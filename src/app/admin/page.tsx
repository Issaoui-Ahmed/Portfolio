"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableProjectCard } from "../../components/admin/SortableProjectCard";

type Project = {
    id: number;
    title: string;
    category: string;
    image: string;
    width: number;
    height: number;
    githubLink?: string;
    mediumLink?: string;
    customLinkText?: string;
    customLinkUrl?: string;
    customLinkIcon?: string;
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

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

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
            const url = data.url;
            return url.startsWith("/images/") ? url.replace("/images/", "") : url;
        } catch (error) {
            alert("Upload failed");
            return null;
        }
    };

    const handleAddProject = () => {
        if (!data) return;
        const newProject: Project = {
            id: Date.now(),
            title: "",
            category: "",
            image: "",
            width: 800,
            height: 600, // Default height
        };
        setData({
            ...data,
            projects: [...data.projects, newProject],
        });
    };

    const handleDeleteProject = (id: number) => {
        if (!data) return;
        // Instant delete, no confirm
        const newProjects = data.projects.filter((p) => p.id !== id);
        setData({ ...data, projects: newProjects });
    };

    const handleUpdateProject = (updatedProject: Project) => {
        if (!data) return;
        const newProjects = data.projects.map((p) =>
            p.id === updatedProject.id ? updatedProject : p
        );
        setData({ ...data, projects: newProjects });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id && data) {
            const oldIndex = data.projects.findIndex((p) => p.id === active.id);
            const newIndex = data.projects.findIndex((p) => p.id === over.id);

            setData({
                ...data,
                projects: arrayMove(data.projects, oldIndex, newIndex),
            });
        }
    };

    if (loading || !data) return <div className="p-10">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl">Portfolio Admin</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={handleAddProject}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            + Add Project
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>

                <section className="mb-12 border-b pb-12">
                    <h2 className="text-xl mb-4">Personal Info</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1">Name</label>
                                <input
                                    type="text"
                                    value={data.personalInfo.name}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            personalInfo: {
                                                ...data.personalInfo,
                                                name: e.target.value,
                                            },
                                        })
                                    }
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Bio</label>
                                <textarea
                                    value={data.personalInfo.bio}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            personalInfo: {
                                                ...data.personalInfo,
                                                bio: e.target.value,
                                            },
                                        })
                                    }
                                    className="w-full p-2 border rounded h-32"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm mb-1">
                                Profile Image
                            </label>
                            <div className="flex gap-4 items-start">
                                <div className="relative w-32 h-32 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                                    {data.personalInfo.profileImage && (
                                        <img
                                            src={
                                                data.personalInfo.profileImage.startsWith("http")
                                                    ? data.personalInfo.profileImage
                                                    : `/images/${data.personalInfo.profileImage}`
                                            }
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="flex-1">
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
                                                        personalInfo: {
                                                            ...data.personalInfo,
                                                            profileImage: url,
                                                        },
                                                    });
                                                }
                                            }
                                        }}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-black file:text-white hover:file:bg-gray-800 mb-2"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Or paste filename/URL"
                                        value={data.personalInfo.profileImage || ""}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                personalInfo: {
                                                    ...data.personalInfo,
                                                    profileImage: e.target.value,
                                                },
                                            })
                                        }
                                        className="w-full p-2 border rounded text-sm text-gray-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl mb-6">Projects (Drag to Reorder)</h2>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={data.projects.map((p) => p.id)}
                            strategy={rectSortingStrategy}
                        >
                            <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
                                {data.projects.map((project) => (
                                    <SortableProjectCard
                                        key={project.id}
                                        project={project}
                                        onUpdate={handleUpdateProject}
                                        onDelete={handleDeleteProject}
                                        onUpload={handleUpload}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </section>
            </div>
        </div>
    );
}

