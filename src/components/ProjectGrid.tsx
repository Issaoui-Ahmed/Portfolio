import ProjectCard from "./ProjectCard";
import data from "../data/portfolio.json";
const { projects } = data;

export default function ProjectGrid({ currentFilter }: { currentFilter: string }) {
    const filteredProjects =
        currentFilter === "All"
            ? projects
            : projects.filter((p) => p.category === currentFilter);

    return (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-20">
            {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    );
}
