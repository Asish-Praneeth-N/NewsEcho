"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Loader2 } from "lucide-react";

export default function UserDashboard() {
    const { user, role, loading, logout } = useAuth();
    const router = useRouter();
    const [requestStatus, setRequestStatus] = useState<"none" | "pending">("none");

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
            } else if (role === "admin") {
                router.push("/admin");
            } else if (role === "super_admin") {
                router.push("/super-admin");
            }
        }

        // Listen for adminRequest status
        if (user) {
            const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
                if (doc.exists() && doc.data().adminRequest) {
                    setRequestStatus("pending");
                } else {
                    setRequestStatus("none");
                }
            });
            return () => unsub();
        }
    }, [user, role, loading, router]);

    const handleRequestAdmin = async () => {
        if (!user) return;
        try {
            await updateDoc(doc(db, "users", user.uid), {
                adminRequest: true
            });
        } catch (err) {
            console.error(err);
        }
    };

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
                <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-3xl font-serif">Publisher Dashboard</h1>
                        <p className="text-neutral-500">Manage your subscriptions and bookmarks.</p>
                    </div>
                    <button
                        onClick={() => logout()}
                        className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                        Sign Out
                    </button>
                </div>

                <div className="grid gap-8">
                    {/* Placeholder Content */}
                    <div className="p-12 border border-neutral-800 rounded-lg text-center bg-neutral-900/30">
                        <h3 className="text-xl font-medium mb-2 text-neutral-300">No active subscriptions</h3>
                        <p className="text-neutral-500 mb-6">Explore the community to find newsletters you love.</p>
                        <button className="px-6 py-2 bg-white text-black rounded font-medium hover:bg-gray-200">
                            Explore
                        </button>
                    </div>

                    {/* Admin Access Request Block */}
                    <div className="border-t border-neutral-800 pt-8 mt-4">
                        <h3 className="text-lg font-medium mb-4">Publisher Status</h3>

                        <div className="flex items-center justify-between p-4 bg-neutral-900/50 rounded-lg border border-neutral-800">
                            <div>
                                <h4 className="font-medium text-white mb-1">Interested in publishing?</h4>
                                <p className="text-sm text-neutral-500">
                                    {requestStatus === "pending"
                                        ? "Your request is under review by a Super Admin."
                                        : "Request admin access to start creating your own newsletters."}
                                </p>
                            </div>
                            {requestStatus === "pending" ? (
                                <span className="px-4 py-2 bg-yellow-900/20 text-yellow-500 border border-yellow-900/50 rounded text-sm font-medium">
                                    Pending Review
                                </span>
                            ) : (
                                <button
                                    onClick={handleRequestAdmin}
                                    className="px-4 py-2 bg-indigo-900/30 text-indigo-400 border border-indigo-900 rounded hover:bg-indigo-900/50 transition-colors text-sm font-medium"
                                >
                                    Request Access
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
