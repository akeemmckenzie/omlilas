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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  if (!builder) {
    return { auto: () => ({ quality: () => ({ width: () => ({ url: () => "" }), url: () => "" }) }) };
  }
  return builder.image(source);
}
