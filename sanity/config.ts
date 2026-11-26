export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-02-25",
  // Keep the Sanity CDN off. Next.js already caches every page, and the
  // revalidate webhook rebuilds pages the moment content is published. With the
  // CDN on, that rebuild read stale data (the CDN can lag a minute or more) and
  // the stale page was then cached for another hour.
  useCdn: false,
};
