import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getBlogPostBySlug,
  getAllBlogPostSlugs,
} from "@/lib/sanity";
import PageTransition from "@/components/PageTransition";
import BlogPostBody from "./BlogPostBody";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getAllBlogPostSlugs();
  return (slugs || []).map((slug: string) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt,
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <PageTransition>
      <article className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-10">
            <Link
              href="/blog"
              className="text-xs tracking-[0.2em] uppercase text-charcoal/50 hover:text-charcoal transition-colors"
            >
              ← All Posts
            </Link>
          </div>

          <header className="mb-12 text-center">
            {post.category && (
              <span className="inline-block text-[11px] tracking-[0.25em] uppercase text-accent mb-4">
                {post.category}
              </span>
            )}
            <h1 className="font-serif text-3xl md:text-5xl text-charcoal tracking-wide leading-tight">
              {post.title}
            </h1>
            <time
              dateTime={post.publishedAt}
              className="block text-sm text-charcoal/50 tracking-wide mt-5"
            >
              {formatDate(post.publishedAt)}
            </time>
            {post.excerpt && (
              <p className="text-base text-charcoal/65 mt-6 max-w-2xl mx-auto leading-relaxed italic">
                {post.excerpt}
              </p>
            )}
          </header>

          <BlogPostBody post={post} />
        </div>
      </article>
    </PageTransition>
  );
}
