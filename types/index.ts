export type UserRole = 'user' | 'admin';

export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    role: UserRole;
    bio?: string;
    username?: string;
    createdAt: any; // Firestore Timestamp
}
