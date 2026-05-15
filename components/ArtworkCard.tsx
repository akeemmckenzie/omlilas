"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ArtworkVariant, SanityArtwork } from "@/sanity/types";
import { formatPrice } from "@/lib/sanity";
import {
  defaultVariant,
  variantPrice,
  variantSoldOut,
  variantSoldLabel,
} from "@/lib/artworkVariants";
import SanityImage from "./SanityImage";
import ArtworkPlaceholder from "./ArtworkPlaceholder";

interface ArtworkCardProps {
  artwork: SanityArtwork;
  index?: number;
  uniform?: boolean;
  /** Which variant this card represents. Drives price, sold state, and the link. */
  variant?: ArtworkVariant;
}

export default function ArtworkCard({
  artwork,
  index = 0,
  uniform = false,
  variant,
}: ArtworkCardProps) {
  const hasImage = artwork.images && artwork.images.length > 0;
  const slug =
    typeof artwork.slug === "string"
      ? artwork.slug
      : artwork.slug?.current;

  const effectiveVariant = variant ?? defaultVariant(artwork);
  const price = effectiveVariant
    ? variantPrice(artwork, effectiveVariant)
    : undefined;
  const soldOut = effectiveVariant
    ? variantSoldOut(artwork, effectiveVariant)
    : false;
  const soldLabel = effectiveVariant
    ? variantSoldLabel(artwork, effectiveVariant)
    : "Sold";

  const href = effectiveVariant
    ? `/artwork/${slug}?v=${effectiveVariant}`
    : `/artwork/${slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
    >
      <Link href={href} className="group block">
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
                  {soldOut ? (
                    typeof price === "number" ? (
                      <>
                        {formatPrice(price)}{" "}
                        <em className="italic">{soldLabel}</em>
                      </>
                    ) : (
                      <em className="italic">{soldLabel}</em>
                    )
                  ) : typeof price === "number" ? (
                    formatPrice(price)
                  ) : (
                    ""
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Card info below image — uniform: title + price (or Sold) */}
          <div className="mt-4 text-center">
            <h3 className="font-serif text-sm text-charcoal tracking-wide truncate">
              {artwork.title}
            </h3>
            <p
              className={`text-xs mt-1 tracking-wide ${
                soldOut ? "text-charcoal/60" : "text-charcoal/60"
              }`}
            >
              {soldOut ? (
                typeof price === "number" ? (
                  <>
                    {formatPrice(price)}{" "}
                    <em className="italic text-accent">{soldLabel}</em>
                  </>
                ) : (
                  <em className="italic uppercase text-accent">{soldLabel}</em>
                )
              ) : typeof price === "number" ? (
                formatPrice(price)
              ) : (
                ""
              )}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
