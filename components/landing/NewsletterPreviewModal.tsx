import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Calendar, User, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

interface NewsletterPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NewsletterPreviewModal({ isOpen, onClose }: NewsletterPreviewModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden bg-black border border-white/20 rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.1)] pointer-events-auto flex flex-col">

                            {/* Decorative Gradient Border */}
                            <div className="absolute inset-0 rounded-3xl pointer-events-none border border-white/10 shadow-inner"></div>

                            {/* Header Image Area */}
                            <div className="relative h-64 w-full overflow-hidden shrink-0 grayscale">
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-black opacity-80"></div>
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-40"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/80 backdrop-blur-sm border border-white/10 transition-all duration-200 z-10 group"
                                >
                                    <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                                </button>

                                <div className="absolute bottom-6 left-8 right-8">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-gray-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                                            Technology
                                        </span>
                                        <span className="flex items-center gap-1.5 text-xs font-medium text-gray-400 bg-black/50 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                                            <Calendar className="h-3.5 w-3.5" /> Dec 15, 2024
                                        </span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow-lg">
                                        The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">Digital Communication</span>
                                    </h2>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-8 overflow-y-auto custom-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                <style jsx>{`
                                    div::-webkit-scrollbar {
                                        display: none;
                                    }
                                `}</style>
                                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/20 flex items-center justify-center">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">NewsEcho Team</p>
                                        <p className="text-xs text-gray-500">Curated by Industry Experts</p>
                                    </div>
                                </div>

                                <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light">
                                    <p>
                                        In an era defined by rapid technological advancement, the way we communicate is undergoing a fundamental shift. From <span className="text-white font-medium">AI-driven assistants</span> to immersive virtual reality meetings, the digital landscape is evolving at an unprecedented pace.
                                    </p>
                                    <p>
                                        This week, we explore the emerging trends that are set to redefine our interactions. We'll look at how natural language processing is making our devices smarter and more intuitive, and how decentralized platforms are giving users more control over their data.
                                    </p>

                                    <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-black border border-white/10 overflow-hidden group hover:border-white/30 transition-colors duration-300">
                                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <Sparkles className="h-24 w-24 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                            <Sparkles className="h-5 w-5 text-gray-400" /> Key Takeaways
                                        </h3>
                                        <ul className="space-y-3">
                                            {[
                                                "AI is becoming more conversational and context-aware.",
                                                "Privacy-focused communication tools are on the rise.",
                                                "Virtual spaces are blurring the lines between physical and digital presence."
                                            ].map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-sm text-gray-400">
                                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.5)]"></span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <p>
                                        Join us as we dive deep into these topics and more. Subscribe to NewsEcho to get the full analysis delivered straight to your inbox every week.
                                    </p>
                                </div>

                                {/* CTA Footer */}
                                <div className="mt-10 pt-8 border-t border-white/10 flex flex-col items-center text-center">
                                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                                        Unlock the full story and get exclusive weekly insights delivered to your inbox.
                                    </p>
                                    <Link
                                        href="/signup"
                                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white rounded-full text-black font-bold text-lg shadow-lg hover:bg-gray-200 hover:scale-105 transition-all duration-300 overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            Subscribe  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </Link>
                                   
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
