"use client";

import { motion } from "framer-motion";
import { Instagram, Mail, Youtube } from "lucide-react";
import type { SanitySettings } from "@/sanity/types";
import type { SanityPageContent } from "@/sanity/types";
import QuoteBanner from "@/components/QuoteBanner";
import ContactForm from "@/components/ContactForm";

interface ContactContentProps {
  settings?: SanitySettings | null;
  page?: SanityPageContent | null;
}

export default function ContactContent({
  settings,
  page,
}: ContactContentProps) {
  const quote =
    settings?.artistQuote ||
    "Each piece of art is infused with intentional, meaningful energy, honoring the materials and the creative process.";
  const email = settings?.artistEmail || "hello@omlilas.com";
  const instagram =
    settings?.socialInstagram || "https://instagram.com/omlilas";
  const youtube = settings?.socialYoutube || "https://youtube.com/@omlilas";
  const heading = page?.heading || "Custom Pieces & General Inquiries";
  const introText =
    page?.introText ||
    "Whether you're interested in commissioning a custom piece, inquiring about an existing work, or simply want to say hello — we'd love to hear from you.";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <QuoteBanner
        quote={quote}
        backgroundImage={settings?.quoteBannerBackground}
        bgColors={["#3D2B1F", "#5C4033", "#2F2018"]}
      />

      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="font-serif text-3xl md:text-4xl text-charcoal tracking-wide mb-6">
                {heading}
              </h1>
              <p className="text-sm text-charcoal/50 leading-relaxed mb-8">
                {introText}
              </p>

              <div className="space-y-4">
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 text-sm text-charcoal/60 hover:text-charcoal transition-colors duration-200"
                >
                  <Mail size={16} />
                  {email}
                </a>
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-charcoal/60 hover:text-charcoal transition-colors duration-200"
                >
                  <Instagram size={16} />
                  Instagram
                </a>
                <a
                  href={youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-charcoal/60 hover:text-charcoal transition-colors duration-200"
                >
                  <Youtube size={16} />
                  YouTube
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <ContactForm email={email} />
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
