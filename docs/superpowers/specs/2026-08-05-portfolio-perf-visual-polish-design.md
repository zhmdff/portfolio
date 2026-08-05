# Portfolio Perf + Visual Polish

## Goal
Improve runtime performance and tighten visual polish of the existing Next.js portfolio without changing its structure, content, or aesthetic direction (dark/glass minimal look stays).

## Scope
In scope: `ControllerModel.tsx`, `InteractiveGrid.tsx`, section reveal animations (`app/globals.css` `.animate-fade-in` usage across `app/page.tsx`, `Showcase.tsx`, `TechArsenal.tsx`, `ContactForm.tsx`), transition-timing consistency in `ProjectCard.tsx` / `TechArsenal.tsx` / `globals.css` button classes, `next.config.ts`.

Out of scope: new sections/content, color palette or layout restructuring, i18n/translation content, backend/contact form logic.

## Changes

### 1. 3D controller canvas (`components/ControllerModel.tsx`)
- Cap device pixel ratio on the `<Canvas>` (`dpr={[1, 1.5]}`) instead of the current uncapped default, so retina/high-DPI displays don't render at full native resolution for no visible gain.
- Drop the `Environment preset="city"` HDRI fetch. It downloads an external environment map purely for reflections on a stylized controller model; replace with the existing manual `ambientLight`/`directionalLight` setup already present (just remove the `Environment` element — lights stay).
- Leave `Float`'s continuous animation loop as-is; it's the intended idle motion, not a bug.

### 2. Interactive grid mouse tracking (`components/InteractiveGrid.tsx`)
- Wrap the `mousemove` handler's CSS variable writes in `requestAnimationFrame`, coalescing rapid-fire events (high-poll-rate mice/trackpads) into one style write per frame instead of one per event.

### 3. Scroll-triggered reveals (replaces load-triggered `.animate-fade-in`)
- Add a small reusable client component/hook (`components/RevealOnScroll.tsx`) using `IntersectionObserver` (`threshold: 0.1`, fire once) that applies the existing `fadeIn` keyframe animation when an element enters the viewport, instead of on mount.
- Replace `animate-fade-in` + inline `animationDelay` usages in `app/page.tsx`, `Showcase.tsx`, `TechArsenal.tsx` (and `ContactForm.tsx` if it uses the class) with this component wrapping each section/card.
- Keep the same `fadeIn` keyframe/timing (`1s cubic-bezier(0.16, 1, 0.3, 1)`) — only the trigger changes (viewport entry vs. mount), so visual character is unchanged, just no longer wastes work animating off-screen content (e.g. footer animating before scroll) and reads better as a scroll-reveal.
- `ProjectCard` per-item stagger delay (`idx * 0.1s`) is preserved within the observer callback.

### 4. Transition-timing consistency
- Audit hover/transition `duration-*` values in `ProjectCard.tsx`, `TechArsenal.tsx`, and `.btn-geometric`/`.nav-link`/`.glass-panel` in `globals.css`. Standardize to a small set of durations (fast: 300ms for color/opacity, slow: 500ms for transform/layout shifts) rather than the current mix of 300/500/700ms across similar interactions.
- No new visual effects added — this is a consistency cleanup so hover states feel uniform.

### 5. `next.config.ts`
- Add `experimental.optimizePackageImports: ["three", "@react-three/drei"]` (or the current Next 16 equivalent flag) to reduce bundled import surface from these libraries if Next's default doesn't already tree-shake them fully.
- No other config changes — image formats/compression already default-optimized by Next 16.

## Testing
- Manual: `npm run dev`, verify hero 3D model renders correctly in both light/dark theme (no `Environment` regression in lighting look), verify scroll-reveal fires once per section/card and matches prior fade timing, verify grid still tracks mouse smoothly.
- `npm run build` to confirm no type/build errors from the `next.config.ts` and component changes.
- No automated test suite exists in this repo currently; this stays manual-only.

## Risks
- Removing `Environment preset="city"` changes reflections/lighting slightly on the controller model — mitigated by keeping existing directional/ambient lights, verify visually before/after.
- `optimizePackageImports` flag name may differ between Next versions; verify against installed Next 16.1.6 config schema before adding (drop it if unsupported rather than guessing).
