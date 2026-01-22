import { supabase } from '../lib/supabase';
import { getSession } from './auth';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';
import path from 'path';

export async function uploadAttachment(noteId: string, filePath: string) {
    const session = getSession();
    if (!session) {
        console.error(chalk.red('You must be logged in to upload attachments.'));
        return;
    }

    const spinner = ora('Uploading file...').start();
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    const storagePath = `${session.user.id}/${noteId}/${Date.now()}_${fileName}`;

    const { data: storageData, error: storageError } = await supabase.storage
        .from('attachments')
        .upload(storagePath, fileBuffer, {
            contentType: 'application/octet-stream',
        });

    if (storageError) {
        spinner.fail(chalk.red(`Upload failed: ${storageError.message}`));
        return;
    }

    const { error: dbError } = await supabase.from('attachments').insert({
        note_id: noteId,
        file_name: fileName,
        file_path: storagePath,
        file_size: fileBuffer.length,
        content_type: 'application/octet-stream',
    });

    if (dbError) {
        spinner.fail(chalk.red(`Failed to link attachment in DB: ${dbError.message}`));
        return;
    }

    spinner.succeed(chalk.green(`File "${fileName}" attached to note ${noteId}`));
}

export async function downloadAttachment(noteId: string, fileName: string, destPath?: string) {
    const session = getSession();
    if (!session) {
        console.error(chalk.red('You must be logged in to download.'));
        return;
    }

    const spinner = ora('Searching for attachment...').start();
    const { data: attachment, error: dbError } = await supabase
        .from('attachments')
        .select('*')
        .eq('note_id', noteId)
        .eq('file_name', fileName)
        .single();

    if (dbError || !attachment) {
        spinner.fail(chalk.red(`Attachment "${fileName}" not found for note ${noteId}`));
        return;
    }

    spinner.text = 'Downloading...';
    const { data: fileData, error: downloadError } = await supabase.storage
        .from('attachments')
        .download(attachment.file_path);

    if (downloadError || !fileData) {
        spinner.fail(chalk.red(`Download failed: ${downloadError?.message}`));
        return;
    }

    const finalDest = destPath || path.join(process.cwd(), fileName);
    fs.writeFileSync(finalDest, Buffer.from(await fileData.arrayBuffer()));
    spinner.succeed(chalk.green(`File downloaded to: ${finalDest}`));
}

export async function listAttachments(noteId: string) {
    const { data, error } = await supabase
        .from('attachments')
        .select('file_name, file_size, created_at')
        .eq('note_id', noteId);

    if (error) {
        console.error(chalk.red(`Failed to list attachments: ${error.message}`));
        return;
    }

    if (data.length === 0) {
        console.log(chalk.yellow('No attachments for this note.'));
        return;
    }

    console.log(chalk.bold.blue('\nAttachments:'));
    data.forEach((att) => {
        const size = (att.file_size! / 1024).toFixed(2);
        console.log(`${chalk.white(att.file_name)} (${size} KB) - ${new Date(att.created_at!).toLocaleDateString()}`);
    });
    console.log('');
}
