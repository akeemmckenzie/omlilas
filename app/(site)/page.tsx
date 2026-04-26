import HeroSection from "@/components/HeroSection";
import FeaturedWorks from "@/components/FeaturedWorks";
import HomeFeatureTiles from "@/components/HomeFeatureTiles";
import { getSiteSettings, getPageContent, getFeaturedArtworks } from "@/lib/sanity";

export default async function Home() {
  const [settings, pageContent, featured] = await Promise.all([
    getSiteSettings(),
    getPageContent("home"),
    getFeaturedArtworks(),
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
    </>
  );
}
