"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, query, orderBy, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, Search, Filter, Edit, Trash2, Eye, MoreVertical, FileText, CheckCircle, Clock, AlertCircle, Activity } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { Timestamp } from "firebase/firestore";

interface Newsletter {
    id: string;
    title: string;
    status: 'draft' | 'published' | 'scheduled';
    publishedAt?: Timestamp;
    author: string;
    createdAt: Timestamp;
}

export default function NewslettersPage() {
    const router = useRouter();
    const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'draft' | 'published' | 'scheduled'>('all');
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchNewsletters();
    }, []);

    const fetchNewsletters = async () => {
        if (!db) {
            setLoading(false);
            return;
        }
        const firestore = db;
        try {
            const q = query(collection(firestore, "newsletters"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Newsletter[];
            setNewsletters(data);
        } catch (error) {
            console.error("Error fetching newsletters:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!db) return;
        const firestore = db;
        if (confirm("Are you sure you want to delete this newsletter?")) {
            try {
                await deleteDoc(doc(firestore, "newsletters", id));
                setNewsletters(prev => prev.filter(n => n.id !== id));
            } catch (error) {
                console.error("Error deleting newsletter:", error);
            }
        }
    };

    const handleStatusChange = async (id: string, newStatus: 'draft' | 'published' | 'scheduled') => {
        if (!db) return;
        const firestore = db;
        try {
            await updateDoc(doc(firestore, "newsletters", id), { status: newStatus, publishedAt: newStatus === 'published' ? Timestamp.now() : null });

            // If publishing, trigger email notification
            if (newStatus === 'published') {
                const newsletter = newsletters.find(n => n.id === id);
                if (newsletter) {
                    // Don't await this to keep UI responsive, or show a toast
                    fetch('/api/send-newsletter', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            newsletterId: id,
                            title: newsletter.title,
                            link: `${window.location.origin}/newsletter/${id}` // Assuming public link
                        })
                    }).catch(err => console.error("Failed to send emails:", err));
                }
            }

            setNewsletters(prev => prev.map(n => n.id === id ? { ...n, status: newStatus, publishedAt: newStatus === 'published' ? Timestamp.now() : undefined } : n));
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const filteredNewsletters = newsletters.filter(n => {
        const matchesFilter = filter === 'all' || n.status === filter;
        const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'scheduled': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'published': return <CheckCircle className="h-3 w-3" />;
            case 'scheduled': return <Clock className="h-3 w-3" />;
            default: return <FileText className="h-3 w-3" />;
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Newsletters</h1>
                        <p className="text-gray-400">Manage, publish, and track your newsletters.</p>
                    </div>
                    <Link
                        href="/dashboard/admin/newsletters/new"
                        className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                        <Plus className="h-5 w-5" /> Create New
                    </Link>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search newsletters..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:outline-none text-sm transition-all"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        {['all', 'draft', 'published', 'scheduled'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize whitespace-nowrap transition-all border ${filter === f
                                    ? 'bg-white text-black border-white'
                                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                    </div>
                ) : filteredNewsletters.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed">
                        <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No newsletters found</h3>
                        <p className="text-gray-400 mb-6">Get started by creating your first newsletter.</p>
                        <Link
                            href="/dashboard/admin/newsletters/new"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
                        >
                            <Plus className="h-4 w-4" /> Create Newsletter
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredNewsletters.map((newsletter) => (
                            <motion.div
                                key={newsletter.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(newsletter.status)}`}>
                                            {getStatusIcon(newsletter.status)}
                                            {newsletter.status.charAt(0).toUpperCase() + newsletter.status.slice(1)}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {newsletter.publishedAt ? newsletter.publishedAt.toDate().toLocaleDateString() : 'Not published'}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                                        {newsletter.title}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        By {newsletter.author}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Link
                                        href={`/dashboard/admin/newsletters/${newsletter.id}/edit`}
                                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                        title="Edit"
                                    >
                                        <Edit className="h-5 w-5" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(newsletter.id)}
                                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                    <div className="relative group/menu">
                                        <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                                            <MoreVertical className="h-5 w-5" />
                                        </button>
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-white/10 rounded-xl shadow-xl overflow-hidden hidden group-hover/menu:block z-10">
                                            {newsletter.status !== 'published' && (
                                                <button
                                                    onClick={() => handleStatusChange(newsletter.id, 'published')}
                                                    className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                                                >
                                                    <CheckCircle className="h-4 w-4" /> Publish Now
                                                </button>
                                            )}
                                            {newsletter.status === 'published' && (
                                                <button
                                                    onClick={() => handleStatusChange(newsletter.id, 'draft')}
                                                    className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                                                >
                                                    <FileText className="h-4 w-4" /> Revert to Draft
                                                </button>
                                            )}
                                            <Link
                                                href={`/dashboard/admin/newsletters/${newsletter.id}/analytics`}
                                                className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                                            >
                                                <Activity className="h-4 w-4" /> View Analytics
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
