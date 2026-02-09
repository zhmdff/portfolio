"use client";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-medium">
      <button 
        onClick={() => setLanguage("az")}
        className={`transition-opacity hover:opacity-100 ${language === "az" ? "opacity-100 underline underline-offset-4" : "opacity-40"}`}
      >
        AZ
      </button>
      <div className="w-px h-3 bg-foreground/20"></div>
      <button 
        onClick={() => setLanguage("en")}
        className={`transition-opacity hover:opacity-100 ${language === "en" ? "opacity-100 underline underline-offset-4" : "opacity-40"}`}
      >
        EN
      </button>
    </div>
  );
}
