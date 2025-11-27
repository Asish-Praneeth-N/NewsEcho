"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Search, Filter, Shield, FileText, User, Settings, Clock, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface AuditLog {
    id: string;
    action: string;
    actor: string; // User ID or Name
    target: string; // Resource affected
    details: string;
    timestamp: any;
    type: 'security' | 'content' | 'user' | 'system';
}

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'security' | 'content' | 'user' | 'system'>('all');

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            // In a real app, you would fetch from 'audit_logs' collection
            // For now, we'll simulate data or fetch if it exists
            // const q = query(collection(db, "audit_logs"), orderBy("timestamp", "desc"), limit(50));
            // const querySnapshot = await getDocs(q);
            // const data = querySnapshot.docs.map(...) 

            // Mock Data for Demonstration
            const mockLogs: AuditLog[] = Array.from({ length: 20 }, (_, i) => {
                const types: ('security' | 'content' | 'user' | 'system')[] = ['security', 'content', 'user', 'system'];
                const type = types[Math.floor(Math.random() * types.length)];
                return {
                    id: `log-${i}`,
                    action: ['User Login', 'Newsletter Published', 'User Promoted', 'Settings Updated'][Math.floor(Math.random() * 4)],
                    actor: 'Admin User',
                    target: ['System', 'Newsletter #123', 'User #456', 'Email Settings'][Math.floor(Math.random() * 4)],
                    details: 'Action performed successfully',
                    timestamp: new Date(Date.now() - i * 1000 * 60 * 60),
                    type: type
                };
            });
            setLogs(mockLogs);
        } catch (error) {
            console.error("Error fetching logs:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(log => filter === 'all' || log.type === filter);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'security': return <Shield className="h-4 w-4 text-red-400" />;
            case 'content': return <FileText className="h-4 w-4 text-blue-400" />;
            case 'user': return <User className="h-4 w-4 text-purple-400" />;
            case 'system': return <Settings className="h-4 w-4 text-gray-400" />;
            default: return <Activity className="h-4 w-4 text-gray-400" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'security': return 'bg-red-500/10 border-red-500/20 text-red-400';
            case 'content': return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
            case 'user': return 'bg-purple-500/10 border-purple-500/20 text-purple-400';
            case 'system': return 'bg-gray-500/10 border-gray-500/20 text-gray-400';
            default: return 'bg-gray-500/10 border-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Audit Logs</h1>
                    <p className="text-gray-400">Track system activity and security events.</p>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {['all', 'security', 'content', 'user', 'system'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all border ${filter === f
                                    ? 'bg-white text-black border-white'
                                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Logs Table */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        <div className="col-span-2">Type</div>
                        <div className="col-span-3">Action</div>
                        <div className="col-span-2">Actor</div>
                        <div className="col-span-3">Target</div>
                        <div className="col-span-2 text-right">Time</div>
                    </div>
                    <div className="divide-y divide-white/5">
                        {loading ? (
                            <div className="p-8 flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                            </div>
                        ) : filteredLogs.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">No logs found.</div>
                        ) : (
                            filteredLogs.map((log) => (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors text-sm"
                                >
                                    <div className="col-span-2">
                                        <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border ${getTypeColor(log.type)}`}>
                                            {getTypeIcon(log.type)}
                                            <span className="capitalize">{log.type}</span>
                                        </span>
                                    </div>
                                    <div className="col-span-3 font-medium text-white">
                                        {log.action}
                                    </div>
                                    <div className="col-span-2 text-gray-400">
                                        {log.actor}
                                    </div>
                                    <div className="col-span-3 text-gray-400 truncate">
                                        {log.target}
                                    </div>
                                    <div className="col-span-2 text-right text-gray-500 text-xs flex items-center justify-end gap-1">
                                        <Clock className="h-3 w-3" />
                                        {log.timestamp.toLocaleString()}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
