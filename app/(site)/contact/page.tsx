import type { Metadata } from "next";
import { getSiteSettings, getPageContent } from "@/lib/sanity";
import ContactContent from "./ContactContent";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent("contact");
  return {
    title: page?.seo?.title || "Contact",
    description:
      page?.seo?.description ||
      "Get in touch for custom pieces, commissions, or general inquiries.",
  };
}

export default async function ContactPage() {
  const [settings, page] = await Promise.all([
    getSiteSettings(),
    getPageContent("contact"),
  ]);

  return <ContactContent settings={settings} page={page} />;
}
