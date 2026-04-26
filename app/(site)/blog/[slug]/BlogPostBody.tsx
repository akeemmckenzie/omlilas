"use client";

import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/sanity/client";
import type { SanityBlogPost } from "@/sanity/types";

interface BlogPostBodyProps {
  post: SanityBlogPost;
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const url = urlFor(value).auto("format").quality(85).width(1400).url();
      return (
        <figure className="my-10 -mx-6 md:mx-0">
          <div className="relative w-full aspect-[16/10] bg-cream-light overflow-hidden md:rounded-sm gallery-shadow">
            <Image
              src={url}
              alt={value.alt || ""}
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="text-xs text-charcoal/50 text-center mt-3 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h1: ({ children }) => (
      <h1 className="font-serif text-3xl md:text-4xl text-charcoal mt-12 mb-4 tracking-wide">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-serif text-2xl md:text-3xl text-charcoal mt-10 mb-3 tracking-wide">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-serif text-xl md:text-2xl text-charcoal mt-8 mb-3 tracking-wide">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-accent pl-6 my-8 italic text-charcoal/70 font-serif text-lg leading-relaxed">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="text-base md:text-lg text-charcoal/80 leading-[1.85] mb-6">
        {children}
      </p>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="text-accent underline underline-offset-4 hover:text-charcoal transition-colors"
      >
        {children}
      </a>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    strong: ({ children }) => (
      <strong className="font-semibold text-charcoal">{children}</strong>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-outside pl-6 mb-6 space-y-2 text-charcoal/80 text-base md:text-lg leading-[1.85]">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-outside pl-6 mb-6 space-y-2 text-charcoal/80 text-base md:text-lg leading-[1.85]">
        {children}
      </ol>
    ),
  },
};

export default function BlogPostBody({ post }: BlogPostBodyProps) {
  const coverUrl = post.coverImage
    ? urlFor(post.coverImage).auto("format").quality(85).width(1600).url()
    : null;

  return (
    <>
      {coverUrl && (
        <div className="relative w-full aspect-[16/9] bg-cream-light overflow-hidden mb-12 -mx-6 md:mx-0 md:rounded-sm gallery-shadow">
          <Image
            src={coverUrl}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 720px"
            className="object-cover"
          />
        </div>
      )}

      {post.body && post.body.length > 0 ? (
        <div className="prose-reset">
          <PortableText value={post.body} components={components} />
        </div>
      ) : (
        <p className="text-charcoal/40 text-center py-12">
          This post has no content yet.
        </p>
      )}
    </>
  );
}
