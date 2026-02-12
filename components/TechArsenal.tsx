"use client";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

const tech = [
  { name: "C#", color: "239120" },
  { name: ".NET", color: "512BD4" },
  { name: "Node.js", color: "339933" },
  { name: "TypeScript", color: "3178C6" },
  { name: "NextJS", color: "3178C6" },
  { name: "SQL", color: "3178C6" },
  { name: "JavaScript", color: "F7DF1E", logoColor: "black" },
  { name: "Unity", color: "000000" },
  { name: "React", color: "61DAFB", logoColor: "black" },
  { name: "PHP", color: "47A248" },
  { name: "MYSQL", color: "47A248" },
  { name: "PostgreSQL", color: "4169E1" },
  { name: "Laravel", color: "2496ED" },
  { name: "Codeigniter", color: "2496ED" },
  { name: "Git", color: "F05032" },
];

export default function TechArsenal() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="space-y-12">
      <div className="flex items-center space-x-8">
        <h2 className="text-xs uppercase tracking-[0.5em] font-medium whitespace-nowrap">{t.stack_title}</h2>
        <div className="geometric-line"></div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
        {tech.map((item) => (
          <div key={item.name} className="group relative px-6 py-3 border border-foreground/10 hover:border-foreground/30 transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500" style={{ backgroundColor: `#${item.color}` }} />
            <span className="text-sm font-light tracking-widest uppercase">{item.name}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12">
        <div className="p-8 border border-foreground/5 bg-foreground/[0.02] space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-foreground animate-pulse"></div>
            <p className="text-[10px] uppercase tracking-widest opacity-40">Code snippet</p>
          </div>
          <pre className="text-xs font-mono leading-relaxed opacity-70 whitespace-pre-wrap break-words selection:bg-foreground selection:text-background">
            {`public class Developer 
{
    public string Name => "${translations[language].name}";
    public string[] Roles => new[] { 
        "Backend Architect", 
        "Full Stack Dev", 
        "Game Dev" 
    };
    
    public string CurrentFocus => 
        "${t.focus}";
}`}
          </pre>
        </div>

        <div className="space-y-8 flex flex-col justify-center">
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest opacity-40 font-medium">{t.about_title}</p>
            <p className="text-2xl font-light leading-relaxed italic opacity-80">"{t.about_me}"</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium tracking-tighter">{t.name}</p>
            <p className="text-[10px] uppercase tracking-widest opacity-40">{t.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
