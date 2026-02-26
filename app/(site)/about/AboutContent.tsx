"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PortableText } from "@portabletext/react";
import type { SanitySettings } from "@/sanity/types";
import type { SanityPageContent } from "@/sanity/types";
import { urlFor } from "@/sanity/client";
import QuoteBanner from "@/components/QuoteBanner";

interface AboutContentProps {
  settings?: SanitySettings | null;
  page?: SanityPageContent | null;
}

export default function AboutContent({ settings, page }: AboutContentProps) {
  const heading = page?.heading || "About the Artist";
  const quote =
    settings?.artistQuote ||
    "Each piece of art is infused with intentional, meaningful energy, honoring the materials and the creative process.";
  const hasPortrait = !!settings?.artistPortrait;
  const hasBio = settings?.artistBio && settings.artistBio.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
            {/* Left: Portrait */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative bg-cream-light gallery-shadow overflow-hidden">
                {hasPortrait ? (
                  <Image
                    src={urlFor(settings!.artistPortrait!)
                      .auto("format")
                      .quality(85)
                      .width(800)
                      .url()}
                    alt={settings?.artistName || "Artist portrait"}
                    width={800}
                    height={1040}
                    className="w-full h-auto"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div
                    className="w-full artwork-placeholder"
                    style={{
                      paddingBottom: "130%",
                      background:
                        "linear-gradient(180deg, #4A4A4A 0%, #2C2C2C 50%, #3A3A3A 100%)",
                    }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-white/20 text-xs tracking-[0.2em] uppercase">
                      Artist Portrait
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Right: Bio */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col justify-center"
            >
              <h1 className="font-serif text-3xl md:text-4xl text-charcoal tracking-wide mb-8">
                {heading}
              </h1>
              {hasBio ? (
                <div className="space-y-5 text-sm text-charcoal/65 leading-relaxed [&>p]:mb-0">
                  <PortableText value={settings!.artistBio} />
                </div>
              ) : (
                <p className="text-sm text-charcoal/65 leading-relaxed">
                  Bio coming soon.
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <QuoteBanner
        quote={quote}
        backgroundImage={settings?.quoteBannerBackground}
      />
    </motion.div>
  );
}
