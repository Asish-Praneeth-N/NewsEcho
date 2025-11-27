"use client";

import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Clock, Star, ArrowRight, Search, Filter } from "lucide-react";
import Link from "next/link";

import { collection, query, where, orderBy, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function UserDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [latestIssues, setLatestIssues] = useState<any[]>([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        } else if (user) {
            fetchLatestIssues();
        }
    }, [user, loading, router]);

    const fetchLatestIssues = async () => {
        if (!db) return;
        try {
            const q = query(
                collection(db, "newsletters"),
                where("status", "==", "published"),
                orderBy("createdAt", "desc"),
                limit(5)
            );
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setLatestIssues(data);
        } catch (error) {
            console.error("Error fetching newsletters:", error);
        } finally {
            setFetching(false);
        }
    };

    if (loading || fetching) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    if (!user) return null;

    const subscriptions = [
        { id: 1, name: 'Tech Weekly', author: 'Alex Chen', nextIssue: 'Tomorrow', status: 'Active', color: 'bg-blue-500' },
        { id: 2, name: 'Design Daily', author: 'Sarah Smith', nextIssue: 'In 2 days', status: 'Active', color: 'bg-purple-500' },
        { id: 3, name: 'Finance Digest', author: 'Mike Ross', nextIssue: 'Today', status: 'Paused', color: 'bg-green-500' },
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
            <Navbar />
            <main className="pt-24 pb-12 px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2">My Feed</h1>
                        <p className="text-gray-400">Manage your subscriptions and read latest issues.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search newsletters..."
                                className="pl-10 pr-4 py-2 rounded-full bg-white/10 border border-white/10 focus:border-white/30 focus:outline-none text-sm w-64 transition-all"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium">
                            <Filter className="h-4 w-4" />
                            Filter
                        </button>
                    </div>
                </div>

                {/* Subscriptions Grid - Placeholder for now */}
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Your Subscriptions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {subscriptions.map((sub, index) => (
                        <motion.div
                            key={sub.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group hover:-translate-y-1"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`h-12 w-12 rounded-xl ${sub.color} flex items-center justify-center text-xl font-bold`}>
                                    {sub.name[0]}
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${sub.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                    {sub.status}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold mb-1">{sub.name}</h3>
                            <p className="text-sm text-gray-400 mb-4">by {sub.author}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Next: {sub.nextIssue}
                                </span>
                                <button className="text-sm font-bold hover:underline flex items-center gap-1">
                                    Read <ArrowRight className="h-3 w-3" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Recent Issues List */}
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-500" />
                    Latest Issues
                </h2>
                <div className="space-y-4">
                    {latestIssues.length === 0 ? (
                        <p className="text-gray-400">No published newsletters yet.</p>
                    ) : (
                        latestIssues.map((issue, i) => (
                            <motion.div
                                key={issue.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + (i * 0.1) }}
                                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-gray-800 flex items-center justify-center">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold group-hover:text-blue-400 transition-colors">{issue.title}</h4>
                                        <p className="text-sm text-gray-400">By {issue.author} • {issue.createdAt?.toDate().toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <Link href={`/newsletter/${issue.id}`} className="text-xs text-blue-400 hover:underline">
                                    Read Now
                                </Link>
                            </motion.div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
