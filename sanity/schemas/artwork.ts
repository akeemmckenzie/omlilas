import { defineType, defineField } from "sanity";

export default defineType({
  name: "artwork",
  title: "Artwork",
  type: "document",
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "original", title: "Original" },
    { name: "unsigned", title: "Unsigned Print" },
    { name: "signed", title: "Signed Print" },
    { name: "images", title: "Images" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "details",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "details",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "collection",
      title: "Collection / Series",
      type: "reference",
      to: [{ type: "collection" }],
      group: "details",
      description:
        "The series this artwork belongs to. Manage series under Collection in the studio.",
    }),
    defineField({
      name: "medium",
      title: "Medium",
      type: "string",
      group: "details",
    }),
    defineField({
      name: "dimensions",
      title: "Dimensions",
      type: "string",
      group: "details",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      group: "details",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 5,
      group: "details",
    }),
    defineField({
      name: "featured",
      title: "Featured on Home",
      type: "boolean",
      group: "details",
      initialValue: false,
    }),

    // Original variant
    defineField({
      name: "hasOriginal",
      title: "Available as Original",
      type: "boolean",
      group: "original",
      initialValue: false,
      description: "Tick if a one-of-a-kind original is being offered.",
    }),
    defineField({
      name: "originalPrice",
      title: "Original Price (USD)",
      type: "number",
      group: "original",
      hidden: ({ document }) => !document?.hasOriginal,
      validation: (Rule) =>
        Rule.custom((value, ctx) => {
          const doc = ctx.document as { hasOriginal?: boolean } | undefined;
          if (doc?.hasOriginal && (value === undefined || value === null)) {
            return "Required when Original is enabled.";
          }
          return true;
        }).min(0),
    }),
    defineField({
      name: "originalSold",
      title: "Original Sold",
      type: "boolean",
      group: "original",
      initialValue: false,
      hidden: ({ document }) => !document?.hasOriginal,
    }),

    // Unsigned print variant
    defineField({
      name: "hasUnsignedPrint",
      title: "Available as Unsigned Print",
      type: "boolean",
      group: "unsigned",
      initialValue: false,
      description: "Tick if unsigned prints are available (unlimited stock).",
    }),
    defineField({
      name: "unsignedPrice",
      title: "Unsigned Price (USD)",
      type: "number",
      group: "unsigned",
      hidden: ({ document }) => !document?.hasUnsignedPrint,
      validation: (Rule) =>
        Rule.custom((value, ctx) => {
          const doc = ctx.document as { hasUnsignedPrint?: boolean } | undefined;
          if (doc?.hasUnsignedPrint && (value === undefined || value === null)) {
            return "Required when Unsigned Print is enabled.";
          }
          return true;
        }).min(0),
    }),
    defineField({
      name: "unsignedEdition",
      title: "Edition Note",
      type: "string",
      group: "unsigned",
      description: 'Optional, e.g. "Open Edition" or "Edition of 100".',
      hidden: ({ document }) => !document?.hasUnsignedPrint,
    }),
    defineField({
      name: "unsignedSizes",
      title: "Sizes",
      type: "array",
      group: "unsigned",
      description:
        "Optional. Add one or more sizes (e.g. 8×10, 11×14). When set, the customer picks a size at checkout and the unit price comes from the selected size. Leave empty to use the single Unsigned Price above.",
      hidden: ({ document }) => !document?.hasUnsignedPrint,
      of: [
        {
          type: "object",
          name: "unsignedPrintSize",
          title: "Size",
          fields: [
            {
              name: "label",
              title: "Label",
              type: "string",
              description: 'e.g. "8×10" or "11×14 inches".',
              validation: (Rule) => Rule.required(),
            },
            {
              name: "price",
              title: "Price (USD)",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            },
          ],
          preview: {
            select: { title: "label", price: "price" },
            prepare: ({ title, price }) => ({
              title,
              subtitle: typeof price === "number" ? `$${price}` : "—",
            }),
          },
        },
      ],
    }),

    // Signed print variant
    defineField({
      name: "hasSignedPrint",
      title: "Available as Signed Print",
      type: "boolean",
      group: "signed",
      initialValue: false,
      description: "Tick if a hand-signed and numbered edition is available.",
    }),
    defineField({
      name: "signedPrice",
      title: "Signed Price (USD)",
      type: "number",
      group: "signed",
      hidden: ({ document }) => !document?.hasSignedPrint,
      validation: (Rule) =>
        Rule.custom((value, ctx) => {
          const doc = ctx.document as { hasSignedPrint?: boolean } | undefined;
          if (doc?.hasSignedPrint && (value === undefined || value === null)) {
            return "Required when Signed Print is enabled.";
          }
          return true;
        }).min(0),
    }),
    defineField({
      name: "signedEdition",
      title: "Signed Edition Note",
      type: "string",
      group: "signed",
      description: 'e.g. "Signed Edition of 15".',
      hidden: ({ document }) => !document?.hasSignedPrint,
    }),
    defineField({
      name: "signedStock",
      title: "Signed Stock Remaining",
      type: "number",
      group: "signed",
      description:
        "How many signed prints are still available. When 0, the signed variant is shown as Sold Out.",
      hidden: ({ document }) => !document?.hasSignedPrint,
      validation: (Rule) => Rule.min(0).integer(),
    }),
    defineField({
      name: "signedDescription",
      title: "Signed Description",
      type: "text",
      rows: 3,
      group: "signed",
      hidden: ({ document }) => !document?.hasSignedPrint,
    }),
    defineField({
      name: "signedSizes",
      title: "Sizes",
      type: "array",
      group: "signed",
      description:
        "Optional. Add one or more sizes — each with its own price and stock count. When set, the customer picks a size at checkout. Leave empty to use the single Signed Price and Stock fields above.",
      hidden: ({ document }) => !document?.hasSignedPrint,
      of: [
        {
          type: "object",
          name: "signedPrintSize",
          title: "Size",
          fields: [
            {
              name: "label",
              title: "Label",
              type: "string",
              description: 'e.g. "8×10" or "11×14 inches".',
              validation: (Rule) => Rule.required(),
            },
            {
              name: "price",
              title: "Price (USD)",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            },
            {
              name: "stock",
              title: "Stock Remaining",
              type: "number",
              description:
                "Signed prints are limited; how many of this size are still available.",
              validation: (Rule) => Rule.required().min(0).integer(),
            },
          ],
          preview: {
            select: { title: "label", price: "price", stock: "stock" },
            prepare: ({ title, price, stock }) => ({
              title,
              subtitle:
                (typeof price === "number" ? `$${price}` : "—") +
                (typeof stock === "number" ? ` · ${stock} in stock` : ""),
            }),
          },
        },
      ],
    }),

    // Images
    defineField({
      name: "images",
      title: "Images (shared)",
      type: "array",
      group: "images",
      description:
        "Main images for this artwork. Used on the originals and unsigned print views, and as the base gallery for the signed view.",
      of: [{ type: "artworkImage" }],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "signedImages",
      title: "Signed Print — Extra Images",
      type: "array",
      group: "images",
      description:
        "Optional. Additional photos shown only on the signed print view (e.g. signing/numbering close-ups). Appended to the shared images.",
      of: [{ type: "artworkImage" }],
      hidden: ({ document }) => !document?.hasSignedPrint,
    }),

    // SEO
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoFields",
      group: "seo",
    }),
  ],
  orderings: [
    {
      title: "Year (Newest)",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
    {
      title: "Title",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "collection.title",
      media: "images.0.image",
    },
  },
});
