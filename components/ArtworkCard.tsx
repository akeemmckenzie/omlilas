"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { SanityArtwork } from "@/sanity/types";
import { formatPrice } from "@/lib/sanity";
import SanityImage from "./SanityImage";
import ArtworkPlaceholder from "./ArtworkPlaceholder";

interface ArtworkCardProps {
  artwork: SanityArtwork;
  index?: number;
  uniform?: boolean;
}

export default function ArtworkCard({
  artwork,
  index = 0,
  uniform = false,
}: ArtworkCardProps) {
  const hasImage = artwork.images && artwork.images.length > 0;
  const slug = artwork.slug?.current || artwork.slug;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
    >
      <Link href={`/artwork/${slug}`} className="group block">
        <div className="relative bg-cream-light rounded-sm gallery-shadow sunlight-effect transition-shadow duration-500 p-4 sm:p-6">
          {/* Artwork image area */}
          <div
            className={`relative overflow-hidden ${
              uniform ? "aspect-[3/4] bg-cream" : ""
            }`}
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={uniform ? "absolute inset-0" : ""}
            >
              {hasImage ? (
                uniform ? (
                  <SanityImage
                    image={artwork.images[0]}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <SanityImage
                    image={artwork.images[0]}
                    width={600}
                    height={750}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="w-full h-auto"
                  />
                )
              ) : (
                <ArtworkPlaceholder
                  colors={["#8B7355", "#A08B6D", "#C4A882"]}
                  aspect="3:4"
                />
              )}
            </motion.div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-all duration-300 flex items-end justify-center opacity-0 group-hover:opacity-100">
              <div className="p-4 text-center w-full">
                <p className="text-cream text-sm font-serif tracking-wide">
                  {artwork.title}
                </p>
                <p className="text-cream/80 text-xs mt-1">
                  {formatPrice(artwork.price)}
                </p>
              </div>
            </div>
          </div>

          {/* Signed badge for prints */}
          {artwork.category === "print" && artwork.signedPrice && (
            <div className="absolute top-6 right-6 sm:top-8 sm:right-8">
              <span className="inline-block px-3 py-1 bg-accent text-cream text-[10px] tracking-widest uppercase rounded-sm shadow-sm">
                Signed Available
              </span>
            </div>
          )}

          {/* Card info below image */}
          <div className="mt-4 text-center">
            <h3 className="font-serif text-sm text-charcoal tracking-wide">
              {artwork.title}
            </h3>
            <p className="text-xs text-charcoal/50 mt-1">{artwork.medium}</p>
            {artwork.category === "print" && artwork.signedPrice ? (
              <p className="text-xs text-charcoal/50 mt-1">
                From {formatPrice(artwork.price)}
              </p>
            ) : null}
            {artwork.sold && (
              <span className="inline-block mt-2 text-[10px] tracking-widest uppercase text-accent">
                Sold
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
