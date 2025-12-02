"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { resolveImagePath } from "../../../../utils/image";

type Section = {
    id: string;
    title: string;
    content: string;
};

type Project = {
    id: number;
    title: string;
    category: string;
    image: string;
    width: number;
    height: number;
    sections?: Section[];
};

type PortfolioData = {
    personalInfo: any;
    categories: string[];
    projects: Project[];
};

// Define the params type correctly for Next.js 15
type Params = Promise<{ id: string }>;

export default function EditProjectPage({ params }: { params: Params }) {
    const [project, setProject] = useState<Project | null>(null);
    const [fullData, setFullData] = useState<PortfolioData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const loadData = async () => {
            const { id } = await params;
            fetch("/api/portfolio")
                .then((res) => res.json())
                .then((data: PortfolioData) => {
                    setFullData(data);
                    const foundProject = data.projects.find((p) => p.id.toString() === id);
                    if (foundProject) {
                        // Ensure sections array exists
                        if (!foundProject.sections) {
                            foundProject.sections = [];
                        }
                        setProject(foundProject);
                    }
                    setLoading(false);
                });
        };
        loadData();
    }, [params]);

    const handleSave = async () => {
        if (!fullData || !project) return;
        setSaving(true);

        const updatedProjects = fullData.projects.map((p) =>
            p.id === project.id ? project : p
        );

        const updatedData = { ...fullData, projects: updatedProjects };

        try {
            await fetch("/api/portfolio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });
            alert("Changes saved successfully!");
            router.push("/admin");
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
            const url = data.url;
            return url.startsWith("/images/") ? url.replace("/images/", "") : url;
        } catch (error) {
            alert("Upload failed");
            return null;
        }
    };

    const addSection = () => {
        if (!project) return;
        const newSection: Section = {
            id: `section-${Date.now()}`,
            title: "New Section",
            content: "Section content goes here...",
        };
        setProject({
            ...project,
            sections: [...(project.sections || []), newSection],
        });
    };

    const updateSection = (index: number, field: keyof Section, value: string) => {
        if (!project || !project.sections) return;
        const newSections = [...project.sections];
        newSections[index] = { ...newSections[index], [field]: value };
        // Update ID if title changes to keep it somewhat semantic (optional, but good for anchors)
        if (field === "title") {
            newSections[index].id = value.toLowerCase().replace(/\s+/g, '-');
        }
        setProject({ ...project, sections: newSections });
    };

    const removeSection = (index: number) => {
        if (!project || !project.sections) return;
        const newSections = project.sections.filter((_, i) => i !== index);
        setProject({ ...project, sections: newSections });
    };

    if (loading) return <div className="p-10">Loading...</div>;
    if (!project) return <div className="p-10">Project not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="text-gray-500 hover:text-black">
                            ← Back
                        </Link>
                        <h1 className="text-2xl font-bold">Edit Project</h1>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Main Info */}
                    <section className="space-y-4 border-b pb-8">
                        <h2 className="text-xl font-semibold">Project Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={project.title}
                                        onChange={(e) => setProject({ ...project, title: e.target.value })}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Category</label>
                                    <input
                                        type="text"
                                        value={project.category}
                                        onChange={(e) => setProject({ ...project, category: e.target.value })}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Cover Image</label>
                                <div className="relative w-full aspect-video bg-gray-100 rounded overflow-hidden group">
                                    <Image
                                        src={resolveImagePath(project.image)}
                                        alt={project.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <label className="cursor-pointer bg-white text-black px-4 py-2 rounded">
                                            Change Image
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const url = await handleUpload(file);
                                                        if (url) {
                                                            setProject({ ...project, image: url });
                                                        }
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sections */}
                    <section className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Content Sections</h2>
                            <button
                                onClick={addSection}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                + Add Section
                            </button>
                        </div>

                        <div className="space-y-6">
                            {project.sections?.map((section, index) => (
                                <div key={index} className="border rounded-lg p-6 bg-gray-50 relative group">
                                    <button
                                        onClick={() => removeSection(index)}
                                        className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        Remove
                                    </button>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Section Title</label>
                                            <input
                                                type="text"
                                                value={section.title}
                                                onChange={(e) => updateSection(index, "title", e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Content</label>
                                            <textarea
                                                value={section.content}
                                                onChange={(e) => updateSection(index, "content", e.target.value)}
                                                className="w-full p-2 border rounded h-32"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!project.sections || project.sections.length === 0) && (
                                <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                                    No sections yet. Add one to start writing content.
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
