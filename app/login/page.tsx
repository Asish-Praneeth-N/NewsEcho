"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { signInWithGoogle } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Validte Role
            const userDocRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userDocRef);

            if (userSnap.exists()) {
                const role = userSnap.data().role;
                if (role === "admin") {
                    router.push("/admin");
                } else {
                    router.push("/dashboard");
                }
            } else {
                // Fallback if doc missing (should typically not happen)
                router.push("/dashboard");
            }

        } catch (err: any) {
            setError("Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-20%] left-[-20%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none"></div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-30 z-0"></div>

            <div className="relative z-10 w-full max-w-md">

                {/* Logo Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6 text-sm">
                        <ArrowLeft size={16} /> Return to Orbit
                    </Link>
                    <h1 className="text-4xl font-serif text-white mb-2">NewsEcho.</h1>
                    <p className="text-neutral-500 italic">"The ink never dries on a good story."</p>
                </div>

                {/* Auth Card */}
                <div className="glass-effect p-8 rounded-xl border border-white/10 shadow-2xl bg-neutral-900/60 backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-60"></div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1.5">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-white/20 focus:border-white/20 outline-none transition-all"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1.5">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-white/20 focus:border-white/20 outline-none transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-medium py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 mt-2"
                        >
                            {loading && <Loader2 size={18} className="animate-spin" />}
                            Log In
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-4 text-neutral-600 text-xs uppercase font-medium">
                        <div className="flex-1 h-px bg-neutral-800"></div>
                        <span>Or</span>
                        <div className="flex-1 h-px bg-neutral-800"></div>
                    </div>

                    <button
                        onClick={signInWithGoogle}
                        className="w-full bg-neutral-950 border border-neutral-800 text-white font-medium py-3 rounded-lg hover:bg-neutral-900 transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="#FFFFFF"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#FFFFFF"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FFFFFF"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#FFFFFF"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="mt-8 text-center text-sm text-neutral-500">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-white hover:underline decoration-white/50 underline-offset-4">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
