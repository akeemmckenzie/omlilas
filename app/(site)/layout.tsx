import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/lib/cart/CartContext";
import { getSiteSettings } from "@/lib/sanity";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  const socialLinks = {
    instagram: settings?.socialInstagram || "https://instagram.com/omlilas",
    youtube: settings?.socialYoutube || "https://youtube.com/@omlilas",
  };

  return (
    <CartProvider>
      <Header socialLinks={socialLinks} />
      <main className="min-h-screen">{children}</main>
      <Footer settings={settings} />
      <CartDrawer />
    </CartProvider>
  );
}
