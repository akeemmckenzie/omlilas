import type { Metadata } from "next";
import { getCollections, getPageContent } from "@/lib/sanity";
import CollectionGrid from "@/components/CollectionGrid";
import PageTransition from "@/components/PageTransition";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent("originals");
  return {
    title: page?.seo?.title || "Original Paintings",
    description:
      page?.seo?.description ||
      "Browse original paintings by OMLILAS, organized by series.",
  };
}

export default async function OriginalsPage() {
  const [collections, page] = await Promise.all([
    getCollections(),
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
                "Explore the originals by series. Each collection brings together pieces created with a shared intention."}
            </p>
          </div>
          <CollectionGrid collections={collections || []} />
        </div>
      </section>
    </PageTransition>
  );
}
