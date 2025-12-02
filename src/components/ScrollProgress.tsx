"use client";

import { useEffect, useState } from "react";

type Section = {
    id: string;
    label: string;
};

export default function ScrollProgress({ sections }: { sections: Section[] }) {
    const [activeSection, setActiveSection] = useState(sections[0].id);

    useEffect(() => {
        const observers = new Map();

        const callback: IntersectionObserverCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(callback, {
            rootMargin: "-20% 0px -50% 0px",
            threshold: 0,
        });

        sections.forEach((section) => {
            const element = document.getElementById(section.id);
            if (element) {
                observer.observe(element);
                observers.set(section.id, element);
            }
        });

        return () => observer.disconnect();
    }, [sections]);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="fixed left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-8 z-50">
            <div className="relative h-[400px] w-0.5 bg-gray-200 rounded-full">
                {/* Active Indicator Line - simplified for now, just markers */}

                {sections.map((section, index) => {
                    const isActive = activeSection === section.id;
                    // Calculate position percentage roughly
                    const top = `${(index / (sections.length - 1)) * 100}%`;

                    return (
                        <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className="absolute -left-1.5 w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center group"
                            style={{ top }}
                            aria-label={`Scroll to ${section.label}`}
                        >
                            <div
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${isActive ? "bg-black scale-125" : "bg-gray-300 group-hover:bg-gray-400"
                                    }`}
                            />
                            {/* Tooltip/Label */}
                            <span
                                className={`absolute left-8 text-sm font-medium transition-all duration-300 whitespace-nowrap ${isActive
                                        ? "text-black opacity-100 translate-x-0"
                                        : "text-gray-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                                    }`}
                            >
                                {section.label}
                            </span>
                        </button>
                    );
                })}

                {/* Progress Line Fill */}
                <div
                    className="absolute top-0 left-0 w-full bg-black transition-all duration-500 ease-out rounded-full"
                    style={{
                        height: `${(sections.findIndex(s => s.id === activeSection) / (sections.length - 1)) * 100}%`
                    }}
                />
            </div>
        </div>
    );
}
