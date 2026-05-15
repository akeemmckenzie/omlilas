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

export type ArtworkVariant = "original" | "signed" | "unsigned";

export interface SanitySignedSize {
  _key: string;
  label: string;
  price: number;
  stock: number;
}

export interface SanityUnsignedSize {
  _key: string;
  label: string;
  price: number;
}

export interface SanityArtwork {
  _id: string;
  _type: "artwork";
  title: string;
  slug: { current: string };
  collection?: SanityCollectionRef;
  medium?: string;
  dimensions?: string;
  year?: number;
  description?: string;
  featured?: boolean;

  // Original variant
  hasOriginal?: boolean;
  originalPrice?: number;
  originalSold?: boolean;

  // Unsigned print variant
  hasUnsignedPrint?: boolean;
  unsignedPrice?: number;
  unsignedEdition?: string;
  unsignedSizes?: SanityUnsignedSize[];

  // Signed print variant
  hasSignedPrint?: boolean;
  signedPrice?: number;
  signedEdition?: string;
  signedStock?: number;
  signedDescription?: string;
  signedImages?: SanityArtworkImage[];
  signedSizes?: SanitySignedSize[];

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
  usShippingRate?: number;
  intlShippingRate?: number;
  socialInstagram: string;
  socialYoutube: string;
  footerCopyright: string;
}

export interface SanityOrderItem {
  artworkId?: string;
  title: string;
  variant: "signed" | "unsigned";
  sizeLabel?: string;
  sizeKey?: string;
  quantity: number;
  unitPrice: number;
}

export interface SanityOrder {
  _id: string;
  orderNumber?: string;
  status: "paid" | "fulfilled" | "refunded" | "cancelled";
  placedAt: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  customerEmail?: string;
  customerName?: string;
  shippingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  items: SanityOrderItem[];
  stripeSessionId: string;
  stripePaymentIntentId?: string;
}

export interface SanityPageContent {
  pageId: string;
  heading?: string;
  subtitle?: string;
  introText?: string;
  featuredWorksHeading?: string;
  seo?: { title?: string; description?: string };
}

export interface SanityBlogPostListItem {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  category?: string;
  excerpt?: string;
}

export interface SanityFeaturedBlogPost extends SanityBlogPostListItem {
  coverImage?: SanityImageSource;
}

export interface SanityBlogPost {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  category?: string;
  excerpt?: string;
  coverImage?: SanityImageSource;
  body?: PortableTextBlock[];
  seo?: { title?: string; description?: string };
}
