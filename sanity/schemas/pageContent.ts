import { defineType, defineField } from "sanity";

export default defineType({
  name: "pageContent",
  title: "Page Content",
  type: "document",
  fields: [
    defineField({
      name: "pageId",
      title: "Page",
      type: "string",
      options: {
        list: [
          { title: "Home", value: "home" },
          { title: "Originals", value: "originals" },
          { title: "Prints", value: "prints" },
          { title: "Blog", value: "blog" },
          { title: "About", value: "about" },
          { title: "Contact", value: "contact" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "introText",
      title: "Intro Text",
      type: "text",
      rows: 4,
      description: "Used on Contact page.",
    }),
    defineField({
      name: "featuredWorksHeading",
      title: "Featured Works Heading",
      type: "string",
      description: "Used on Home page.",
      hidden: ({ document }) => document?.pageId !== "home",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoFields",
    }),
  ],
  preview: {
    select: { title: "pageId" },
    prepare: ({ title }) => ({
      title: `Page: ${title ? title.charAt(0).toUpperCase() + title.slice(1) : "Unknown"}`,
    }),
  },
});
