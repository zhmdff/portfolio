"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, Float, Center } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

const LIGHT_MODEL = "/models/controller_optimized.glb";
const DARK_MODEL = "/models/controller_dark_optimized.glb";
const TARGET_FPS = 30;

function FrameLimiter() {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    const interval = setInterval(() => invalidate(), 1000 / TARGET_FPS);
    return () => clearInterval(interval);
  }, [invalidate]);

  return null;
}

function Controller({ modelPath }: { modelPath: string }) {
  const { scene } = useGLTF(modelPath);

  return (
    <Center>
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6} floatingRange={[-0.05, 0.05]}>
        <primitive object={scene} scale={0.5} rotation={[0.3, -0.8, 0]} />
      </Float>
    </Center>
  );
}

useGLTF.preload(LIGHT_MODEL);
useGLTF.preload(DARK_MODEL);

export default function ControllerModel() {
  const { theme } = useTheme();
  const modelPath = theme === "dark" ? DARK_MODEL : LIGHT_MODEL;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className="controller-canvas-wrapper">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 40 }}
        dpr={[1, 1.5]}
        frameloop={isVisible ? "demand" : "never"}
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: false, alpha: true }}
      >
        {isVisible && <FrameLimiter />}
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#a78bfa" />
          <Controller key={modelPath} modelPath={modelPath} />
        </Suspense>
      </Canvas>
    </div>
  );
}
