"use client";

import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Clock, Star, ArrowRight, Search, Filter } from "lucide-react";
import Link from "next/link";

export default function UserDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

    const subscriptions = [
        { id: 1, title: 'Tech Weekly', author: 'TechCrunch', category: 'Technology', nextIssue: 'Tomorrow' },
        { id: 2, title: 'Design Daily', author: 'Dribbble', category: 'Design', nextIssue: 'Today' },
        { id: 3, title: 'Finance Digest', author: 'Bloomberg', category: 'Business', nextIssue: 'Mon, Dec 18' },
    ];

    const recentIssues = [
        { id: 1, title: 'The Future of AI', newsletter: 'Tech Weekly', date: 'Dec 10', readTime: '5 min' },
        { id: 2, title: 'Minimalist UI Trends', newsletter: 'Design Daily', date: 'Dec 09', readTime: '3 min' },
        { id: 3, title: 'Market Analysis Q4', newsletter: 'Finance Digest', date: 'Dec 08', readTime: '8 min' },
        { id: 4, title: 'React Server Components', newsletter: 'Tech Weekly', date: 'Dec 03', readTime: '6 min' },
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
            <Navbar />

            <main className="pt-24 pb-12 px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">My Dashboard</h1>
                        <p className="mt-2 text-gray-400">Welcome back, {user?.displayName || 'Reader'}. You have 3 new issues to read.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search newsletters..."
                                className="bg-gray-900 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-white/30 w-64"
                            />
                        </div>
                        <button className="p-2 rounded-full bg-gray-900 border border-white/10 text-gray-400 hover:text-white transition-colors">
                            <Filter className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Subscriptions Grid */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">My Subscriptions</h2>
                        <Link href="/newsletters" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                            Browse All <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {subscriptions.map((sub) => (
                            <motion.div
                                key={sub.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group p-6 rounded-2xl bg-gray-900/30 border border-white/10 hover:bg-gray-900 hover:border-white/30 transition-all relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowRight className="h-5 w-5 text-white -rotate-45" />
                                </div>
                                <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                                    <Mail className="h-5 w-5 text-gray-300" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">{sub.title}</h3>
                                <p className="text-sm text-gray-400 mb-4">by {sub.author}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <span className="text-xs font-medium text-gray-500 bg-white/5 px-2 py-1 rounded">{sub.category}</span>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> {sub.nextIssue}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Recent Issues List */}
                <section>
                    <h2 className="text-xl font-bold text-white mb-6">Recent Issues</h2>
                    <div className="rounded-3xl bg-gray-900/30 border border-white/10 backdrop-blur-sm overflow-hidden">
                        {recentIssues.map((issue, i) => (
                            <div key={issue.id} className="group flex items-center justify-between p-6 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center text-xs font-bold text-gray-400">
                                        {issue.newsletter.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-white group-hover:text-gray-200 transition-colors">{issue.title}</h3>
                                        <p className="text-xs text-gray-500">{issue.newsletter} • {issue.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="text-xs text-gray-500 hidden sm:block">{issue.readTime} read</span>
                                    <button className="p-2 rounded-full hover:bg-white/10 text-gray-500 hover:text-white transition-colors">
                                        <Star className="h-4 w-4" />
                                    </button>
                                    <button className="p-2 rounded-full bg-white text-black opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
