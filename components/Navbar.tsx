"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { User } from "lucide-react";
import ProfileModal from "@/components/ProfileModal";

export default function Navbar() {
    const { user, userProfile, isAdmin } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const dashboardLink = isAdmin ? "/dashboard/admin" : "/dashboard/user";

    return (
        <>
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
                                        href={dashboardLink}
                                        className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => setIsProfileOpen(true)}
                                        className="flex items-center gap-3 group cursor-pointer"
                                    >
                                        <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                                            Profile
                                        </span>
                                        <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-800 border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all">
                                            {userProfile?.photoURL || user.photoURL ? (
                                                <img
                                                    src={userProfile?.photoURL || user.photoURL || ""}
                                                    alt="Profile"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <User className="h-4 w-4 text-gray-400" />
                                            )}
                                        </div>
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
            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                user={user}
                userProfile={userProfile}
            />
        </>
    );
}
