"use client";
import { useEffect } from "react";

const FLOWERS = [
  '<svg width="$SZ" height="$SZ" viewBox="0 0 40 40"><g opacity="$OP"><circle cx="20" cy="20" r="5" fill="#f6d98c"/><g fill="$COL"><ellipse cx="20" cy="9" rx="6" ry="9"/><ellipse cx="31" cy="17" rx="6" ry="9" transform="rotate(72 31 17)"/><ellipse cx="27" cy="30" rx="6" ry="9" transform="rotate(144 27 30)"/><ellipse cx="13" cy="30" rx="6" ry="9" transform="rotate(216 13 30)"/><ellipse cx="9" cy="17" rx="6" ry="9" transform="rotate(288 9 17)"/></g></g></svg>',
  '<svg width="$SZ" height="$HT" viewBox="0 0 20 28"><path d="M10 0 C18 8 18 20 10 28 C2 20 2 8 10 0Z" fill="$COL" opacity="$OP"/></svg>',
  '<svg width="$SZ" height="$SZ" viewBox="0 0 24 24"><g opacity="$OP"><path d="M12 2 C16 7 16 14 12 20 C8 14 8 7 12 2Z" fill="$COL"/><path d="M12 20 L12 24" stroke="#a9b87a" stroke-width="1.4"/></g></svg>',
];
const COLORS = ["#f4b8c4", "#f0a6b6", "#f6c9d3", "#e9c97f", "#f0dba0", "#ead0e6", "#f7d3a8"];

function makeFlower() {
  const el = document.createElement("div");
  el.className = "petal";
  const tpl = FLOWERS[Math.floor(Math.random() * FLOWERS.length)];
  const col = COLORS[Math.floor(Math.random() * COLORS.length)];
  const sz = 12 + Math.random() * 20;
  const op = (0.55 + Math.random() * 0.4).toFixed(2);
  el.innerHTML = tpl
    .split("$SZ").join(String(sz))
    .split("$HT").join(String(sz * 1.35))
    .split("$COL").join(col)
    .split("$OP").join(op);
  el.style.left = Math.random() * 100 + "vw";
  const dur = 7 + Math.random() * 8;
  const drift = (Math.random() - 0.5) * 220;
  const spin = (Math.random() > 0.5 ? 1 : -1) * (300 + Math.random() * 360);
  const sway = 30 + Math.random() * 40;
  el.animate(
    [
      { transform: "translateY(-50px) translateX(0) rotate(0deg)", opacity: 0, offset: 0 },
      { opacity: Number(op), offset: 0.08 },
      { transform: `translateY(${window.innerHeight * 0.5}px) translateX(${sway}px) rotate(${spin * 0.5}deg)`, offset: 0.5 },
      { opacity: Number(op), offset: 0.9 },
      { transform: `translateY(${window.innerHeight + 70}px) translateX(${drift}px) rotate(${spin}deg)`, opacity: 0, offset: 1 },
    ],
    { duration: dur * 1000, easing: "ease-in" },
  );
  document.body.appendChild(el);
  setTimeout(() => el.remove(), dur * 1000 + 100);
}

export function Petals({ active }: { active: boolean }) {
  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (let i = 0; i < 10; i++) setTimeout(makeFlower, Math.random() * 4000);
    const id = setInterval(() => { if (!document.hidden) makeFlower(); }, 650);
    return () => clearInterval(id);
  }, [active]);
  return null;
}
