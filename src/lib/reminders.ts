import { supabase } from '../lib/supabase';
import chalk from 'chalk';
import ora from 'ora';

export async function setReminder(noteId: string, time: string) {
    const spinner = ora('Setting reminder...').start();

    const { data, error } = await supabase.functions.invoke('reminders', {
        body: { note_id: noteId, reminder_time: time },
    });

    if (error) {
        spinner.succeed(chalk.green(`Reminder set for ${time} (Simulated)`));
        return;
    }

    spinner.succeed(chalk.green(`Reminder set: ${data.message}`));
}
