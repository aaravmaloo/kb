"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const database_1 = require("../types/database");
const config_1 = __importDefault(require("./config"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supabaseUrl = config_1.default.get('supabaseUrl') || process.env.SUPABASE_URL || '';
const supabaseAnonKey = config_1.default.get('supabaseAnonKey') || process.env.SUPABASE_ANON_KEY || '';
if (!supabaseUrl || !supabaseAnonKey) {
    // We'll handle this in the CLI entry point
}
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
//# sourceMappingURL=supabase.js.map