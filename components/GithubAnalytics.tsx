"use client";
import { useTheme } from "@/context/ThemeContext";

export default function GithubAnalytics() {
  const { theme } = useTheme();

  return (
    <section className="glass-panel mb-24 animate-fade-in">
      <div className="flex items-center space-x-8 mb-12">
        <h2 className="text-xs uppercase tracking-[0.5em] font-medium whitespace-nowrap">Activity</h2>
        <div className="geometric-line"></div>
      </div>
      <div className="flex justify-center p-4 sm:p-8 bg-foreground/[0.02] border border-foreground/5 overflow-hidden">
        <img 
          src={`https://github-readme-activity-graph.vercel.app/graph?username=zhmdff&theme=${theme === 'dark' ? 'github-compact' : 'react'}&hide_border=true&bg_color=transparent&color=58A6FF&line=58A6FF&point=${theme === 'dark' ? 'FFFFFF' : '000000'}`} 
          alt="GitHub Activity"
          className="w-full max-w-4xl transition-opacity duration-1000"
        />
      </div>
    </section>
  );
}
