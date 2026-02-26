import Image from "next/image";
import { urlFor } from "@/sanity/client";
import type { SanityArtworkImage } from "@/sanity/types";

interface SanityImageProps {
  image: SanityArtworkImage;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

export default function SanityImage({
  image,
  width,
  height,
  fill,
  sizes,
  priority = false,
  className = "",
}: SanityImageProps) {
  const url = urlFor(image.image).auto("format").quality(85).url();

  if (fill) {
    return (
      <Image
        src={url}
        alt={image.alt || ""}
        fill
        sizes={sizes || "100vw"}
        priority={priority}
        className={className}
        style={{ objectFit: "cover" }}
      />
    );
  }

  return (
    <Image
      src={url}
      alt={image.alt || ""}
      width={width || 800}
      height={height || 1000}
      sizes={sizes || "(max-width: 768px) 100vw, 50vw"}
      priority={priority}
      className={className}
    />
  );
}
