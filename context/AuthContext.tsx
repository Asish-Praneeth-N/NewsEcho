"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    User,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { auth, db, googleProvider } from "../lib/firebase";
import { useRouter } from "next/navigation";

export type Role = "user" | "admin" | "super_admin";

interface AuthContextType {
    user: User | null;
    role: Role | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        let unsubscribeFirestore: (() => void) | null = null;

        const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser: User | null) => {
            setLoading(true); // Temporarily true while we fetch role

            if (currentUser) {
                setUser(currentUser);

                // Real-time listener for Role
                const userDocRef = doc(db, "users", currentUser.uid);

                unsubscribeFirestore = onSnapshot(userDocRef, (docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const userData = docSnapshot.data();
                        const newRole = userData.role as Role;
                        setRole(newRole);

                        // Optional: Ensure strict redirect logic here if needed, 
                        // but usually handled by middleware/page logic on navigation.
                    } else {
                        // Edge case: User in Auth but not Firestore
                        // We do nothing here, waiting for sign-up logic to complete
                        setRole(null);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Firestore Listener Error:", error);
                    setLoading(false);
                });

            } else {
                setUser(null);
                setRole(null);
                if (unsubscribeFirestore) {
                    unsubscribeFirestore();
                    unsubscribeFirestore = null;
                }
                setLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeFirestore) {
                unsubscribeFirestore();
            }
        };
    }, []);

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Check if user doc exists, if not create it (auto-signup via Google)
            const userDocRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userDocRef);

            if (!userSnap.exists()) {
                await setDoc(userDocRef, {
                    uid: user.uid,
                    email: user.email,
                    role: "user",
                    adminRequest: false,
                    createdAt: serverTimestamp()
                });
                // No need to setRole manualy, logic in UseEffect handles it via listener
                router.push("/dashboard");
            } else {
                const data = userSnap.data();
                const userRole = data.role;

                // Strict Redirect
                if (userRole === "super_admin") {
                    router.push("/super-admin");
                } else if (userRole === "admin") {
                    router.push("/admin");
                } else {
                    router.push("/dashboard");
                }
            }

        } catch (error) {
            console.error("Google Sign In Error", error);
        }
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
        setRole(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, signInWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
