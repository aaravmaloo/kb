import { supabase } from '../lib/supabase';
import { getSession } from './auth';
import chalk from 'chalk';
import ora from 'ora';

export async function addNote(title: string, content: string, tags: string[], isPublic: boolean = false) {
    const session = getSession();
    if (!session) {
        console.error(chalk.red('You must be logged in to add a note.'));
        return;
    }

    const spinner = ora('Saving note...').start();
    const { data: note, error: noteError } = await supabase
        .from('notes')
        .insert({
            title,
            content,
            user_id: session.user.id,
            is_public: isPublic,
        })
        .select()
        .single();

    if (noteError) {
        spinner.fail(chalk.red(`Failed to save note: ${noteError.message}`));
        return;
    }

    if (tags.length > 0) {
        spinner.text = 'Adding tags...';
        for (const tagName of tags) {
            const { data: tag, error: tagError } = await supabase
                .from('tags')
                .upsert({ name: tagName.trim().toLowerCase() }, { onConflict: 'name' })
                .select()
                .single();

            if (tag) {
                await supabase.from('note_tags').insert({
                    note_id: note.id,
                    tag_id: tag.id,
                });
            }
        }
    }

    spinner.succeed(chalk.green(`Note "${title}" added successfully! (ID: ${note.id})`));
}

export async function listNotes(tag?: string) {
    const session = getSession();
    if (!session) {
        console.error(chalk.red('You must be logged in to list notes.'));
        return;
    }

    const spinner = ora('Fetching notes...').start();
    let query = supabase
        .from('notes')
        .select(`
      id,
      title,
      created_at,
      note_tags!inner (
        tags (name)
      )
    `)
        .eq('user_id', session.user.id);

    if (tag) {
        query = query.eq('note_tags.tags.name', tag.toLowerCase());
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
        spinner.fail(chalk.red(`Failed to fetch notes: ${error.message}`));
        return;
    }

    spinner.stop();
    if (data.length === 0) {
        console.log(chalk.yellow('No notes found.'));
        return;
    }

    console.log(chalk.bold.blue('\nYour Notes:'));
    data.forEach((note) => {
        const tagsStr = (note as any).note_tags.map((nt: any) => nt.tags.name).join(', ');
        console.log(`${chalk.cyan(note.id.substring(0, 8))} | ${chalk.white(note.title)} [${chalk.gray(tagsStr)}]`);
    });
    console.log('');
}

export async function viewNote(idSearch: string) {
    const session = getSession();
    if (!session) {
        console.error(chalk.red('You must be logged in to view a note.'));
        return;
    }

    const spinner = ora('Fetching note...').start();
    const { data, error } = await supabase
        .from('notes')
        .select(`
      *,
      note_tags (
        tags (name)
      )
    `)
        .or(`id.eq.${idSearch},id.ilike.${idSearch}%`)
        .eq('user_id', session.user.id)
        .single();

    if (error) {
        spinner.fail(chalk.red(`Note not found: ${error.message}`));
        return;
    }

    spinner.stop();
    console.log(chalk.bold.blue(`\n--- ${data.title} ---`));
    const tagsStr = (data as any).note_tags.map((nt: any) => nt.tags.name).join(', ');
    console.log(chalk.gray(`Tags: ${tagsStr}`));
    console.log(chalk.gray(`Created: ${new Date(data.created_at!).toLocaleString()}`));
    console.log('\n' + data.content);
    console.log(chalk.bold.blue('-------------------\n'));
}

export async function searchNotes(queryStr: string) {
    const session = getSession();
    if (!session) {
        console.error(chalk.red('You must be logged in to search.'));
        return;
    }

    const spinner = ora('Searching...').start();
    const { data, error } = await supabase
        .from('notes')
        .select('id, title')
        .eq('user_id', session.user.id)
        .textSearch('search_vector', queryStr);

    if (error) {
        spinner.fail(chalk.red(`Search failed: ${error.message}`));
        return;
    }

    spinner.stop();
    if (data.length === 0) {
        console.log(chalk.yellow('No matches found.'));
        return;
    }

    console.log(chalk.bold.blue(`\nSearch results for "${queryStr}":`));
    data.forEach(note => {
        console.log(`${chalk.cyan(note.id.substring(0, 8))} | ${chalk.white(note.title)}`);
    });
    console.log('');
}

export async function viewHistory(idSearch: string) {
    const session = getSession();
    if (!session) {
        console.error(chalk.red('You must be logged in to view history.'));
        return;
    }

    const { data: note } = await supabase
        .from('notes')
        .select('id, title')
        .or(`id.eq.${idSearch},id.ilike.${idSearch}%`)
        .eq('user_id', session.user.id)
        .single();

    if (!note) {
        console.error(chalk.red('Note not found.'));
        return;
    }

    const { data: history, error: historyError } = await supabase
        .from('note_history')
        .select('*')
        .eq('note_id', note.id)
        .order('created_at', { ascending: false });

    if (historyError) {
        console.error(chalk.red(`Failed to fetch history: ${historyError.message}`));
        return;
    }

    console.log(chalk.bold.blue(`\nHistory for "${note.title}":`));
    if (history.length === 0) {
        console.log(chalk.yellow('No previous versions found.'));
        return;
    }

    history.forEach((entry, index) => {
        console.log(chalk.cyan(`v${history.length - index} | ${new Date(entry.created_at!).toLocaleString()}`));
        console.log((entry.content?.split('\n').slice(0, 3).join('\n') || '') + '...');
    });
}
