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

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

    if (!isAdmin) return null;

    const stats = [
        { name: 'Total Subscribers', value: '12,345', change: '+12%', icon: Users },
        { name: 'Active Newsletters', value: '24', change: '+4', icon: Mail },
        { name: 'Avg. Open Rate', value: '48.5%', change: '+2.1%', icon: Activity },
        { name: 'Monthly Revenue', value: '$45,231', change: '+18%', icon: TrendingUp },
    ];

    const recentActivity = [
        { id: 1, type: 'New Subscriber', user: 'alex@example.com', time: '2 mins ago' },
        { id: 2, type: 'Newsletter Published', user: 'Tech Weekly #42', time: '1 hour ago' },
        { id: 3, type: 'New Subscriber', user: 'sarah@design.co', time: '3 hours ago' },
        { id: 4, type: 'Payment Received', user: '$12.00 from Mike', time: '5 hours ago' },
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
            <Navbar />

            <main className="pt-24 pb-12 px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Admin Dashboard</h1>
                        <p className="mt-2 text-gray-400">Welcome back, {user?.displayName || 'Admin'}. Here's what's happening today.</p>
                    </div>
                    <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                        <Plus className="h-5 w-5" /> New Newsletter
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
                    {stats.map((item) => (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-6 rounded-2xl bg-gray-900/50 border border-white/10 backdrop-blur-sm hover:bg-gray-900 hover:border-white/20 transition-all group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                                    <item.icon className="h-6 w-6 text-gray-300 group-hover:text-white transition-colors" />
                                </div>
                                <span className="flex items-center text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                                    {item.change} <ArrowUpRight className="h-3 w-3 ml-1" />
                                </span>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1">{item.value}</h3>
                            <p className="text-sm text-gray-400">{item.name}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chart Area (Placeholder) */}
                    <div className="lg:col-span-2 p-8 rounded-3xl bg-gray-900/30 border border-white/10 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-white">Subscriber Growth</h2>
                            <select className="bg-black border border-white/10 rounded-lg px-3 py-1 text-sm text-gray-400 focus:outline-none focus:border-white/30">
                                <option>Last 7 days</option>
                                <option>Last 30 days</option>
                                <option>Last year</option>
                            </select>
                        </div>
                        <div className="h-64 flex items-end justify-between gap-2">
                            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                <div key={i} className="w-full bg-white/5 rounded-t-lg hover:bg-white/10 transition-all relative group" style={{ height: `${h}%` }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {h * 10}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 text-xs text-gray-500">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="p-8 rounded-3xl bg-gray-900/30 border border-white/10 backdrop-blur-sm">
                        <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
                        <div className="space-y-6">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-4 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                                    <div className="h-2 w-2 mt-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-white">{activity.type}</p>
                                        <p className="text-xs text-gray-400 mt-1">{activity.user}</p>
                                        <p className="text-[10px] text-gray-600 mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-3 rounded-xl border border-white/10 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                            View All Activity
                        </button>
                    </div>
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
