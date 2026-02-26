"use client";

interface ArtworkPlaceholderProps {
  colors: string[];
  aspect?: string;
  className?: string;
}

export default function ArtworkPlaceholder({
  colors,
  aspect = "3:4",
  className = "",
}: ArtworkPlaceholderProps) {
  const [w, h] = aspect.split(":").map(Number);
  const paddingBottom = `${(h / w) * 100}%`;

  const gradient =
    colors.length >= 3
      ? `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`
      : colors.length === 2
        ? `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`
        : colors[0];

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{ paddingBottom }}
    >
      <div
        className="absolute inset-0 artwork-placeholder"
        style={{ background: gradient }}
      >
        <span className="relative z-10 text-white/30 text-xs tracking-[0.2em] uppercase">
          Artwork
        </span>
      </div>
    </div>
  );
}
