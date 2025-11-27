"use client";

import { useState } from "react";
import { Camera, Loader2, X } from "lucide-react";

interface ImageUploaderProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
}

export default function ImageUploader({ value, onChange, label = "Hero Image" }: ImageUploaderProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setError(null);

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
            onChange(data.secure_url);
        } catch (error: any) {
            console.error("Cloudinary upload error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = () => {
        onChange("");
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">{label}</label>

            {value ? (
                <div className="relative w-full h-64 rounded-xl overflow-hidden group border border-white/10">
                    <img
                        src={value}
                        alt="Uploaded"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            onClick={handleRemove}
                            className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/40 transition-colors"
                            type="button"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="relative w-full h-64 rounded-xl border-2 border-dashed border-white/10 hover:border-white/30 transition-colors bg-white/5 flex flex-col items-center justify-center group">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        disabled={loading}
                    />
                    {loading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-10 w-10 text-blue-400 animate-spin" />
                            <p className="text-sm text-gray-400">Uploading...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 pointer-events-none">
                            <Camera className="h-10 w-10 text-gray-400 group-hover:text-white transition-colors" />
                            <p className="text-sm text-gray-400 group-hover:text-white transition-colors">
                                Click or drag to upload image
                            </p>
                        </div>
                    )}
                </div>
            )}
            {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                </div>
            )}
        </div>
    );
}
