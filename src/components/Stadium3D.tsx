/**
 * Stadium3D.tsx
 * Low-poly 3D cricket stadium — React Three Fiber v8 + React 18 compatible.
 * Cinematic auto-rotating camera, floodlights, crowd sparkles, boundary rope.
 */

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Sparkles, Float } from "@react-three/drei";
import * as THREE from "three";

interface Stadium3DProps {
  teamColor?: string;
  teamGlow?: string;
  height?: string;
}

// ─── Pitch (centre strip) ────────────────────────────────────────────────────
function Pitch() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
      <planeGeometry args={[0.85, 5.2]} />
      <meshStandardMaterial color="#c8a870" roughness={0.9} />
    </mesh>
  );
}

// ─── Outfield (ground) ────────────────────────────────────────────────────────
function Outfield() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <circleGeometry args={[13, 72]} />
      <meshStandardMaterial color="#1d4a1d" roughness={1} metalness={0} />
    </mesh>
  );
}

// ─── Boundary rope ─────────────────────────────────────────────────────────────
function BoundaryRope({ color }: { color: string }) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * 11, 0.06, Math.sin(a) * 11));
    }
    return pts;
  }, []);

  const tubeGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points, true);
    return new THREE.TubeGeometry(curve, 128, 0.055, 8, true);
  }, [points]);

  return (
    <mesh geometry={tubeGeo}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.7}
        roughness={0.2}
        metalness={0.5}
      />
    </mesh>
  );
}

// ─── Stand tier ───────────────────────────────────────────────────────────────
function Stand({ angle, color, idx }: { angle: number; color: string; idx: number }) {
  const x = Math.cos(angle) * 14.5;
  const z = Math.sin(angle) * 14.5;

  return (
    <group position={[x, 0, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
      {/* 4 rows of seating */}
      {[0, 1, 2, 3].map((row) => (
        <mesh key={row} position={[0, row * 0.55 + 0.28, -row * 0.55]} castShadow>
          <boxGeometry args={[5.2, 0.48, 1.1]} />
          <meshStandardMaterial
            color={row % 2 === 0 ? "#111127" : "#15152f"}
            roughness={0.8}
            emissive={idx % 4 === 0 ? color : "#000000"}
            emissiveIntensity={idx % 4 === 0 ? 0.04 : 0}
          />
        </mesh>
      ))}
      {/* Floodlight tower */}
      <mesh position={[0, 4.8, -2.6]} castShadow>
        <cylinderGeometry args={[0.07, 0.11, 6.5, 8]} />
        <meshStandardMaterial color="#999999" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Floodlight head */}
      <mesh position={[0, 8.2, -2.6]}>
        <boxGeometry args={[1.4, 0.18, 0.55]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// ─── Wickets ──────────────────────────────────────────────────────────────────
function Wickets({ end }: { end: number }) {
  return (
    <group position={[0, 0, end * 2.55]}>
      {[-0.115, 0, 0.115].map((x, i) => (
        <mesh key={i} position={[x, 0.38, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 0.76, 8]} />
          <meshStandardMaterial color="#ede8d8" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Cinematic camera ─────────────────────────────────────────────────────────
function CinematicCamera() {
  const t = useRef(0);
  useFrame((state) => {
    t.current += 0.0025;
    const r = 22;
    state.camera.position.set(
      Math.cos(t.current) * r,
      9 + Math.sin(t.current * 0.4) * 2.5,
      Math.sin(t.current) * r
    );
    state.camera.lookAt(0, 1, 0);
  });
  return null;
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function StadiumScene({ teamColor }: { teamColor: string }) {
  const standAngles = useMemo(
    () => Array.from({ length: 18 }, (_, i) => (i / 18) * Math.PI * 2),
    []
  );

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[8, 18, 8]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* 4 Floodlights with team color */}
      {[0, 1, 2, 3].map((i) => (
        <pointLight
          key={i}
          position={[
            Math.cos((i / 4) * Math.PI * 2) * 14,
            8.5,
            Math.sin((i / 4) * Math.PI * 2) * 14,
          ]}
          intensity={60}
          distance={35}
          color={teamColor}
          decay={2}
        />
      ))}
      {/* Centre fill */}
      <pointLight position={[0, 6, 0]} intensity={30} distance={20} color="#ffffff" decay={2} />

      {/* Stars background */}
      <Stars radius={70} depth={50} count={4000} factor={3} fade speed={0.4} />

      {/* Crowd sparkle effect */}
      <Sparkles
        count={220}
        scale={[26, 7, 26]}
        position={[0, 3, 0]}
        size={2}
        speed={0.15}
        color={teamColor}
        opacity={0.55}
      />

      {/* Ground */}
      <Outfield />
      <Pitch />
      <BoundaryRope color={teamColor} />

      {/* Wickets */}
      <Wickets end={1} />
      <Wickets end={-1} />

      {/* Stadium stands */}
      {standAngles.map((angle, i) => (
        <Stand key={i} angle={angle} color={teamColor} idx={i} />
      ))}

      {/* Cinematic rotating camera */}
      <CinematicCamera />
    </>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function Stadium3D({
  teamColor = "#FFD700",
  teamGlow = "rgba(255,215,0,0.4)",
  height = "100%",
}: Stadium3DProps) {
  return (
    <div style={{ width: "100%", height, position: "absolute", inset: 0 }}>
      <Canvas
        shadows
        camera={{ position: [22, 10, 0], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <StadiumScene teamColor={teamColor} />
        </Suspense>
      </Canvas>
    </div>
  );
}
