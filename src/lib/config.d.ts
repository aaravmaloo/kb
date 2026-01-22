import Conf from 'conf';
interface ConfigSchema {
    supabaseUrl: string;
    supabaseAnonKey: string;
    session: {
        access_token: string;
        refresh_token: string;
        user: any;
    } | null;
}
declare const config: Conf<ConfigSchema>;
export default config;
//# sourceMappingURL=config.d.ts.map