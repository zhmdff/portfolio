import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { PortfolioListItem } from "@/lib/portfolio-api";

export default function ProjectCard({ project }: { project: PortfolioListItem }) {
  const { language } = useLanguage();
  const projectName = language === "en" ? project.NameEn : project.Name;
  const projectDescription = language === "en" ? project.DescriptionEn : project.Description;
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link href={`/projects/${project.Slug}`} className="group block space-y-6">
      <div className="relative aspect-video overflow-hidden border border-border group-hover:border-foreground/20 transition-colors duration-300 bg-foreground/[0.03]">
        <div className="absolute inset-0 sm:inset-[2.5%] group-hover:inset-0 transition-all duration-500 ease-out overflow-hidden">
          {project.Image && (
            <Image
              src={project.Image}
              alt={projectName}
              fill
              className={`object-cover transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setImageLoaded(true)}
            />
          )}
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-2xl font-light tracking-tight group-hover:translate-x-1 transition-transform duration-500">
            {projectName}
          </h3>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500">
            <path d="M7 17L17 7M17 7H7M17 7V17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.Tags.map((tag) => (
            <span key={tag} className="text-[10px] uppercase tracking-widest text-foreground/40 px-2 py-1 border border-border">
              {tag}
            </span>
          ))}
        </div>

        {projectDescription && (
          <p className="text-sm text-foreground/60 line-clamp-2 font-light leading-relaxed group-hover:text-foreground/80 transition-colors">
            {projectDescription}
          </p>
        )}
      </div>
    </Link>
  );
}
