import { Command } from 'commander';
import { dashboard } from '../lib/realtime';

export function dashboardCommands() {
    const program = new Command();

    program
        .command('dashboard')
        .description('Live activity dashboard')
        .action(async () => {
            await dashboard();
        });

    return program;
}
