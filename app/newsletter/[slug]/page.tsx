"use client";

import { useEffect, useState, use } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { UserNavbar } from "../../components/layout/UserNavbar";
import { Loader2, Calendar, User, ArrowLeft, Bookmark, Share2 } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";

// Needed for syntax highlighting if we add it later
// import rehypeHighlight from "rehype-highlight"; 

interface Newsletter {
    id: string;
    title: string;
    content: string;
    heroImageUrl: string;
    publishedAt: any;
    authorId: string;
}

export default function NewsletterPage({ params }: { params: Promise<{ slug: string }> }) {
    // Unwrap params in Next.js 15+ (using React.use() or await)
    // Since this is a client component, we use `use` hook or async effect on params promise if passed from parent server component.
    // However, `params` prop in a Client Component page is a Promise in Next.js 15.

    // Simplest way for client component:
    // We can't use `await` at top level of client component. 
    // We will unwrap it inside an effect or look at new Next.js patterns.
    // Actually, `use(params)` is the recommended React 19 way.

    const { slug } = use(params);

    const [post, setPost] = useState<Newsletter | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const q = query(
                    collection(db, "newsletters"),
                    where("slug", "==", slug),
                    where("status", "==", "published")
                );

                const snapshot = await getDocs(q);
                if (snapshot.empty) {
                    setError(true);
                } else {
                    const docData = snapshot.docs[0].data();
                    setPost({ id: snapshot.docs[0].id, ...docData } as Newsletter);
                }
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchPost();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
                <h1 className="text-2xl font-serif mb-4">Newsletter not found</h1>
                <Link href="/newsletters" className="text-neutral-400 hover:text-white flex items-center gap-2">
                    <ArrowLeft size={16} /> Back to Feed
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <UserNavbar />

            <article className="max-w-3xl mx-auto px-6 py-12">

                {/* Back Link */}
                <Link href="/newsletters" className="inline-flex items-center text-neutral-500 hover:text-white mb-8 transition-colors text-sm">
                    <ArrowLeft size={16} className="mr-2" /> Back to Newsletters
                </Link>

                {/* Header */}
                <header className="mb-10 text-center">
                    <div className="flex items-center justify-center gap-4 text-sm text-neutral-400 mb-6 font-mono">
                        {post.publishedAt && (
                            <span className="px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/50">
                                {new Date(post.publishedAt.seconds * 1000).toLocaleDateString(undefined, {
                                    month: 'long', day: 'numeric', year: 'numeric'
                                })}
                            </span>
                        )}
                        <span className="flex items-center gap-2">Reading time: 5 min</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-serif font-medium leading-tight mb-8">
                        {post.title}
                    </h1>

                    {/* Actions Bar */}
                    <div className="flex items-center justify-center gap-4 border-y border-neutral-800 py-4 max-w-md mx-auto">
                        <button className="flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                            <Bookmark size={18} /> Save
                        </button>
                        <div className="w-px h-4 bg-neutral-800" />
                        <button className="flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors">
                            <Share2 size={18} /> Share
                        </button>
                    </div>
                </header>

                {/* Hero Image */}
                {post.heroImageUrl && (
                    <div className="mb-12 rounded-xl overflow-hidden border border-neutral-800 shadow-2xl">
                        <img
                            src={post.heroImageUrl}
                            alt={post.title}
                            className="w-full h-auto object-cover max-h-[500px]"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-p:text-neutral-300 prose-a:text-indigo-400 hover:prose-a:text-indigo-300 prose-img:rounded-lg">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>

                {/* Footer Subscribe CTA */}
                <div className="mt-20 p-8 md:p-12 border border-neutral-800 rounded-2xl bg-gradient-to-br from-neutral-900/50 to-black text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                    <h3 className="text-2xl font-serif mb-3">Enjoyed this newsletter?</h3>
                    <p className="text-neutral-400 mb-6 max-w-md mx-auto">
                        Subscribe to get the next edition directly in your dashboard.
                    </p>
                    <button className="px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition-colors">
                        Subscribe
                    </button>
                </div>

            </article>
        </div>
    );
}
