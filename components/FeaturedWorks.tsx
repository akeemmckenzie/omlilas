"use client";

import { motion } from "framer-motion";
import type { SanityArtwork } from "@/sanity/types";
import ArtworkCard from "./ArtworkCard";

interface FeaturedWorksProps {
  artworks: SanityArtwork[];
  heading?: string;
}

export default function FeaturedWorks({
  artworks,
  heading = "Selected Works",
}: FeaturedWorksProps) {
  if (!artworks || artworks.length === 0) return null;

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-serif text-3xl md:text-4xl text-charcoal text-center mb-14 tracking-wide"
        >
          {heading}
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {artworks.map((artwork, i) => (
            <ArtworkCard key={artwork._id} artwork={artwork} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
