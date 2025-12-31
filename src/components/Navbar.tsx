import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Beranda", href: "#beranda" },
  { name: "Profil", href: "#profil" },
  { name: "Kegiatan", href: "#kegiatan" },
  { name: "Galeri", href: "#galeri" },
  { name: "Kontak", href: "#kontak" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a 
            href="#beranda" 
            onClick={(e) => { e.preventDefault(); scrollToSection("#beranda"); }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg md:text-xl">ا</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display font-bold text-foreground text-sm md:text-base">Pondok Pesantren</h1>
              <p className="text-accent font-semibold text-xs md:text-sm">Al-Hidayah</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="text-foreground/80 hover:text-primary font-medium transition-colors duration-200"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 animate-slide-up">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="text-foreground/80 hover:text-primary hover:bg-secondary/50 py-3 px-4 rounded-lg text-left font-medium transition-all duration-200"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
