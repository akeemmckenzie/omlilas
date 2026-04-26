"use client";

import type { ArtworkVariant, SanityArtwork } from "@/sanity/types";
import ArtworkCard from "./ArtworkCard";

interface ArtworkGridProps {
  artworks: SanityArtwork[];
  columns?: 2 | 3;
  variant?: ArtworkVariant;
}

export default function ArtworkGrid({
  artworks,
  columns = 2,
  variant,
}: ArtworkGridProps) {
  if (!artworks || artworks.length === 0) {
    return (
      <p className="text-center text-charcoal/40 text-sm py-12">
        No artworks to display yet.
      </p>
    );
  }

  const gridCols =
    columns === 3
      ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8"
      : "grid-cols-1 md:grid-cols-2 gap-8 md:gap-10";

  return (
    <div className={`grid ${gridCols}`}>
      {artworks.map((artwork, i) => (
        <ArtworkCard
          key={artwork._id}
          artwork={artwork}
          index={i}
          uniform={columns === 3}
          variant={variant}
        />
      ))}
    </div>
  );
}
