"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { projects } from "@/lib/projects";
import SocialLinks from "@/components/SocialLinks";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";

export default function ProjectsPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const [activeProjectId, setActiveProjectId] = useState(projects[0].id);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      root: containerRef.current,
      threshold: 0.6,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = Number(entry.target.getAttribute("data-project-id"));
          setActiveProjectId(id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const projectElements = document.querySelectorAll("[data-project-id]");
    projectElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const infoPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (containerRef.current) {
        e.preventDefault();
        containerRef.current.scrollTop += e.deltaY;
      }
    };

    const panel = infoPanelRef.current;
    if (panel) {
      panel.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (panel) {
        panel.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];
  const projectName = language === "en" ? activeProject.name_en : activeProject.name;
  const projectSubtitle = language === "en" ? activeProject.subtitle_en : activeProject.subtitle;
  const projectDescription = language === "en" ? activeProject.description_en : activeProject.description;
  const projectDetails = language === "en" ? activeProject.technicalDetails_en : activeProject.technicalDetails;

  return (
    <div className="min-h-screen lg:h-screen flex flex-col lg:overflow-hidden selection:bg-foreground selection:text-background">
      {/* Navigation */}
      <nav className="z-50 w-full bg-background/60 backdrop-blur-xl border-b border-foreground/5 shrink-0">
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

      <main className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden relative">
        {/* Mobile View: Vertical list of project cards */}
        <div className="lg:hidden w-full bg-background space-y-12 pb-24">
          {projects.map((project) => (
            <div key={project.id} className="p-6 space-y-8 border-b border-foreground/5 last:border-0">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h1 className="font-light tracking-tight text-3xl leading-tight">
                    {language === "en" ? project.name_en : project.name}
                  </h1>
                </div>
                {(language === "en" ? project.subtitle_en : project.subtitle) && (
                  <p className="text-[10px] uppercase tracking-[0.3em] font-medium opacity-40">
                    {language === "en" ? project.subtitle_en : project.subtitle}
                  </p>
                )}
              </div>

              {/* Mobile Image - 16:9 with same premium styling */}
              <div className="relative w-full aspect-video">
                <div className="absolute inset-0 bg-foreground/5 overflow-hidden border border-foreground/5 rounded-xl shadow-lg">
                  <Image
                    src={project.image}
                    alt={language === "en" ? project.name_en : project.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <p className="text-base text-foreground/70 font-light leading-relaxed">
                {language === "en" ? project.description_en : project.description}
              </p>

              {(language === "en" ? project.technicalDetails_en : project.technicalDetails) && (
                <div className="space-y-4 pt-6 border-t border-foreground/5">
                  <h3 className="text-[9px] uppercase tracking-widest font-bold opacity-30">
                    {t.technical_details}
                  </h3>
                  <ul className="space-y-2.5">
                    {(language === "en" ? project.technicalDetails_en : project.technicalDetails)?.map((detail, i) => (
                      <li key={i} className="flex gap-3 text-[13px] text-foreground/60 font-light leading-relaxed">
                        <span className="text-foreground/20">•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                {project.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="text-[9px] uppercase tracking-widest text-foreground/40 px-2 py-1 border border-foreground/10 bg-foreground/[0.02] rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="pt-4">
                <Link 
                  href={project.url} 
                  target="_blank"
                  className="btn-geometric inline-flex items-center gap-3 text-[11px] py-3 px-6 w-full justify-center"
                >
                  <span>{t.live_demo}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3.5 h-3.5">
                    <path d="M7 17L17 7M17 7H7M17 7V17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Split-screen synchronized scroller */}
        <div 
          ref={infoPanelRef}
          className="hidden lg:flex w-[40%] p-16 overflow-hidden flex-col justify-center animate-fade-in border-r border-foreground/5 bg-background scroll-hide relative z-10 h-full"
        >
          <div className="max-w-md space-y-8 my-auto">
            <div className="space-y-4">
              <Link 
                href="/" 
                className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity inline-flex items-center gap-2"
              >
                &larr; {t.back_to_home}
              </Link>
              
              <div className="flex items-center gap-3 transition-opacity duration-300" key={`title-${activeProjectId}`}>
                <h1 className="font-light tracking-tight text-4xl sm:text-5xl leading-tight">
                  {projectName}
                </h1>
              </div>

              {projectSubtitle && (
                <p className="text-[10px] uppercase tracking-[0.3em] font-medium opacity-40 animate-fade-in" key={`subtitle-${activeProjectId}`}>
                  {projectSubtitle}
                </p>
              )}
            </div>

            <p className="text-base text-foreground/70 font-light leading-relaxed animate-fade-in" key={`desc-${activeProjectId}`}>
              {projectDescription}
            </p>

            {projectDetails && (
              <div className="space-y-4 pt-6 border-t border-foreground/5 animate-fade-in" key={`details-${activeProjectId}`}>
                <h3 className="text-[9px] uppercase tracking-widest font-bold opacity-30">
                  {t.technical_details}
                </h3>
                <ul className="space-y-2.5">
                  {projectDetails.map((detail, i) => (
                    <li key={i} className="flex gap-3 text-[13px] text-foreground/60 font-light leading-relaxed">
                      <span className="text-foreground/20">•</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2 animate-fade-in" key={`tags-${activeProjectId}`}>
              {activeProject.tags.map(tag => (
                <span 
                  key={tag} 
                  className="text-[9px] uppercase tracking-widest text-foreground/40 px-2 py-1 border border-foreground/10 bg-foreground/[0.02] rounded-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="pt-8 animate-fade-in">
              <Link 
                href={activeProject.url} 
                target="_blank"
                className="btn-geometric inline-flex items-center gap-3 text-[11px] py-3 px-6"
              >
                <span>{t.live_demo}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3.5 h-3.5">
                  <path d="M7 17L17 7M17 7H7M17 7V17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop View Right Side: Scrollable Images */}
        <div 
          ref={containerRef}
          className="hidden lg:block w-[60%] overflow-y-auto scroll-smooth snap-y snap-mandatory bg-foreground/[0.01] custom-scrollbar h-full"
        >
          {projects.map((project) => (
            <div 
              key={project.id}
              data-project-id={project.id}
              className="h-full flex items-center justify-center p-20 snap-center shrink-0"
            >
              <div className="relative w-full aspect-video group">
                <div className="absolute inset-0 bg-foreground/5 overflow-hidden border border-foreground/5 group-hover:border-foreground/10 transition-all duration-700 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                  <Image
                    src={project.image}
                    alt={language === "en" ? project.name_en : project.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                    priority={project.id === activeProjectId}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>
                <div className={`absolute -inset-2 border border-foreground/10 transition-opacity duration-700 pointer-events-none rounded-2xl ${activeProjectId === project.id ? 'opacity-100' : 'opacity-0'}`} />
              </div>
            </div>
          ))}
          <div className="h-[20vh]" />
        </div>
      </main>
    </div>
  );
}
