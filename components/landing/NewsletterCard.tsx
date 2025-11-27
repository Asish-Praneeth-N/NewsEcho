import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface NewsletterCardProps {
    id: string;
    title: string;
    description: string;
    date: string;
    slug: string;
    redirectUrl?: string;
}

export default function NewsletterCard({
    title,
    description,
    date,
    slug,
    redirectUrl,
}: NewsletterCardProps) {
    const href = redirectUrl || `/newsletters/${slug}`;

    return (
        <div className="group flex flex-col overflow-hidden rounded-2xl bg-white/5 border border-white/10 shadow-lg transition-all duration-300 hover:bg-white/10 hover:shadow-2xl hover:scale-[1.02] hover:border-white/20 backdrop-blur-md">
            <div className="flex flex-1 flex-col justify-between p-8">
                <div className="flex-1">
                    <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">Newsletter</p>
                    <Link href={href} className="mt-3 block">
                        <p className="text-2xl font-bold text-white group-hover:text-gray-200 transition-colors">{title}</p>
                        <p className="mt-3 text-base text-gray-400 line-clamp-3 group-hover:text-gray-300 transition-colors">{description}</p>
                    </Link>
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                    <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-500">
                            {date}
                        </p>
                    </div>
                    <Link href={href} className="flex items-center text-white font-semibold hover:text-gray-300 transition-colors group/link">
                        Read <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
