"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, ShieldAlert } from "lucide-react";

export default function AdminDashboard() {
    const { user, role, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login"); // Unauthenticated -> Login
            } else if (role !== "admin") {
                router.push("/dashboard"); // Regular User -> User Dashboard
            }
        }
    }, [user, role, loading, router]);

    if (loading || !user || role !== "admin") {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="animate-spin text-white" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8 border-t-4 border-red-600">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="text-red-500" />
                        <h1 className="text-3xl font-serif">Admin Console</h1>
                    </div>
                    <button onClick={logout} className="px-4 py-2 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors text-sm">
                        Sign Out
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800">
                        <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wide mb-2">System Status</h2>
                        <div className="text-2xl font-bold text-emerald-500">Operational</div>
                    </div>
                    <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800">
                        <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wide mb-2">Total Users</h2>
                        <div className="text-2xl font-bold">1</div>
                    </div>
                </div>

            </div>
        </div>
    );
}
