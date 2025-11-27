"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Save, Globe, Mail, Shield, Loader2, AlertCircle } from "lucide-react";

interface SystemSettings {
    siteName: string;
    supportEmail: string;
    maintenanceMode: boolean;
    allowRegistration: boolean;
    cloudinaryCloudName: string;
    cloudinaryUploadPreset: string;
}

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<SystemSettings>({
        siteName: "NewsletterMS",
        supportEmail: "support@example.com",
        maintenanceMode: false,
        allowRegistration: true,
        cloudinaryCloudName: "",
        cloudinaryUploadPreset: "",
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            if (!db) return;
            const docRef = doc(db, "system_settings", "general");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setSettings({ ...settings, ...docSnap.data() } as SystemSettings);
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (!db) throw new Error("Database not initialized");
            await setDoc(doc(db, "system_settings", "general"), settings, { merge: true });
            alert("Settings saved successfully!");
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Failed to save settings.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Platform Settings</h1>
                        <p className="text-gray-400">Configure general system preferences.</p>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black hover:bg-gray-200 transition-colors text-sm font-bold shadow-lg hover:scale-105 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Changes
                    </button>
                </div>

                <div className="space-y-6">
                    {/* General Settings */}
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                <Globe className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-bold">General Information</h2>
                        </div>
                        <div className="grid gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Site Name</label>
                                <input
                                    type="text"
                                    name="siteName"
                                    value={settings.siteName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-white/30 focus:outline-none text-sm transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Support Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                    <input
                                        type="email"
                                        name="supportEmail"
                                        value={settings.supportEmail}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-white/30 focus:outline-none text-sm transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Access Control */}
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                                <Shield className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-bold">Access & Security</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-white/5">
                                <div>
                                    <h3 className="font-medium text-white">Maintenance Mode</h3>
                                    <p className="text-xs text-gray-400">Disable access for non-admin users.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="maintenanceMode"
                                        checked={settings.maintenanceMode}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-white/5">
                                <div>
                                    <h3 className="font-medium text-white">Allow Registration</h3>
                                    <p className="text-xs text-gray-400">Allow new users to sign up.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="allowRegistration"
                                        checked={settings.allowRegistration}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Cloudinary Settings (Optional override) */}
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                                <AlertCircle className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-bold">Cloudinary Configuration</h2>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">
                            These settings are usually loaded from environment variables. Only set these if you need to override them dynamically.
                        </p>
                        <div className="grid gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Cloud Name</label>
                                <input
                                    type="text"
                                    name="cloudinaryCloudName"
                                    value={settings.cloudinaryCloudName}
                                    onChange={handleChange}
                                    placeholder={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "Enter cloud name"}
                                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-white/30 focus:outline-none text-sm transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Upload Preset</label>
                                <input
                                    type="text"
                                    name="cloudinaryUploadPreset"
                                    value={settings.cloudinaryUploadPreset}
                                    onChange={handleChange}
                                    placeholder={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "Enter upload preset"}
                                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-white/30 focus:outline-none text-sm transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
