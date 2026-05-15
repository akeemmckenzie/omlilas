"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import type { ArtworkVariant, SanityArtwork } from "@/sanity/types";
import { formatPrice } from "@/lib/sanity";
import {
  VARIANT_LABELS,
  availableVariants,
  defaultSizeKey,
  defaultVariant,
  findSize,
  hasSizes,
  variantEdition,
  variantImages,
  variantPrice,
  variantSizes,
  variantSoldOut,
} from "@/lib/artworkVariants";
import type { SanitySignedSize, SanityUnsignedSize } from "@/sanity/types";
import SanityImage from "@/components/SanityImage";
import ArtworkPlaceholder from "@/components/ArtworkPlaceholder";
import { useCart } from "@/lib/cart/CartContext";
import { urlFor } from "@/sanity/client";

interface ArtworkDetailViewProps {
  artwork: SanityArtwork;
  initialVariant?: ArtworkVariant;
}

export default function ArtworkDetailView({
  artwork,
  initialVariant,
}: ArtworkDetailViewProps) {
  const variants = useMemo(() => availableVariants(artwork), [artwork]);
  const variant: ArtworkVariant =
    initialVariant && variants.includes(initialVariant)
      ? initialVariant
      : defaultVariant(artwork) || "original";

  const images = useMemo(
    () => variantImages(artwork, variant),
    [artwork, variant],
  );
  const imageCount = images.length;
  const hasImages = imageCount > 0;

  const [selectedImage, setSelectedImage] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [addedFlash, setAddedFlash] = useState(false);

  const { addItem } = useCart();

  const isOriginalVariant = variant === "original";
  const isSignedVariant = variant === "signed";
  const variantHasSizes = hasSizes(artwork, variant);
  const sizes = useMemo(
    () => variantSizes(artwork, variant),
    [artwork, variant],
  );

  const [selectedSizeKey, setSelectedSizeKey] = useState<string | undefined>(
    () => defaultSizeKey(artwork, variant),
  );
  const selectedSize = findSize(artwork, variant, selectedSizeKey) as
    | SanitySignedSize
    | SanityUnsignedSize
    | undefined;

  const price = variantPrice(artwork, variant, selectedSizeKey);
  const edition = variantEdition(artwork, variant);
  const soldOut = variantSoldOut(artwork, variant, selectedSizeKey);

  const isPurchasable =
    !isOriginalVariant &&
    !soldOut &&
    typeof price === "number" &&
    (!variantHasSizes || !!selectedSizeKey);

  const signedSizeStock =
    isSignedVariant && selectedSize && "stock" in selectedSize
      ? (selectedSize as SanitySignedSize).stock
      : null;
  const stockRemaining = isSignedVariant
    ? variantHasSizes
      ? signedSizeStock
      : typeof artwork.signedStock === "number"
        ? artwork.signedStock
        : null
    : null;

  const maxQty = isSignedVariant
    ? typeof stockRemaining === "number"
      ? Math.max(stockRemaining, 1)
      : 1
    : 99;
  const effectiveQty = Math.min(Math.max(qty, 1), maxQty);

  function handleAddToCart() {
    if (!isPurchasable) return;
    if (variant !== "signed" && variant !== "unsigned") return;
    const firstImage = images[0]?.image;
    const imageUrl = firstImage
      ? urlFor(firstImage).width(400).url()
      : undefined;
    addItem(
      {
        artworkId: artwork._id,
        slug: artwork.slug.current,
        title: artwork.title,
        variant,
        unitPrice: price as number,
        edition,
        imageUrl: imageUrl || undefined,
        sizeKey: selectedSizeKey,
        sizeLabel: selectedSize?.label,
      },
      effectiveQty,
    );
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 1200);
  }

  const openFullscreen = (index: number) => {
    setFullscreenIndex(index);
    setFullscreen(true);
  };

  const nextFullscreen = () =>
    setFullscreenIndex((i) => (i + 1) % imageCount);
  const prevFullscreen = () =>
    setFullscreenIndex((i) => (i - 1 + imageCount) % imageCount);

  const otherVariants = variants.filter((v) => v !== variant);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            {/* Left: Image Gallery */}
            <div className="space-y-4">
              <button
                onClick={() => hasImages && openFullscreen(selectedImage)}
                className="w-full cursor-zoom-in"
                aria-label="View full screen"
              >
                <div className="gallery-shadow bg-cream-light p-4 sm:p-6">
                  {hasImages ? (
                    <SanityImage
                      image={images[selectedImage] ?? images[0]}
                      width={800}
                      height={1000}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="w-full h-auto"
                      priority
                    />
                  ) : (
                    <ArtworkPlaceholder
                      colors={["#8B7355", "#A08B6D", "#C4A882"]}
                      aspect="3:4"
                    />
                  )}
                </div>
              </button>

              {imageCount > 1 && (
                <div className="flex gap-3 flex-wrap">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`flex-1 min-w-[60px] transition-all duration-200 ${
                        selectedImage === i
                          ? "ring-2 ring-accent ring-offset-2 ring-offset-cream"
                          : "opacity-60 hover:opacity-100"
                      }`}
                      aria-label={`View image ${i + 1}`}
                    >
                      <div className="bg-cream-light p-1.5">
                        <SanityImage
                          image={img}
                          width={150}
                          height={190}
                          sizes="20vw"
                          className="w-full h-auto"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <p className="text-xs tracking-[0.2em] uppercase text-charcoal/40 mb-3">
                  {artwork.collection?.title}
                </p>
                <h1 className="font-serif text-3xl md:text-4xl text-charcoal tracking-wide mb-2">
                  {artwork.title}
                </h1>
                <p className="text-xs tracking-[0.2em] uppercase text-accent mb-5">
                  {VARIANT_LABELS[variant]}
                </p>

                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-charcoal/50 mb-6">
                  {artwork.year && <span>{artwork.year}</span>}
                  {artwork.medium && <span>{artwork.medium}</span>}
                  {artwork.dimensions && <span>{artwork.dimensions}</span>}
                  {edition && <span>{edition}</span>}
                </div>

                {/* Price / sold-out */}
                {soldOut ? (
                  <p className="text-2xl text-accent font-serif mb-6 tracking-wide uppercase">
                    {variant === "original" ? "Sold" : "Sold Out"}
                  </p>
                ) : typeof price === "number" ? (
                  <p className="text-2xl text-charcoal font-serif mb-6">
                    {formatPrice(price)}
                  </p>
                ) : null}

                {/* Stock indicator for signed prints */}
                {isSignedVariant &&
                  !soldOut &&
                  typeof stockRemaining === "number" && (
                    <p className="text-xs tracking-[0.15em] uppercase text-charcoal/60 mb-6">
                      {stockRemaining === 1
                        ? "Only 1 remaining"
                        : `${stockRemaining} remaining`}
                    </p>
                  )}

                {/* Signed-edition note */}
                {isSignedVariant && artwork.signedDescription && (
                  <div className="mb-6 p-4 bg-accent/8 border border-accent/20 rounded-sm">
                    <p className="text-xs tracking-[0.15em] uppercase text-accent font-medium mb-2">
                      Artist Signed Edition
                    </p>
                    <p className="text-sm text-charcoal/60 leading-relaxed">
                      {artwork.signedDescription}
                    </p>
                  </div>
                )}

                {/* Description */}
                {artwork.description && (
                  <p className="text-sm text-charcoal/60 leading-relaxed mb-8">
                    {artwork.description}
                  </p>
                )}

                {isOriginalVariant ? (
                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/contact"
                      className="px-10 py-3.5 bg-charcoal text-cream text-xs tracking-widest uppercase hover:bg-charcoal/85 hover:scale-[1.02] transition-all duration-300"
                    >
                      Inquire
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {variantHasSizes && (
                      <div>
                        <p className="text-[11px] tracking-[0.2em] uppercase text-charcoal/50 mb-2">
                          Size
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {sizes.map((s) => {
                            const outOfStock =
                              isSignedVariant &&
                              "stock" in s &&
                              typeof (s as SanitySignedSize).stock ===
                                "number" &&
                              (s as SanitySignedSize).stock <= 0;
                            const isSelected = s._key === selectedSizeKey;
                            return (
                              <button
                                key={s._key}
                                type="button"
                                onClick={() => {
                                  setSelectedSizeKey(s._key);
                                  setQty(1);
                                }}
                                disabled={outOfStock}
                                className={`px-4 py-2 text-xs tracking-widest uppercase border transition-colors ${
                                  isSelected
                                    ? "border-charcoal bg-charcoal text-cream"
                                    : "border-charcoal/20 text-charcoal/70 hover:border-charcoal/40 hover:text-charcoal"
                                } ${outOfStock ? "opacity-40 cursor-not-allowed line-through" : ""}`}
                              >
                                {s.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {isPurchasable && (
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] tracking-[0.2em] uppercase text-charcoal/50">
                          Qty
                        </span>
                        <div className="flex items-center border border-charcoal/15">
                          <button
                            type="button"
                            onClick={() => setQty((q) => Math.max(1, q - 1))}
                            disabled={effectiveQty <= 1}
                            className="w-9 h-9 flex items-center justify-center text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5 transition-colors disabled:opacity-40"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center text-sm">
                            {effectiveQty}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setQty((q) => Math.min(maxQty, q + 1))
                            }
                            disabled={effectiveQty >= maxQty}
                            className="w-9 h-9 flex items-center justify-center text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5 transition-colors disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-3 items-center">
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={!isPurchasable}
                        className="px-10 py-3.5 bg-charcoal text-cream text-xs tracking-widest uppercase hover:bg-charcoal/85 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {soldOut
                          ? "Sold Out"
                          : addedFlash
                            ? "Added ✓"
                            : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Cross-link to other variants of the same artwork */}
                {otherVariants.length > 0 && (
                  <div className="mt-10 pt-6 border-t border-charcoal/10">
                    <p className="text-[11px] tracking-[0.2em] uppercase text-charcoal/45 mb-3">
                      Also available as
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {otherVariants.map((v) => (
                        <Link
                          key={v}
                          href={`/artwork/${artwork.slug.current}?v=${v}`}
                          className="text-xs tracking-widest uppercase px-4 py-2 border border-charcoal/15 text-charcoal/70 hover:text-charcoal hover:border-charcoal/40 transition-colors"
                        >
                          {VARIANT_LABELS[v]}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen lightbox */}
      <AnimatePresence>
        {fullscreen && hasImages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center p-6"
            onClick={() => setFullscreen(false)}
          >
            <button
              className="absolute top-6 right-6 text-cream/60 hover:text-cream transition-colors z-10"
              onClick={() => setFullscreen(false)}
              aria-label="Close"
            >
              <X size={28} />
            </button>

            {imageCount > 1 && (
              <>
                <button
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream transition-colors z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevFullscreen();
                  }}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={36} />
                </button>
                <button
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream transition-colors z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextFullscreen();
                  }}
                  aria-label="Next image"
                >
                  <ChevronRight size={36} />
                </button>
              </>
            )}

            <div
              className="max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={fullscreenIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <SanityImage
                    image={images[fullscreenIndex]}
                    width={1200}
                    height={1500}
                    sizes="90vw"
                    className="w-full h-auto"
                  />
                </motion.div>
              </AnimatePresence>

              {imageCount > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFullscreenIndex(i);
                      }}
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        fullscreenIndex === i ? "bg-cream" : "bg-cream/30"
                      }`}
                      aria-label={`Go to image ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
