"use client";

import { UserNavbar } from "../components/layout/UserNavbar";
import { DiscussionBoard } from "../components/community/DiscussionBoard";

export default function CommunityPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
            <UserNavbar />

            <div className="max-w-3xl mx-auto px-6 py-12">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold mb-4">Community Discussions</h1>
                    <p className="text-neutral-400">Join the conversation with other NewsEcho readers.</p>
                </div>

                {/* Discussion Board with no newsletterId (General) */}
                <DiscussionBoard />

            </div>
        </div>
    );
}
