"use client";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";

export default function AnimatedBackground() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  
  if (!mounted) return null;

  const isDark = theme === "dark";
  const orbColor1 = isDark ? "rgba(167, 139, 250, 0.15)" : "rgba(167, 139, 250, 0.25)";
  const orbColor2 = isDark ? "rgba(56, 189, 248, 0.12)" : "rgba(56, 189, 248, 0.22)";

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full filter blur-[100px]"
        style={{ background: orbColor1, mixBlendMode: isDark ? "screen" : "multiply" }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[10%] right-[-5%] w-[40vw] h-[40vw] rounded-full filter blur-[100px]"
        style={{ background: orbColor2, mixBlendMode: isDark ? "screen" : "multiply" }}
        animate={{
          x: [0, -40, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>
  );
}
