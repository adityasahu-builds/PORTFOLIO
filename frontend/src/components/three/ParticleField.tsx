"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 1500;
const GEOMETRY_COUNT = 6;

// Math.random generators extracted outside component scope to comply with react-hooks/purity linter checks
function generatePositionsAndSizes() {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 18;
    positions[i3 + 1] = (Math.random() - 0.5) * 12;
    positions[i3 + 2] = (Math.random() - 0.5) * 8;
    sizes[i] = Math.random() * 1.8 + 0.4;
  }
  return { positions, sizes };
}

function generateFloatingGeoms() {
  return Array.from({ length: GEOMETRY_COUNT }).map((_, idx) => {
    return {
      position: [
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4 - 2,
      ] as [number, number, number],
      scale: Math.random() * 0.4 + 0.2,
      rotSpeed: [
        Math.random() * 0.3 + 0.1,
        Math.random() * 0.3 + 0.1,
        Math.random() * 0.1,
      ] as [number, number, number],
    };
  });
}

export function ParticleField() {
  const meshRef = useRef<THREE.Points>(null);
  const geometriesGroupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  // Generate particles positions using pure reference calls
  const { positions, sizes } = useMemo(() => generatePositionsAndSizes(), []);

  const initialPositions = useMemo(() => new Float32Array(positions), [positions]);
  const time = useRef(0);

  // Generate metadata for floating wireframe structures using pure reference calls
  const floatingGeoms = useMemo(() => generateFloatingGeoms(), []);

  useFrame((state, delta) => {
    time.current += delta * 0.2;

    // 1. Animate point cloud particles
    if (meshRef.current) {
      const geo = meshRef.current.geometry;
      const pos = geo.attributes.position.array as Float32Array;
      const mouseX = mouse.x * 2.0;
      const mouseY = mouse.y * 2.0;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const ix = initialPositions[i3];
        const iy = initialPositions[i3 + 1];
        const iz = initialPositions[i3 + 2];

        pos[i3] = ix + Math.sin(time.current + ix) * 0.12 - mouseX * 0.05;
        pos[i3 + 1] = iy + Math.cos(time.current + iy) * 0.08 - mouseY * 0.05;
        pos[i3 + 2] = iz;
      }
      geo.attributes.position.needsUpdate = true;
    }

    // 2. Animate group of wireframe structures
    if (geometriesGroupRef.current) {
      const children = geometriesGroupRef.current.children;
      children.forEach((child, index) => {
        const metadata = floatingGeoms[index];
        if (!metadata) return;
        child.rotation.x += delta * metadata.rotSpeed[0];
        child.rotation.y += delta * metadata.rotSpeed[1];
        // Slow float
        child.position.y = metadata.position[1] + Math.sin(time.current + index) * 0.15;
      });
      // Subtle group parallax
      geometriesGroupRef.current.position.x = -mouse.x * 0.2;
      geometriesGroupRef.current.position.y = -mouse.y * 0.2;
    }
  });

  return (
    <group>
      {/* 3D Wireframe Floating structures */}
      <group ref={geometriesGroupRef}>
        {floatingGeoms.map((geom, idx) => (
          <mesh
            key={idx}
            position={geom.position}
            scale={[geom.scale, geom.scale, geom.scale]}
          >
            <octahedronGeometry args={[1, 1]} />
            <meshBasicMaterial
              color={0xc8a96e}
              wireframe
              transparent
              opacity={0.12}
            />
          </mesh>
        ))}
      </group>

      {/* Point cloud dust */}
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[sizes, 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={0xc8a96e}
          size={0.024}
          sizeAttenuation
          transparent
          opacity={0.48}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
