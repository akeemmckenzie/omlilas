import Link from "next/link";
import { Instagram, Youtube } from "lucide-react";
import type { SanitySettings } from "@/sanity/types";

interface FooterProps {
  settings?: SanitySettings | null;
}

export default function Footer({ settings }: FooterProps) {
  const copyright = settings?.footerCopyright || "© 2025 OMLILAS. All rights reserved.";
  const instagram = settings?.socialInstagram || "https://instagram.com/omlilas";
  const youtube = settings?.socialYoutube || "https://youtube.com/@omlilas";

  return (
    <footer className="bg-cream border-t border-charcoal/5">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <Link
              href="/"
              className="font-serif text-xl tracking-wide text-charcoal"
            >
              OMLILAS
            </Link>
            <p className="text-xs text-charcoal/40 mt-2">{copyright}</p>
          </div>

          <nav className="flex items-center gap-6">
            {["Originals", "Prints", "About", "Contact"].map((label) => (
              <Link
                key={label}
                href={`/${label.toLowerCase()}`}
                className="text-xs tracking-widest uppercase text-charcoal/50 hover:text-charcoal transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoal/40 hover:text-charcoal transition-colors duration-200"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href={youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoal/40 hover:text-charcoal transition-colors duration-200"
              aria-label="YouTube"
            >
              <Youtube size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
