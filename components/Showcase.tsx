"use client";

import ProjectCard from "./ProjectCard";
import { projects } from "@/lib/projects";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import Link from "next/link";

interface ShowcaseProps {
  idList: number[];
}

export default function Showcase({ idList }: ShowcaseProps) {
  const { language } = useLanguage();
  const t = translations[language];
  
  const showcasedProjects = projects.filter((project) => idList.includes(project.id));

  return (
    <section id="projects" className="py-24 space-y-16 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8 flex-1">
          <h2 className="text-xs uppercase tracking-[0.5em] font-medium whitespace-nowrap">
            {t.projects_title}
          </h2>
          <div className="geometric-line"></div>
        </div>
        <Link 
          href="/projects" 
          className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity ml-8 whitespace-nowrap"
        >
          {t.view_all_projects} &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {showcasedProjects.map((project, idx) => (
          <div 
            key={project.id} 
            className="animate-fade-in" 
            style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </section>
  );
}
