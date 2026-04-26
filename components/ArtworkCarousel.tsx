"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SanityArtwork } from "@/sanity/types";
import ArtworkCard from "./ArtworkCard";

interface ArtworkCarouselProps {
  title: string;
  subtitle?: string;
  artworks: SanityArtwork[];
  variant?: "signed" | "unsigned";
}

export default function ArtworkCarousel({
  title,
  subtitle,
  artworks,
  variant = "unsigned",
}: ArtworkCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (!artworks || artworks.length === 0) return null;

  const scrollByOne = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-carousel-item]");
    const step = card ? card.offsetWidth + 24 : track.clientWidth * 0.8;
    track.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  return (
    <section className="mb-20">
      <div className="flex items-end justify-between mb-6">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-serif text-2xl md:text-3xl text-charcoal tracking-wide"
          >
            {title}
          </motion.h2>
          {subtitle && (
            <p className="text-sm text-charcoal/50 mt-2 max-w-xl">{subtitle}</p>
          )}
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scrollByOne(-1)}
            aria-label={`Scroll ${title} left`}
            className="w-10 h-10 rounded-full border border-charcoal/15 text-charcoal/70 hover:text-charcoal hover:border-charcoal/40 transition-colors flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollByOne(1)}
            aria-label={`Scroll ${title} right`}
            className="w-10 h-10 rounded-full border border-charcoal/15 text-charcoal/70 hover:text-charcoal hover:border-charcoal/40 transition-colors flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory carousel-scroll"
        style={{ scrollPaddingLeft: "0px" }}
      >
        {artworks.map((artwork, i) => (
          <div
            key={artwork._id}
            data-carousel-item
            className="snap-start shrink-0 w-[80%] sm:w-[44%] md:w-[30%] lg:w-[22%]"
          >
            <ArtworkCard
              artwork={artwork}
              index={i}
              uniform
              priceOverride={
                variant === "signed" ? artwork.signedPrice : artwork.price
              }
            />
          </div>
        ))}
      </div>
    </section>
  );
}
