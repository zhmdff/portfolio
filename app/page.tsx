"use client";

import ContactForm from "@/components/ContactForm";
import ProjectCard, { Project } from "@/components/ProjectCard";
import SocialLinks from "@/components/SocialLinks";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import TechArsenal from "@/components/TechArsenal";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { projects } from "@/lib/projects";

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="selection:bg-foreground selection:text-background min-h-screen">
      {/* Sticky Header */}
      <nav className="sticky top-0 z-50 w-full bg-background/60 backdrop-blur-xl border-b border-foreground/5 animate-fade-in">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 flex justify-between items-center py-6">
          <div className="text-xl font-medium tracking-tighter hover:opacity-70 transition-opacity cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            zhmdff
          </div>
          <div className="flex items-center gap-8 sm:gap-12">
            <div className="hidden sm:flex items-center gap-8">
              <SocialLinks />
              <LanguageSwitcher />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 sm:px-12 pb-24">
        {/* Mobile Nav Helper */}
        <div className="flex sm:hidden justify-between items-center py-8 animate-fade-in">
          <SocialLinks />
          <LanguageSwitcher />
        </div>

        {/* Hero */}
        <header className="py-24 sm:py-32 space-y-12 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] opacity-40">
              {t.role} / {t.location}
            </p>
            <h1 className="text-5xl sm:text-7xl font-light tracking-tight leading-[1.1] max-w-4xl">
              {t.name} <br />
              <span className="opacity-40 italic">{t.tagline}</span>
            </h1>
          </div>
          <div className="space-y-6">
            <p className="text-xl text-foreground/60 max-w-2xl font-light leading-relaxed">{t.description}</p>
            <div className="flex items-center gap-4 pt-4">
              <a href="#projects" className="btn-geometric">
                {t.projects_title}
              </a>
              <a href="#contact" className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">
                {t.contact_title}
              </a>
            </div>
          </div>
        </header>

        {/* Tech Arsenal Section */}
        <div className="glass-panel mb-24 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <TechArsenal />
        </div>

        {/* Projects Section */}
        <section id="projects" className="py-24 space-y-16 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center space-x-8">
            <h2 className="text-xs uppercase tracking-[0.5em] font-medium whitespace-nowrap">{t.projects_title}</h2>
            <div className="geometric-line"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {projects.map((project, idx) => (
              <div key={project.name} className="animate-fade-in" style={{ animationDelay: `${0.4 + idx * 0.1}s` }}>
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <div id="contact" className="glass-panel mb-24 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <ContactForm />
        </div>

        {/* Footer */}
        <footer className="py-24 border-t border-foreground/5 animate-fade-in" style={{ animationDelay: "0.7s" }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-2">
              <p className="text-sm opacity-40">
                &copy; {new Date().getFullYear()} {t.name}. {t.footer_copy}.
              </p>
              <p className="text-[10px] uppercase tracking-widest opacity-20">Azerbaijan / Baku</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] uppercase tracking-widest opacity-40">{t.footer_status}</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
