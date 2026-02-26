import { defineType, defineField } from "sanity";

export default defineType({
  name: "artwork",
  title: "Artwork",
  type: "document",
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "pricing", title: "Pricing" },
    { name: "signed", title: "Signed Edition" },
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
      name: "category",
      title: "Category",
      type: "string",
      group: "details",
      options: {
        list: [
          { title: "Original", value: "original" },
          { title: "Print", value: "print" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "collection",
      title: "Collection",
      type: "string",
      group: "details",
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
      title: "Featured",
      type: "boolean",
      group: "details",
      initialValue: false,
    }),
    defineField({
      name: "sold",
      title: "Sold",
      type: "boolean",
      group: "details",
      initialValue: false,
    }),
    // Pricing
    defineField({
      name: "price",
      title: "Price (USD)",
      type: "number",
      group: "pricing",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "edition",
      title: "Edition",
      type: "string",
      group: "pricing",
      description: 'e.g. "Edition of 50"',
      hidden: ({ document }) => document?.category !== "print",
    }),
    // Signed Edition (only visible for prints)
    defineField({
      name: "signedPrice",
      title: "Signed Price (USD)",
      type: "number",
      group: "signed",
      hidden: ({ document }) => document?.category !== "print",
    }),
    defineField({
      name: "signedEdition",
      title: "Signed Edition",
      type: "string",
      group: "signed",
      description: 'e.g. "Signed Edition of 15"',
      hidden: ({ document }) => document?.category !== "print",
    }),
    defineField({
      name: "signedDescription",
      title: "Signed Description",
      type: "text",
      rows: 3,
      group: "signed",
      hidden: ({ document }) => document?.category !== "print",
    }),
    // Images
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      group: "images",
      of: [{ type: "artworkImage" }],
      validation: (Rule) => Rule.min(1),
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
      subtitle: "collection",
      media: "images.0.image",
    },
  },
});
