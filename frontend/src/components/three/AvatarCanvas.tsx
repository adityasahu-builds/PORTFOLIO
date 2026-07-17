"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, useGLTF, Html, Center, useTexture } from "@react-three/drei";
import * as THREE from "three";

// ─── React Error Boundary for Image texture ────────────────
interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ImageErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn("Failed to load dynamic avatar-cutout.png texture: ", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// ─── Image Cutout Renderer ────────────────────────────────
function ImageRenderer() {
  const texture = useTexture("/avatar-cutout.png");

  // Keep the texture extremely crisp and sharp like an SVG
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  return (
    // Reverted plane geometry args to [1.97, 3.5] (9:16 aspect ratio)
    <mesh position={[0, 0.45, 0]}>
      <planeGeometry args={[1.97, 3.5]} />
      <meshBasicMaterial map={texture} transparent={true} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ─── 3D Model Renderer (Fallback Custom Model) ─────────────
function ModelRenderer() {
  const gltf = useGLTF("/models/avatar.gltf");
  return (
    <Center>
      <primitive 
        object={gltf.scene} 
        scale={1.35} 
        position={[0, -0.4, 0]}
      />
    </Center>
  );
}

// ─── Suspense Loading Indicator ──────────────────────────
function LoadingRenderer() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        {/* Loading Spinner */}
        <div className="w-8 h-8 rounded-full border-2 border-blue-500/20 border-t-blue-400 animate-spin mb-3" />
        <span className="text-[0.65rem] tracking-[0.2em] uppercase text-blue-300/60 font-semibold font-mono">
          Loading...
        </span>
      </div>
    </Html>
  );
}

// ─── Platform pedestal fallback ──────────────────────────
function PlatformPedestal() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.15;
    }
  });

  return (
    <group position={[0, -1.3, 0]}>
      {/* Pedestal Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <cylinderGeometry args={[1.3, 1.35, 0.1, 32]} />
        <meshPhysicalMaterial color="#0c0c16" roughness={0.12} metalness={0.9} />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <cylinderGeometry args={[1.15, 1.2, 0.1, 32]} />
        <meshPhysicalMaterial color="#07070f" roughness={0.08} metalness={0.9} clearcoat={0.9} />
      </mesh>

      {/* Concentric Neon Rings */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.11, 0]}>
        <ringGeometry args={[1.17, 1.19, 64]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[1.26, 1.28, 64]} />
        <meshBasicMaterial color="#0066ff" transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* Spotlight reflect */}
      <pointLight position={[0, 0.25, 0]} intensity={4.5} distance={3.5} color="#00ffff" />

      {/* Left glowing crystal */}
      <group position={[-1.5, 0.05, 0.3]} rotation={[0.2, 0.4, -0.1]}>
        <mesh>
          <octahedronGeometry args={[0.16, 0]} />
          <meshPhysicalMaterial color="#00d2ff" roughness={0.1} transmission={0.9} thickness={0.5} emissive="#00a2ff" emissiveIntensity={1.5} />
        </mesh>
        <mesh scale={[1.08, 1.08, 1.08]}>
          <octahedronGeometry args={[0.16, 0]} />
          <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Right glowing crystal */}
      <group position={[1.5, 0.05, -0.3]} rotation={[-0.3, -0.2, 0.1]}>
        <mesh>
          <octahedronGeometry args={[0.16, 0]} />
          <meshPhysicalMaterial color="#00d2ff" roughness={0.1} transmission={0.9} thickness={0.5} emissive="#00a2ff" emissiveIntensity={1.5} />
        </mesh>
        <mesh scale={[1.08, 1.08, 1.08]}>
          <octahedronGeometry args={[0.16, 0]} />
          <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.8} />
        </mesh>
      </group>
    </group>
  );
}

// ─── Main Canvas component holding lights, camera and floats ───
export function AvatarCanvas() {
  return (
    <div className="w-full h-full min-h-[420px] pointer-events-auto" style={{ zIndex: 10 }}>
      <Canvas
        camera={{ position: [0, 0.3, 5.5], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 3, 4]} intensity={2.0} color="#00a2ff" />
        <pointLight position={[-1, 2, -3]} intensity={5.0} distance={10} color="#0055ff" />
        <spotLight 
          position={[0, 5, 2]} 
          intensity={3.0} 
          angle={0.6} 
          penumbra={1} 
          color="#00ffff" 
        />

        {/* Floating Animation Wrapper */}
        <Float 
          speed={2} 
          rotationIntensity={0.08} 
          floatIntensity={0.4} 
          floatingRange={[-0.06, 0.06]}
        >
          {/* Reverted Torus Halo back to radius = 1.35 and aligned at position [0, 0, -1.2] */}
          <mesh position={[0, 0, -1.2]}>
            <torusGeometry args={[1.35, 0.012, 16, 100]} />
            <meshBasicMaterial color="#00d2ff" transparent opacity={0.85} />
          </mesh>
          <mesh position={[0, 0, -1.2]} scale={[1.03, 1.03, 1.03]}>
            <torusGeometry args={[1.35, 0.012, 16, 100]} />
            <meshBasicMaterial color="#0055ff" transparent opacity={0.4} />
          </mesh>

          {/* Reverted Pedestal Platform to default scale (removed wrapping scaled group) */}
          <PlatformPedestal />

          {/* Error Boundary wrapping the dynamic model load */}
          <ImageErrorBoundary
            fallback={
              <group>
                {/* 3D custom model dynamic load */}
                <React.Suspense fallback={<LoadingRenderer />}>
                  <ModelRenderer />
                </React.Suspense>
              </group>
            }
          >
            <React.Suspense fallback={<LoadingRenderer />}>
              <ImageRenderer />
            </React.Suspense>
          </ImageErrorBoundary>
        </Float>
      </Canvas>
    </div>
  );
}
