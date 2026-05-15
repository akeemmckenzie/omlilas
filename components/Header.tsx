"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Instagram, Menu, Youtube } from "lucide-react";
import MobileMenu from "./MobileMenu";
import CartButton from "./CartButton";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/originals", label: "Originals" },
  { href: "/prints", label: "Prints" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

interface HeaderProps {
  socialLinks?: {
    instagram?: string;
    youtube?: string;
  };
}

export default function Header({ socialLinks }: HeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const instagram = socialLinks?.instagram || "https://instagram.com/omlilas";
  const youtube = socialLinks?.youtube || "https://youtube.com/@omlilas";

  return (
    <>
      <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-sm border-b border-charcoal/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-2xl tracking-wide text-charcoal"
          >
            OMLILAS
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link text-sm tracking-wide transition-colors duration-200 ${
                  pathname === link.href
                    ? "active text-charcoal"
                    : "text-charcoal/70 hover:text-charcoal"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoal/60 hover:text-charcoal transition-colors duration-200 hidden sm:block"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href={youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoal/60 hover:text-charcoal transition-colors duration-200 hidden sm:block"
              aria-label="YouTube"
            >
              <Youtube size={18} />
            </a>
            <CartButton />
            <button
              className="md:hidden text-charcoal/70 hover:text-charcoal transition-colors duration-200 ml-1"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={navLinks}
        pathname={pathname}
        socialLinks={{ instagram, youtube }}
      />
    </>
  );
}
