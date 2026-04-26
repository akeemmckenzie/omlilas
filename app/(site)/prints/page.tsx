import type { Metadata } from "next";
import { getPrints, getPageContent } from "@/lib/sanity";
import ArtworkCarousel from "@/components/ArtworkCarousel";
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

  const all = prints || [];
  const signed = all.filter((p) => !!p.hasSignedPrint);
  const unsigned = all.filter((p) => !!p.hasUnsignedPrint);

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

          <ArtworkCarousel
            title="Signed Prints"
            subtitle="Hand-signed and numbered. Limited stock — once they're gone, they're gone."
            artworks={signed}
            variant="signed"
          />

          <ArtworkCarousel
            title="Unsigned Prints"
            subtitle="Open editions, archival giclée — always available."
            artworks={unsigned}
            variant="unsigned"
          />

          {all.length === 0 && (
            <p className="text-center text-charcoal/40 text-sm py-12">
              No prints to display yet.
            </p>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
