import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-black border-t border-white/10">
            <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                <div className="flex justify-center md:order-2 gap-8">
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</Link>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</Link>
                </div>
                <div className="mt-8 md:order-1 md:mt-0">
                    <p className="text-center text-xs leading-5 text-gray-500">
                        &copy; 2025 NewsEcho. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
