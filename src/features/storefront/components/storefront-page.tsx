"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/features/catalog/domain/product";
import type { StorefrontBanner } from "@/features/storefront/server";
import CatalogSection from "@/features/storefront/components/catalog-section";
import Footer from "@/features/storefront/components/footer";
import HeroSection from "@/features/storefront/components/hero-section";
import IntroScreen from "@/features/storefront/components/intro-screen";
import Navbar from "@/features/storefront/components/navbar";
import TestimoniSection from "@/features/storefront/components/testimoni-section";
import FAQSection from "@/features/storefront/components/faq-section";
import themeStyles from "./storefront-theme.module.css";

interface StorefrontPageProps {
  products: Product[];
  banners: StorefrontBanner[];
}

function FloatingWhatsAppGlyph() {
  return (
    <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true">
      <path
        fill="currentColor"
        d="M27.2 15.4c0 6.2-5 11.3-11.3 11.3-2 0-4-.5-5.7-1.5l-6.1 1.9 2-5.9a11.2 11.2 0 0 1-1.8-5.9C4.3 9.1 9.4 4 15.7 4S27.2 9.1 27.2 15.4Zm-11.5-9.5c-5.2 0-9.4 4.2-9.4 9.4 0 1.9.6 3.7 1.6 5.2l.2.2-1.2 3.7 3.8-1.2.2.1c1.5.9 3.2 1.4 4.9 1.4 5.2 0 9.4-4.2 9.4-9.4 0-5.2-4.2-9.4-9.5-9.4Zm5.4 12c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.7-1.7-2-.2-.3 0-.4.1-.6l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6 0-.2-.7-1.7-.9-2.3-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.3 3.2c.2.2 2.2 3.5 5.4 4.8 3.2 1.2 3.2.8 3.8.7.6-.1 1.8-.8 2.1-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.6-.4Z"
      />
    </svg>
  );
}

export default function StorefrontPage({ products, banners }: StorefrontPageProps) {
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    if (!introComplete) {
      return;
    }

    if (window.location.hash !== "#catalog") {
      return;
    }

    window.setTimeout(() => {
      document
        .getElementById("catalog")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", "/");
    }, 150);
  }, [introComplete]);

  return (
    <>
      {!introComplete && <IntroScreen onComplete={() => setIntroComplete(true)} />}
      {introComplete && (
        <div className={`${themeStyles.storefrontTheme} min-h-screen bg-background`}>
          <Navbar />
          <div className="pt-16 sm:pt-20">
            <HeroSection banners={banners} />
            <CatalogSection products={products} />
            <div className="mx-auto h-[2px] w-[90%] max-w-[1480px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <TestimoniSection />
            <div className="mx-auto h-[2px] w-[90%] max-w-[1480px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <FAQSection />
            <Footer />
            <a
              href="https://wa.me/628881462675"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat via WhatsApp"
              className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#22C55E] text-white shadow-[0_4px_24px_rgba(34,197,94,0.35)] transition hover:scale-[1.03] animate-[whatsapp-pulse_2.8s_ease-in-out_infinite] sm:bottom-6 sm:right-6"
            >
              <FloatingWhatsAppGlyph />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
