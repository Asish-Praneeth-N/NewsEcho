import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

export default function NewsletterPreview() {
    return (
        <section className="py-24 bg-transparent">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="grid md:grid-cols-2 gap-12 items-center">

                    {/* Content Side */}
                    <div className="order-2 md:order-1">
                        <div className="mb-2 uppercase text-xs font-bold tracking-widest text-secondary">Editorial Quality</div>
                        <h2 className="text-3xl md:text-4xl font-serif italic mb-6 text-white">Designed for Reading</h2>
                        <p className="text-secondary mb-8 leading-relaxed">
                            Your content deserves a platform that respects typography and white space.
                            NewsEcho delivers a pristine reading experience on every device,
                            ensuring your message lands with impact.
                        </p>
                        <Link href="#" className="inline-flex items-center text-sm font-medium border-b border-white pb-0.5 hover:text-gray-300 hover:border-gray-300 transition-colors text-white">
                            View Sample Issue <ArrowRight size={16} className="ml-2" />
                        </Link>
                    </div>

                    {/* Preview Card Side */}
                    <div className="order-1 md:order-2 bg-neutral-900/50 p-8 md:p-12 rounded-xl border border-neutral-800">
                        <article className="bg-black p-8 shadow-2xl border border-neutral-800 rounded-lg max-w-sm mx-auto transform rotate-1 hover:rotate-0 transition-transform duration-500">
                            <div className="flex items-center gap-2 text-xs text-neutral-500 mb-4">
                                <Calendar size={14} />
                                <span>October 24, 2025</span>
                                <span className="w-1 h-1 bg-neutral-700 rounded-full"></span>
                                <span>Issue #42</span>
                            </div>

                            <h3 className="text-2xl font-serif font-medium mb-3 text-white">The Future of Digital Communities</h3>

                            <div className="flex gap-2 mb-6">
                                <span className="bg-neutral-900 text-neutral-400 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide border border-neutral-800">Tech</span>
                                <span className="bg-neutral-900 text-neutral-400 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide border border-neutral-800">Analysis</span>
                            </div>

                            <p className="text-secondary text-sm leading-relaxed mb-6">
                                As platforms evolve, the definition of community is shifting from open forums to curated,
                                value-driven spaces. In this issue, we explore...
                            </p>

                            <div className="text-sm font-medium text-white">Read full issue →</div>
                        </article>
                    </div>

                </div>
            </div>
        </section>
    );
}
