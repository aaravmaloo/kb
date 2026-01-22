import { Command } from 'commander';
import inquirer from 'inquirer';
import { login, signUp, logout } from '../lib/auth';

export function authCommands() {
    const auth = new Command('auth');

    auth
        .command('signup')
        .description('Sign up for a new account')
        .action(async () => {
            const answers = await inquirer.prompt([
                { type: 'input', name: 'email', message: 'Email:' },
                { type: 'password', name: 'password', message: 'Password:' },
            ]);
            await signUp(answers.email, answers.password);
        });

    auth
        .command('login')
        .description('Login to your account')
        .action(async () => {
            const answers = await inquirer.prompt([
                { type: 'input', name: 'email', message: 'Email:' },
                { type: 'password', name: 'password', message: 'Password:' },
            ]);
            await login(answers.email, answers.password);
        });

    auth
        .command('logout')
        .description('Logout of your account')
        .action(async () => {
            await logout();
        });

    return auth;
}
