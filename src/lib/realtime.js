"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboard = dashboard;
const supabase_1 = require("../lib/supabase");
const chalk_1 = __importDefault(require("chalk"));
async function dashboard() {
    console.log(chalk_1.default.bold.magenta('\n=== KB Realtime Activity Dashboard ==='));
    console.log(chalk_1.default.gray('Listening for changes in your notes...\n'));
    supabase_1.supabase
        .channel('any')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, (payload) => {
        const event = payload.eventType;
        const note = payload.new;
        const oldNote = payload.old;
        if (event === 'INSERT') {
            console.log(`${chalk_1.default.green('[NEW]')} Note created: ${chalk_1.default.bold(note.title)} (${note.id.substring(0, 8)})`);
        }
        else if (event === 'UPDATE') {
            console.log(`${chalk_1.default.yellow('[UPDATE]')} Note updated: ${chalk_1.default.bold(note.title)} (${note.id.substring(0, 8)})`);
        }
        else if (event === 'DELETE') {
            console.log(`${chalk_1.default.red('[DELETE]')} Note removed: (${oldNote.id.substring(0, 8)})`);
        }
    })
        .subscribe();
    // Keep process alive
    process.stdin.resume();
    process.on('SIGINT', () => {
        console.log(chalk_1.default.gray('\nClosing dashboard...'));
        process.exit();
    });
}
//# sourceMappingURL=realtime.js.map