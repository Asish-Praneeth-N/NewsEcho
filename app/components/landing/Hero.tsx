import { ArrowRight, ChevronRight, LayoutTemplate } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden">
            {/* Background Grid Pattern is applied globally to body, but we can enhance it here if needed */}
            <div className="absolute inset-0 z-0 bg-grid-pattern opacity-40"></div>

            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-5xl">

                {/* Badge / Announcement */}
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-neutral-900 border border-neutral-800 text-sm text-gray-400 animate-fade-in-up">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                    <span>Construction in Progress</span>
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-7xl font-serif font-medium leading-[1.1] mb-6 tracking-tight text-white animate-fade-in-up delay-100">
                    Newsletters, <span className="italic font-serif text-gray-300">Delivered Intelligently.</span>
                </h1>

                {/* Sub-headline */}
                <p className="text-xl text-secondary max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
                    Create, publish, and manage editorial newsletters with real-time delivery, deep analytics, and community engagement.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-in-up delay-300">
                    <Link
                        href="/signup"
                        className="group px-8 py-3.5 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-200 transition-all flex items-center gap-2"
                    >
                        Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="#explore"
                        className="px-8 py-3.5 bg-black border border-neutral-800 text-white rounded-lg text-sm font-medium hover:bg-neutral-900 transition-all"
                    >
                        Explore Newsletters
                    </Link>
                </div>

                {/* Abstract Dashboard/Card Preview with Glass Effect */}
                <div className="relative mx-auto max-w-4xl animate-fade-in-up delay-500">
                    <div className="absolute inset-x-0 -top-20 -z-10 h-[400px] w-full bg-gradient-to-b from-neutral-800/20 to-transparent blur-3xl"></div>

                    <div className="glass-effect rounded-xl p-2 border border-white/10 shadow-2xl">
                        <div className="bg-neutral-950 rounded-lg border border-neutral-800 overflow-hidden shadow-sm aspect-[16/9] flex flex-col">
                            {/* Mock Header */}
                            <div className="h-12 border-b border-neutral-800 flex items-center px-4 gap-2 bg-neutral-900/50">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-neutral-700"></div>
                                    <div className="w-3 h-3 rounded-full bg-neutral-700"></div>
                                    <div className="w-3 h-3 rounded-full bg-neutral-700"></div>
                                </div>
                                <div className="ml-4 h-2 w-32 bg-neutral-800 rounded"></div>
                            </div>
                            {/* Mock Content */}
                            <div className="flex-1 p-8 grid grid-cols-12 gap-6 bg-neutral-950">
                                <div className="col-span-3 space-y-3">
                                    <div className="h-4 w-full bg-neutral-800 rounded"></div>
                                    <div className="h-4 w-4/5 bg-neutral-900 rounded"></div>
                                    <div className="h-4 w-5/6 bg-neutral-900 rounded"></div>
                                </div>
                                <div className="col-span-9 space-y-6">
                                    <div className="h-32 w-full bg-neutral-900/50 rounded border border-neutral-800 flex items-center justify-center text-neutral-700">
                                        <LayoutTemplate size={32} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-full bg-neutral-800 rounded"></div>
                                        <div className="h-4 w-5/6 bg-neutral-900 rounded"></div>
                                        <div className="h-4 w-4/5 bg-neutral-900 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
