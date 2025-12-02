import data from "../../../data/portfolio.json";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { resolveImagePath } from "../../../utils/image";
import ScrollProgress from "../../../components/ScrollProgress";

// Define the params type correctly for Next.js 15
type Params = Promise<{ id: string }>;

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

export async function generateStaticParams() {
    return data.projects.map((project) => ({
        id: project.id.toString(),
    }));
}

export default async function ProjectPage({ params }: { params: Params }) {
    const { id } = await params;
    const project = (data.projects as Project[]).find((p) => p.id.toString() === id);

    if (!project) {
        notFound();
    }

    const sections = project.sections || [];

    return (
        <div className="min-h-screen bg-white font-[family-name:var(--font-geist-sans)]">
            {sections.length > 0 && <ScrollProgress sections={sections.map((s) => ({ id: s.id, label: s.title }))} />}

            <div className="p-8 md:p-20 max-w-7xl mx-auto">
                <Link href="/" className="inline-block mb-12 text-gray-500 hover:text-black transition-colors">
                    ← Back to Projects
                </Link>

                <article className="max-w-4xl mx-auto">
                    <header className="mb-20">
                        <div className="flex items-baseline gap-4 mb-4">
                            <h1 className="text-4xl md:text-6xl text-black font-medium">{project.title}</h1>
                        </div>
                        <p className="text-xl text-gray-500">{project.category}</p>
                    </header>

                    <div className="relative w-full aspect-video mb-24 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                            src={resolveImagePath(project.image)}
                            alt={project.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <div className="space-y-32">
                        {sections.map((section) => (
                            <section key={section.id} id={section.id} className="scroll-mt-40">
                                <h2 className="text-2xl mb-6 text-black">{section.title}</h2>
                                <p className="text-xl text-gray-600 leading-relaxed whitespace-pre-wrap">
                                    {section.content}
                                </p>
                            </section>
                        ))}

                        {sections.length === 0 && (
                            <p className="text-xl text-gray-500 italic">
                                No details available for this project yet.
                            </p>
                        )}
                    </div>
                </article>
            </div>
        </div>
    );
}

