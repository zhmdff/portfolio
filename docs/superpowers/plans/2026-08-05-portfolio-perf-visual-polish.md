# Portfolio Perf + Visual Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce runtime cost of the 3D hero canvas and mouse-tracked grid, replace load-triggered section animations with viewport-triggered reveals, and standardize hover-transition timings — all without changing the site's structure, content, or dark/glass aesthetic.

**Architecture:** Small, targeted edits to existing client components (`ControllerModel`, `InteractiveGrid`), one new reusable component (`RevealOnScroll`) built on `IntersectionObserver`, a CSS/JSX consistency pass on transition durations, and one `next.config.ts` addition.

**Tech Stack:** Next.js 16.1.6 (App Router), React 19, `@react-three/fiber` 9 / `@react-three/drei` 10 / `three` 0.184, Tailwind CSS v4, no test runner installed in this repo — verification is manual (`npm run dev` + `npm run build`).

## Global Constraints

- No automated test suite exists; every task's "test" step is `npm run build` (must succeed with no type errors) plus a manual visual check described in the step — do not invent a test framework.
- Keep the existing dark/glass minimal aesthetic — no new colors, layouts, or content.
- Keep the existing `fadeIn` keyframe timing (`1s cubic-bezier(0.16, 1, 0.3, 1)`) — only its trigger changes.
- Scope is limited to: `components/ControllerModel.tsx`, `components/InteractiveGrid.tsx`, `app/page.tsx`, `components/Showcase.tsx`, `components/ProjectCard.tsx`, `components/TechArsenal.tsx`, `app/globals.css`, `next.config.ts`, and one new file `components/RevealOnScroll.tsx`. Do not touch `app/projects/page.tsx`, `ContactForm.tsx` internals, translations, or i18n.

---

### Task 1: Cap DPR and drop HDRI Environment in ControllerModel

**Files:**
- Modify: `components/ControllerModel.tsx`

**Interfaces:**
- No exported signatures change. `ControllerModel` remains a default-export React component with no props.

- [ ] **Step 1: Read current file to confirm line numbers**

Current relevant block (`components/ControllerModel.tsx:1-43`):
```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { useGLTF, Environment, Float, Center } from "@react-three/drei";
import { Suspense } from "react";
import { useTheme } from "@/context/ThemeContext";
```
and
```tsx
      <Canvas camera={{ position: [0, 0, 12], fov: 40 }} style={{ width: "100%", height: "100%" }} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#a78bfa" />
          <Controller key={modelPath} modelPath={modelPath} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
```

- [ ] **Step 2: Remove the `Environment` import and element, add `dpr` cap to `Canvas`**

Edit the import line to drop `Environment`:
```tsx
import { useGLTF, Float, Center } from "@react-three/drei";
```

Edit the `Canvas` element to add `dpr` and remove the `<Environment preset="city" />` line:
```tsx
      <Canvas
        camera={{ position: [0, 0, 12], fov: 40 }}
        dpr={[1, 1.5]}
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#a78bfa" />
          <Controller key={modelPath} modelPath={modelPath} />
        </Suspense>
      </Canvas>
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: build succeeds, no TypeScript/ESLint errors about unused `Environment` import.

- [ ] **Step 4: Manual visual check**

Run: `npm run dev`, open `http://localhost:3000`.
Confirm: controller model still renders and rotates/floats in the hero, in both light and dark theme (toggle via `ThemeToggle`). Lighting will look slightly flatter without the HDRI reflections — this is expected and acceptable per the design spec.

- [ ] **Step 5: Commit**

```bash
git add components/ControllerModel.tsx
git commit -m "perf: cap canvas dpr and drop HDRI environment on controller model"
```

---

### Task 2: Throttle InteractiveGrid mousemove with requestAnimationFrame

**Files:**
- Modify: `components/InteractiveGrid.tsx`

**Interfaces:**
- No exported signatures change. `InteractiveGrid` remains a default-export React component with no props.

- [ ] **Step 1: Replace the effect body**

Current (`components/InteractiveGrid.tsx:8-20`):
```tsx
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      container.style.setProperty("--mouse-x", `${clientX}px`);
      container.style.setProperty("--mouse-y", `${clientY}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
```

Replace with:
```tsx
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId = 0;
    let pendingX = 0;
    let pendingY = 0;

    const applyMousePosition = () => {
      container.style.setProperty("--mouse-x", `${pendingX}px`);
      container.style.setProperty("--mouse-y", `${pendingY}px`);
      rafId = 0;
    };

    const handleMouseMove = (e: MouseEvent) => {
      pendingX = e.clientX;
      pendingY = e.clientY;
      if (!rafId) {
        rafId = requestAnimationFrame(applyMousePosition);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Manual visual check**

Run: `npm run dev`, move mouse rapidly over the page.
Confirm: the radial highlight on the grid still follows the cursor smoothly, with no visible lag introduced.

- [ ] **Step 4: Commit**

```bash
git add components/InteractiveGrid.tsx
git commit -m "perf: throttle grid mousemove tracking with requestAnimationFrame"
```

---

### Task 3: Create RevealOnScroll component

**Files:**
- Create: `components/RevealOnScroll.tsx`

**Interfaces:**
- Produces: `export default function RevealOnScroll(props: { children: React.ReactNode; delay?: number; className?: string; as?: keyof JSX.IntrinsicElements }): JSX.Element`
  - `delay` is in seconds, applied as `animationDelay` (default `0`).
  - `className` is merged with the internal reveal classes (default `""`).
  - `as` picks the wrapper tag (default `"div"`), so it can wrap a `<section>` or `<div>` as needed by call sites.
  - Applies the existing `fadeIn` keyframe (class name `animate-fade-in`, already defined in `app/globals.css:100-102`) only once the element scrolls into view, instead of on mount.

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
}

export default function RevealOnScroll({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`${isVisible ? "animate-fade-in" : "opacity-0"} ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </Tag>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds, no type errors on the `ElementType`/ref typing.

- [ ] **Step 3: Commit**

```bash
git add components/RevealOnScroll.tsx
git commit -m "feat: add RevealOnScroll component for viewport-triggered fade-in"
```

---

### Task 4: Apply RevealOnScroll in app/page.tsx

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `RevealOnScroll` from Task 3 (`components/RevealOnScroll.tsx`), props `{ children, delay?, className?, as? }`.

- [ ] **Step 1: Import RevealOnScroll**

Add near the other component imports in `app/page.tsx`:
```tsx
import RevealOnScroll from "@/components/RevealOnScroll";
```

- [ ] **Step 2: Replace the nav's `animate-fade-in` usage**

Current (`app/page.tsx:28`):
```tsx
      <nav className="sticky top-0 z-50 w-full bg-background/60 backdrop-blur-xl border-b border-foreground/5 animate-fade-in">
```
The nav is above the fold on load, so it should keep firing immediately rather than waiting for scroll — leave this one as-is (do not wrap in `RevealOnScroll`). Skip to Step 3.

- [ ] **Step 3: Wrap the hero header in RevealOnScroll**

Current (`app/page.tsx:51`):
```tsx
        <header className="py-24 sm:py-32 animate-fade-in" style={{ animationDelay: "0.1s" }}>
```
Replace with:
```tsx
        <RevealOnScroll as="header" className="py-24 sm:py-32" delay={0.1}>
```
And change its matching closing tag from `</header>` to `</RevealOnScroll>`.

- [ ] **Step 4: Wrap the Tech Arsenal panel**

Current (`app/page.tsx:85`):
```tsx
        <div className="glass-panel mb-24 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <TechArsenal />
        </div>
```
Replace with:
```tsx
        <RevealOnScroll className="glass-panel mb-24" delay={0.2}>
          <TechArsenal />
        </RevealOnScroll>
```

- [ ] **Step 5: Wrap the Contact panel**

Current (`app/page.tsx:93`):
```tsx
        <div id="contact" className="glass-panel mb-24 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <ContactForm />
        </div>
```
Replace with:
```tsx
        <RevealOnScroll as="div" className="glass-panel mb-24" delay={0.6}>
          <div id="contact">
            <ContactForm />
          </div>
        </RevealOnScroll>
```
(The `id="contact"` is preserved on an inner `div` so the `#contact` anchor link in the hero still scrolls to the right place.)

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 7: Manual visual check**

Run: `npm run dev`. Reload the page at the top — hero, tech arsenal, and contact sections should NOT all animate immediately; scroll down and confirm each section fades in as it enters the viewport, once only (scrolling back up and down again should not re-trigger the fade).

- [ ] **Step 8: Commit**

```bash
git add app/page.tsx
git commit -m "feat: reveal hero/tech/contact sections on scroll instead of on mount"
```

---

### Task 5: Apply RevealOnScroll in Showcase.tsx

**Files:**
- Modify: `components/Showcase.tsx`

**Interfaces:**
- Consumes: `RevealOnScroll` from Task 3.

- [ ] **Step 1: Import RevealOnScroll**

Add to `components/Showcase.tsx` imports:
```tsx
import RevealOnScroll from "@/components/RevealOnScroll";
```

- [ ] **Step 2: Replace the section wrapper**

Current (`components/Showcase.tsx:20`):
```tsx
    <section id="projects" className="py-24 space-y-16 animate-fade-in">
```
Replace with:
```tsx
    <RevealOnScroll as="section" className="py-24 space-y-16" id="projects">
```
Note: `id` is a standard DOM attribute passed through via `{...rest}`-style props — since `RevealOnScroll` as written in Task 3 does not spread extra props, add `id` support now: update `RevealOnScrollProps` in `components/RevealOnScroll.tsx` to include `id?: string` and pass it to `<Tag id={id} ...>`. Do this edit as part of this step:

In `components/RevealOnScroll.tsx`, update the interface:
```tsx
interface RevealOnScrollProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
  id?: string;
}
```
Update the function signature:
```tsx
export default function RevealOnScroll({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
  id,
}: RevealOnScrollProps) {
```
Update the rendered tag:
```tsx
    <Tag
      ref={ref}
      id={id}
      className={`${isVisible ? "animate-fade-in" : "opacity-0"} ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
```

Also update the closing tag in `components/Showcase.tsx` from `</section>` to `</RevealOnScroll>`.

- [ ] **Step 3: Replace per-card fade wrapper**

Current (`components/Showcase.tsx:37-45`):
```tsx
        {showcasedProjects.map((project, idx) => (
          <div 
            key={project.id} 
            className="animate-fade-in" 
            style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
          >
            <ProjectCard project={project} />
          </div>
        ))}
```
Replace with:
```tsx
        {showcasedProjects.map((project, idx) => (
          <RevealOnScroll key={project.id} delay={0.1 + idx * 0.1}>
            <ProjectCard project={project} />
          </RevealOnScroll>
        ))}
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Manual visual check**

Run: `npm run dev`, navigate to the homepage, scroll to the projects section.
Confirm: the "Projects" heading/section and each project card fade in with the existing stagger as they enter the viewport, only once.

- [ ] **Step 6: Commit**

```bash
git add components/Showcase.tsx components/RevealOnScroll.tsx
git commit -m "feat: reveal projects section and cards on scroll"
```

---

### Task 6: Standardize transition durations

**Files:**
- Modify: `components/ProjectCard.tsx`
- Modify: `components/TechArsenal.tsx`
- Modify: `app/globals.css`

**Interfaces:** None (pure className/duration value edits, no signature changes).

Rule applied: `duration-300` for color/opacity/border-color changes (fast feedback), `duration-500` for transform/layout-affecting changes (translate, scale, inset). No `duration-700` remains after this task — `700` is replaced by `500` since those cases are transform/layout-class changes.

- [ ] **Step 1: Edit `components/ProjectCard.tsx`**

Current (`components/ProjectCard.tsx:32-33`):
```tsx
      <div className="relative aspect-video overflow-hidden border border-border group-hover:border-foreground/20 transition-colors duration-500">
        <div className="absolute inset-0 sm:inset-[2.5%] group-hover:inset-0 transition-all duration-700 ease-out overflow-hidden">
```
Replace with:
```tsx
      <div className="relative aspect-video overflow-hidden border border-border group-hover:border-foreground/20 transition-colors duration-300">
        <div className="absolute inset-0 sm:inset-[2.5%] group-hover:inset-0 transition-all duration-500 ease-out overflow-hidden">
```

Current (`components/ProjectCard.tsx:41`):
```tsx
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none" />
```
Replace with:
```tsx
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
```

Lines 46 and 53 (`transition-transform duration-500` and `transition-all duration-500`) already match the "transform → 500ms" rule — leave unchanged.

- [ ] **Step 2: Edit `components/TechArsenal.tsx`**

Current (`components/TechArsenal.tsx:36-37`):
```tsx
          <div key={item.name} className="group relative px-6 py-3 border border-foreground/10 hover:border-foreground/30 transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500" style={{ backgroundColor: `#${item.color}` }} />
```
Replace with:
```tsx
          <div key={item.name} className="group relative px-6 py-3 border border-foreground/10 hover:border-foreground/30 transition-colors duration-300 overflow-hidden">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300" style={{ backgroundColor: `#${item.color}` }} />
```
(The outer div's hover effect is a border-color change only, so `transition-all` → `transition-colors` at `duration-300` matches the fast-feedback rule; the inner overlay is an opacity change, also `duration-300`.)

- [ ] **Step 3: Edit `app/globals.css`**

Current (`app/globals.css:48-53`):
```css
  .glass-panel {
    @apply border border-foreground/5 p-8 sm:p-12 transition-all duration-500;
    background: var(--section-bg);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
```
This panel has no interactive hover state changing its own properties (no `hover:` classes attached to `.glass-panel` itself in current usage) — leave `duration-500` as-is; it's a static utility class, not part of the hover-consistency audit. No change needed here.

Current (`app/globals.css:55-59`):
```css
  .btn-geometric {
    @apply relative px-8 py-4 border border-foreground/30 hover:border-foreground uppercase tracking-[0.2em] text-[10px] transition-all duration-300 overflow-hidden;
    background: transparent;
    color: var(--foreground);
  }
```
Already `duration-300` for a color-only hover — matches the rule, no change.

Current (`app/globals.css:69-76`):
```css
  .nav-link {
    @apply relative text-sm uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity;
  }

  .nav-link::after {
    content: '';
    @apply absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-300;
  }
```
`.nav-link` itself has no explicit duration (Tailwind's `transition-opacity` default is 150ms) — bring it in line with the fast-feedback rule:
```css
  .nav-link {
    @apply relative text-sm uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity duration-300;
  }
```
`.nav-link::after` is a `width` transform-like change (layout), already `duration-300` via `transition-all` — per the rule this should be `duration-500` since width is layout-affecting:
```css
  .nav-link::after {
    content: '';
    @apply absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-500;
  }
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Manual visual check**

Run: `npm run dev`. Hover over project cards, tech-stack chips, nav links, and the primary CTA button.
Confirm: hover feedback feels uniform in speed (fast for color/opacity, slightly slower for movement) and no interaction feels newly sluggish or newly abrupt compared to before.

- [ ] **Step 6: Commit**

```bash
git add components/ProjectCard.tsx components/TechArsenal.tsx app/globals.css
git commit -m "style: standardize hover transition durations across cards, chips, and nav"
```

---

### Task 7: Add optimizePackageImports for three/drei

**Files:**
- Modify: `next.config.ts`

**Interfaces:** None (config-only change).

- [ ] **Step 1: Check installed Next.js version supports the flag**

Run: `npm ls next` (or check `package.json`) — confirm `next` is `16.1.6`. Next.js's `experimental.optimizePackageImports` has been available since Next 13.5 and remains under `experimental` in Next 16, so it applies here.

- [ ] **Step 2: Edit `next.config.ts`**

Current (`next.config.ts:1-7`):
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```
Replace with:
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["three", "@react-three/drei"],
  },
};

export default nextConfig;
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: build succeeds with no warning about an unrecognized config key. If Next.js logs a warning that `optimizePackageImports` doesn't apply cleanly to `three` (a CJS/mixed package), remove `"three"` from the array and keep only `"@react-three/drei"`.

- [ ] **Step 4: Manual visual check**

Run: `npm run dev`, confirm the homepage and `/projects` page still load and render the 3D controller model correctly (this flag only affects tree-shaking of named imports, not runtime behavior, so no visual difference is expected — this is a smoke check).

- [ ] **Step 5: Commit**

```bash
git add next.config.ts
git commit -m "perf: enable optimizePackageImports for three/drei"
```

---

## Final Verification

- [ ] Run `npm run build` once more at the end to confirm the full sequence of changes builds cleanly together.
- [ ] Run `npm run dev`, click through: homepage scroll (reveal animations), theme toggle (controller relighting), `/projects` page (unaffected, sanity check), contact form `#contact` anchor link from the hero CTA.
