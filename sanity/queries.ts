import { groq } from "next-sanity";

const collectionProjection = `
  collection-> {
    _id,
    title,
    "slug": slug.current,
    description
  }
`;

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
    homeFeatureTilesHeading,
    homeFeatureTiles[] {
      image,
      title,
      text,
      link
    },
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
    _id, title, slug, category, ${collectionProjection}, medium, dimensions, year,
    description, featured, sold, price,
    images[] { image, alt, caption }
  }
`;

export const printsQuery = groq`
  *[_type == "artwork" && category == "print"] | order(year desc) {
    _id, title, slug, category, ${collectionProjection}, medium, dimensions, year,
    description, featured, sold, price, edition,
    signedPrice, signedEdition, signedDescription,
    images[] { image, alt, caption }
  }
`;

export const featuredArtworksQuery = groq`
  *[_type == "artwork" && featured == true] | order(year desc) {
    _id, title, slug, category, ${collectionProjection}, medium, price, signedPrice,
    sold, featured,
    images[] { image, alt, caption }
  }
`;

export const artworkBySlugQuery = groq`
  *[_type == "artwork" && slug.current == $slug][0] {
    _id, title, slug, category, ${collectionProjection}, medium, dimensions, year,
    description, featured, sold, price, edition,
    signedPrice, signedEdition, signedDescription,
    images[] { image, alt, caption },
    seo
  }
`;

export const allArtworkSlugsQuery = groq`
  *[_type == "artwork"].slug.current
`;

export const collectionsQuery = groq`
  *[_type == "collection"] | order(order asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    coverImage,
    order,
    "artworkCount": count(*[_type == "artwork" && category == "original" && references(^._id)])
  }
`;

export const collectionBySlugQuery = groq`
  *[_type == "collection" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    coverImage
  }
`;

export const originalsByCollectionQuery = groq`
  *[_type == "artwork" && category == "original" && collection->slug.current == $slug]
    | order(year desc) {
      _id, title, slug, category, ${collectionProjection}, medium, dimensions, year,
      description, featured, sold, price,
      images[] { image, alt, caption }
    }
`;

export const allCollectionSlugsQuery = groq`
  *[_type == "collection"].slug.current
`;
