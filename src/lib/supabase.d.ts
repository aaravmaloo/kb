import { Database } from '../types/database';
export declare const supabase: import("@supabase/supabase-js").SupabaseClient<Database, "public", "public", {
    Tables: {
        attachments: {
            Row: {
                content_type: string | null;
                created_at: string | null;
                file_name: string;
                file_path: string;
                file_size: number | null;
                id: string;
                note_id: string | null;
            };
            Insert: {
                content_type?: string | null;
                created_at?: string | null;
                file_name: string;
                file_path: string;
                file_size?: number | null;
                id?: string;
                note_id?: string | null;
            };
            Update: {
                content_type?: string | null;
                created_at?: string | null;
                file_name?: string;
                file_path?: string;
                file_size?: number | null;
                id?: string;
                note_id?: string | null;
            };
            Relationships: [{
                foreignKeyName: "attachments_note_id_fkey";
                columns: ["note_id"];
                isOneToOne: false;
                referencedRelation: "notes";
                referencedColumns: ["id"];
            }];
        };
        note_tags: {
            Row: {
                note_id: string;
                tag_id: string;
            };
            Insert: {
                note_id: string;
                tag_id: string;
            };
            Update: {
                note_id?: string;
                tag_id?: string;
            };
            Relationships: [{
                foreignKeyName: "note_tags_note_id_fkey";
                columns: ["note_id"];
                isOneToOne: false;
                referencedRelation: "notes";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "note_tags_tag_id_fkey";
                columns: ["tag_id"];
                isOneToOne: false;
                referencedRelation: "tags";
                referencedColumns: ["id"];
            }];
        };
        notes: {
            Row: {
                content: string | null;
                created_at: string | null;
                id: string;
                is_public: boolean | null;
                search_vector: string | null;
                title: string;
                updated_at: string | null;
                user_id: string;
            };
            Insert: {
                content?: string | null;
                created_at?: string | null;
                id?: string;
                is_public?: boolean | null;
                search_vector?: never;
                title: string;
                updated_at?: string | null;
                user_id: string;
            };
            Update: {
                content?: string | null;
                created_at?: string | null;
                id?: string;
                is_public?: boolean | null;
                search_vector?: never;
                title?: string;
                updated_at?: string | null;
                user_id?: string;
            };
            Relationships: [];
        };
        profiles: {
            Row: {
                full_name: string | null;
                id: string;
                updated_at: string | null;
                username: string | null;
            };
            Insert: {
                full_name?: string | null;
                id: string;
                updated_at?: string | null;
                username?: string | null;
            };
            Update: {
                full_name?: string | null;
                id?: string;
                updated_at?: string | null;
                username?: string | null;
            };
            Relationships: [];
        };
        tags: {
            Row: {
                id: string;
                name: string;
            };
            Insert: {
                id?: string;
                name: string;
            };
            Update: {
                id?: string;
                name?: string;
            };
            Relationships: [];
        };
    };
    Views: { [_ in never]: never; };
    Functions: { [_ in never]: never; };
    Enums: { [_ in never]: never; };
    CompositeTypes: { [_ in never]: never; };
}, {
    PostgrestVersion: "12";
}>;
//# sourceMappingURL=supabase.d.ts.map