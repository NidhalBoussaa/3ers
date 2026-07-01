"use client";
import { useEffect, useRef } from "react";

type Particle = {
  x: number; y: number; r: number;
  vx: number; vy: number; a: number; tw: number;
};

export function DustCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const x = c.getContext("2d");
    if (!x) return;

    let parts: Particle[] = [];
    let raf = 0;

    function size() {
      c!.width = window.innerWidth;
      c!.height = window.innerHeight;
    }
    function make() {
      const n = Math.min(70, Math.floor(window.innerWidth / 12));
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * c!.width,
        y: Math.random() * c!.height,
        r: Math.random() * 1.6 + 0.3,
        vy: Math.random() * 0.25 + 0.05,
        vx: (Math.random() - 0.5) * 0.2,
        a: Math.random() * 0.5 + 0.2,
        tw: Math.random() * Math.PI * 2,
      }));
    }
    function loop() {
      x!.clearRect(0, 0, c!.width, c!.height);
      for (const p of parts) {
        p.y += p.vy; p.x += p.vx; p.tw += 0.02;
        if (p.y > c!.height + 5) { p.y = -5; p.x = Math.random() * c!.width; }
        if (p.x < -5) p.x = c!.width;
        if (p.x > c!.width + 5) p.x = 0;
        const tw = (Math.sin(p.tw) + 1) / 2;
        x!.beginPath();
        x!.arc(p.x, p.y, p.r, 0, 7);
        x!.fillStyle = `rgba(220,180,90,${p.a * tw * 0.7})`;
        x!.shadowBlur = 6;
        x!.shadowColor = "rgba(231,200,120,.6)";
        x!.fill();
      }
      raf = requestAnimationFrame(loop);
    }
    size(); make(); loop();
    const onResize = () => { size(); make(); };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 z-[1] pointer-events-none"
    />
  );
}
