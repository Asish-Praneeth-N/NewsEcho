"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "@/types";
import { User, signOut, Auth } from "firebase/auth";
import { doc, updateDoc, collection, query, where, getDocs, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Camera, Save, Loader2, User as UserIcon, LogOut, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    userProfile: UserProfile | null;
}

export default function ProfileModal({ isOpen, onClose, user, userProfile }: ProfileModalProps) {
    const router = useRouter();
    const [displayName, setDisplayName] = useState("");
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (userProfile) {
            setDisplayName(userProfile.displayName || "");
            setUsername(userProfile.username || "");
            setBio(userProfile.bio || "");
            setImagePreview(userProfile.photoURL || null);
        } else if (user) {
            setDisplayName(user.displayName || "");
            setImagePreview(user.photoURL || null);
        }
    }, [userProfile, user, isOpen]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImageToCloudinary = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "newsletter_ms_preset";
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your_cloud_name";

        formData.append("upload_preset", uploadPreset);

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || "Image upload failed");
            }

            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            throw error;
        }
    };

    const checkUsernameAvailability = async (newUsername: string) => {
        if (!db || !user) return false;
        if (userProfile?.username === newUsername) return true;

        const usernameDoc = await getDoc(doc(db, "usernames", newUsername));
        return !usernameDoc.exists();
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (!user || !db) return;

            if (username.length < 3) {
                throw new Error("Username must be at least 3 characters long.");
            }

            const isAvailable = await checkUsernameAvailability(username);
            if (!isAvailable) {
                throw new Error("Username is already taken.");
            }

            let photoURL = userProfile?.photoURL || user.photoURL;

            if (imageFile) {
                photoURL = await uploadImageToCloudinary(imageFile);
            }

            if (username !== userProfile?.username) {
                await setDoc(doc(db, "usernames", username), { uid: user.uid });

                if (userProfile?.username) {
                    await deleteDoc(doc(db, "usernames", userProfile.username));
                }
            }

            const userRef = doc(db, "users", user.uid);

            await updateDoc(userRef, {
                displayName,
                username,
                bio,
                photoURL,
            });

            setMessage({ type: 'success', text: "Profile updated successfully!" });
            setTimeout(() => {
                setMessage(null);
                onClose();
            }, 1500);
        } catch (error: any) {
            console.error("Error updating profile:", error);
            setMessage({ type: 'error', text: "Failed to update profile. " + error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        if (auth) {
            await signOut(auth as Auth);
        }
        router.push("/login");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
                    >
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl pointer-events-auto flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#0A0A0A]">
                                <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Scrollable Content */}
                            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                                {message && (
                                    <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                        {message.text}
                                    </div>
                                )}

                                <form onSubmit={handleSave} className="space-y-8">
                                    {/* Image Upload */}
                                    <div className="flex flex-col items-center sm:flex-row gap-6">
                                        <div className="relative group">
                                            <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-800 border-2 border-white/10 flex items-center justify-center">
                                                {imagePreview ? (
                                                    <img
                                                        src={imagePreview}
                                                        alt="Profile"
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <UserIcon className="h-10 w-10 text-gray-400" />
                                                )}
                                            </div>
                                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                                                <Camera className="h-6 w-6 text-white" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleImageChange}
                                                />
                                            </label>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-white">Profile Photo</h3>
                                            <p className="text-sm text-gray-400 mt-1">Click the image to upload a new photo.</p>
                                            <p className="text-xs text-gray-500 mt-1">Recommended: Square JPG, PNG. Max 2MB.</p>
                                        </div>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                                                <input
                                                    type="text"
                                                    value={displayName}
                                                    onChange={(e) => setDisplayName(e.target.value)}
                                                    className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                                                    placeholder="Enter your name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                                                <input
                                                    type="text"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                                                    className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                                                    placeholder="unique_username"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                                            <textarea
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                                rows={4}
                                                className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all resize-none"
                                                placeholder="Tell us a little about yourself..."
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-white/10 flex justify-end gap-4">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-6 py-3 rounded-full font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex items-center justify-center gap-2 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-5 w-5" />
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                    <style jsx global>{`
                        .custom-scrollbar::-webkit-scrollbar {
                            width: 0px;
                            background: transparent;
                        }
                        .custom-scrollbar {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }
                    `}</style>
                </>
            )}
        </AnimatePresence>
    );
}
