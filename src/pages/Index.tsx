import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ProfileSection } from "@/components/ProfileSection";
import { ActivitiesSection } from "@/components/ActivitiesSection";
import { GallerySection } from "@/components/GallerySection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { usePageTracking } from "@/hooks/usePageTracking";

const Index = () => {
  usePageTracking("/");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <ProfileSection />
        <ActivitiesSection />
        <GallerySection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
