import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { sanityConfig } from "./config";

const isConfigured =
  sanityConfig.projectId &&
  sanityConfig.projectId !== "YOUR_PROJECT_ID_HERE" &&
  /^[a-z0-9-]+$/.test(sanityConfig.projectId);

export const client = isConfigured
  ? createClient({
      projectId: sanityConfig.projectId,
      dataset: sanityConfig.dataset,
      apiVersion: sanityConfig.apiVersion,
      useCdn: sanityConfig.useCdn,
    })
  : null;

const builder = client ? imageUrlBuilder(client) : null;

interface UrlBuilderLike {
  auto: (mode?: string) => UrlBuilderLike;
  quality: (q?: number) => UrlBuilderLike;
  width: (w?: number) => UrlBuilderLike;
  height: (h?: number) => UrlBuilderLike;
  url: () => string;
}

function emptyBuilder(): UrlBuilderLike {
  const stub: UrlBuilderLike = {
    auto: () => stub,
    quality: () => stub,
    width: () => stub,
    height: () => stub,
    url: () => "",
  };
  return stub;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any): UrlBuilderLike {
  if (!builder) return emptyBuilder();
  return builder.image(source) as unknown as UrlBuilderLike;
}
