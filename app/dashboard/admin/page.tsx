"use client";

import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Mail, TrendingUp, Settings, Plus, FileText, Activity, ArrowUpRight } from "lucide-react";

export default function AdminDashboard() {
    const { user, loading, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
            } else if (!isAdmin) {
                router.push("/dashboard/user");
            }
        }
    }, [user, loading, isAdmin, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    if (!user || !isAdmin) return null;

    const stats = [
        { name: 'Total Users', value: '1,234', change: '+12%', icon: Users, color: 'text-blue-400' },
        { name: 'Active Newsletters', value: '45', change: '+5%', icon: Mail, color: 'text-purple-400' },
        { name: 'Revenue', value: '$12,345', change: '+18%', icon: TrendingUp, color: 'text-green-400' },
        { name: 'Avg. Open Rate', value: '42%', change: '+2%', icon: Activity, color: 'text-yellow-400' },
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
            <Navbar />
            <main className="pt-24 pb-12 px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2">Admin Dashboard</h1>
                        <p className="text-gray-400">Overview of platform performance and management.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium">
                            <Settings className="h-4 w-4" />
                            Settings
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-white text-black hover:bg-gray-200 transition-colors text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transform duration-200">
                            <Plus className="h-4 w-4" />
                            New Newsletter
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <span className="flex items-center text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                                    {stat.change}
                                    <ArrowUpRight className="h-3 w-3 ml-1" />
                                </span>
                            </div>
                            <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                            <p className="text-sm text-gray-400">{stat.name}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chart Area */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold">Growth Analytics</h2>
                            <select className="bg-black/50 border border-white/10 rounded-lg px-3 py-1 text-sm text-gray-400 focus:outline-none focus:border-white/30">
                                <option>Last 7 days</option>
                                <option>Last 30 days</option>
                                <option>Last year</option>
                            </select>
                        </div>
                        <div className="h-64 flex items-center justify-center text-gray-500 border-2 border-dashed border-white/10 rounded-xl">
                            Chart Placeholder
                        </div>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="p-8 rounded-3xl bg-white/5 border border-white/10"
                    >
                        <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
                        <div className="space-y-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                        <FileText className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">New newsletter published</p>
                                        <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-3 rounded-xl border border-white/10 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                            View All Activity
                        </button>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <div className="mt-12">
                    <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: 'Create Newsletter', desc: 'Draft and publish a new issue', icon: FileText },
                            { title: 'Manage Subscribers', desc: 'View and edit subscriber list', icon: Users },
                            { title: 'Platform Settings', desc: 'Configure general settings', icon: Settings },
                        ].map((action, i) => (
                            <button key={i} className="flex items-center gap-4 p-6 rounded-2xl bg-gray-900/30 border border-white/10 hover:bg-gray-900 hover:border-white/30 transition-all text-left group">
                                <div className="p-3 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                                    <action.icon className="h-6 w-6 text-gray-300 group-hover:text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{action.title}</h3>
                                    <p className="text-xs text-gray-400 mt-1">{action.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
