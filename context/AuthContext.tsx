"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    User,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "../lib/firebase";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    role: "user" | "admin" | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<"user" | "admin" | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser: User | null) => {
            setLoading(true);
            if (currentUser) {
                setUser(currentUser);
                // Fetch Role
                try {
                    const userDocRef = doc(db, "users", currentUser.uid);
                    const userSnap = await getDoc(userDocRef);

                    if (userSnap.exists()) {
                        setRole(userSnap.data().role);
                    } else {
                        // If manual signup handled elsewhere, this might wait.
                        // But for safety, if user exists in Auth but not Firestore (rare edge case), default to user logic or handle in signup.
                        // We will handle doc creation explicitly in Signup flow.
                    }
                } catch (error) {
                    console.error("Error fetching user role:", error);
                }
            } else {
                setUser(null);
                setRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
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
                    createdAt: serverTimestamp()
                });
                setRole("user");
                router.push("/dashboard");
            } else {
                const data = userSnap.data();
                setRole(data.role);
                if (data.role === "admin") {
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
