import Link from "next/link";
import { Twitter, Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-black border-t border-neutral-900 py-12">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">

                <div className="flex flex-col items-center md:items-start">
                    <div className="font-serif font-bold text-xl mb-1 text-white">NewsEcho.</div>
                    <div className="text-xs text-secondary">
                        &copy; {new Date().getFullYear()} NewsEcho Inc.
                    </div>
                </div>

                <div className="flex items-center gap-6 text-secondary text-sm">
                    <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                    <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                    <Link href="#" className="hover:text-white transition-colors">Contact</Link>
                </div>

                <div className="flex items-center gap-4 text-neutral-500">
                    <a href="#" className="hover:text-white transition-colors"><Twitter size={16} /></a>
                    <a href="#" className="hover:text-white transition-colors"><Github size={16} /></a>
                </div>

            </div>
        </footer>
    );
}
