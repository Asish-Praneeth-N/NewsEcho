import Link from "next/link";
import { Twitter, Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-black border-t border-neutral-900 pt-16 pb-8">
            <div className="container mx-auto px-4">

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                    <div className="col-span-2 md:col-span-1">
                        <div className="font-serif font-bold text-xl mb-4 text-white">NewsEcho.</div>
                        <p className="text-sm text-secondary leading-relaxed">
                            The intelligent newsletter platform for modern publishers and communities.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-medium mb-4 text-sm text-white">Product</h4>
                        <ul className="space-y-2 text-sm text-secondary">
                            <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Changelog</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Docs</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium mb-4 text-sm text-white">Company</h4>
                        <ul className="space-y-2 text-sm text-secondary">
                            <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium mb-4 text-sm text-white">Legal</h4>
                        <ul className="space-y-2 text-sm text-secondary">
                            <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-neutral-900">
                    <div className="text-xs text-secondary mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} NewsEcho Inc. All rights reserved.
                    </div>

                    <div className="flex items-center gap-6 text-secondary">
                        <a href="#" className="hover:text-white transition-colors"><Twitter size={18} /></a>
                        <a href="#" className="hover:text-white transition-colors"><Github size={18} /></a>
                        <a href="#" className="hover:text-white transition-colors"><Linkedin size={18} /></a>
                        <a href="#" className="hover:text-white transition-colors"><Mail size={18} /></a>
                    </div>
                </div>

            </div>
        </footer>
    );
}
