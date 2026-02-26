import type { Metadata } from "next";
import { getPrints, getPageContent } from "@/lib/sanity";
import ArtworkGrid from "@/components/ArtworkGrid";
import PageTransition from "@/components/PageTransition";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent("prints");
  return {
    title: page?.seo?.title || "Limited Edition Prints",
    description:
      page?.seo?.description ||
      "Shop limited-edition archival giclée prints by OMLILAS. Museum-quality reproductions signed and numbered by the artist.",
  };
}

export default async function PrintsPage() {
  const [prints, page] = await Promise.all([
    getPrints(),
    getPageContent("prints"),
  ]);

  return (
    <PageTransition>
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h1 className="font-serif text-3xl md:text-4xl text-charcoal tracking-wide">
              {page?.heading || "Limited Edition Prints"}
            </h1>
            <p className="text-sm text-charcoal/50 mt-3 max-w-md mx-auto">
              {page?.subtitle ||
                "Archival giclée prints on museum-quality paper — signed and numbered by the artist."}
            </p>
          </div>
          <ArtworkGrid artworks={prints || []} />
        </div>
      </section>
    </PageTransition>
  );
}
