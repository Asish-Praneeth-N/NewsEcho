"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { signOut, Auth } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
    const { user, isAdmin } = useAuth();
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        if (auth) {
            await signOut(auth as Auth);
        }
        router.push("/login");
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-black/50 backdrop-blur-md border-b border-white/10" : "bg-transparent"}`}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 justify-between items-center">
                    <div className="flex">
                        <div className="flex flex-shrink-0 items-center">
                            <Link href="/" className="text-2xl font-bold text-white tracking-tight hover:opacity-80 transition-opacity">
                                NewsEcho
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center">
                        {user ? (
                            <div className="flex items-center gap-6">
                                <Link
                                    href={isAdmin ? "/dashboard/admin" : "/dashboard/user"}
                                    className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20 border border-white/10 transition-all"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-6">
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="rounded-full bg-white px-5 py-2 text-sm font-bold text-black shadow-lg hover:bg-gray-200 hover:scale-105 transition-all duration-300"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
