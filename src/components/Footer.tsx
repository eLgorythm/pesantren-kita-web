import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo & About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <span className="font-display font-bold text-lg">ا</span>
              </div>
              <div>
                <h3 className="font-display font-bold">Pondok Pesantren</h3>
                <p className="text-gold text-sm font-semibold">Al-Hidayah</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              Mencetak generasi Qurani yang berakhlak mulia dan berwawasan luas untuk kemajuan umat dan bangsa.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Navigasi</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#beranda" className="text-primary-foreground/80 hover:text-gold transition-colors">Beranda</a>
              </li>
              <li>
                <a href="#profil" className="text-primary-foreground/80 hover:text-gold transition-colors">Profil</a>
              </li>
              <li>
                <a href="#kegiatan" className="text-primary-foreground/80 hover:text-gold transition-colors">Kegiatan</a>
              </li>
              <li>
                <a href="#galeri" className="text-primary-foreground/80 hover:text-gold transition-colors">Galeri</a>
              </li>
              <li>
                <a href="#kontak" className="text-primary-foreground/80 hover:text-gold transition-colors">Kontak</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4">Kontak</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>Jl. Pesantren No. 123</li>
              <li>Telp: 081234567890</li>
              <li>Email: info@alhidayah.sch.id</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/20 pt-8 text-center">
          <p className="text-sm text-primary-foreground/70 flex items-center justify-center gap-1">
            © {new Date().getFullYear()} Pondok Pesantren Al-Hidayah. Dibuat dengan 
            <Heart className="w-4 h-4 text-accent fill-accent" />
          </p>
        </div>
      </div>
    </footer>
  );
};
