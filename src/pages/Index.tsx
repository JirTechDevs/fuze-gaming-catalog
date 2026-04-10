import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import IntroScreen from "@/components/IntroScreen";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CatalogSection from "@/components/CatalogSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [introComplete, setIntroComplete] = useState(false);
  const handleComplete = useCallback(() => setIntroComplete(true), []);

  return (
    <>
      {!introComplete && <IntroScreen onComplete={handleComplete} />}
      <AnimatePresence>
        {introComplete && (
          <motion.div
            className="min-h-screen bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Navbar />
            <div className="pt-12">
              <HeroSection />
              <CatalogSection />
              <Footer />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Index;
