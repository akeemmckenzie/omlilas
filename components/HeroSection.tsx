"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { SanitySettings } from "@/sanity/types";
import { urlFor } from "@/sanity/client";

interface HeroSectionProps {
  settings?: SanitySettings | null;
}

export default function HeroSection({ settings }: HeroSectionProps) {
  const headline = settings?.heroHeadline || "What's Real Never Washes Away.";
  const ctaText = settings?.heroCtaText || "Shop Now";
  const ctaLink = settings?.heroCtaLink || "/originals";
  const bgImage = settings?.heroBackgroundImage;

  return (
    <section className="relative w-full h-[85vh] min-h-[500px] overflow-hidden">
      {/* Background: Sanity image or gradient fallback */}
      {bgImage ? (
        <Image
          src={urlFor(bgImage).auto("format").quality(85).width(1920).url()}
          alt="Hero background"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #3D2B1F 0%, #5C4033 20%, #8B6D4A 45%, #C4A882 70%, #E8DCCF 90%, #F5F0EB 100%)",
          }}
        />
      )}

      {/* Overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-l from-charcoal/50 via-charcoal/15 to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex items-center justify-end">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="max-w-lg text-right"
        >
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-cream leading-tight tracking-wide">
            {headline}
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          >
            <Link
              href={ctaLink}
              className="inline-block mt-8 px-10 py-3.5 bg-charcoal text-cream text-sm tracking-widest uppercase hover:bg-charcoal/85 hover:scale-[1.02] transition-all duration-300"
            >
              {ctaText}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
