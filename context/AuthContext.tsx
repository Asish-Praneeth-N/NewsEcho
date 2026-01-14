
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    User,
    onAuthStateChanged,
    onIdTokenChanged, // Added import
    signInWithPopup,
    signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { auth, db, googleProvider } from "../lib/firebase";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Added import

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
    const [role, setRole] = useState<Role | null>(null); // "user" | "admin" | "super_admin"
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        let unsubscribeRoleListener: (() => void) | null = null;

        // Use onIdTokenChanged to handle token refreshes automatically
        const unsubscribeAuth = onIdTokenChanged(auth, async (currentUser: User | null) => {
            setLoading(true); // Temporarily true while we fetch role

            if (currentUser) {
                setUser(currentUser);
                
                // Get and set token in cookie for Middleware
                const token = await currentUser.getIdToken();
                Cookies.set("authToken", token, { expires: 1/24, secure: true }); // 1 hour

                // Real-time listener for Role
                const userDocRef = doc(db, "users", currentUser.uid);
                
                // Cancel previous listener if any (e.g. fast user switch)
                if (unsubscribeRoleListener) {
                    unsubscribeRoleListener();
                }

                unsubscribeRoleListener = onSnapshot(userDocRef, (docSnap) => {
                    if (docSnap.exists()) {
                        setRole(docSnap.data().role as Role);
                    } else {
                        setRole("user"); // Default fallback if user doc doesn't exist
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Firestore Listener Error:", error);
                    setLoading(false);
                });

            } else {
                setUser(null);
                setRole(null);
                Cookies.remove("authToken");
                
                if (unsubscribeRoleListener) {
                    unsubscribeRoleListener();
                    unsubscribeRoleListener = null;
                }
                setLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeRoleListener) {
                unsubscribeRoleListener();
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
