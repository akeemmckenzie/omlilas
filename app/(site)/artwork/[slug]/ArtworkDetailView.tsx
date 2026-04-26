"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { SanityArtwork } from "@/sanity/types";
import { formatPrice } from "@/lib/sanity";
import SanityImage from "@/components/SanityImage";
import ArtworkPlaceholder from "@/components/ArtworkPlaceholder";

interface ArtworkDetailViewProps {
  artwork: SanityArtwork;
}

export default function ArtworkDetailView({ artwork }: ArtworkDetailViewProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [signed, setSigned] = useState(false);

  const isPrint = artwork.category === "print";
  const hasSigned = isPrint && !!artwork.signedPrice;
  const hasImages = artwork.images && artwork.images.length > 0;
  const imageCount = hasImages ? artwork.images.length : 0;

  const currentPrice =
    signed && artwork.signedPrice ? artwork.signedPrice : artwork.price;
  const currentEdition =
    signed && artwork.signedEdition ? artwork.signedEdition : artwork.edition;

  const openFullscreen = (index: number) => {
    setFullscreenIndex(index);
    setFullscreen(true);
  };

  const nextFullscreen = () =>
    setFullscreenIndex((i) => (i + 1) % imageCount);
  const prevFullscreen = () =>
    setFullscreenIndex((i) => (i - 1 + imageCount) % imageCount);

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
              {/* Main image */}
              <button
                onClick={() => hasImages && openFullscreen(selectedImage)}
                className="w-full cursor-zoom-in"
                aria-label="View full screen"
              >
                <div className="gallery-shadow bg-cream-light p-4 sm:p-6">
                  {hasImages ? (
                    <SanityImage
                      image={artwork.images[selectedImage]}
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

              {/* Thumbnail strip */}
              {imageCount > 1 && (
                <div className="flex gap-3">
                  {artwork.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`flex-1 transition-all duration-200 ${
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
                <h1 className="font-serif text-3xl md:text-4xl text-charcoal tracking-wide mb-4">
                  {artwork.title}
                </h1>

                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-charcoal/50 mb-6">
                  <span>{artwork.year}</span>
                  <span>{artwork.medium}</span>
                  <span>{artwork.dimensions}</span>
                  {currentEdition && <span>{currentEdition}</span>}
                </div>

                {/* Signed / Unsigned toggle for prints */}
                {hasSigned && (
                  <div className="mb-6">
                    <div className="inline-flex rounded-sm overflow-hidden border border-charcoal/15">
                      <button
                        onClick={() => setSigned(false)}
                        className={`px-5 py-2.5 text-xs tracking-widest uppercase transition-all duration-200 ${
                          !signed
                            ? "bg-charcoal text-cream"
                            : "bg-transparent text-charcoal/50 hover:text-charcoal"
                        }`}
                      >
                        Unsigned
                      </button>
                      <button
                        onClick={() => setSigned(true)}
                        className={`px-5 py-2.5 text-xs tracking-widest uppercase transition-all duration-200 relative ${
                          signed
                            ? "bg-accent text-cream"
                            : "bg-transparent text-charcoal/50 hover:text-charcoal"
                        }`}
                      >
                        Signed
                        <span
                          className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-accent/80 animate-pulse"
                          style={{
                            display: signed ? "none" : "inline-block",
                          }}
                        />
                      </button>
                    </div>
                  </div>
                )}

                {/* Price */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={signed ? "signed" : "unsigned"}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="text-2xl text-charcoal font-serif mb-6"
                  >
                    {formatPrice(currentPrice)}
                  </motion.p>
                </AnimatePresence>

                {/* Signed highlight banner */}
                <AnimatePresence>
                  {signed && hasSigned && artwork.signedDescription && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mb-6 p-4 bg-accent/8 border border-accent/20 rounded-sm">
                        <p className="text-xs tracking-[0.15em] uppercase text-accent font-medium mb-2">
                          Artist Signed Edition
                        </p>
                        <p className="text-sm text-charcoal/60 leading-relaxed">
                          {artwork.signedDescription}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Description */}
                {(!signed || !artwork.signedDescription) && (
                  <p className="text-sm text-charcoal/60 leading-relaxed mb-8">
                    {artwork.description}
                  </p>
                )}
                {signed && artwork.signedDescription && <div className="mb-2" />}

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/contact"
                    className="px-10 py-3.5 bg-charcoal text-cream text-xs tracking-widest uppercase hover:bg-charcoal/85 hover:scale-[1.02] transition-all duration-300"
                  >
                    Inquire
                  </Link>
                </div>
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
                    image={artwork.images[fullscreenIndex]}
                    width={1200}
                    height={1500}
                    sizes="90vw"
                    className="w-full h-auto"
                  />
                </motion.div>
              </AnimatePresence>

              {imageCount > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {artwork.images.map((_, i) => (
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
