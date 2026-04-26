import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCollectionBySlug,
  getOriginalsByCollection,
  getAllCollectionSlugs,
} from "@/lib/sanity";
import ArtworkGrid from "@/components/ArtworkGrid";
import PageTransition from "@/components/PageTransition";

interface Props {
  params: { collection: string };
}

export async function generateStaticParams() {
  const slugs = await getAllCollectionSlugs();
  return (slugs || []).map((slug: string) => ({ collection: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getCollectionBySlug(params.collection);
  if (!c) return {};
  return {
    title: `${c.title} — Originals`,
    description: c.description,
  };
}

export default async function CollectionPage({ params }: Props) {
  const [collection, artworks] = await Promise.all([
    getCollectionBySlug(params.collection),
    getOriginalsByCollection(params.collection),
  ]);

  if (!collection) notFound();

  return (
    <PageTransition>
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10">
            <Link
              href="/originals"
              className="text-xs tracking-[0.2em] uppercase text-charcoal/50 hover:text-charcoal transition-colors"
            >
              ← All Series
            </Link>
          </div>

          <div className="text-center mb-14">
            <h1 className="font-serif text-3xl md:text-4xl text-charcoal tracking-wide">
              {collection.title}
            </h1>
            {collection.description && (
              <p className="text-sm text-charcoal/60 mt-4 max-w-2xl mx-auto leading-relaxed">
                {collection.description}
              </p>
            )}
          </div>

          <ArtworkGrid
            artworks={artworks || []}
            columns={3}
            variant="original"
          />
        </div>
      </section>
    </PageTransition>
  );
}
