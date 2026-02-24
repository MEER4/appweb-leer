export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            [key: string]: any
        }
    }
}

export interface Kid {
    id: string;
    parent_id: string;
    name: string;
    age: number;
    avatar_url?: string | null;
    created_at?: string;
}
