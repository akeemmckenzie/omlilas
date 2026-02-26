import type { Metadata } from "next";
import { getSiteSettings, getPageContent } from "@/lib/sanity";
import AboutContent from "./AboutContent";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent("about");
  return {
    title: page?.seo?.title || "About",
    description:
      page?.seo?.description ||
      "Learn about OMLILAS, a contemporary visual artist exploring memory, landscape, and material identity.",
  };
}

export default async function AboutPage() {
  const [settings, page] = await Promise.all([
    getSiteSettings(),
    getPageContent("about"),
  ]);

  return <AboutContent settings={settings} page={page} />;
}
