"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowLeft, Users, MousePointer, Eye, TrendingUp, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface AnalyticsData {
    newsletterId: string;
    totalOpens: number;
    uniqueOpens: number;
    totalClicks: number;
    clickThroughRate: number;
    opensOverTime: { date: string; count: number }[];
    clicksOverTime: { date: string; count: number }[];
}

interface Newsletter {
    title: string;
    status: string;
    publishedAt: any;
}

export default function AnalyticsPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

    useEffect(() => {
        if (params.id) {
            fetchData(params.id as string);
        }
    }, [params.id]);

    const fetchData = async (id: string) => {
        if (!db) return;
        try {
            // Fetch Newsletter Details
            const newsletterDoc = await getDoc(doc(db, "newsletters", id));
            if (newsletterDoc.exists()) {
                setNewsletter(newsletterDoc.data() as Newsletter);
            } else {
                alert("Newsletter not found");
                router.push("/dashboard/admin/newsletters");
                return;
            }

            // Mock Analytics Data (Replace with real Firestore queries when tracking is implemented)
            // In a real app, you would query a 'newsletter_analytics' collection or subcollection
            setAnalytics({
                newsletterId: id,
                totalOpens: Math.floor(Math.random() * 1000) + 500,
                uniqueOpens: Math.floor(Math.random() * 800) + 400,
                totalClicks: Math.floor(Math.random() * 300) + 100,
                clickThroughRate: 12.5,
                opensOverTime: Array.from({ length: 7 }, (_, i) => ({
                    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
                    count: Math.floor(Math.random() * 100) + 50
                })),
                clicksOverTime: Array.from({ length: 7 }, (_, i) => ({
                    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
                    count: Math.floor(Math.random() * 50) + 10
                }))
            });

        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    if (!newsletter || !analytics) return null;

    return (
        <div className="min-h-screen bg-black text-white font-sans p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/dashboard/admin/newsletters"
                        className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-1">Analytics: {newsletter.title}</h1>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Published: {newsletter.publishedAt ? new Date(newsletter.publishedAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                            </span>
                            <span className="flex items-center gap-1 capitalize">
                                <Clock className="h-4 w-4" />
                                Status: {newsletter.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-2xl bg-white/5 border border-white/10"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                                <Eye className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">+12%</span>
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{analytics.totalOpens}</h3>
                        <p className="text-sm text-gray-400">Total Opens</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-6 rounded-2xl bg-white/5 border border-white/10"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                                <Users className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">+8%</span>
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{analytics.uniqueOpens}</h3>
                        <p className="text-sm text-gray-400">Unique Opens</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-6 rounded-2xl bg-white/5 border border-white/10"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400">
                                <MousePointer className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">+5%</span>
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{analytics.totalClicks}</h3>
                        <p className="text-sm text-gray-400">Total Clicks</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-6 rounded-2xl bg-white/5 border border-white/10"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-green-500/10 text-green-400">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">+2.5%</span>
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{analytics.clickThroughRate}%</h3>
                        <p className="text-sm text-gray-400">Click-Through Rate</p>
                    </motion.div>
                </div>

                {/* Charts Area (Placeholder for now) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                        <h3 className="text-xl font-bold mb-6">Engagement Over Time</h3>
                        <div className="h-64 flex items-end justify-between gap-2 px-4">
                            {analytics.opensOverTime.map((item, index) => (
                                <div key={index} className="flex flex-col items-center gap-2 w-full">
                                    <div
                                        className="w-full bg-blue-500/50 rounded-t-lg hover:bg-blue-500 transition-colors relative group"
                                        style={{ height: `${(item.count / 150) * 100}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {item.count} Opens
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400">{item.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                        <h3 className="text-xl font-bold mb-6">Click Performance</h3>
                        <div className="h-64 flex items-end justify-between gap-2 px-4">
                            {analytics.clicksOverTime.map((item, index) => (
                                <div key={index} className="flex flex-col items-center gap-2 w-full">
                                    <div
                                        className="w-full bg-orange-500/50 rounded-t-lg hover:bg-orange-500 transition-colors relative group"
                                        style={{ height: `${(item.count / 60) * 100}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {item.count} Clicks
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400">{item.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
