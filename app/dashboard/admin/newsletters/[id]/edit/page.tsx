"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Save, Send, Clock, Loader2, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploader from "@/components/admin/ImageUploader";

export default function EditNewsletterPage() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [heroImage, setHeroImage] = useState("");
    const [tags, setTags] = useState("");
    const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('draft');

    useEffect(() => {
        if (params.id) {
            fetchNewsletter(params.id as string);
        }
    }, [params.id]);

    const fetchNewsletter = async (id: string) => {
        if (!db) return;
        try {
            const docRef = doc(db, "newsletters", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setTitle(data.title);
                setSlug(data.slug);
                setSummary(data.summary || "");
                setContent(data.content);
                setHeroImage(data.heroImage || "");
                setTags(data.tags ? data.tags.join(", ") : "");
                setStatus(data.status);
            } else {
                alert("Newsletter not found");
                router.push("/dashboard/admin/newsletters");
            }
        } catch (error) {
            console.error("Error fetching newsletter:", error);
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        if (!slug) { // Only auto-generate if slug is empty or user hasn't manually edited it (simplified logic)
            setSlug(generateSlug(newTitle));
        }
    };

    const handleSubmit = async (newStatus?: 'draft' | 'published' | 'scheduled') => {
        if (!title || !content) {
            alert("Please fill in at least the title and content.");
            return;
        }

        setSaving(true);
        if (!db) {
            alert("Database connection not available.");
            setSaving(false);
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
                status: newStatus || status,
                updatedAt: serverTimestamp(),
                publishedAt: newStatus === 'published' ? serverTimestamp() : undefined,
            };

            await updateDoc(doc(db, "newsletters", params.id as string), newsletterData);
            router.push("/dashboard/admin/newsletters");
        } catch (error) {
            console.error("Error updating newsletter:", error);
            alert("Failed to update newsletter. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

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
                            <h1 className="text-3xl font-bold tracking-tight">Edit Newsletter</h1>
                            <p className="text-gray-400 text-sm">Update your newsletter content.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleSubmit('draft')}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" /> Save Draft
                        </button>
                        <button
                            onClick={() => handleSubmit('published')}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2 rounded-full bg-white text-black hover:bg-gray-200 transition-colors text-sm font-bold shadow-lg hover:scale-105 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            {status === 'published' ? 'Update & Publish' : 'Publish Now'}
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
                        {/* Status Card */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <h3 className="font-bold text-white mb-4">Status</h3>
                            <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${status === 'published' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                    status === 'scheduled' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                        'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                    }`}>
                                    {status}
                                </span>
                            </div>
                        </div>

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
                    </div>
                </div>
            </div>
        </div>
    );
}
