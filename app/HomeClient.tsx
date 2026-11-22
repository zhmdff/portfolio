"use client";

// import ControllerArt from "@/components/ControllerArt"; // hidden for now
import DevArt from "@/components/DevArt";
import ContactForm from "@/components/ContactForm";
import { WebShowcase, SoftwareShowcase } from "@/components/Showcase";
import SocialLinks from "@/components/SocialLinks";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import TechArsenal from "@/components/TechArsenal";
import RevealOnScroll from "@/components/RevealOnScroll";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import type { PortfolioListItem } from "@/lib/portfolio-api";

interface HomeClientProps {
  webProjects: PortfolioListItem[] | null;
  softwareProjects: PortfolioListItem[] | null;
}

export default function HomeClient({ webProjects, softwareProjects }: HomeClientProps) {
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
        <header className="py-24 sm:py-32">
          <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-8">
            {/* Left – Text */}
            <div className="lg:basis-3/5 lg:grow-0 min-w-0 space-y-12">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.4em] opacity-60">
                  {t.role} / {t.location}
                </p>
                <h1 className="text-5xl sm:text-7xl font-light tracking-tight leading-[1.1] max-w-4xl">
                  {t.name} <br />
                  <span className="opacity-60 italic">{t.tagline}</span>
                </h1>
              </div>
              <div className="space-y-6">
                <p className="text-xl text-foreground/60 max-w-2xl font-light leading-relaxed">{t.description}</p>
                <div className="flex items-center gap-4 pt-4">
                  <a href="#web-projects" className="btn-geometric">
                    {t.web_projects_title}
                  </a>
                  <a href="#contact" className="text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
                    {t.contact_title}
                  </a>
                </div>
              </div>
            </div>

            {/* Right – 3D Controller */}
            <div className="hidden lg:flex flex-col lg:basis-2/5 lg:grow justify-center items-center gap-6 w-full">
              <DevArt />
              {/* <ControllerArt /> */}
            </div>
          </div>
        </header>

        {/* Web Projects Showcase */}
        <WebShowcase initial={webProjects} />

        {/* Software Showcase */}
        <SoftwareShowcase initial={softwareProjects} />

        {/* Tech Stack */}
        <RevealOnScroll delay={0.2}>
          <div className="glass-panel mb-24">
            <TechArsenal />
          </div>
        </RevealOnScroll>

        {/* Contact Section */}
        <RevealOnScroll delay={0.2}>
          <div id="contact" className="glass-panel mb-24">
            <ContactForm />
          </div>
        </RevealOnScroll>

        {/* Footer */}
        <footer>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-2">
              <p className="text-sm opacity-60">
                &copy; {new Date().getFullYear()} {t.name}. {t.footer_copy}.
              </p>
              <p className="text-[10px] uppercase tracking-widest opacity-50">Azerbaijan / Baku</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
