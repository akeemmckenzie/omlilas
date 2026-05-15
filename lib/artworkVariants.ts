import type {
  ArtworkVariant,
  SanityArtwork,
  SanitySignedSize,
  SanityUnsignedSize,
} from "@/sanity/types";

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

export function variantSizes(
  artwork: SanityArtwork | null | undefined,
  variant: ArtworkVariant,
): SanitySignedSize[] | SanityUnsignedSize[] {
  if (!artwork) return [];
  if (variant === "signed") return artwork.signedSizes ?? [];
  if (variant === "unsigned") return artwork.unsignedSizes ?? [];
  return [];
}

export function hasSizes(
  artwork: SanityArtwork | null | undefined,
  variant: ArtworkVariant,
): boolean {
  return variantSizes(artwork, variant).length > 0;
}

export function defaultSizeKey(
  artwork: SanityArtwork | null | undefined,
  variant: ArtworkVariant,
): string | undefined {
  const sizes = variantSizes(artwork, variant);
  if (sizes.length === 0) return undefined;
  // For signed, prefer the first in-stock size; otherwise fall back to the first.
  if (variant === "signed") {
    const inStock = (sizes as SanitySignedSize[]).find(
      (s) => typeof s.stock === "number" && s.stock > 0,
    );
    if (inStock) return inStock._key;
  }
  return sizes[0]._key;
}

export function findSize(
  artwork: SanityArtwork | null | undefined,
  variant: ArtworkVariant,
  sizeKey: string | undefined,
): SanitySignedSize | SanityUnsignedSize | undefined {
  if (!sizeKey) return undefined;
  return (variantSizes(artwork, variant) as Array<{ _key: string }>).find(
    (s) => s._key === sizeKey,
  ) as SanitySignedSize | SanityUnsignedSize | undefined;
}

export function variantPrice(
  artwork: SanityArtwork,
  variant: ArtworkVariant,
  sizeKey?: string,
): number | undefined {
  if (variant === "original") return artwork.originalPrice;
  const size = findSize(artwork, variant, sizeKey);
  if (size) return size.price;
  if (hasSizes(artwork, variant)) {
    // Sizes defined but none selected — caller should resolve a size first.
    return undefined;
  }
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
  sizeKey?: string,
): boolean {
  if (variant === "original") return !!artwork.originalSold;
  if (variant === "signed") {
    if (hasSizes(artwork, "signed")) {
      const size = findSize(artwork, "signed", sizeKey) as
        | SanitySignedSize
        | undefined;
      if (size) {
        return typeof size.stock === "number" && size.stock <= 0;
      }
      // No size selected — sold out only if EVERY size is out of stock.
      const sizes = (artwork.signedSizes ?? []) as SanitySignedSize[];
      return sizes.every(
        (s) => typeof s.stock === "number" && s.stock <= 0,
      );
    }
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
