import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArtworkBySlug, getAllArtworkSlugs } from "@/lib/sanity";
import { parseVariantParam } from "@/lib/artworkVariants";
import ArtworkDetailView from "./ArtworkDetailView";

interface Props {
  params: { slug: string };
  searchParams: { v?: string };
}

export async function generateStaticParams() {
  const slugs = await getAllArtworkSlugs();
  return (slugs || []).map((slug: string) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const artwork = await getArtworkBySlug(params.slug);
  if (!artwork) return {};

  return {
    title: artwork.seo?.title || artwork.title,
    description: artwork.seo?.description || artwork.description,
    openGraph: {
      title: `${artwork.title} — OMLILAS`,
      description: artwork.description,
    },
  };
}

export default async function ArtworkPage({ params, searchParams }: Props) {
  const artwork = await getArtworkBySlug(params.slug);
  if (!artwork) notFound();

  const initialVariant = parseVariantParam(searchParams?.v);

  return (
    <ArtworkDetailView artwork={artwork} initialVariant={initialVariant} />
  );
}
