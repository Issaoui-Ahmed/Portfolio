"use client";

import { useState } from "react";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import ProjectGrid from "@/components/ProjectGrid";

export default function Home() {
  const [filter, setFilter] = useState("All");

  return (
    <main className="min-h-screen max-w-[1200px] mx-auto px-6 py-12 md:px-12 lg:px-20">
      <Header />
      <FilterBar currentFilter={filter} setFilter={setFilter} />
      <ProjectGrid currentFilter={filter} />
    </main>
  );
}
