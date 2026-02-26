"use client";

import { useRef } from "react";

interface ContactFormProps {
  email?: string;
}

export default function ContactForm({
  email = "hello@omlilas.com",
}: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const data = new FormData(form);
    const firstName = data.get("firstName") as string;
    const lastName = data.get("lastName") as string;
    const senderEmail = data.get("email") as string;
    const subject = (data.get("subject") as string) || "Inquiry from OMLILAS Website";
    const message = data.get("message") as string;

    const body = [
      `Name: ${firstName} ${lastName}`,
      `Email: ${senderEmail}`,
      "",
      message,
    ].join("\n");

    const mailtoUrl = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="firstName"
            className="block text-xs tracking-widest uppercase text-charcoal/50 mb-2"
          >
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            className="w-full px-4 py-3 bg-cream border border-charcoal/10 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-accent/50 transition-colors duration-200"
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-xs tracking-widest uppercase text-charcoal/50 mb-2"
          >
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            className="w-full px-4 py-3 bg-cream border border-charcoal/10 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-accent/50 transition-colors duration-200"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-xs tracking-widest uppercase text-charcoal/50 mb-2"
        >
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-4 py-3 bg-cream border border-charcoal/10 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-accent/50 transition-colors duration-200"
        />
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-xs tracking-widest uppercase text-charcoal/50 mb-2"
        >
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          className="w-full px-4 py-3 bg-cream border border-charcoal/10 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-accent/50 transition-colors duration-200"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-xs tracking-widest uppercase text-charcoal/50 mb-2"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className="w-full px-4 py-3 bg-cream border border-charcoal/10 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-accent/50 transition-colors duration-200 resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full sm:w-auto px-10 py-3.5 bg-charcoal text-cream text-xs tracking-widest uppercase hover:bg-charcoal/85 transition-colors duration-200"
      >
        Send Message
      </button>
    </form>
  );
}
