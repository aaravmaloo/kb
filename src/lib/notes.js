"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNote = addNote;
exports.listNotes = listNotes;
exports.viewNote = viewNote;
exports.searchNotes = searchNotes;
exports.viewHistory = viewHistory;
const supabase_1 = require("../lib/supabase");
const auth_1 = require("./auth");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
async function addNote(title, content, tags, isPublic = false) {
    const session = (0, auth_1.getSession)();
    if (!session) {
        console.error(chalk_1.default.red('You must be logged in to add a note.'));
        return;
    }
    const spinner = (0, ora_1.default)('Saving note...').start();
    const { data: note, error: noteError } = await supabase_1.supabase
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
        spinner.fail(chalk_1.default.red(`Failed to save note: ${noteError.message}`));
        return;
    }
    if (tags.length > 0) {
        spinner.text = 'Adding tags...';
        for (const tagName of tags) {
            // Upsert tag
            const { data: tag, error: tagError } = await supabase_1.supabase
                .from('tags')
                .upsert({ name: tagName.trim().toLowerCase() }, { onConflict: 'name' })
                .select()
                .single();
            if (tag) {
                await supabase_1.supabase.from('note_tags').insert({
                    note_id: note.id,
                    tag_id: tag.id,
                });
            }
        }
    }
    spinner.succeed(chalk_1.default.green(`Note "${title}" added successfully! (ID: ${note.id})`));
}
async function listNotes(tag) {
    const session = (0, auth_1.getSession)();
    if (!session) {
        console.error(chalk_1.default.red('You must be logged in to list notes.'));
        return;
    }
    const spinner = (0, ora_1.default)('Fetching notes...').start();
    let query = supabase_1.supabase
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
        spinner.fail(chalk_1.default.red(`Failed to fetch notes: ${error.message}`));
        return;
    }
    spinner.stop();
    if (data.length === 0) {
        console.log(chalk_1.default.yellow('No notes found.'));
        return;
    }
    console.log(chalk_1.default.bold.blue('\nYour Notes:'));
    data.forEach((note) => {
        const tagsStr = note.note_tags.map((nt) => nt.tags.name).join(', ');
        console.log(`${chalk_1.default.cyan(note.id.substring(0, 8))} | ${chalk_1.default.white(note.title)} [${chalk_1.default.gray(tagsStr)}]`);
    });
    console.log('');
}
async function viewNote(idSearch) {
    const session = (0, auth_1.getSession)();
    if (!session) {
        console.error(chalk_1.default.red('You must be logged in to view a note.'));
        return;
    }
    const spinner = (0, ora_1.default)('Fetching note...').start();
    const { data, error } = await supabase_1.supabase
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
        spinner.fail(chalk_1.default.red(`Note not found: ${error.message}`));
        return;
    }
    spinner.stop();
    console.log(chalk_1.default.bold.blue(`\n--- ${data.title} ---`));
    const tagsStr = data.note_tags.map((nt) => nt.tags.name).join(', ');
    console.log(chalk_1.default.gray(`Tags: ${tagsStr}`));
    console.log(chalk_1.default.gray(`Created: ${new Date(data.created_at).toLocaleString()}`));
    console.log('\n' + data.content);
    console.log(chalk_1.default.bold.blue('-------------------\n'));
}
async function searchNotes(queryStr) {
    const session = (0, auth_1.getSession)();
    if (!session) {
        console.error(chalk_1.default.red('You must be logged in to search.'));
        return;
    }
    const spinner = (0, ora_1.default)('Searching...').start();
    const { data, error } = await supabase_1.supabase
        .from('notes')
        .select('id, title')
        .eq('user_id', session.user.id)
        .textSearch('search_vector', queryStr);
    if (error) {
        spinner.fail(chalk_1.default.red(`Search failed: ${error.message}`));
        return;
    }
    spinner.stop();
    if (data.length === 0) {
        console.log(chalk_1.default.yellow('No matches found.'));
        return;
    }
    console.log(chalk_1.default.bold.blue(`\nSearch results for "${queryStr}":`));
    data.forEach(note => {
        console.log(`${chalk_1.default.cyan(note.id.substring(0, 8))} | ${chalk_1.default.white(note.title)}`);
    });
    console.log('');
}
async function viewHistory(idSearch) {
    const session = (0, auth_1.getSession)();
    if (!session) {
        console.error(chalk_1.default.red('You must be logged in to view history.'));
        return;
    }
    const spinner = (0, ora_1.default)('Fetching history...').start();
    // Find note first
    const { data: note } = await supabase_1.supabase
        .from('notes')
        .select('id, title')
        .or(`id.eq.${idSearch},id.ilike.${idSearch}%`)
        .eq('user_id', session.user.id)
        .single();
    if (!note) {
        spinner.fail(chalk_1.default.red('Note not found.'));
        return;
    }
    const { data: history, error: historyError } = await supabase_1.supabase
        .from('note_history')
        .select('*')
        .eq('note_id', note.id)
        .order('created_at', { ascending: false });
    if (historyError) {
        spinner.fail(chalk_1.default.red(`Failed to fetch history: ${historyError.message}`));
        return;
    }
    spinner.stop();
    console.log(chalk_1.default.bold.blue(`\nHistory for "${note.title}":`));
    if (history.length === 0) {
        console.log(chalk_1.default.yellow('No previous versions found.'));
        return;
    }
    history.forEach((entry, index) => {
        console.log(chalk_1.default.cyan(`v${history.length - index} | ${new Date(entry.created_at).toLocaleString()}`));
        console.log(chalk_1.default.gray('--- Content snippet ---'));
        console.log((entry.content?.split('\n').slice(0, 3).join('\n') || '') + '...');
        console.log(chalk_1.default.gray('-----------------------\n'));
    });
}
//# sourceMappingURL=notes.js.map