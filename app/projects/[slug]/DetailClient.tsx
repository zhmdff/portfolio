"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { imageUrl, PortfolioDetail } from "@/lib/portfolio-api";

export default function DetailClient({ project, downloadHref }: { project: PortfolioDetail; downloadHref: string }) {
  const { language } = useLanguage();
  const t = translations[language];
  const name = language === "en" ? project.NameEn : project.Name;
  const subtitle = language === "en" ? project.SubtitleEn : project.Subtitle;
  const description = language === "en" ? project.DescriptionEn : project.Description;
  const details = language === "en" ? project.TechnicalDetailsEn : project.TechnicalDetails;

  return (
    <div className="max-w-4xl mx-auto p-8 sm:p-16 space-y-8">
      <Link href="/projects" className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100">
        &larr; {t.back_to_home}
      </Link>

      <h1 className="text-4xl font-light tracking-tight">{name}</h1>
      {subtitle && <p className="text-[10px] uppercase tracking-[0.3em] font-medium opacity-40">{subtitle}</p>}

      {project.Image && (
        <div className="relative aspect-video border border-foreground/5 rounded-xl overflow-hidden">
          <Image src={imageUrl(project.Image)!} alt={name} fill className="object-cover" />
        </div>
      )}

      <p className="text-base text-foreground/70 font-light leading-relaxed">{description}</p>

      {details.length > 0 && (
        <ul className="space-y-2.5">
          {details.map((d, i) => (
            <li key={i} className="flex gap-3 text-[13px] text-foreground/60 font-light">
              <span className="text-foreground/20">•</span>{d}
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-2">
        {project.Tags.map((tag) => (
          <span key={tag} className="text-[9px] uppercase tracking-widest text-foreground/40 px-2 py-1 border border-foreground/10">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-4 pt-4">
        {project.Url && (
          <Link href={project.Url} target="_blank" rel="noopener noreferrer" className="btn-geometric px-6 py-3 text-[11px]">
            {t.live_demo}
          </Link>
        )}
        {project.FileName && (
          <Link href={downloadHref} className="btn-geometric px-6 py-3 text-[11px]">
            Download {project.Version ? `v${project.Version}` : ""} ({project.Platform})
          </Link>
        )}
      </div>
    </div>
  );
}
