"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Instagram, Youtube } from "lucide-react";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
  pathname: string;
  socialLinks: {
    instagram: string;
    youtube: string;
  };
}

export default function MobileMenu({
  open,
  onClose,
  links,
  pathname,
  socialLinks,
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-charcoal/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-full w-72 bg-cream z-50 shadow-2xl"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-10">
                <span className="font-serif text-xl tracking-wide text-charcoal">
                  OMLILAS
                </span>
                <button
                  onClick={onClose}
                  className="text-charcoal/60 hover:text-charcoal transition-colors"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              <nav className="flex flex-col gap-6">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className={`text-lg tracking-wide transition-colors duration-200 ${
                      pathname === link.href
                        ? "text-charcoal font-medium"
                        : "text-charcoal/60 hover:text-charcoal"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-12 pt-8 border-t border-charcoal/10 flex gap-5">
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-charcoal/50 hover:text-charcoal transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-charcoal/50 hover:text-charcoal transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
