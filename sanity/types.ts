// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any;
import type { PortableTextBlock } from "@portabletext/types";

export interface SanityArtworkImage {
  image: SanityImageSource;
  alt?: string;
  caption?: string;
}

export interface SanityHomeTile {
  image: SanityImageSource;
  title?: string;
  text?: string;
  link?: string;
}

export interface SanityCollectionRef {
  _id: string;
  title: string;
  slug: string;
  description?: string;
}

export interface SanityCollection {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  coverImage?: SanityImageSource;
  order?: number;
  artworkCount?: number;
}

export interface SanityArtwork {
  _id: string;
  _type: "artwork";
  title: string;
  slug: { current: string };
  category: "original" | "print";
  collection?: SanityCollectionRef;
  medium: string;
  dimensions: string;
  year: number;
  description: string;
  featured: boolean;
  sold: boolean;
  price: number;
  edition?: string;
  signedPrice?: number;
  signedEdition?: string;
  signedDescription?: string;
  images: SanityArtworkImage[];
  seo?: { title?: string; description?: string };
}

export interface SanitySettings {
  siteName: string;
  tagline: string;
  heroHeadline: string;
  heroCtaText: string;
  heroCtaLink: string;
  heroBackgroundImage?: SanityImageSource;
  artistName: string;
  artistEmail: string;
  artistBio: PortableTextBlock[];
  artistQuote: string;
  artistPortrait?: SanityImageSource;
  quoteBannerBackground?: SanityImageSource;
  homeFeatureTilesHeading?: string;
  homeFeatureTiles?: SanityHomeTile[];
  socialInstagram: string;
  socialYoutube: string;
  footerCopyright: string;
}

export interface SanityPageContent {
  pageId: string;
  heading?: string;
  subtitle?: string;
  introText?: string;
  featuredWorksHeading?: string;
  seo?: { title?: string; description?: string };
}
