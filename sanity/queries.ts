import { groq } from "next-sanity";

const collectionProjection = `
  collection-> {
    _id,
    title,
    "slug": slug.current,
    description
  }
`;

const variantFieldsProjection = `
  hasOriginal,
  originalPrice,
  originalSold,
  hasUnsignedPrint,
  unsignedPrice,
  unsignedEdition,
  unsignedSizes[] { _key, label, price },
  hasSignedPrint,
  signedPrice,
  signedEdition,
  signedStock,
  signedDescription,
  signedImages[] { image, alt, caption },
  signedSizes[] { _key, label, price, stock }
`;

const artworkListProjection = `
  _id,
  title,
  slug,
  ${collectionProjection},
  medium,
  dimensions,
  year,
  description,
  featured,
  ${variantFieldsProjection},
  images[] { image, alt, caption }
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
    usShippingRate,
    intlShippingRate,
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

// Originals: artworks tagged as "Available as Original"
export const originalsQuery = groq`
  *[_type == "artwork" && hasOriginal == true] | order(year desc) {
    ${artworkListProjection}
  }
`;

// All prints (signed or unsigned). The /prints page splits client-side.
export const printsQuery = groq`
  *[_type == "artwork" && (hasSignedPrint == true || hasUnsignedPrint == true)]
    | order(year desc) {
      ${artworkListProjection}
    }
`;

export const featuredArtworksQuery = groq`
  *[_type == "artwork" && featured == true] | order(year desc) {
    ${artworkListProjection}
  }
`;

export const artworkBySlugQuery = groq`
  *[_type == "artwork" && slug.current == $slug][0] {
    ${artworkListProjection},
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
    "artworkCount": count(*[_type == "artwork" && hasOriginal == true && references(^._id)])
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
  *[_type == "artwork" && hasOriginal == true && collection->slug.current == $slug]
    | order(year desc) {
      ${artworkListProjection}
    }
`;

export const allCollectionSlugsQuery = groq`
  *[_type == "collection"].slug.current
`;

// Blog
export const blogPostsQuery = groq`
  *[_type == "blogPost" && defined(publishedAt) && publishedAt <= now()]
    | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      category,
      excerpt
    }
`;

export const featuredBlogPostsQuery = groq`
  *[_type == "blogPost"
    && featured == true
    && defined(publishedAt)
    && publishedAt <= now()]
    | order(publishedAt desc)[0...3] {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      category,
      excerpt,
      coverImage
    }
`;

export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    category,
    excerpt,
    coverImage,
    body,
    seo
  }
`;

export const allBlogPostSlugsQuery = groq`
  *[_type == "blogPost" && defined(publishedAt) && publishedAt <= now()].slug.current
`;

// Server-side: lookup the current state of artworks for cart validation at checkout
export const artworksByIdsQuery = groq`
  *[_type == "artwork" && _id in $ids] {
    _id,
    title,
    "slug": slug.current,
    hasSignedPrint,
    signedPrice,
    signedStock,
    signedSizes[] { _key, label, price, stock },
    hasUnsignedPrint,
    unsignedPrice,
    unsignedSizes[] { _key, label, price },
    "imageUrl": images[0].image.asset->url
  }
`;
