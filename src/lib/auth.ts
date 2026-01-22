import { supabase } from '../lib/supabase';
import config from '../lib/config';
import chalk from 'chalk';
import ora from 'ora';

export async function signUp(email: string, password: string) {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const spinner = ora('Signing up...').start();
    const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: trimmedPassword,
    });

    if (error) {
        spinner.fail(chalk.red(`Signup failed: ${error.message}`));
        return;
    }

    if (data.session) {
        config.set('session', data.session);
        spinner.succeed(chalk.green('Signup successful! Logged in as well.'));
    } else {
        spinner.succeed(chalk.green('Signup successful! Please check your email for confirmation.'));
    }
}

export async function login(email: string, password: string) {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const spinner = ora('Logging in...').start();
    const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
    });

    if (error) {
        spinner.fail(chalk.red(`Login failed: ${error.message}`));
        return;
    }

    if (data.session) {
        config.set('session', data.session);
        spinner.succeed(chalk.green(`Logged in successfully as ${data.user.email}`));
    }
}

export async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error(chalk.red(`Logout failed: ${error.message}`));
    } else {
        config.set('session', null);
        console.log(chalk.green('Logged out successfully.'));
    }
}

export function getSession() {
    return config.get('session');
}
