import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database';
import config from './config';
import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

let supabaseInstance: SupabaseClient<Database> | null = null;

const XOR_KEY = 'kb-kb-kb';
const OBS_URL = 'AxZZGxEXRE0MA0caDEoGEw4LSREEQh8bHgZOD0xeHhIKAEwYBwMIDQ==';
const OBS_KEY = 'DhtnAwBqCAskC2ciN1ciUyULZBgrQzlXCCFkXStGGzo9IWdSTEgSKBsBHiYLYgIoEQZ1KQp0BiQROH4iEWQFKAc4RCJUZAYGAwNDLRd3WVMTOHoHCUgGOB0GZQdTdywsACtEHAtOBlsYOH4iVGQGJB4AH18LYSgoGzt1OgtiASdYLEcAFWI/O18saQwRZAY0XwFuIlRgASNfLGkyUWABBVstZVtMe1kzPxJbJwduPRgjIUIDFWA7DC8XXT0VGy86MlViPy1+HBBdF08pW08ZNw==';

function deobs(str: string, k: string): string {
    const decoded = Buffer.from(str, 'base64').toString('binary');
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
        result += String.fromCharCode(decoded.charCodeAt(i) ^ k.charCodeAt(i % k.length));
    }
    return result;
}

export function getSupabase(): SupabaseClient<Database> {
    if (supabaseInstance) return supabaseInstance;

    const supabaseUrl = config.get('supabaseUrl') || process.env.SUPABASE_URL || deobs(OBS_URL, XOR_KEY);
    const supabaseAnonKey = config.get('supabaseAnonKey') || process.env.SUPABASE_ANON_KEY || deobs(OBS_KEY, XOR_KEY);

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error(chalk.red('\nError: Supabase configuration missing!'));
        console.log(chalk.yellow('Please ensure SUPABASE_URL and SUPABASE_ANON_KEY are set in your config or .env file.\n'));
        process.exit(1);
    }

    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey);
    return supabaseInstance;
}

export const supabase = {
    get auth() { return getSupabase().auth; },
    get storage() { return getSupabase().storage; },
    get from() { return (relation: any) => getSupabase().from(relation); },
    get functions() { return getSupabase().functions; },
    channel: (name: string) => getSupabase().channel(name),
} as any as SupabaseClient<Database>;
