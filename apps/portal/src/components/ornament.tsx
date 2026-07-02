/** Static gold ornamental divider — the atelier's structural separator. */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg className={`orn ${className}`.trim()} viewBox="0 0 200 24" aria-hidden="true">
      <line x1="0" y1="12" x2="84" y2="12" />
      <line x1="116" y1="12" x2="200" y2="12" />
      <path d="M84 12 L100 4 L116 12 L100 20 Z" className="diamond" />
    </svg>
  );
}
