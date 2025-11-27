"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Save, Send, Clock, Loader2, Eye } from "lucide-react";
import Link from "next/link";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploader from "@/components/admin/ImageUploader";

export default function CreateNewsletterPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [heroImage, setHeroImage] = useState("");
    const [tags, setTags] = useState("");

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        setSlug(generateSlug(newTitle));
    };

    const handleSubmit = async (status: 'draft' | 'published' | 'scheduled') => {
        if (!title || !content) {
            alert("Please fill in at least the title and content.");
            return;
        }

        setLoading(true);

        if (!db) {
            alert("Database connection not available. Please try again later.");
            setLoading(false);
            return;
        }

        try {
            const newsletterData = {
                title,
                slug,
                summary,
                content,
                heroImage,
                tags: tags.split(',').map(t => t.trim()).filter(Boolean),
                status,
                author: user?.displayName || 'Admin',
                authorId: user?.uid,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                publishedAt: status === 'published' ? serverTimestamp() : null,
            };

            await addDoc(collection(db, "newsletters"), newsletterData);
            router.push("/dashboard/admin/newsletters");
        } catch (error) {
            console.error("Error creating newsletter:", error);
            alert("Failed to create newsletter. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans p-6 lg:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard/admin/newsletters"
                            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Create Newsletter</h1>
                            <p className="text-gray-400 text-sm">Draft a new issue for your subscribers.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleSubmit('draft')}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" /> Save Draft
                        </button>
                        <button
                            onClick={() => handleSubmit('published')}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 rounded-full bg-white text-black hover:bg-gray-200 transition-colors text-sm font-bold shadow-lg hover:scale-105 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            Publish Now
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title & Slug */}
                        <div className="space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Newsletter Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={handleTitleChange}
                                    placeholder="e.g., The Future of AI Design"
                                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-white/30 focus:outline-none text-lg font-bold transition-all placeholder:text-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Slug (URL)</label>
                                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-black/30 border border-white/5 text-gray-400 text-sm">
                                    <span>newsletterms.com/newsletter/</span>
                                    <input
                                        type="text"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        className="bg-transparent border-none focus:outline-none text-white flex-1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Rich Text Editor */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">Content</label>
                            <RichTextEditor
                                value={content}
                                onChange={setContent}
                                placeholder="Start writing your newsletter..."
                            />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Hero Image */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <ImageUploader
                                value={heroImage}
                                onChange={setHeroImage}
                                label="Hero Image"
                            />
                        </div>

                        {/* Meta Info */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Summary</label>
                                <textarea
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    rows={3}
                                    placeholder="Brief description for preview cards..."
                                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-white/30 focus:outline-none text-sm transition-all resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                                <input
                                    type="text"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    placeholder="tech, design, news (comma separated)"
                                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-white/30 focus:outline-none text-sm transition-all"
                                />
                            </div>
                        </div>

                        {/* Schedule (Placeholder) */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 opacity-50 pointer-events-none">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-white">Schedule</h3>
                                <Clock className="h-4 w-4 text-gray-400" />
                            </div>
                            <p className="text-xs text-gray-400">Scheduling feature coming soon.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
