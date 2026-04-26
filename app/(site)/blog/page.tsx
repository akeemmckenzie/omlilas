import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts, getPageContent } from "@/lib/sanity";
import PageTransition from "@/components/PageTransition";
import type { SanityBlogPostListItem } from "@/sanity/types";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent("blog");
  return {
    title: page?.seo?.title || "Blog",
    description:
      page?.seo?.description ||
      "Studio notes, process, and reflections from OMLILAS.",
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}

function groupByYear(
  posts: SanityBlogPostListItem[],
): { year: number; posts: SanityBlogPostListItem[] }[] {
  const map = new Map<number, SanityBlogPostListItem[]>();
  for (const p of posts) {
    const year = new Date(p.publishedAt).getFullYear();
    if (!map.has(year)) map.set(year, []);
    map.get(year)!.push(p);
  }
  return Array.from(map.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([year, posts]) => ({ year, posts }));
}

export default async function BlogPage() {
  const [posts, page] = await Promise.all([
    getBlogPosts(),
    getPageContent("blog"),
  ]);

  const grouped = groupByYear(posts || []);

  return (
    <PageTransition>
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="font-serif text-3xl md:text-4xl text-charcoal tracking-wide">
              {page?.heading || "Journal"}
            </h1>
            <p className="text-sm text-charcoal/50 mt-3 max-w-md mx-auto">
              {page?.subtitle ||
                "Notes from the studio — process, inspiration, and what's behind each series."}
            </p>
          </div>

          {grouped.length === 0 ? (
            <p className="text-center text-charcoal/40 text-sm py-12">
              No posts yet.
            </p>
          ) : (
            <div className="space-y-16">
              {grouped.map(({ year, posts }) => (
                <div key={year}>
                  <div className="flex items-baseline gap-4 mb-6">
                    <h2 className="font-serif text-2xl text-charcoal tracking-wide">
                      {year}
                    </h2>
                    <span className="flex-1 h-px bg-charcoal/10" />
                    <span className="text-xs tracking-[0.2em] uppercase text-charcoal/40">
                      {posts.length} {posts.length === 1 ? "Post" : "Posts"}
                    </span>
                  </div>
                  <ul className="divide-y divide-charcoal/10">
                    {posts.map((post) => (
                      <li key={post._id}>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="group flex items-baseline justify-between gap-6 py-5 transition-colors"
                        >
                          <div className="min-w-0">
                            {post.category && (
                              <span className="inline-block text-[10px] tracking-[0.2em] uppercase text-accent mb-1">
                                {post.category}
                              </span>
                            )}
                            <h3 className="font-serif text-lg md:text-xl text-charcoal group-hover:text-accent transition-colors duration-200 truncate">
                              {post.title}
                            </h3>
                          </div>
                          <time
                            dateTime={post.publishedAt}
                            className="text-xs text-charcoal/50 tracking-wide whitespace-nowrap"
                          >
                            {formatDate(post.publishedAt)}
                          </time>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
