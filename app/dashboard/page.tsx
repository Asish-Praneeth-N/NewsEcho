"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
    const { user, role, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
            } else if (role !== "user") {
                router.push("/admin"); // Redirect Admins to Admin Panel
            }
        }
    }, [user, role, loading, router]);

    if (loading || !user || role !== "user") {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="animate-spin text-white" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-serif">Publisher Dashboard</h1>
                    <button onClick={logout} className="px-4 py-2 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors text-sm">
                        Sign Out
                    </button>
                </div>

                <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800">
                    <h2 className="text-xl font-medium mb-4">Welcome back, {user.email}</h2>
                    <div className="p-4 bg-neutral-950 rounded border border-neutral-800 text-neutral-400 text-sm">
                        This is a protected user area. Only users with `role: "user"` can see this.
                    </div>
                </div>
            </div>
        </div>
    );
}
