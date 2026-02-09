"use client";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

export default function ContactForm() {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [formData, setFormData] = useState({ email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"" | "sending" | "success" | "error">("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "zhmdff@gmail.com",
          subject: `${formData.subject} - from ${formData.email}`,
          text: formData.message,
        }),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ email: "", subject: "", message: "" });
        setTimeout(() => setStatus(""), 5000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="space-y-16">
      <div className="flex items-center space-x-8">
        <h2 className="text-xs uppercase tracking-[0.5em] font-medium whitespace-nowrap">{t.contact_title}</h2>
        <div className="geometric-line"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        <div className="space-y-10">
          <p className="text-3xl font-light leading-relaxed tracking-tight max-w-md text-foreground">
            {t.contact_tagline}
          </p>
          <div className="space-y-4 pt-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 mb-1">{t.direct_email}</p>
              <a href="mailto:zhmdff@gmail.com" className="text-xl font-mono hover:opacity-60 transition-opacity">
                zhmdff@gmail.com
              </a>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="group relative">
              <input 
                type="email" 
                placeholder={t.placeholder_email} 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                className="w-full bg-transparent border-b border-foreground/20 py-4 outline-none focus:border-foreground transition-all duration-500 placeholder:text-foreground/20" 
                required 
              />
            </div>
            <div className="group relative">
              <input 
                type="text" 
                placeholder={t.placeholder_subject} 
                value={formData.subject} 
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })} 
                className="w-full bg-transparent border-b border-foreground/20 py-4 outline-none focus:border-foreground transition-all duration-500 placeholder:text-foreground/20" 
                required 
              />
            </div>
            <div className="group relative">
              <textarea 
                placeholder={t.placeholder_message} 
                value={formData.message} 
                onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
                className="w-full bg-transparent border-b border-foreground/20 py-4 outline-none focus:border-foreground transition-all duration-500 min-h-[120px] resize-none placeholder:text-foreground/20" 
                required 
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4">
            <button 
              type="submit" 
              disabled={status === "sending"} 
              className="btn-geometric w-full sm:w-auto"
            >
              {status === "sending" ? t.btn_sending : t.btn_send}
            </button>
            
            {status === "success" && (
              <span className="text-[10px] uppercase tracking-widest text-foreground font-medium animate-pulse">
                {t.msg_success}
              </span>
            )}
            {status === "error" && (
              <span className="text-[10px] uppercase tracking-widest text-red-500 font-medium">
                {t.msg_error}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
