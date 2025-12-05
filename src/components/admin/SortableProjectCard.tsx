"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, useEffect } from "react";

type Project = {
    id: number;
    title: string;
    category: string;
    image: string;
    width: number;
    height: number;
    githubLink?: string;
    mediumLink?: string;
    deployedLink?: string;
    customLinkText?: string;
    customLinkUrl?: string;
    customLinkIcon?: string;
};

interface SortableProjectCardProps {
    project: Project;
    onUpdate: (project: Project) => void;
    onDelete: (id: number) => void;
    onUpload: (file: File) => Promise<string | null>;
}

export function SortableProjectCard({
    project,
    onUpdate,
    onDelete,
    onUpload,
}: SortableProjectCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: project.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        aspectRatio: `${project.width} / ${project.height}`,
    };

    const handleResize = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const startY = e.clientY;
        const startHeight = project.height;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const newHeight = Math.max(200, startHeight + (moveEvent.clientY - startY));
            onUpdate({ ...project, height: newHeight });
        };

        const onMouseUp = () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="relative group bg-gray-100 mb-6 break-inside-avoid"
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute top-2 left-2 z-10 cursor-move p-2 bg-white/80 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity"
            >
                ✋
            </div>

            {/* Delete Button */}
            <button
                onClick={() => onDelete(project.id)}
                className="absolute top-2 right-2 z-10 p-2 bg-red-500 text-white rounded shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Delete Project"
            >
                🗑️
            </button>

            {/* Image / Upload */}
            <div className="relative w-full h-full overflow-hidden">
                <img
                    src={
                        project.image.startsWith("http")
                            ? project.image
                            : `/images/${project.image}`
                    }
                    alt={project.title}
                    className="w-full h-full object-cover"
                />
                <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            const url = await onUpload(file);
                            if (url) {
                                onUpdate({ ...project, image: url });
                            }
                        }
                    }}
                />
            </div>

            {/* Inputs */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 p-2 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <input
                    type="text"
                    value={project.title}
                    onChange={(e) => onUpdate({ ...project, title: e.target.value })}
                    className="w-full bg-transparent font-medium text-sm mb-1 border-b border-transparent hover:border-gray-300 focus:border-black outline-none"
                    placeholder="Title"
                />
                <input
                    type="text"
                    value={project.category}
                    onChange={(e) => onUpdate({ ...project, category: e.target.value })}
                    className="w-full bg-transparent text-xs text-gray-500 border-b border-transparent hover:border-gray-300 focus:border-black outline-none mb-1"
                    placeholder="Category"
                />

                {/* Custom Link Section */}
                <div className="mb-2 border-t border-gray-200 pt-1">
                    <div className="flex gap-2 mb-1">
                        <input
                            type="text"
                            value={project.customLinkText || ""}
                            onChange={(e) => onUpdate({ ...project, customLinkText: e.target.value })}
                            className="w-1/2 bg-transparent text-xs text-gray-500 border-b border-transparent hover:border-gray-300 focus:border-black outline-none"
                            placeholder="Link Text"
                        />
                        <div className="relative w-1/2">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const url = await onUpload(file);
                                        if (url) {
                                            onUpdate({ ...project, customLinkIcon: url });
                                        }
                                    }
                                }}
                            />
                            <div className="text-xs text-gray-400 border-b border-transparent truncate">
                                {project.customLinkIcon ? "Icon Uploaded" : "Upload Icon"}
                            </div>
                        </div>
                    </div>
                    <input
                        type="text"
                        value={project.customLinkUrl || ""}
                        onChange={(e) => onUpdate({ ...project, customLinkUrl: e.target.value })}
                        className="w-full bg-transparent text-xs text-blue-500 border-b border-transparent hover:border-gray-300 focus:border-black outline-none"
                        placeholder="Custom Link URL"
                    />
                </div>

                <div className="flex gap-2 border-t border-gray-200 pt-1">
                    <input
                        type="text"
                        value={project.githubLink || ""}
                        onChange={(e) => onUpdate({ ...project, githubLink: e.target.value })}
                        className="w-1/3 bg-transparent text-xs text-gray-500 border-b border-transparent hover:border-gray-300 focus:border-black outline-none"
                        placeholder="GitHub URL"
                    />
                    <input
                        type="text"
                        value={project.mediumLink || ""}
                        onChange={(e) => onUpdate({ ...project, mediumLink: e.target.value })}
                        className="w-1/3 bg-transparent text-xs text-gray-500 border-b border-transparent hover:border-gray-300 focus:border-black outline-none"
                        placeholder="Medium URL"
                    />
                    <input
                        type="text"
                        value={project.deployedLink || ""}
                        onChange={(e) => onUpdate({ ...project, deployedLink: e.target.value })}
                        className="w-1/3 bg-transparent text-xs text-gray-500 border-b border-transparent hover:border-gray-300 focus:border-black outline-none"
                        placeholder="Deployed URL"
                    />
                </div>
            </div>

            {/* Resize Handle */}
            <div
                onMouseDown={handleResize}
                className="absolute bottom-0 left-0 right-0 h-4 cursor-ns-resize flex justify-center items-center opacity-0 group-hover:opacity-100 hover:bg-black/10 transition-all"
            >
                <div className="w-10 h-1 bg-gray-400 rounded-full" />
            </div>
        </div>
    );
}
