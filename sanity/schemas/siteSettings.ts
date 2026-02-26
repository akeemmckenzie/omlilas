import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "hero", title: "Hero" },
    { name: "artist", title: "Artist" },
    { name: "social", title: "Social & Footer" },
  ],
  fields: [
    // General
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      group: "general",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "general",
    }),
    // Hero
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroCtaText",
      title: "Hero Button Text",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroCtaLink",
      title: "Hero Button Link",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroBackgroundImage",
      title: "Hero Background Image",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      description:
        "Optional. If not set, the gradient background is used.",
    }),
    // Artist
    defineField({
      name: "artistName",
      title: "Artist Name",
      type: "string",
      group: "artist",
    }),
    defineField({
      name: "artistEmail",
      title: "Artist Email",
      type: "string",
      group: "artist",
    }),
    defineField({
      name: "artistBio",
      title: "Artist Bio",
      type: "array",
      group: "artist",
      of: [{ type: "block" }],
      description: "Rich text biography.",
    }),
    defineField({
      name: "artistQuote",
      title: "Artist Quote",
      type: "text",
      rows: 3,
      group: "artist",
    }),
    defineField({
      name: "artistPortrait",
      title: "Artist Portrait",
      type: "image",
      group: "artist",
      options: { hotspot: true },
    }),
    defineField({
      name: "quoteBannerBackground",
      title: "Quote Banner Background Image",
      type: "image",
      group: "artist",
      options: { hotspot: true },
      description: "Optional background image for the quote banner.",
    }),
    // Social & Footer
    defineField({
      name: "socialInstagram",
      title: "Instagram URL",
      type: "url",
      group: "social",
    }),
    defineField({
      name: "socialYoutube",
      title: "YouTube URL",
      type: "url",
      group: "social",
    }),
    defineField({
      name: "footerCopyright",
      title: "Footer Copyright",
      type: "string",
      group: "social",
    }),
  ],
});
