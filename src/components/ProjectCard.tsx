import Image from "next/image";

export type Project = {
    id: number;
    title: string;
    category: string;
    image: string;
    width: number;
    height: number;
};

export default function ProjectCard({ project }: { project: Project }) {
    return (
        <div className="group cursor-pointer break-inside-avoid mb-20">
            <div className="relative overflow-hidden mb-4 bg-gray-100">
                <Image
                    src={project.image}
                    alt={project.title}
                    width={project.width}
                    height={project.height}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <div className="flex justify-between items-baseline">
                <h3 className="font-medium text-black text-base">{project.title}</h3>
                <span className="text-sm text-gray-400">{project.category}</span>
            </div>
        </div>
    );
}
