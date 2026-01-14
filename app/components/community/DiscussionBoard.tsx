"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, orderBy, where, addDoc, serverTimestamp, onSnapshot, doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, MessageSquare, Send, User, Clock, Reply, Edit2, X, Trash2 } from "lucide-react";

interface Post {
    id: string;
    content: string;
    authorName: string;
    authorId: string;
    createdAt: any;
    newsletterId?: string | null;
    replyTo?: {
        id: string;
        authorName: string;
    } | null;
}

interface DiscussionBoardProps {
    newsletterId?: string; // If provided, scopes to this newsletter. If undefined, separate "general" feed (or handle as null).
}

export function DiscussionBoard({ newsletterId }: DiscussionBoardProps) {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPost, setNewPost] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    // Reply state
    const [replyingTo, setReplyingTo] = useState<Post | null>(null);

    // Edit state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");

    useEffect(() => {
        let q;
        if (newsletterId) {
            q = query(
                collection(db, "community_posts"),
                where("newsletterId", "==", newsletterId),
                orderBy("createdAt", "desc")
            );
        } else {
            // General feed - assuming posts without newsletterId are general
            // Note: If you want ALL posts here, remove the 'where' clause. 
            // We'll stick to 'general' posts only for the main community tab to avoid clutter.
            // However, Firestore query with '==' null can be tricky if field is missing. 
            // We'll require newsletterId to be explicitly null for general posts.
            q = query(
                collection(db, "community_posts"),
                where("newsletterId", "==", null),
                orderBy("createdAt", "desc")
            );
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items: Post[] = [];
            snapshot.forEach((doc) => {
                items.push({ id: doc.id, ...doc.data() } as Post);
            });
            setPosts(items);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [newsletterId]);

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPost.trim() || !user) return;

        setSubmitting(true);
        try {
            // If replying, maybe append @Name directly to content or store as metadata?
            // "tag a reply tag... to reply that user in specific"
            // We'll store metadata for UI badges, but usage is fluid.

            const postData: any = {
                content: newPost,
                authorId: user.uid,
                authorName: user.displayName || "Anonymous Reader",
                createdAt: serverTimestamp(),
                newsletterId: newsletterId || null, // Explicit null for general
            };

            if (replyingTo) {
                postData.replyTo = {
                    id: replyingTo.id,
                    authorName: replyingTo.authorName
                };
            }

            await addDoc(collection(db, "community_posts"), postData);
            setNewPost("");
            setReplyingTo(null);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingId || !editText.trim() || !user) return;

        try {
            await updateDoc(doc(db, "community_posts", editingId), {
                content: editText
            });
            setEditingId(null);
            setEditText("");
        } catch (err) {
            console.error("Error updating post:", err);
            alert("Failed to update. You might be outside the 3-minute edit window.");
        }
    };

    const startReply = (post: Post) => {
        setReplyingTo(post);
        // Optional: Pre-fill text with @Name
        // setNewPost(`@${post.authorName} `);
        // User requested "tag a reply tag", metadata badge is cleaner than forcing text.
        // We'll just focus the area.
        const textarea = document.getElementById("post-textarea");
        if (textarea) textarea.focus();
    };

    const startEdit = (post: Post) => {
        setEditingId(post.id);
        setEditText(post.content);
    };

    const checkCanEdit = (post: Post) => {
        if (!user || post.authorId !== user.uid) return false;
        if (!post.createdAt) return true; // Optimistic

        // 3 minute window
        const now = Date.now();
        const created = post.createdAt.seconds * 1000;
        return (now - created) < 3 * 60 * 1000;
    };

    // Force re-render periodically to update "Edit" button visibility? 
    // Implementing a simple reliable check on click/render is better. 
    // We can't auto-hide the button in real-time easily without an interval.
    // We'll just show it if it looks valid, and backend will reject if late.

    return (
        <div className="space-y-8">
            {/* Input Area */}
            <div className="bg-neutral-900/30 border border-neutral-800 rounded-2xl p-6 shadow-lg">
                <form onSubmit={handlePost}>
                    {replyingTo && (
                        <div className="flex items-center justify-between mb-3 bg-indigo-900/20 px-3 py-2 rounded-lg border border-indigo-500/30">
                            <span className="text-sm text-indigo-300">
                                Replying to <span className="font-bold">{replyingTo.authorName}</span>
                            </span>
                            <button
                                type="button"
                                onClick={() => setReplyingTo(null)}
                                className="text-neutral-400 hover:text-white"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-900/30 text-indigo-400 flex items-center justify-center shrink-0">
                            <User size={20} />
                        </div>
                        <div className="flex-1">
                            <textarea
                                id="post-textarea"
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                placeholder={replyingTo ? `Reply to ${replyingTo.authorName}...` : "Share your thoughts..."}
                                className="w-full bg-transparent border-none text-white placeholder-neutral-500 focus:ring-0 resize-none h-24 text-lg"
                            />
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-neutral-800/50">
                                <span className="text-xs text-neutral-600">Markdown supported</span>
                                <button
                                    type="submit"
                                    disabled={submitting || !newPost.trim() || !user}
                                    className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-neutral-200 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                    {replyingTo ? "Reply" : "Post"}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* Feed */}
            <div className="space-y-6">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin text-white" size={24} />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-16 bg-neutral-900/10 rounded-2xl border border-dashed border-neutral-800">
                        <MessageSquare className="mx-auto text-neutral-600 mb-3" size={32} />
                        <p className="text-neutral-500">No discussions yet. Be the first to post!</p>
                    </div>
                ) : (
                    posts.map((post) => (
                        <div key={post.id} className="bg-neutral-900/20 border border-neutral-800 rounded-2xl p-6 hover:bg-neutral-900/40 transition-colors group">
                            {/* Post Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-400">
                                        {post.authorName[0]}
                                    </div>
                                    <div>
                                        <div className="font-medium text-white text-sm flex items-center gap-2">
                                            {post.authorName}
                                            {post.replyTo && (
                                                <span className="text-neutral-500 text-xs font-normal flex items-center gap-1">
                                                    <Reply size={10} className="scale-x-[-1]" />
                                                    waifu {post.replyTo.authorName}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-neutral-500 flex items-center gap-1">
                                            <Clock size={10} />
                                            {post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleString() : "Just now"}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {user && (
                                        <button
                                            onClick={() => startReply(post)}
                                            className="p-1.5 text-neutral-400 hover:text-indigo-400 hover:bg-indigo-900/20 rounded transition-colors"
                                            title="Reply"
                                        >
                                            <Reply size={16} />
                                        </button>
                                    )}

                                    {checkCanEdit(post) && (
                                        <button
                                            onClick={() => startEdit(post)}
                                            className="p-1.5 text-neutral-400 hover:text-emerald-400 hover:bg-emerald-900/20 rounded transition-colors"
                                            title="Edit (within 3 mins)"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            {editingId === post.id ? (
                                <form onSubmit={handleUpdate} className="mt-2">
                                    <textarea
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-indigo-500 text-sm min-h-[100px]"
                                    />
                                    <div className="flex justify-end gap-2 mt-2">
                                        <button
                                            type="button"
                                            onClick={() => setEditingId(null)}
                                            className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-500"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="text-neutral-300 leading-relaxed whitespace-pre-wrap pl-11 text-sm md:text-base">
                                    {post.content}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
