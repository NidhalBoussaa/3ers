import { Ornament } from "@/components/ornament";

/**
 * The invitation's signature arc, borrowed whole: night gives way to a warm
 * cream stage lit from the edges, and returns to night at the close.
 */
export function StageTransition({ direction }: { direction: "to-cream" | "to-night" }) {
  if (direction === "to-cream") {
    return (
      <div className="relative bg-night" aria-hidden="true">
        <div className="h-[26vh] min-h-40 bg-gradient-to-b from-night via-[#3a2e1a] to-champagne" />
        <div className="absolute inset-x-0 bottom-0 h-[18vh] bg-[radial-gradient(ellipse_at_bottom,rgba(241,216,148,0.28)_0%,transparent_70%)]" />
      </div>
    );
  }
  return (
    <div className="relative" aria-hidden="true">
      <div className="bg-champagne pb-14 pt-2">
        <Ornament />
      </div>
      <div className="h-[24vh] min-h-36 bg-gradient-to-b from-champagne via-[#4a3b20] to-night" />
    </div>
  );
}
