import Image from "next/image";
import { resolveImagePath } from "../utils/image";

export type Project = {
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

import Link from "next/link";

export default function ProjectCard({ project }: { project: Project }) {
    return (
        <div className="mb-20 break-inside-avoid group">
            <div className="block">
                <div className="relative overflow-hidden mb-4 bg-gray-100 rounded-lg">
                    <Image
                        src={resolveImagePath(project.image)}
                        alt={project.title}
                        width={project.width}
                        height={project.height}
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <div className="flex flex-col items-center mb-2">
                    <h3 className="text-black text-base group-hover:text-gray-600 transition-colors text-center">{project.title}</h3>
                    {project.customLinkText && project.customLinkUrl && (
                        <a
                            href={project.customLinkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-gray-500 italic hover:text-black transition-colors mt-1"
                        >
                            {project.customLinkText}
                            {project.customLinkIcon && (
                                <img
                                    src={resolveImagePath(project.customLinkIcon)}
                                    alt=""
                                    className="w-4 h-4 object-contain"
                                />
                            )}
                        </a>
                    )}
                </div>
            </div>

            <div className="flex justify-center gap-6 text-sm text-gray-500">
                {project.githubLink && (
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-black transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405 1.02 0 2.04.135 3 .405 2.28-1.56 3.285-1.23 3.285-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        Repo
                    </a>
                )}
                {project.mediumLink && (
                    <a href={project.mediumLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-black transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
                        </svg>
                        Blog
                    </a>
                )}
                {project.deployedLink && (
                    <a href={project.deployedLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-black transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="2" y1="12" x2="22" y2="12"></line>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                        Live
                    </a>
                )}
            </div>
        </div>
    );
}
