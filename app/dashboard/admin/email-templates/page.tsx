"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, Edit, Trash2, Mail, Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    content: string;
}

export default function EmailTemplatesPage() {
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<EmailTemplate>({ id: '', name: '', subject: '', content: '' });

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            if (!db) return;
            const querySnapshot = await getDocs(collection(db, "email_templates"));
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as EmailTemplate[];
            setTemplates(data);
        } catch (error) {
            console.error("Error fetching templates:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (template: EmailTemplate) => {
        setEditingId(template.id);
        setEditForm(template);
    };

    const handleCreate = () => {
        const newId = `template-${Date.now()}`;
        setEditingId(newId);
        setEditForm({ id: newId, name: 'New Template', subject: '', content: '' });
    };

    const handleSave = async () => {
        try {
            if (!db) return;
            await setDoc(doc(db, "email_templates", editForm.id), editForm);
            setTemplates(prev => {
                const existing = prev.find(t => t.id === editForm.id);
                if (existing) {
                    return prev.map(t => t.id === editForm.id ? editForm : t);
                } else {
                    return [...prev, editForm];
                }
            });
            setEditingId(null);
        } catch (error) {
            console.error("Error saving template:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this template?")) {
            try {
                if (!db) return;
                await deleteDoc(doc(db, "email_templates", id));
                setTemplates(prev => prev.filter(t => t.id !== id));
            } catch (error) {
                console.error("Error deleting template:", error);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    if (editingId) {
        return (
            <div className="min-h-screen bg-black text-white font-sans p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setEditingId(null)}
                                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="h-6 w-6" />
                            </button>
                            <h1 className="text-3xl font-bold tracking-tight">
                                {templates.find(t => t.id === editingId) ? 'Edit Template' : 'Create Template'}
                            </h1>
                        </div>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black hover:bg-gray-200 transition-colors text-sm font-bold shadow-lg hover:scale-105"
                        >
                            <Save className="h-4 w-4" /> Save Template
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Template Name</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-white/30 focus:outline-none text-sm transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Email Subject</label>
                                <input
                                    type="text"
                                    value={editForm.subject}
                                    onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-white/30 focus:outline-none text-sm transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">Email Content</label>
                            <RichTextEditor
                                value={editForm.content}
                                onChange={(val) => setEditForm({ ...editForm, content: val })}
                                placeholder="Design your email template..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Email Templates</h1>
                        <p className="text-gray-400">Manage standard email layouts and responses.</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                        <Plus className="h-5 w-5" /> Create New
                    </button>
                </div>

                {templates.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed">
                        <Mail className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No templates found</h3>
                        <p className="text-gray-400 mb-6">Create your first email template to get started.</p>
                        <button
                            onClick={handleCreate}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
                        >
                            <Plus className="h-4 w-4" /> Create Template
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map((template) => (
                            <motion.div
                                key={template.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(template)}
                                            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(template.id)}
                                            className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{template.name}</h3>
                                <p className="text-sm text-gray-400 line-clamp-2">
                                    Subject: {template.subject}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
