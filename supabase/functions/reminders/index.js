"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jsr:@supabase/functions-js/edge-runtime.d.ts");
Deno.serve(async (req) => {
    const { note_id, reminder_time, user_email } = await req.json();
    console.log(`Setting reminder for ${user_email} at ${reminder_time} for note ${note_id}`);
    // In a real app, this would trigger an email or integration
    // Supabase doesn't have a built-in "wait and then do something" besides DB triggers
    // or external cron.
    return new Response(JSON.stringify({
        message: "Reminder logic triggered!",
        note_id,
        reminder_time
    }), {
        headers: { 'Content-Type': 'application/json' },
    });
});
//# sourceMappingURL=index.js.map