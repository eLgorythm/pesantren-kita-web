import heroImage from "@/assets/hero-mosque.jpg";

export const HeroSection = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="beranda" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Masjid Pesantren Al-Hidayah"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/90" />
      </div>

      {/* Islamic Pattern Overlay */}
      <div className="absolute inset-0 islamic-pattern opacity-20" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-20">
        <div className="max-w-4xl mx-auto">
          {/* Bismillah */}
          <p className="text-gold font-display text-2xl md:text-3xl mb-6 animate-fade-in">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
          </p>

          {/* Main Heading */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 animate-slide-up">
            Pondok Pesantren
            <span className="block text-gold mt-2">Al-Hidayah</span>
          </h1>

          {/* Tagline */}
          <p className="text-primary-foreground/90 text-lg md:text-xl lg:text-2xl mb-8 max-w-2xl mx-auto animate-slide-up delay-200">
            Mencetak Generasi Qurani yang Berakhlak Mulia dan Berwawasan Luas
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-300">
            <button 
              onClick={() => scrollToSection("#profil")}
              className="btn-hero"
            >
              Pelajari Lebih Lanjut
            </button>
            <button 
              onClick={() => scrollToSection("#kontak")}
              className="px-8 py-4 rounded-xl border-2 border-primary-foreground/50 text-primary-foreground font-semibold hover:bg-primary-foreground/10 transition-all duration-300"
            >
              Hubungi Kami
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/50 flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary-foreground/70 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};
