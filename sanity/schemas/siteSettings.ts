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
    // Home: 4 feature tiles
    defineField({
      name: "homeFeatureTilesHeading",
      title: "Home Feature Tiles Heading",
      type: "string",
      group: "hero",
      description: "Optional heading shown above the 4 home tiles.",
    }),
    defineField({
      name: "homeFeatureTiles",
      title: "Home Feature Tiles",
      type: "array",
      group: "hero",
      description:
        "Up to 4 clickable tiles shown on the home page between the hero and Selected Works.",
      validation: (Rule) => Rule.max(4),
      of: [
        {
          type: "object",
          name: "homeTile",
          title: "Tile",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
              name: "text",
              title: "Text",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "link",
              title: "Link",
              type: "string",
              description:
                "Optional URL or path (e.g. /originals or /artwork/some-slug).",
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "link", media: "image" },
          },
        },
      ],
    }),
    // Shipping (used by Stripe Checkout for prints)
    defineField({
      name: "usShippingRate",
      title: "US Shipping Rate (USD)",
      type: "number",
      group: "general",
      description:
        "Flat shipping rate for US orders. Used at Stripe Checkout for prints.",
      initialValue: 15,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "intlShippingRate",
      title: "International Shipping Rate (USD)",
      type: "number",
      group: "general",
      description:
        "Unused — international shipping is currently disabled. Re-enable in app/api/checkout/route.ts when ready.",
      initialValue: 40,
      hidden: true,
      validation: (Rule) => Rule.min(0),
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
