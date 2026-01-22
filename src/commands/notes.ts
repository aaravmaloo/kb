import { Command } from 'commander';
import { addNote, listNotes, viewNote, searchNotes, viewHistory } from '../lib/notes';
import inquirer from 'inquirer';

export function noteCommands() {
    const program = new Command();

    program
        .command('add <title>')
        .description('Add a new note')
        .option('-t, --tags <tags>', 'Comma separated tags')
        .option('-p, --public', 'Make note public', false)
        .action(async (title, options) => {
            const { content } = await inquirer.prompt([
                { type: 'editor', name: 'content', message: 'Enter note content:' },
            ]);
            const tags = options.tags ? options.tags.split(',') : [];
            await addNote(title, content, tags, options.public);
        });

    program
        .command('list')
        .description('List your notes')
        .option('--tag <tag>', 'Filter by tag')
        .action(async (options) => {
            await listNotes(options.tag);
        });

    program
        .command('view <id>')
        .description('View a note by ID or partial ID')
        .action(async (id) => {
            await viewNote(id);
        });

    program
        .command('search <query>')
        .description('Search notes using full-text search')
        .action(async (query) => {
            await searchNotes(query);
        });

    program
        .command('history <id>')
        .description('View version history for a note')
        .action(async (id) => {
            await viewHistory(id);
        });

    return program;
}
