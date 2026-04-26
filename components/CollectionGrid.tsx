"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { urlFor } from "@/sanity/client";
import type { SanityCollection } from "@/sanity/types";

interface CollectionGridProps {
  collections: SanityCollection[];
}

export default function CollectionGrid({ collections }: CollectionGridProps) {
  if (!collections || collections.length === 0) {
    return (
      <p className="text-center text-charcoal/40 text-sm py-12">
        No collections to display yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      {collections.map((c, i) => {
        const imgUrl = c.coverImage
          ? urlFor(c.coverImage)
              .auto("format")
              .quality(85)
              .width(1200)
              .url()
          : null;

        return (
          <motion.div
            key={c._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
          >
            <Link
              href={`/originals/${c.slug}`}
              className="group block relative overflow-hidden rounded-sm gallery-shadow"
            >
              <div className="relative aspect-[16/9] bg-cream-light">
                {imgUrl ? (
                  <Image
                    src={imgUrl}
                    alt={c.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #8B6D4A 0%, #C4A882 60%, #E8DCCF 100%)",
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <h3 className="font-serif text-2xl md:text-3xl text-cream tracking-wide">
                    {c.title}
                  </h3>
                  {c.description && (
                    <p className="text-cream/80 text-sm mt-2 max-w-xl line-clamp-2">
                      {c.description}
                    </p>
                  )}
                  <span className="inline-block mt-3 text-[11px] tracking-[0.2em] uppercase text-cream/70 group-hover:text-cream transition-colors">
                    {typeof c.artworkCount === "number"
                      ? `${c.artworkCount} ${c.artworkCount === 1 ? "work" : "works"} →`
                      : "View series →"}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
