import type { ArtworkVariant, SanityArtwork } from "@/sanity/types";

export const VARIANT_PRIORITY: ArtworkVariant[] = [
  "original",
  "signed",
  "unsigned",
];

export const VARIANT_LABELS: Record<ArtworkVariant, string> = {
  original: "Original",
  signed: "Signed Print",
  unsigned: "Unsigned Print",
};

export function hasVariant(
  artwork: SanityArtwork | null | undefined,
  variant: ArtworkVariant,
): boolean {
  if (!artwork) return false;
  if (variant === "original") return !!artwork.hasOriginal;
  if (variant === "signed") return !!artwork.hasSignedPrint;
  return !!artwork.hasUnsignedPrint;
}

export function availableVariants(
  artwork: SanityArtwork | null | undefined,
): ArtworkVariant[] {
  return VARIANT_PRIORITY.filter((v) => hasVariant(artwork, v));
}

export function defaultVariant(
  artwork: SanityArtwork | null | undefined,
): ArtworkVariant | null {
  return availableVariants(artwork)[0] ?? null;
}

export function variantPrice(
  artwork: SanityArtwork,
  variant: ArtworkVariant,
): number | undefined {
  if (variant === "original") return artwork.originalPrice;
  if (variant === "signed") return artwork.signedPrice;
  return artwork.unsignedPrice;
}

export function variantEdition(
  artwork: SanityArtwork,
  variant: ArtworkVariant,
): string | undefined {
  if (variant === "signed") return artwork.signedEdition;
  if (variant === "unsigned") return artwork.unsignedEdition;
  return undefined;
}

export function variantSoldOut(
  artwork: SanityArtwork,
  variant: ArtworkVariant,
): boolean {
  if (variant === "original") return !!artwork.originalSold;
  if (variant === "signed") {
    return typeof artwork.signedStock === "number" && artwork.signedStock <= 0;
  }
  return false;
}

export function variantSoldLabel(
  artwork: SanityArtwork,
  variant: ArtworkVariant,
): string {
  if (variant === "original") return "Sold";
  if (variant === "signed") return "Sold Out";
  return "";
}

export function variantImages(
  artwork: SanityArtwork,
  variant: ArtworkVariant,
) {
  const base = artwork.images || [];
  if (variant === "signed" && artwork.signedImages?.length) {
    return [...base, ...artwork.signedImages];
  }
  return base;
}

export function parseVariantParam(
  raw: unknown,
): ArtworkVariant | undefined {
  if (raw === "original" || raw === "signed" || raw === "unsigned") {
    return raw;
  }
  return undefined;
}
