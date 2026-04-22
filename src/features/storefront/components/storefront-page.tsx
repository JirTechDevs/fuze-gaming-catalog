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

interface StorefrontPageProps {
  products: Product[];
  banners: StorefrontBanner[];
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
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="pt-14 sm:pt-16">
            <HeroSection banners={banners} />
            <CatalogSection products={products} />
            <div className="mx-auto h-[2px] w-[90%] max-w-[1480px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <TestimoniSection />
            <div className="mx-auto h-[2px] w-[90%] max-w-[1480px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <FAQSection />
            <Footer />
          </div>
        </div>
      )}
    </>
  );
}
