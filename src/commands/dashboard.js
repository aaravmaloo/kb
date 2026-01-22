"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardCommands = dashboardCommands;
const commander_1 = require("commander");
const realtime_1 = require("../lib/realtime");
function dashboardCommands() {
    const program = new commander_1.Command();
    program
        .command('dashboard')
        .description('Live activity dashboard')
        .action(async () => {
        await (0, realtime_1.dashboard)();
    });
    return program;
}
//# sourceMappingURL=dashboard.js.map