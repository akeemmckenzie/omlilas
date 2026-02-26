"use client";

import type { SanityArtwork } from "@/sanity/types";
import ArtworkCard from "./ArtworkCard";

interface ArtworkGridProps {
  artworks: SanityArtwork[];
}

export default function ArtworkGrid({ artworks }: ArtworkGridProps) {
  if (!artworks || artworks.length === 0) {
    return (
      <p className="text-center text-charcoal/40 text-sm py-12">
        No artworks to display yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
      {artworks.map((artwork, i) => (
        <ArtworkCard key={artwork._id} artwork={artwork} index={i} />
      ))}
    </div>
  );
}
