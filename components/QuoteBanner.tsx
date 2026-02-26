"use client";

import Image from "next/image";
import { motion } from "framer-motion";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any;
import { urlFor } from "@/sanity/client";

interface QuoteBannerProps {
  quote: string;
  backgroundImage?: SanityImageSource | null;
  bgColors?: string[];
}

export default function QuoteBanner({
  quote,
  backgroundImage,
  bgColors = ["#3D2B1F", "#5C4033", "#2F2018"],
}: QuoteBannerProps) {
  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden">
      {/* Background: Sanity image or gradient fallback */}
      {backgroundImage ? (
        <Image
          src={urlFor(backgroundImage).auto("format").quality(80).width(1920).url()}
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${bgColors[0]} 0%, ${bgColors[1]} 50%, ${bgColors[2]} 100%)`,
          }}
        />
      )}
      <div className="absolute inset-0 bg-charcoal/40" />

      {/* Quote */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-serif text-xl sm:text-2xl md:text-3xl text-cream/90 leading-relaxed italic tracking-wide"
        >
          &ldquo;{quote}&rdquo;
        </motion.blockquote>
      </div>
    </section>
  );
}
