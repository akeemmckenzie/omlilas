import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "OMLILAS — Contemporary Visual Art",
    template: "%s | OMLILAS",
  },
  description:
    "Explore original paintings and limited-edition prints by OMLILAS. Contemporary visual art rooted in memory, landscape, and material identity.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "OMLILAS — Contemporary Visual Art",
    description:
      "Explore original paintings and limited-edition prints by OMLILAS.",
    siteName: "OMLILAS",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${dmSans.variable} font-sans bg-cream text-charcoal antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
