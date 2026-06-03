"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 200, mouseRef }: { count: number, mouseRef: React.MutableRefObject<any> }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { viewport } = useThree();

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      
      // Add physics offsets and velocities
      temp.push({ 
        t, factor, speed, xFactor, yFactor, zFactor,
        dx: 0, dy: 0, dz: 0,
        vx: 0, vy: 0, vz: 0
      });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!mesh.current) return;

    // Decay the click pulse over time
    if (mouseRef.current.clickPulse > 0) {
      mouseRef.current.clickPulse *= 0.9;
      if (mouseRef.current.clickPulse < 0.01) mouseRef.current.clickPulse = 0;
    }

    // Map normalized mouse coords to 3D world coords based on viewport
    const targetX = (mouseRef.current.x * viewport.width) / 2;
    const targetY = (mouseRef.current.y * viewport.height) / 2;
    const targetZ = 0;

    particles.forEach((particle, i) => {
      let { t } = particle;
      const { factor, speed, xFactor, yFactor, zFactor } = particle;
      
      // Update base drifting time
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      
      // Base positions (drifting)
      const baseX = xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10;
      const baseY = yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10;
      const baseZ = zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10;

      // Current actual position
      const currX = baseX + particle.dx;
      const currY = baseY + particle.dy;
      const currZ = baseZ + particle.dz;

      // Distance to mouse
      const distX = currX - targetX;
      const distY = currY - targetY;
      const distZ = currZ - targetZ;
      const distSq = distX * distX + distY * distY + distZ * distZ;
      const dist = Math.sqrt(distSq) || 0.1;

      // 1. Scatter on Click (Repulsion)
      if (mouseRef.current.clickPulse > 0) {
        // Strong outward force that drops off with distance
        const force = (100 / (distSq + 50)) * mouseRef.current.clickPulse * 15;
        particle.vx += (distX / dist) * force;
        particle.vy += (distY / dist) * force;
        particle.vz += (distZ / dist) * force;
      }

      // 2. Attract on Drag
      if (mouseRef.current.down) {
        // Pull particles toward the mouse
        const force = 5.0 / (dist + 20);
        particle.vx -= (distX / dist) * force;
        particle.vy -= (distY / dist) * force;
        particle.vz -= (distZ / dist) * force;
      }

      // 3. Spring force to return to base positions
      particle.vx -= particle.dx * 0.02;
      particle.vy -= particle.dy * 0.02;
      particle.vz -= particle.dz * 0.02;

      // 4. Apply friction
      particle.vx *= 0.90;
      particle.vy *= 0.90;
      particle.vz *= 0.90;

      // Update offsets
      particle.dx += particle.vx;
      particle.dy += particle.vy;
      particle.dz += particle.vz;

      // Apply to Three.js matrix
      const s = Math.cos(t);
      dummy.position.set(baseX + particle.dx, baseY + particle.dy, baseZ + particle.dz);
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      
      mesh.current?.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  useEffect(() => {
    if (!mesh.current) return;
    const colors = [
      new THREE.Color("#ef4444"), // Red
      new THREE.Color("#22c55e"), // Green
      new THREE.Color("#eab308")  // Yellow
    ];
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      mesh.current.setColorAt(i, color);
    }
    if (mesh.current.instanceColor) {
      mesh.current.instanceColor.needsUpdate = true;
    }
  }, [count]);

  return (
    <instancedMesh ref={mesh} args={[undefined as any, undefined as any, count]}>
      <sphereGeometry args={[0.25, 16, 16]} />
      <meshBasicMaterial transparent opacity={0.8} />
    </instancedMesh>
  );
}

export function ParticleNetwork() {
  const mouseRef = useRef({ x: 0, y: 0, down: false, clickPulse: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    
    const handleMouseDown = () => {
      mouseRef.current.down = true;
    };
    
    const handleMouseUp = () => {
      mouseRef.current.down = false;
      mouseRef.current.clickPulse = 1.0; // Trigger the scatter shockwave
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] bg-soc-background overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      <Canvas camera={{ position: [0, 0, 100], fov: 75 }}>
        <Particles count={250} mouseRef={mouseRef} />
      </Canvas>
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-soc-background/80 to-soc-background"></div>
    </div>
  );
}
