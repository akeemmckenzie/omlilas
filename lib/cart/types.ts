export type CartVariant = "signed" | "unsigned";

export interface CartItem {
  artworkId: string;
  slug: string;
  title: string;
  variant: CartVariant;
  unitPrice: number;
  quantity: number;
  edition?: string;
  imageUrl?: string;
  sizeKey?: string;
  sizeLabel?: string;
}

export function cartLineKey(
  artworkId: string,
  variant: CartVariant,
  sizeKey?: string,
): string {
  return sizeKey
    ? `${artworkId}:${variant}:${sizeKey}`
    : `${artworkId}:${variant}`;
}
