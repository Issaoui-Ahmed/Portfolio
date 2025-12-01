"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Project = {
    id: number;
    title: string;
    category: string;
    image: string;
    width: number;
    height: number;
};

type PortfolioData = {
    personalInfo: {
        name: string;
        role: string;
        bio: string;
        profileImage?: string;
    };
    categories: string[];
    projects: Project[];
};

export default function AdminPage() {
    const [data, setData] = useState<PortfolioData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/portfolio")
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        if (!data) return;
        setSaving(true);
        try {
            await fetch("/api/portfolio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            alert("Changes saved successfully!");
            router.refresh();
        } catch (error) {
            alert("Failed to save changes.");
        } finally {
            setSaving(false);
        }
    };

    const handleUpload = async (file: File): Promise<string | null> => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("filename", file.name);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();
            // Return just the filename if it starts with /images/
            const url = data.url;
            return url.startsWith("/images/") ? url.replace("/images/", "") : url;
        } catch (error) {
            alert("Upload failed");
            return null;
        }
    };

    if (loading || !data) return <div className="p-10">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Portfolio Admin</h1>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>

                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-4">Personal Info</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input
                                type="text"
                                value={data.personalInfo.name}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        personalInfo: { ...data.personalInfo, name: e.target.value },
                                    })
                                }
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Role</label>
                            <input
                                type="text"
                                value={data.personalInfo.role}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        personalInfo: { ...data.personalInfo, role: e.target.value },
                                    })
                                }
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Bio</label>
                            <textarea
                                value={data.personalInfo.bio}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        personalInfo: { ...data.personalInfo, bio: e.target.value },
                                    })
                                }
                                className="w-full p-2 border rounded h-32"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Profile Image</label>
                            <div className="flex gap-4 items-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file && data) {
                                            const url = await handleUpload(file);
                                            if (url) {
                                                setData({
                                                    ...data,
                                                    personalInfo: { ...data.personalInfo, profileImage: url },
                                                });
                                            }
                                        }
                                    }}
                                    className="text-sm"
                                />
                                {data.personalInfo.profileImage && (
                                    <img
                                        src={data.personalInfo.profileImage}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                )}
                            </div>
                            <input
                                type="text"
                                placeholder="Or paste URL"
                                value={data.personalInfo.profileImage || ""}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        personalInfo: { ...data.personalInfo, profileImage: e.target.value },
                                    })
                                }
                                className="w-full p-2 border rounded mt-2 text-sm text-gray-500"
                            />
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4">Projects</h2>
                    <div className="space-y-6">
                        {data.projects.map((project, index) => (
                            <div key={project.id} className="border p-4 rounded bg-gray-50">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-xs font-medium mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={project.title}
                                            onChange={(e) => {
                                                const newProjects = [...data.projects];
                                                newProjects[index].title = e.target.value;
                                                setData({ ...data, projects: newProjects });
                                            }}
                                            className="w-full p-2 border rounded text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium mb-1">Category</label>
                                        <input
                                            type="text"
                                            value={project.category}
                                            onChange={(e) => {
                                                const newProjects = [...data.projects];
                                                newProjects[index].category = e.target.value;
                                                setData({ ...data, projects: newProjects });
                                            }}
                                            className="w-full p-2 border rounded text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1">Image</label>
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const url = await handleUpload(file);
                                                    if (url) {
                                                        const newProjects = [...data.projects];
                                                        newProjects[index].image = url;
                                                        setData({ ...data, projects: newProjects });
                                                    }
                                                }
                                            }}
                                            className="text-xs"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Or paste URL"
                                            value={project.image}
                                            onChange={(e) => {
                                                const newProjects = [...data.projects];
                                                newProjects[index].image = e.target.value;
                                                setData({ ...data, projects: newProjects });
                                            }}
                                            className="w-full p-2 border rounded text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
