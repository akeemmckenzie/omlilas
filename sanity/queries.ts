import { groq } from "next-sanity";

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    tagline,
    heroHeadline,
    heroCtaText,
    heroCtaLink,
    heroBackgroundImage,
    artistName,
    artistEmail,
    artistBio,
    artistQuote,
    artistPortrait,
    quoteBannerBackground,
    socialInstagram,
    socialYoutube,
    footerCopyright
  }
`;

export const pageContentQuery = groq`
  *[_type == "pageContent" && pageId == $pageId][0] {
    pageId,
    heading,
    subtitle,
    introText,
    featuredWorksHeading,
    seo
  }
`;

export const originalsQuery = groq`
  *[_type == "artwork" && category == "original"] | order(year desc) {
    _id, title, slug, category, collection, medium, dimensions, year,
    description, featured, sold, price,
    images[] { image, alt, caption }
  }
`;

export const printsQuery = groq`
  *[_type == "artwork" && category == "print"] | order(year desc) {
    _id, title, slug, category, collection, medium, dimensions, year,
    description, featured, sold, price, edition,
    signedPrice, signedEdition, signedDescription,
    images[] { image, alt, caption }
  }
`;

export const featuredArtworksQuery = groq`
  *[_type == "artwork" && featured == true] | order(year desc) {
    _id, title, slug, category, collection, medium, price, signedPrice,
    sold, featured,
    images[] { image, alt, caption }
  }
`;

export const artworkBySlugQuery = groq`
  *[_type == "artwork" && slug.current == $slug][0] {
    _id, title, slug, category, collection, medium, dimensions, year,
    description, featured, sold, price, edition,
    signedPrice, signedEdition, signedDescription,
    images[] { image, alt, caption },
    seo
  }
`;

export const allArtworkSlugsQuery = groq`
  *[_type == "artwork"].slug.current
`;
