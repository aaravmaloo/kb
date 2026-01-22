import { supabase } from '../lib/supabase';
import chalk from 'chalk';

export async function dashboard() {
    console.log(chalk.bold.magenta('\n=== KB Realtime Activity Dashboard ==='));
    console.log(chalk.gray('Listening for changes in your notes...\n'));

    supabase
        .channel('any')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, (payload) => {
            const event = payload.eventType;
            const note = payload.new as any;
            const oldNote = payload.old as any;

            if (event === 'INSERT') {
                console.log(`${chalk.green('[NEW]')} Note created: ${chalk.bold(note.title)} (${note.id.substring(0, 8)})`);
            } else if (event === 'UPDATE') {
                console.log(`${chalk.yellow('[UPDATE]')} Note updated: ${chalk.bold(note.title)} (${note.id.substring(0, 8)})`);
            } else if (event === 'DELETE') {
                console.log(`${chalk.red('[DELETE]')} Note removed: (${oldNote.id.substring(0, 8)})`);
            }
        })
        .subscribe();

    process.stdin.resume();

    process.on('SIGINT', () => {
        console.log(chalk.gray('\nClosing dashboard...'));
        process.exit();
    });
}
