"use client";

import { useEffect, useState } from "react";
import { UserNavbar } from "../components/layout/UserNavbar";
import { useAuth } from "../../context/AuthContext";
import { collection, query, where, getDocs, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Link from "next/link";
import { Loader2, Trash2, ArrowRight, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

interface Subscription {
    id: string; // Subscription ID
    newsletterId: string;
    createdAt: any;
    // We'll fetch newsletter details and merge them
    newsletter?: {
        title: string;
        slug: string;
        heroImageUrl: string;
    };
}

export default function SubscriptionsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
            return;
        }

        if (user) {
            // Real-time listener for subscriptions
            const q = query(
                collection(db, "subscriptions"),
                where("userId", "==", user.uid)
            );

            const unsubscribe = onSnapshot(q, async (snapshot) => {
                const subs = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Subscription[];

                // Fetch newsletter details for each subscription
                // In a real app with many subs, we might bundle this or use a denormalized approach.
                // For now, simple parallel fetch is fine.
                const enrichedSubs = await Promise.all(subs.map(async (sub) => {
                    // We need to fetch the newsletter doc
                    // Since we don't have a real-time listener on every newsletter here, standard getDoc or query is okay.
                    // But to be cleaner, let's just use getDoc from "newsletters" collection
                    // Wait, we only have ID from subscription? 
                    // My model says: subscription { userId, newsletterId }
                    // So we fetch "newsletters/{newsletterId}"

                    try {
                        const newsletterDoc = await getDocs(query(collection(db, "newsletters"), where("__name__", "==", sub.newsletterId)));
                        // Actually getDoc(doc(db, "newsletters", sub.newsletterId)) is better if we have the ID.
                        // Wait, fetching via query and ID is safer if unsure of existence.
                        // Let's use direct doc ref:

                        const nlRef = doc(db, "newsletters", sub.newsletterId);
                        // We can't use await inside map comfortably without Promise.all, which we are doing.

                        // BUT, to keep it sync/fast in snapshot, we might want to just set IDs first then fetch details?
                        // Let's do the fetch here.

                        // NOTE: onSnapshot callback is synchronous? No, we can make it async.
                        // BUT, rendering might flash. 
                        // Let's fetch details.

                        // FIX: getDoc is robust.
                        const nlSnap = await import("firebase/firestore").then(mod => mod.getDoc(nlRef));

                        if (nlSnap.exists()) {
                            return {
                                ...sub,
                                newsletter: nlSnap.data() as any
                            };
                        }
                        return sub;
                    } catch (e) {
                        return sub;
                    }
                }));

                setSubscriptions(enrichedSubs);
                setLoading(false);
            });

            return () => unsubscribe();
        }
    }, [user, authLoading, router]);

    const handleUnsubscribe = async (subscriptionId: string) => {
        if (!confirm("Are you sure you want to unsubscribe?")) return;
        try {
            await deleteDoc(doc(db, "subscriptions", subscriptionId));
            // Snapshot will update UI automatically
        } catch (error) {
            console.error("Error unsubscribing:", error);
            alert("Failed to unsubscribe");
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <UserNavbar />

            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-indigo-900/20 rounded-lg text-indigo-400">
                        <Mail size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-serif">Your Subscriptions</h1>
                        <p className="text-neutral-500">Manage the newsletters you receive.</p>
                    </div>
                </div>

                {subscriptions.length === 0 ? (
                    <div className="p-12 border border-neutral-800 rounded-2xl bg-neutral-900/30 text-center">
                        <h3 className="text-xl font-medium mb-3 text-neutral-300">Your inbox is empty</h3>
                        <p className="text-neutral-500 mb-8 max-w-sm mx-auto">
                            You haven't subscribed to any newsletters yet. Explore our curated publications to get started.
                        </p>
                        <Link
                            href="/newsletters"
                            className="inline-flex items-center px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition-colors"
                        >
                            Explore Newsletters <ArrowRight size={18} className="ml-2" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {subscriptions.map((sub) => (
                            <div
                                key={sub.id}
                                className="flex items-center justify-between p-6 border border-neutral-800 rounded-xl bg-neutral-900/40 hover:border-neutral-700 transition-all group"
                            >
                                <div className="flex items-center gap-6">
                                    {/* Image */}
                                    <div className="w-16 h-16 rounded-lg bg-neutral-800 overflow-hidden shrink-0 hidden sm:block">
                                        {sub.newsletter?.heroImageUrl ? (
                                            <img
                                                src={sub.newsletter.heroImageUrl}
                                                alt={sub.newsletter.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-neutral-600 bg-neutral-800">
                                                <Mail size={20} />
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-white mb-1">
                                            {sub.newsletter?.title || "Unknown Newsletter"}
                                        </h3>
                                        <p className="text-sm text-neutral-500">
                                            Subscribed on {new Date(sub.createdAt?.seconds * 1000).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {sub.newsletter?.slug && (
                                        <Link
                                            href={`/newsletter/${sub.newsletter.slug}`}
                                            className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors hidden sm:block"
                                        >
                                            View Latest
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => handleUnsubscribe(sub.id)}
                                        className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-colors"
                                        title="Unsubscribe"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
