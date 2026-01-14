import { Shield, Zap, MessageCircle, BarChart3 } from "lucide-react";

export default function KeyFeatures() {
    const features = [
        {
            icon: <Shield size={20} />,
            title: "Role-Based Security",
            description: "Granular permissions for Admins and Subscribers. Secure your content hierarchy."
        },
        {
            icon: <Zap size={20} />,
            title: "Real-time Delivery",
            description: "Optimized dispatch engine that ensures your newsletters arrive instantly, every time."
        },
        {
            icon: <MessageCircle size={20} />,
            title: "Community Spaces",
            description: "Dedicated discussion threads for every issue. Foster engagement beyond the inbox."
        },
        {
            icon: <BarChart3 size={20} />,
            title: "Deep Analytics",
            description: "Track open rates, click-throughs, and subscriber growth with privacy-focused insights."
        }
    ];

    return (
        <section className="py-24 bg-transparent">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="mb-16">
                    <h2 className="text-3xl font-serif italic mb-4 text-left text-white">Platform Capabilities</h2>
                    <div className="h-1 w-20 bg-white"></div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, idx) => (
                        <div key={idx} className="glass-effect p-6 rounded-lg border border-white/10 shadow-sm hover:border-white/20 transition-all group bg-neutral-900/40">
                            <div className="w-10 h-10 rounded bg-neutral-900 flex items-center justify-center text-gray-300 mb-5 group-hover:bg-white group-hover:text-black transition-colors">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-medium mb-2 text-white">{feature.title}</h3>
                            <p className="text-sm text-secondary leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
