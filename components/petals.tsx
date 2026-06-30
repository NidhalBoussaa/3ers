"use client";
import { useEffect } from "react";

const FLOWERS = [
  // 5-petal blossom with a soft gold-cream centre
  '<svg width="$SZ" height="$SZ" viewBox="0 0 40 40"><g opacity="$OP"><circle cx="20" cy="20" r="4.5" fill="#efdcab"/><g fill="$COL"><ellipse cx="20" cy="9" rx="6" ry="9"/><ellipse cx="31" cy="17" rx="6" ry="9" transform="rotate(72 31 17)"/><ellipse cx="27" cy="30" rx="6" ry="9" transform="rotate(144 27 30)"/><ellipse cx="13" cy="30" rx="6" ry="9" transform="rotate(216 13 30)"/><ellipse cx="9" cy="17" rx="6" ry="9" transform="rotate(288 9 17)"/></g></g></svg>',
  // single teardrop petal
  '<svg width="$SZ" height="$HT" viewBox="0 0 20 28"><path d="M10 0 C18 8 18 20 10 28 C2 20 2 8 10 0Z" fill="$COL" opacity="$OP"/></svg>',
  // slender leaf-petal with a faint stem
  '<svg width="$SZ" height="$SZ" viewBox="0 0 24 24"><g opacity="$OP"><path d="M12 2 C16 7 16 14 12 20 C8 14 8 7 12 2Z" fill="$COL"/><path d="M12 20 L12 24" stroke="#cdbf97" stroke-width="1.4"/></g></svg>',
  // rounded 4-petal bloom (softer, fuller)
  '<svg width="$SZ" height="$SZ" viewBox="0 0 40 40"><g opacity="$OP" fill="$COL"><circle cx="20" cy="11" r="8"/><circle cx="29" cy="20" r="8"/><circle cx="20" cy="29" r="8"/><circle cx="11" cy="20" r="8"/><circle cx="20" cy="20" r="5" fill="#f3e6c4"/></g></svg>',
];
// White and beige / champagne blossoms — tuned to the cream-gold palette.
// Whites carry a faint warm tint so they don't vanish against the cream page.
const COLORS = [
  "#fffdf8", // warm white
  "#fbf6ea", // ivory
  "#f4ead3", // soft beige
  "#ece0c4", // champagne
  "#e6d8b8", // sand
  "#f7efdd", // pale cream
  "#ddccaa", // deeper beige
];

function makeFlower() {
  const el = document.createElement("div");
  el.className = "petal";
  const tpl = FLOWERS[Math.floor(Math.random() * FLOWERS.length)];
  const col = COLORS[Math.floor(Math.random() * COLORS.length)];
  const sz = 12 + Math.random() * 20;
  // a touch softer than before, so the pale blooms stay ambient not busy
  const op = (0.45 + Math.random() * 0.35).toFixed(2);
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
