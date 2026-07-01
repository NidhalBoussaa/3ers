"use client";
import { useEffect, useRef } from "react";
import Lottie from "lottie-react";
import flowerData from "@/public/Flower.json";
import garlandData from "@/public/weddingfloral.json";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Two assets:
//  - "bloom"   = Flower.json — a compact square blossom (850×850).
//  - "garland" = weddingfloral.json — a wide floral spray (900×240, 3.75:1),
//                rotated 90° so it runs vertically down an edge.
const ASSET = { bloom: flowerData, garland: garlandData } as const;

// side: which edge it hugs. edgePx: small NEGATIVE px offset from that edge so
// part tucks off-screen. y: % down the container. w/h: px box (garlands keep the
// 3.75:1 ratio in their box, then rotate). rotate: base tilt (garlands add ±90).
const FLOWERS = [
  // ── LEFT EDGE ──
  { id: 0,  type: "bloom",   side: "left",  edgePx: -26, y:  2,  w: 78,  h: 78,  rotate:  20, flipX: false, flipY: false, tint: "sepia(0.7) saturate(1.4) hue-rotate(355deg) brightness(1.05)",   opacity: 0.45 },
  { id: 1,  type: "garland", side: "left",  edgePx: -50, y:  9,  w: 300, h: 80,  rotate:  90, flipX: true,  flipY: false, tint: "grayscale(0.35) sepia(0.55) saturate(1.3) brightness(1.0)",  opacity: 0.6 },
  { id: 2,  type: "bloom",   side: "left",  edgePx: -18, y: 19,  w: 64,  h: 64,  rotate: -15, flipX: true,  flipY: false, tint: "sepia(0.7) saturate(1.4) hue-rotate(355deg) brightness(1.05)", opacity: 0.42 },
  { id: 3,  type: "bloom",   side: "left",  edgePx: -30, y: 29,  w: 86,  h: 86,  rotate:  35, flipX: false, flipY: true,  tint: "sepia(0.7) saturate(1.4) hue-rotate(355deg) brightness(1.05)",  opacity: 0.45 },
  { id: 4,  type: "garland", side: "left",  edgePx: -50, y: 38,  w: 320, h: 86,  rotate:  90, flipX: true,  flipY: true,  tint: "grayscale(0.35) sepia(0.55) saturate(1.3) brightness(1.0)", opacity: 0.55 },
  { id: 5,  type: "bloom",   side: "left",  edgePx: -16, y: 49,  w: 70,  h: 70,  rotate: -38, flipX: true,  flipY: true,  tint: "sepia(0.7) saturate(1.4) hue-rotate(355deg) brightness(1.05)", opacity: 0.42 },
  { id: 6,  type: "bloom",   side: "left",  edgePx: -28, y: 60,  w: 84,  h: 84,  rotate:  28, flipX: false, flipY: false, tint: "sepia(0.7) saturate(1.4) hue-rotate(355deg) brightness(1.05)",   opacity: 0.44 },
  { id: 7,  type: "garland", side: "left",  edgePx: -50, y: 69,  w: 300, h: 80,  rotate:  90, flipX: true,  flipY: false, tint: "grayscale(0.35) sepia(0.55) saturate(1.3) brightness(1.0)", opacity: 0.6 },
  { id: 8,  type: "bloom",   side: "left",  edgePx: -14, y: 80,  w: 66,  h: 66,  rotate: -18, flipX: true,  flipY: false, tint: "sepia(0.7) saturate(1.4) hue-rotate(355deg) brightness(1.05)",  opacity: 0.40 },
  { id: 9,  type: "bloom",   side: "left",  edgePx: -26, y: 91,  w: 78,  h: 78,  rotate:  22, flipX: false, flipY: true,  tint: "sepia(0.7) saturate(1.4) hue-rotate(355deg) brightness(1.05)",   opacity: 0.43 },

  // ── RIGHT EDGE ──
  { id: 10, type: "bloom",   side: "right", edgePx: -26, y:  5,  w: 82,  h: 82,  rotate: -22, flipX: false, flipY: false, tint: "sepia(0.7) saturate(1.4) hue-rotate(355deg) brightness(1.05)",  opacity: 0.45 },
  { id: 11, type: "garland", side: "right", edgePx: -50, y: 13,  w: 320, h: 86,  rotate: -90, flipX: false, flipY: false, tint: "grayscale(0.35) sepia(0.55) saturate(1.3) brightness(1.0)",  opacity: 0.6 },
  { id: 12, type: "bloom",   side: "right", edgePx: -14, y: 24,  w: 66,  h: 66,  rotate:  18, flipX: true,  flipY: false, tint: "sepia(0.7) saturate(1.4) hue-rotate(355deg) brightness(1.05)",  opacity: 0.41 },
  { id: 13, type: "bloom",   side: "right", edgePx: -30, y: 34,  w: 86,  h: 86,  rotate: -35, flipX: false, flipY: true,  tint: "sepia(0.7) saturate(1.4) hue-rotate(355deg) brightness(1.05)",   opacity: 0.46 },
  { id: 14, type: "garland", side: "right", edgePx: -50, y: 43,  w: 300, h: 80,  rotate: -90, flipX: false, flipY: true,  tint: "grayscale(0.35) sepia(0.55) saturate(1.3) brightness(1.0)", opacity: 0.55 },
  { id: 15, type: "bloom",   side: "right", edgePx: -16, y: 54,  w: 70,  h: 70,  rotate:  30, flipX: true,  flipY: false, tint: "sepia(0.7) saturate(1.4) hue-rotate(355deg) brightness(1.05)", opacity: 0.41 },
  { id: 16, type: "bloom",   side: "right", edgePx: -28, y: 65,  w: 82,  h: 82,  rotate: -12, flipX: false, flipY: false, tint: "sepia(0.7) saturate(1.4) hue-rotate(355deg) brightness(1.05)",   opacity: 0.45 },
  { id: 17, type: "garland", side: "right", edgePx: -50, y: 74,  w: 320, h: 86,  rotate: -90, flipX: false, flipY: false, tint: "grayscale(0.35) sepia(0.55) saturate(1.3) brightness(1.0)", opacity: 0.6 },
  { id: 18, type: "bloom",   side: "right", edgePx: -14, y: 85,  w: 66,  h: 66,  rotate:  15, flipX: true,  flipY: false, tint: "sepia(0.7) saturate(1.4) hue-rotate(355deg) brightness(1.05)",  opacity: 0.40 },
  { id: 19, type: "bloom",   side: "right", edgePx: -26, y: 95,  w: 78,  h: 78,  rotate: -20, flipX: false, flipY: true,  tint: "sepia(0.7) saturate(1.4) hue-rotate(355deg) brightness(1.05)",   opacity: 0.43 },
] as const;

type Flower = (typeof FLOWERS)[number];

function FlowerItem({ flower }: { flower: Flower }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // Base tilt (±90 for garlands) lives on the INNER element's transform.
    // GSAP only animates the OUTER box: opacity, scale, a small sway + drift.
    gsap.set(wrap, { opacity: 0, scale: 0.6, rotate: -10 });

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: "top 95%",
      onEnter: () => {
        gsap.to(wrap, {
          opacity: flower.opacity,
          scale: 1,
          rotate: 0,
          duration: 1.6,
          ease: "power3.out",
        });
        // gentle perpetual float — small sway so vertical garlands stay vertical
        gsap.to(wrap, {
          y: -12,
          rotate: 3,
          duration: 3 + (flower.id % 4) * 0.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 1.6,
        });
      },
      onLeaveBack: () => {
        gsap.to(wrap, { opacity: 0, scale: 0.7, duration: 0.8, ease: "power2.in" });
      },
    });

    return () => {
      st.kill();
      gsap.killTweensOf(wrap);
    };
  }, [flower]);

  const isRight = flower.side === "right";
  const isGarland = flower.type === "garland";

  // A garland is wide (w×h, ~3.75:1) but stands vertical once rotated.
  // The POSITIONED box uses its post-rotation footprint (thin strip = h wide,
  // w tall) so edgePx hugs the edge consistently; the wide art is centered
  // inside and rotated. Blooms are square, so footprint == box.
  const boxW = isGarland ? flower.h : flower.w;
  const boxH = isGarland ? flower.w : flower.h;

  // Inner transform.
  //  • Garlands: ONE canonical orientation (rotate 90°, flowers hugging the
  //    LEFT edge with stems trailing inward). The RIGHT edge mirrors it both
  //    ways — scaleX(-1) AND scaleY(-1) — so it reads as a true reflection of
  //    the left run. flipY (per item) toggles the vertical flip for variety.
  //  • Blooms: their own rotate + flipX/flipY for scatter variety.
  let innerTransform: string;
  if (isGarland) {
    // Left edge: rotate(90deg). Right edge: rotate(90deg) + 180° = rotate(270deg),
    // so it points the opposite way down its own edge. flipY toggles per item.
    const baseRot = isRight ? 270 : 90;
    const flipY = flower.flipY ? -1 : 1;
    innerTransform = `translate(-50%, -50%) rotate(${baseRot}deg) scaleY(${flipY})`;
  } else {
    const sx = flower.flipX ? -1 : 1;
    const sy = flower.flipY ? -1 : 1;
    innerTransform = `translate(-50%, -50%) rotate(${flower.rotate}deg) scaleX(${sx}) scaleY(${sy})`;
  }

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none absolute"
      style={{
        top: `${flower.y}%`,
        // edgePx: small NEGATIVE px offset from the edge, so part tucks off-screen
        // and the rest peeks in. Pixel units keep it tied to the element — it can
        // never be flung across the page (that earlier % bug).
        ...(isRight ? { right: flower.edgePx } : { left: flower.edgePx }),
        width: boxW,
        height: boxH,
        filter: flower.tint,
        transformOrigin: "center center",
        willChange: "transform, opacity",
      }}
    >
      {/* Inner holds the native wide aspect, centered, and applies rotation+flip. */}
      <div
        className="absolute top-1/2 left-1/2"
        style={{
          width: flower.w,
          height: flower.h,
          transform: innerTransform,
          transformOrigin: "center center",
        }}
      >
        <Lottie animationData={ASSET[flower.type]} loop autoplay style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
}

export function ScrollFlowers() {
  return (
    <div
      aria-hidden
      // overflow-hidden + inset-0: flowers are clipped to the stage and can
      // NEVER expand the document width (that black gutter was overflow leaking).
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {FLOWERS.map((f) => (
        <FlowerItem key={f.id} flower={f} />
      ))}
    </div>
  );
}
