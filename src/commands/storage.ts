import { Command } from 'commander';
import { uploadAttachment, downloadAttachment, listAttachments } from '../lib/storage';

export function storageCommands() {
    const program = new Command();

    program
        .command('attach <noteId> <filePath>')
        .description('Attach a file to a note')
        .action(async (noteId, filePath) => {
            await uploadAttachment(noteId, filePath);
        });

    program
        .command('download <noteId> <fileName>')
        .description('Download an attachment from a note')
        .option('-o, --output <path>', 'Destination path')
        .action(async (noteId, fileName, options) => {
            await downloadAttachment(noteId, fileName, options.output);
        });

    program
        .command('files <noteId>')
        .description('List attachments for a note')
        .action(async (noteId) => {
            await listAttachments(noteId);
        });

    return program;
}
