"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteCommands = noteCommands;
const commander_1 = require("commander");
const notes_1 = require("../lib/notes");
const inquirer_1 = __importDefault(require("inquirer"));
function noteCommands() {
    const program = new commander_1.Command();
    program
        .command('add <title>')
        .description('Add a new note')
        .option('-t, --tags <tags>', 'Comma separated tags')
        .option('-p, --public', 'Make note public', false)
        .action(async (title, options) => {
        const { content } = await inquirer_1.default.prompt([
            { type: 'editor', name: 'content', message: 'Enter note content:' },
        ]);
        const tags = options.tags ? options.tags.split(',') : [];
        await (0, notes_1.addNote)(title, content, tags, options.public);
    });
    program
        .command('list')
        .description('List your notes')
        .option('--tag <tag>', 'Filter by tag')
        .action(async (options) => {
        await (0, notes_1.listNotes)(options.tag);
    });
    program
        .command('view <id>')
        .description('View a note by ID or partial ID')
        .action(async (id) => {
        await (0, notes_1.viewNote)(id);
    });
    program
        .command('search <query>')
        .description('Search notes using full-text search')
        .action(async (query) => {
        await (0, notes_1.searchNotes)(query);
    });
    program
        .command('history <id>')
        .description('View version history for a note')
        .action(async (id) => {
        await (0, notes_1.viewHistory)(id);
    });
    return program;
}
//# sourceMappingURL=notes.js.map