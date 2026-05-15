import { createClient } from "next-sanity";
import { sanityConfig } from "./config";

const token = process.env.SANITY_API_TOKEN;

const isConfigured =
  sanityConfig.projectId &&
  sanityConfig.projectId !== "YOUR_PROJECT_ID_HERE" &&
  /^[a-z0-9-]+$/.test(sanityConfig.projectId) &&
  !!token;

export const writeClient = isConfigured
  ? createClient({
      projectId: sanityConfig.projectId,
      dataset: sanityConfig.dataset,
      apiVersion: sanityConfig.apiVersion,
      useCdn: false,
      token,
    })
  : null;
