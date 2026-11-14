"use client";

import { useEffect, useState } from "react";
import ProjectCard, { ProjectCardSkeleton } from "./ProjectCard";
import { fetchPinnedPortfolioList, PortfolioListItem } from "@/lib/portfolio-api";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";

type ShowcaseKind = "web" | "software";

interface ShowcaseSectionProps {
  kind: ShowcaseKind;
  title: string;
  viewAllLabel: string;
  id: string;
}

function ShowcaseSection({ kind, title, viewAllLabel, id }: ShowcaseSectionProps) {
  const [projects, setProjects] = useState<PortfolioListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchPinnedPortfolioList(kind)
      .then((list) => {
        if (!cancelled) {
          setProjects(list);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProjects([]);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [kind]);

  // Hide the section entirely when there are no pinned items (after loading completes)
  if (!loading && projects.length === 0) return null;

  return (
    <section className="py-24 space-y-16" id={id}>
      <RevealOnScroll className="flex items-center justify-between">
        <div className="flex items-center space-x-8 flex-1">
          <h2 className="text-xs uppercase tracking-[0.5em] font-medium whitespace-nowrap">
            {title}
          </h2>
          <div className="geometric-line"></div>
        </div>
        <Link
          href="/projects"
          className="text-[10px] uppercase tracking-widest font-medium border border-foreground/20 px-4 py-2 hover:border-foreground hover:bg-foreground hover:text-background transition-all duration-300 ml-8 whitespace-nowrap"
        >
          {viewAllLabel} &rarr;
        </Link>
      </RevealOnScroll>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
        aria-busy={loading}
      >
        {loading
          ? Array.from({ length: 3 }, (_, idx) => <ProjectCardSkeleton key={idx} />)
          : projects.map((project, idx) => (
              <RevealOnScroll key={project.Id} delay={idx * 0.08}>
                <ProjectCard project={project} />
              </RevealOnScroll>
            ))}
      </div>
    </section>
  );
}

export function WebShowcase() {
  const { language } = useLanguage();
  const t = translations[language];
  return (
    <ShowcaseSection
      kind="web"
      title={t.web_projects_title}
      viewAllLabel={t.view_all_projects}
      id="web-projects"
    />
  );
}

export function SoftwareShowcase() {
  const { language } = useLanguage();
  const t = translations[language];
  return (
    <ShowcaseSection
      kind="software"
      title={t.software_title}
      viewAllLabel={t.view_all_projects}
      id="software"
    />
  );
}
