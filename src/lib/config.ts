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

const config = new Conf<ConfigSchema>({
    projectName: 'kb-cli',
    defaults: {
        supabaseUrl: '',
        supabaseAnonKey: '',
        session: null,
    },
});

export default config;
