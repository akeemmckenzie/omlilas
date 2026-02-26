import type { Metadata } from "next";
import { getOriginals, getPageContent } from "@/lib/sanity";
import ArtworkGrid from "@/components/ArtworkGrid";
import PageTransition from "@/components/PageTransition";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent("originals");
  return {
    title: page?.seo?.title || "Original Paintings",
    description:
      page?.seo?.description ||
      "Browse original paintings by OMLILAS. One-of-a-kind works in oil, acrylic, and mixed media.",
  };
}

export default async function OriginalsPage() {
  const [originals, page] = await Promise.all([
    getOriginals(),
    getPageContent("originals"),
  ]);

  return (
    <PageTransition>
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h1 className="font-serif text-3xl md:text-4xl text-charcoal tracking-wide">
              {page?.heading || "Original Works"}
            </h1>
            <p className="text-sm text-charcoal/50 mt-3 max-w-md mx-auto">
              {page?.subtitle ||
                "One-of-a-kind paintings — each piece is an original work created with intention and care."}
            </p>
          </div>
          <ArtworkGrid artworks={originals || []} />
        </div>
      </section>
    </PageTransition>
  );
}
