export type UserRole = 'user' | 'admin';

export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    role: UserRole;
    createdAt: any; // Firestore Timestamp
}
