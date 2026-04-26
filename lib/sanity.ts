import { client } from "@/sanity/client";
import {
  originalsQuery,
  printsQuery,
  featuredArtworksQuery,
  artworkBySlugQuery,
  allArtworkSlugsQuery,
  siteSettingsQuery,
  pageContentQuery,
  collectionsQuery,
  collectionBySlugQuery,
  originalsByCollectionQuery,
  allCollectionSlugsQuery,
  blogPostsQuery,
  blogPostBySlugQuery,
  allBlogPostSlugsQuery,
  featuredBlogPostsQuery,
} from "@/sanity/queries";
import type {
  SanityArtwork,
  SanitySettings,
  SanityPageContent,
  SanityCollection,
  SanityBlogPostListItem,
  SanityBlogPost,
  SanityFeaturedBlogPost,
} from "@/sanity/types";

const REVALIDATE = 3600;

async function safeFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T,
): Promise<T> {
  if (!client) return fallback;
  try {
    const result = await client.fetch<T>(query, params, {
      next: { revalidate: REVALIDATE },
    });
    return result ?? fallback;
  } catch {
    return fallback;
  }
}

export async function getSiteSettings(): Promise<SanitySettings | null> {
  return safeFetch<SanitySettings | null>(siteSettingsQuery, {}, null);
}

export async function getPageContent(
  pageId: string,
): Promise<SanityPageContent | null> {
  return safeFetch<SanityPageContent | null>(
    pageContentQuery,
    { pageId },
    null,
  );
}

export async function getOriginals(): Promise<SanityArtwork[]> {
  return safeFetch<SanityArtwork[]>(originalsQuery, {}, []);
}

export async function getPrints(): Promise<SanityArtwork[]> {
  return safeFetch<SanityArtwork[]>(printsQuery, {}, []);
}

export async function getFeaturedArtworks(): Promise<SanityArtwork[]> {
  return safeFetch<SanityArtwork[]>(featuredArtworksQuery, {}, []);
}

export async function getArtworkBySlug(
  slug: string,
): Promise<SanityArtwork | null> {
  return safeFetch<SanityArtwork | null>(
    artworkBySlugQuery,
    { slug },
    null,
  );
}

export async function getAllArtworkSlugs(): Promise<string[]> {
  return safeFetch<string[]>(allArtworkSlugsQuery, {}, []);
}

export async function getCollections(): Promise<SanityCollection[]> {
  return safeFetch<SanityCollection[]>(collectionsQuery, {}, []);
}

export async function getCollectionBySlug(
  slug: string,
): Promise<SanityCollection | null> {
  return safeFetch<SanityCollection | null>(
    collectionBySlugQuery,
    { slug },
    null,
  );
}

export async function getOriginalsByCollection(
  slug: string,
): Promise<SanityArtwork[]> {
  return safeFetch<SanityArtwork[]>(originalsByCollectionQuery, { slug }, []);
}

export async function getAllCollectionSlugs(): Promise<string[]> {
  return safeFetch<string[]>(allCollectionSlugsQuery, {}, []);
}

export async function getBlogPosts(): Promise<SanityBlogPostListItem[]> {
  return safeFetch<SanityBlogPostListItem[]>(blogPostsQuery, {}, []);
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<SanityBlogPost | null> {
  return safeFetch<SanityBlogPost | null>(blogPostBySlugQuery, { slug }, null);
}

export async function getAllBlogPostSlugs(): Promise<string[]> {
  return safeFetch<string[]>(allBlogPostSlugsQuery, {}, []);
}

export async function getFeaturedBlogPosts(): Promise<SanityFeaturedBlogPost[]> {
  return safeFetch<SanityFeaturedBlogPost[]>(featuredBlogPostsQuery, {}, []);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
