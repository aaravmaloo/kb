"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authCommands = authCommands;
const commander_1 = require("commander");
const inquirer_1 = __importDefault(require("inquirer"));
const auth_1 = require("../lib/auth");
function authCommands() {
    const auth = new commander_1.Command('auth');
    auth
        .command('signup')
        .description('Sign up for a new account')
        .action(async () => {
        const answers = await inquirer_1.default.prompt([
            { type: 'input', name: 'email', message: 'Email:' },
            { type: 'password', name: 'password', message: 'Password:' },
        ]);
        await (0, auth_1.signUp)(answers.email, answers.password);
    });
    auth
        .command('login')
        .description('Login to your account')
        .action(async () => {
        const answers = await inquirer_1.default.prompt([
            { type: 'input', name: 'email', message: 'Email:' },
            { type: 'password', name: 'password', message: 'Password:' },
        ]);
        await (0, auth_1.login)(answers.email, answers.password);
    });
    auth
        .command('logout')
        .description('Logout of your account')
        .action(async () => {
        await (0, auth_1.logout)();
    });
    return auth;
}
//# sourceMappingURL=auth.js.map