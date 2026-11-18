"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { PortfolioListItem } from "@/lib/portfolio-api";
import ProjectCard from "@/components/ProjectCard";
import SocialLinks from "@/components/SocialLinks";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";

export default function ProjectsClient({ projects }: { projects: PortfolioListItem[] }) {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen flex flex-col selection:bg-foreground selection:text-background">
      <nav className="sticky top-0 z-50 w-full bg-background/60 backdrop-blur-xl border-b border-foreground/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex justify-between items-center py-6">
          <Link href="/" className="text-xl font-medium tracking-tighter hover:opacity-70 transition-opacity">
            zhmdff
          </Link>
          <div className="flex items-center gap-8 sm:gap-12">
            <div className="hidden sm:flex items-center gap-8">
              <SocialLinks />
              <LanguageSwitcher />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-12 py-12 space-y-12">
        <div className="space-y-6">
          <Link
            href="/"
            className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
          >
            &larr; {t.back_to_home}
          </Link>
          <div className="flex items-center space-x-8">
            <h1 className="text-xs uppercase tracking-[0.5em] font-medium whitespace-nowrap">
              {t.view_all_projects}
            </h1>
            <div className="geometric-line flex-1"></div>
            <span className="text-[10px] uppercase tracking-widest opacity-40 tabular-nums">
              {projects.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 pb-24">
          {projects.map((project) => (
            <ProjectCard key={project.Id} project={project} />
          ))}
        </div>
      </main>
    </div>
  );
}
