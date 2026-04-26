"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { urlFor } from "@/sanity/client";
import type { SanityFeaturedBlogPost } from "@/sanity/types";

interface HomeJournalProps {
  posts: SanityFeaturedBlogPost[];
  heading?: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function HomeJournal({
  posts,
  heading = "From the Journal",
}: HomeJournalProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-cream-light/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-3xl md:text-4xl text-charcoal tracking-wide"
          >
            {heading}
          </motion.h2>
          <Link
            href="/blog"
            className="text-xs tracking-[0.2em] uppercase text-charcoal/60 hover:text-charcoal transition-colors hidden sm:inline-block"
          >
            All Posts →
          </Link>
        </div>

        <div
          className={`grid gap-8 md:gap-10 ${
            posts.length === 1
              ? "grid-cols-1 max-w-3xl mx-auto"
              : posts.length === 2
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1 md:grid-cols-3"
          }`}
        >
          {posts.map((post, i) => {
            const coverUrl = post.coverImage
              ? urlFor(post.coverImage)
                  .auto("format")
                  .quality(85)
                  .width(900)
                  .url()
              : null;

            return (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-cream gallery-shadow mb-5">
                    {coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
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
                  </div>
                  <div>
                    {post.category && (
                      <span className="inline-block text-[10px] tracking-[0.25em] uppercase text-accent mb-2">
                        {post.category}
                      </span>
                    )}
                    <h3 className="font-serif text-xl md:text-2xl text-charcoal tracking-wide leading-snug group-hover:text-accent transition-colors duration-200">
                      {post.title}
                    </h3>
                    <time
                      dateTime={post.publishedAt}
                      className="block text-xs text-charcoal/50 tracking-wide mt-2"
                    >
                      {formatDate(post.publishedAt)}
                    </time>
                    {post.excerpt && (
                      <p className="text-sm text-charcoal/65 mt-3 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>

        <div className="text-center mt-10 sm:hidden">
          <Link
            href="/blog"
            className="text-xs tracking-[0.2em] uppercase text-charcoal/60 hover:text-charcoal transition-colors"
          >
            All Posts →
          </Link>
        </div>
      </div>
    </section>
  );
}
