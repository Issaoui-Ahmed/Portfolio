"use client";

type FilterBarProps = {
    currentFilter: string;
    setFilter: (filter: string) => void;
};

import data from "../data/portfolio.json";
const categories = ["All", ...Array.from(new Set(data.projects.map((p) => p.category)))];

export default function FilterBar({ currentFilter, setFilter }: FilterBarProps) {
    return (
        <div className="flex gap-8 mb-12 border-b border-gray-100">
            {categories.map((filter) => (
                <button
                    key={filter}
                    onClick={() => setFilter(filter)}
                    className={`text-sm pb-4 relative transition-colors ${currentFilter === filter
                        ? "text-black"
                        : "text-gray-300 hover:text-gray-500"
                        }`}
                >
                    {filter}
                    {currentFilter === filter && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />
                    )}
                </button>
            ))}
        </div>
    );
}
