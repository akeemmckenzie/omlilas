"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { urlFor } from "@/sanity/client";
import type { SanityHomeTile } from "@/sanity/types";

interface HomeFeatureTilesProps {
  tiles?: SanityHomeTile[];
  heading?: string;
}

export default function HomeFeatureTiles({
  tiles,
  heading,
}: HomeFeatureTilesProps) {
  if (!tiles || tiles.length === 0) return null;

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        {heading && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-3xl md:text-4xl text-charcoal text-center mb-12 tracking-wide"
          >
            {heading}
          </motion.h2>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {tiles.slice(0, 4).map((tile, i) => {
            const imgUrl = urlFor(tile.image)
              .auto("format")
              .quality(85)
              .width(800)
              .url();
            const Wrapper = ({ children }: { children: React.ReactNode }) =>
              tile.link ? (
                <Link href={tile.link} className="group block">
                  {children}
                </Link>
              ) : (
                <div className="block">{children}</div>
              );

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
              >
                <Wrapper>
                  <div className="relative aspect-square overflow-hidden bg-cream-light gallery-shadow">
                    <Image
                      src={imgUrl}
                      alt={tile.title || ""}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-colors duration-300" />
                  </div>
                  {(tile.title || tile.text) && (
                    <div className="mt-4 text-center">
                      {tile.title && (
                        <h3 className="font-serif text-base text-charcoal tracking-wide">
                          {tile.title}
                        </h3>
                      )}
                      {tile.text && (
                        <p className="text-xs text-charcoal/60 mt-2 leading-relaxed">
                          {tile.text}
                        </p>
                      )}
                    </div>
                  )}
                </Wrapper>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
