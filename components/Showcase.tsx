"use client";

import ProjectCard from "./ProjectCard";
import { projects } from "@/lib/projects";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";

interface ShowcaseProps {
  idList: number[];
}

export default function Showcase({ idList }: ShowcaseProps) {
  const { language } = useLanguage();
  const t = translations[language];
  
  const showcasedProjects = projects.filter((project) => idList.includes(project.id));

  return (
    <RevealOnScroll as="section" className="py-24 space-y-16" id="projects">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8 flex-1">
          <h2 className="text-xs uppercase tracking-[0.5em] font-medium whitespace-nowrap">
            {t.projects_title}
          </h2>
          <div className="geometric-line"></div>
        </div>
        <Link
          href="/projects"
          className="text-[10px] uppercase tracking-widest font-medium border border-foreground/20 px-4 py-2 hover:border-foreground hover:bg-foreground hover:text-background transition-all duration-300 ml-8 whitespace-nowrap"
        >
          {t.view_all_projects} &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {showcasedProjects.map((project, idx) => (
          <RevealOnScroll key={project.id} delay={0.1 + idx * 0.1}>
            <ProjectCard project={project} />
          </RevealOnScroll>
        ))}
      </div>
    </RevealOnScroll>
  );
}
