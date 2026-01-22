"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = signUp;
exports.login = login;
exports.logout = logout;
exports.getSession = getSession;
const supabase_1 = require("../lib/supabase");
const config_1 = __importDefault(require("../lib/config"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
async function signUp(email, password) {
    const spinner = (0, ora_1.default)('Signing up...').start();
    const { data, error } = await supabase_1.supabase.auth.signUp({
        email,
        password,
    });
    if (error) {
        spinner.fail(chalk_1.default.red(`Signup failed: ${error.message}`));
        return;
    }
    if (data.session) {
        config_1.default.set('session', data.session);
        spinner.succeed(chalk_1.default.green('Signup successful! Logged in as well.'));
    }
    else {
        spinner.succeed(chalk_1.default.green('Signup successful! Please check your email for confirmation.'));
    }
}
async function login(email, password) {
    const spinner = (0, ora_1.default)('Logging in...').start();
    const { data, error } = await supabase_1.supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) {
        spinner.fail(chalk_1.default.red(`Login failed: ${error.message}`));
        return;
    }
    if (data.session) {
        config_1.default.set('session', data.session);
        spinner.succeed(chalk_1.default.green(`Logged in successfully as ${data.user.email}`));
    }
}
async function logout() {
    const { error } = await supabase_1.supabase.auth.signOut();
    if (error) {
        console.error(chalk_1.default.red(`Logout failed: ${error.message}`));
    }
    else {
        config_1.default.set('session', null);
        console.log(chalk_1.default.green('Logged out successfully.'));
    }
}
function getSession() {
    return config_1.default.get('session');
}
//# sourceMappingURL=auth.js.map