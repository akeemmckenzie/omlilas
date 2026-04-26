import HeroSection from "@/components/HeroSection";
import FeaturedWorks from "@/components/FeaturedWorks";
import HomeFeatureTiles from "@/components/HomeFeatureTiles";
import HomeJournal from "@/components/HomeJournal";
import {
  getSiteSettings,
  getPageContent,
  getFeaturedArtworks,
  getFeaturedBlogPosts,
} from "@/lib/sanity";

export default async function Home() {
  const [settings, pageContent, featured, featuredPosts] = await Promise.all([
    getSiteSettings(),
    getPageContent("home"),
    getFeaturedArtworks(),
    getFeaturedBlogPosts(),
  ]);

  return (
    <>
      <HeroSection settings={settings} />
      <HomeFeatureTiles
        tiles={settings?.homeFeatureTiles}
        heading={settings?.homeFeatureTilesHeading}
      />
      <FeaturedWorks
        artworks={featured}
        heading={pageContent?.featuredWorksHeading || "Selected Works"}
      />
      <HomeJournal posts={featuredPosts} />
    </>
  );
}
