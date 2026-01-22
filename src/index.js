#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const auth_1 = require("./commands/auth");
const notes_1 = require("./commands/notes");
const storage_1 = require("./commands/storage");
const dashboard_1 = require("./commands/dashboard");
const chalk_1 = __importDefault(require("chalk"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const program = new commander_1.Command();
program
    .name('kb')
    .description('Knowledge Base CLI - Supabase Integrated')
    .version('1.0.0');
program.addCommand((0, auth_1.authCommands)());
const notes = (0, notes_1.noteCommands)();
notes.commands.forEach(cmd => program.addCommand(cmd));
const storage = (0, storage_1.storageCommands)();
storage.commands.forEach(cmd => program.addCommand(cmd));
const dash = (0, dashboard_1.dashboardCommands)();
dash.commands.forEach(cmd => program.addCommand(cmd));
program.on('command:*', () => {
    console.error(chalk_1.default.red('Invalid command: %s\nSee --help for a list of available commands.'), program.args.join(' '));
    process.exit(1);
});
program.parse(process.argv);
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
//# sourceMappingURL=index.js.map