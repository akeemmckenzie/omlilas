"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { sanityConfig } from "./sanity/config";

export default defineConfig({
  name: "omlilas-studio",
  title: "OMLILAS Studio",
  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
  basePath: "/studio",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Singleton: Site Settings
            S.listItem()
              .title("Site Settings")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings"),
              ),
            S.divider(),
            // Collections (series)
            S.documentTypeListItem("collection").title("Collections"),
            // Artworks
            S.documentTypeListItem("artwork").title("Artworks"),
            S.divider(),
            // Page Content
            S.documentTypeListItem("pageContent").title("Page Content"),
          ]),
    }),
    visionTool({ defaultApiVersion: sanityConfig.apiVersion }),
  ],

  schema: {
    types: schemaTypes,
  },
});
