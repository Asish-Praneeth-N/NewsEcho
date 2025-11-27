"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Search, Filter, MoreVertical, User, Shield, Ban, Trash2, CheckCircle, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

interface UserData {
    id: string;
    uid: string;
    email: string;
    displayName: string | null;
    photoURL: string | null;
    role: 'user' | 'admin';
    status?: 'active' | 'disabled';
    createdAt: any;
}

export default function UsersPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<'all' | 'admin' | 'user'>('all');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        if (!db) {
            setLoading(false);
            return;
        }
        const firestore = db;
        try {
            const q = query(collection(firestore, "users"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as UserData[];
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
        if (!db) return;
        const firestore = db;
        try {
            await updateDoc(doc(firestore, "users", userId), { role: newRole });
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            console.error("Error updating role:", error);
        }
    };

    const handleStatusChange = async (userId: string, newStatus: 'active' | 'disabled') => {
        if (!db) return;
        const firestore = db;
        try {
            await updateDoc(doc(firestore, "users", userId), { status: newStatus });
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleDelete = async (userId: string) => {
        if (!db) return;
        const firestore = db;
        if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            try {
                await deleteDoc(doc(firestore, "users", userId));
                setUsers(prev => prev.filter(u => u.id !== userId));
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesFilter = filter === 'all' || user.role === filter;
        const matchesSearch =
            (user.displayName?.toLowerCase().includes(search.toLowerCase()) || false) ||
            (user.email?.toLowerCase().includes(search.toLowerCase()) || false);
        const isNotCurrentUser = user.id !== currentUser?.uid;
        return matchesFilter && matchesSearch && isNotCurrentUser;
    });

    return (
        <div className="min-h-screen bg-black text-white font-sans p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">User Management</h1>
                        <p className="text-gray-400">Manage user roles, status, and permissions.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-400" />
                            <span className="text-sm font-bold">{users.length} Total Users</span>
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:outline-none text-sm transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'admin', 'user'].map((f) => (
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
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed">
                        <User className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No users found</h3>
                        <p className="text-gray-400">Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredUsers.map((user) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-800 border border-white/10 flex-shrink-0">
                                        {user.photoURL ? (
                                            <img src={user.photoURL} alt={user.displayName || "User"} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center">
                                                <User className="h-6 w-6 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-bold text-white">
                                                {user.displayName || "Unnamed User"}
                                            </h3>
                                            {user.role === 'admin' && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">
                                                    <Shield className="h-3 w-3" /> Admin
                                                </span>
                                            )}
                                            {user.status === 'disabled' && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20">
                                                    <Ban className="h-3 w-3" /> Disabled
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <Mail className="h-3 w-3" />
                                            {user.email}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <button
                                            onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                                            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium text-gray-300 transition-colors flex items-center gap-2"
                                        >
                                            Actions <MoreVertical className="h-4 w-4" />
                                        </button>
                                        {openMenuId === user.id && (
                                            <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-10">
                                                {user.role !== 'admin' ? (
                                                    <button
                                                        onClick={() => handleRoleChange(user.id, 'admin')}
                                                        className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                                                    >
                                                        <Shield className="h-4 w-4" /> Promote to Admin
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleRoleChange(user.id, 'user')}
                                                        className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                                                    >
                                                        <User className="h-4 w-4" /> Demote to User
                                                    </button>
                                                )}

                                                {user.status !== 'disabled' ? (
                                                    <button
                                                        onClick={() => handleStatusChange(user.id, 'disabled')}
                                                        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                                    >
                                                        <Ban className="h-4 w-4" /> Disable Account
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleStatusChange(user.id, 'active')}
                                                        className="w-full text-left px-4 py-3 text-sm text-green-400 hover:bg-green-500/10 transition-colors flex items-center gap-2"
                                                    >
                                                        <CheckCircle className="h-4 w-4" /> Enable Account
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2 border-t border-white/5"
                                                >
                                                    <Trash2 className="h-4 w-4" /> Delete User
                                                </button>
                                            </div>
                                        )}
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
