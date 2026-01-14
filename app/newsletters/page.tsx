"use client";

import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Link from "next/link";
import { Calendar, User, ArrowRight, Loader2 } from "lucide-react";
import { UserNavbar } from "../components/layout/UserNavbar";

interface Newsletter {
    id: string;
    title: string;
    slug: string;
    heroImageUrl: string;
    publishedAt: any;
    authorId: string;
    // We might add excerpt later
}

export default function NewslettersFeed() {
    const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewsletters = async () => {
            try {
                const q = query(
                    collection(db, "newsletters"),
                    where("status", "==", "published"),
                    orderBy("publishedAt", "desc")
                );

                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({
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

        fetchNewsletters();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white">
            <UserNavbar />

            <main className="max-w-6xl mx-auto px-6 py-12">
                <header className="mb-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif mb-4 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                        Latest Insights
                    </h1>
                    <p className="text-neutral-400 max-w-xl mx-auto text-lg">
                        Curated newsletters on technology, design, and growth.
                    </p>
                </header>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-white opacity-50" size={32} />
                    </div>
                ) : newsletters.length === 0 ? (
                    <div className="text-center py-20 border border-neutral-800 rounded-2xl bg-neutral-900/30">
                        <p className="text-neutral-500 text-lg">No newsletters published yet.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {newsletters.map((post) => (
                            <article
                                key={post.id}
                                className="group bg-neutral-900/40 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-600 transition-all duration-300 hover:shadow-2xl hover:bg-neutral-900/60"
                            >
                                <div className="aspect-[16/9] bg-neutral-800 relative overflow-hidden">
                                    {post.heroImageUrl ? (
                                        <img
                                            src={post.heroImageUrl}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-neutral-700 bg-neutral-900">
                                            <span className="text-sm font-medium">No Image</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center gap-4 text-xs text-neutral-400 mb-3 font-mono">
                                        {post.publishedAt && (
                                            <span className="flex items-center gap-1.5">
                                                <Calendar size={12} />
                                                {new Date(post.publishedAt.seconds * 1000).toLocaleDateString(undefined, {
                                                    month: 'short', day: 'numeric', year: 'numeric'
                                                })}
                                            </span>
                                        )}
                                    </div>

                                    <h2 className="text-xl font-medium text-white mb-3 leading-tight group-hover:text-indigo-300 transition-colors line-clamp-2 min-h-[3.5rem]">
                                        {post.title}
                                    </h2>

                                    <Link
                                        href={`/newsletter/${post.slug}`}
                                        className="inline-flex items-center text-sm font-medium text-white mt-4 hover:gap-2 transition-all gap-1 border-b border-transparent hover:border-white/50 pb-0.5"
                                    >
                                        Read Article <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
