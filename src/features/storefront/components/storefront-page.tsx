"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/features/catalog/domain/product";
import CatalogSection from "@/features/storefront/components/catalog-section";
import Footer from "@/features/storefront/components/footer";
import HeroSection from "@/features/storefront/components/hero-section";
import IntroScreen from "@/features/storefront/components/intro-screen";
import Navbar from "@/features/storefront/components/navbar";

interface StorefrontPageProps {
  products: Product[];
}

export default function StorefrontPage({ products }: StorefrontPageProps) {
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
          <div className="pt-12">
            <HeroSection />
            <CatalogSection products={products} />
            <Footer />
          </div>
        </div>
      )}
    </>
  );
}
