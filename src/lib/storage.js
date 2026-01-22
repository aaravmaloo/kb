"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAttachment = uploadAttachment;
exports.downloadAttachment = downloadAttachment;
exports.listAttachments = listAttachments;
const supabase_1 = require("../lib/supabase");
const auth_1 = require("./auth");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function uploadAttachment(noteId, filePath) {
    const session = (0, auth_1.getSession)();
    if (!session) {
        console.error(chalk_1.default.red('You must be logged in to upload attachments.'));
        return;
    }
    const spinner = (0, ora_1.default)('Uploading file...').start();
    const fileBuffer = fs_1.default.readFileSync(filePath);
    const fileName = path_1.default.basename(filePath);
    const storagePath = `${session.user.id}/${noteId}/${Date.now()}_${fileName}`;
    const { data: storageData, error: storageError } = await supabase_1.supabase.storage
        .from('attachments')
        .upload(storagePath, fileBuffer, {
        contentType: 'application/octet-stream', // Could be improved with mime types
    });
    if (storageError) {
        spinner.fail(chalk_1.default.red(`Upload failed: ${storageError.message}`));
        return;
    }
    const { error: dbError } = await supabase_1.supabase.from('attachments').insert({
        note_id: noteId,
        file_name: fileName,
        file_path: storagePath,
        file_size: fileBuffer.length,
        content_type: 'application/octet-stream',
    });
    if (dbError) {
        spinner.fail(chalk_1.default.red(`Failed to link attachment in DB: ${dbError.message}`));
        return;
    }
    spinner.succeed(chalk_1.default.green(`File "${fileName}" attached to note ${noteId}`));
}
async function downloadAttachment(noteId, fileName, destPath) {
    const session = (0, auth_1.getSession)();
    if (!session) {
        console.error(chalk_1.default.red('You must be logged in to download.'));
        return;
    }
    const spinner = (0, ora_1.default)('Searching for attachment...').start();
    const { data: attachment, error: dbError } = await supabase_1.supabase
        .from('attachments')
        .select('*')
        .eq('note_id', noteId)
        .eq('file_name', fileName)
        .single();
    if (dbError || !attachment) {
        spinner.fail(chalk_1.default.red(`Attachment "${fileName}" not found for note ${noteId}`));
        return;
    }
    spinner.text = 'Downloading...';
    const { data: fileData, error: downloadError } = await supabase_1.supabase.storage
        .from('attachments')
        .download(attachment.file_path);
    if (downloadError || !fileData) {
        spinner.fail(chalk_1.default.red(`Download failed: ${downloadError?.message}`));
        return;
    }
    const finalDest = destPath || path_1.default.join(process.cwd(), fileName);
    fs_1.default.writeFileSync(finalDest, Buffer.from(await fileData.arrayBuffer()));
    spinner.succeed(chalk_1.default.green(`File downloaded to: ${finalDest}`));
}
async function listAttachments(noteId) {
    const { data, error } = await supabase_1.supabase
        .from('attachments')
        .select('file_name, file_size, created_at')
        .eq('note_id', noteId);
    if (error) {
        console.error(chalk_1.default.red(`Failed to list attachments: ${error.message}`));
        return;
    }
    if (data.length === 0) {
        console.log(chalk_1.default.yellow('No attachments for this note.'));
        return;
    }
    console.log(chalk_1.default.bold.blue('\nAttachments:'));
    data.forEach((att) => {
        const size = (att.file_size / 1024).toFixed(2);
        console.log(`${chalk_1.default.white(att.file_name)} (${size} KB) - ${new Date(att.created_at).toLocaleDateString()}`);
    });
    console.log('');
}
//# sourceMappingURL=storage.js.map