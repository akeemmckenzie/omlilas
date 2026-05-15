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
}

export function cartLineKey(artworkId: string, variant: CartVariant): string {
  return `${artworkId}:${variant}`;
}
