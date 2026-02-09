import Image from "next/image";

export interface Project {
  name: string;
  url: string;
  tags: string[];
  image: string;
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <a 
      href={project.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group block space-y-6"
    >
      <div className="relative aspect-[16/10] overflow-hidden border border-foreground/5 bg-zinc-100 dark:bg-zinc-900">
        <Image
          src={project.image}
          alt={project.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-2xl font-light tracking-tight group-hover:translate-x-1 transition-transform duration-500">
            {project.name}
          </h3>
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500"
          >
            <path d="M7 17L17 7M17 7H7M17 7V17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {project.tags.map(tag => (
            <span 
              key={tag} 
              className="text-[10px] uppercase tracking-widest text-foreground/40 px-2 py-1 border border-foreground/10"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
