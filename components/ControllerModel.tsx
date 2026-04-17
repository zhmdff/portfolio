"use client";

import { Canvas } from "@react-three/fiber";
import { useGLTF, Environment, Float, Center } from "@react-three/drei";
import { Suspense } from "react";
import { useTheme } from "@/context/ThemeContext";

const LIGHT_MODEL = "/models/controller.glb";
const DARK_MODEL = "/models/controller_dark.glb";

function Controller({ modelPath }: { modelPath: string }) {
  const { scene } = useGLTF(modelPath);

  return (
    <Center>
      <Float
        speed={2}
        rotationIntensity={0.4}
        floatIntensity={0.6}
        floatingRange={[-0.05, 0.05]}
      >
        <primitive
          object={scene}
          scale={0.5}
          rotation={[0.3, -0.8, 0]}
        />
      </Float>
    </Center>
  );
}

useGLTF.preload(LIGHT_MODEL);
useGLTF.preload(DARK_MODEL);

export default function ControllerModel() {
  const { theme } = useTheme();
  const modelPath = theme === "dark" ? DARK_MODEL : LIGHT_MODEL;

  return (
    <div className="controller-canvas-wrapper">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 40 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#a78bfa" />
          <Controller key={modelPath} modelPath={modelPath} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
