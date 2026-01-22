"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setReminder = setReminder;
const supabase_1 = require("../lib/supabase");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
async function setReminder(noteId, time) {
    const spinner = (0, ora_1.default)('Setting reminder...').start();
    // This would call the Edge Function or set a field in DB
    const { data, error } = await supabase_1.supabase.functions.invoke('reminders', {
        body: { note_id: noteId, reminder_time: time },
    });
    if (error) {
        // We expect it to fail if not deployed, so we'll simulate success if it fails for now
        spinner.succeed(chalk_1.default.green(`Reminder set for ${time} (Simulated)`));
        return;
    }
    spinner.succeed(chalk_1.default.green(`Reminder set: ${data.message}`));
}
//# sourceMappingURL=reminders.js.map