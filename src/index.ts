#!/usr/bin/env node
import { Command } from 'commander';
import { authCommands } from './commands/auth';
import { noteCommands } from './commands/notes';
import { storageCommands } from './commands/storage';
import { dashboardCommands } from './commands/dashboard';
import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

const program = new Command();

program
    .name('kb')
    .description('Knowledge Base CLI - Supabase Integrated')
    .version('1.0.0');

program.addCommand(authCommands());

const notes = noteCommands();
notes.commands.forEach(cmd => program.addCommand(cmd));

const storage = storageCommands();
storage.commands.forEach(cmd => program.addCommand(cmd));

const dash = dashboardCommands();
dash.commands.forEach(cmd => program.addCommand(cmd));

program.on('command:*', () => {
    console.error(chalk.red('Invalid command: %s\nSee --help for a list of available commands.'), program.args.join(' '));
    process.exit(1);
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
