import { MessageSquare, Heart } from "lucide-react";

export default function CommunityHighlight() {
    return (
        <section className="py-24 bg-neutral-900 text-white overflow-hidden relative">
            <div className="container mx-auto px-4 relative z-10 max-w-4xl text-center">

                <h2 className="text-3xl md:text-5xl font-serif italic mb-6">More than just email.</h2>
                <p className="text-gray-400 text-lg mb-16 max-w-2xl mx-auto">
                    Transform passive readers into an active community.
                    Host discussions, gather feedback, and grow together.
                </p>

                {/* Mock Discusion Thread */}
                <div className="text-left bg-neutral-800 rounded-xl p-6 md:p-8 border border-neutral-700 max-w-2xl mx-auto shadow-2xl">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-10 h-10 rounded-full bg-indigo-500 flex-shrink-0"></div>
                        <div>
                            <div className="flex items-baseline gap-2">
                                <span className="font-medium text-white">Sarah Jenkins</span>
                                <span className="text-xs text-neutral-500">2 hours ago</span>
                            </div>
                            <p className="text-gray-300 text-sm mt-1 leading-relaxed">
                                This week's deep dive into subscription models was fascinating.
                                I'm curious how this applies to micro-communities?
                            </p>
                            <div className="flex gap-4 mt-3 text-xs text-neutral-500">
                                <button className="flex items-center gap-1 hover:text-white transition-colors"><Heart size={14} /> 12</button>
                                <button className="flex items-center gap-1 hover:text-white transition-colors"><MessageSquare size={14} /> Reply</button>
                            </div>
                        </div>
                    </div>

                    {/* Reply */}
                    <div className="flex items-start gap-4 pl-6 md:pl-14 border-l-2 border-neutral-700/50">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex-shrink-0"></div>
                        <div>
                            <div className="flex items-baseline gap-2">
                                <span className="font-medium text-white">Alex Chen</span>
                                <span className="bg-neutral-700 text-[10px] px-1.5 py-0.5 rounded text-white">Author</span>
                                <span className="text-xs text-neutral-500">1 hour ago</span>
                            </div>
                            <p className="text-gray-300 text-sm mt-1 leading-relaxed">
                                Great question, Sarah! Micro-communities actually have the advantage of higher engagement density...
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Decorative */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent"></div>
        </section>
    );
}
