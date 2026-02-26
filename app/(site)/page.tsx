import HeroSection from "@/components/HeroSection";
import FeaturedWorks from "@/components/FeaturedWorks";
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
      <FeaturedWorks
        artworks={featured}
        heading={pageContent?.featuredWorksHeading || "Selected Works"}
      />
    </>
  );
}
