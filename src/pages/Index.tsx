import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CatalogSection from "@/components/CatalogSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-16">
      <HeroSection />
      <CatalogSection />
      <Footer />
    </div>
  </div>
);

export default Index;
