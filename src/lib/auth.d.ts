export declare function signUp(email: string, password: string): Promise<void>;
export declare function login(email: string, password: string): Promise<void>;
export declare function logout(): Promise<void>;
export declare function getSession(): {
    access_token: string;
    refresh_token: string;
    user: any;
} | null;
//# sourceMappingURL=auth.d.ts.map