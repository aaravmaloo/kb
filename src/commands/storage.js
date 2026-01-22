"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageCommands = storageCommands;
const commander_1 = require("commander");
const storage_1 = require("../lib/storage");
function storageCommands() {
    const program = new commander_1.Command();
    program
        .command('attach <noteId> <filePath>')
        .description('Attach a file to a note')
        .action(async (noteId, filePath) => {
        await (0, storage_1.uploadAttachment)(noteId, filePath);
    });
    program
        .command('download <noteId> <fileName>')
        .description('Download an attachment from a note')
        .option('-o, --output <path>', 'Destination path')
        .action(async (noteId, fileName, options) => {
        await (0, storage_1.downloadAttachment)(noteId, fileName, options.output);
    });
    program
        .command('files <noteId>')
        .description('List attachments for a note')
        .action(async (noteId) => {
        await (0, storage_1.listAttachments)(noteId);
    });
    return program;
}
//# sourceMappingURL=storage.js.map