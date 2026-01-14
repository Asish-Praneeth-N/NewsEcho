import { PenTool, Send, Users } from "lucide-react";

export default function HowItWorks() {
    const steps = [
        {
            icon: <PenTool size={24} />,
            title: "Create Content",
            description: "Write beautiful, engaging newsletters with our distraction-free editorial or clean markdown editor."
        },
        {
            icon: <Send size={24} />,
            title: "Publish Instantly",
            description: "Send to your subscribers real-time or schedule for later. Automated delivery ensures it hits the inbox."
        },
        {
            icon: <Users size={24} />,
            title: "Engage Community",
            description: "Spark discussions with built-in commenting and community features that turn readers into members."
        }
    ];

    return (
        <section className="py-24 bg-transparent border-t border-white/5">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif italic mb-4 text-white">How it works</h2>
                    <p className="text-secondary max-w-xl mx-auto">
                        A simple, streamlined workflow designed for serious writers and community builders.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 relative">
                    {/* Connector Line (Desktop Only) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[1px] bg-neutral-800 -z-10"></div>

                    {steps.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center group">
                            <div className="w-14 h-14 rounded-full bg-black border border-neutral-700 flex items-center justify-center text-white mb-6 group-hover:border-white transition-colors shadow-sm">
                                {step.icon}
                            </div>
                            <h3 className="text-lg font-medium mb-3 text-white">{step.title}</h3>
                            <p className="text-sm text-secondary leading-relaxed px-4">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
