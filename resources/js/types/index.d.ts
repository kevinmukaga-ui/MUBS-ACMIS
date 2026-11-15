export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role?: 'lecturer' | 'coordinator' | 'committee_member' | 'qa_officer' | 'admin' | string;
    faculty?: string;
    department?: string;
    is_lecturer?: boolean;
    is_committee?: boolean;
    is_coordinator?: boolean;
    is_qa?: boolean;
    can_resolve_flags?: boolean;
    can_approve_accreditation?: boolean;
    can_request_revision?: boolean;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
    };
};
