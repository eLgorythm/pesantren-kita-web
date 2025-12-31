import { useEffect, useState } from "react";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface ContactInfo {
  address: string;
  whatsapp: string | null;
  email: string | null;
  maps_embed: string | null;
}

export const ContactSection = () => {
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      const { data, error } = await supabase
        .from("contact_info")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setContact(data);
      }
      setLoading(false);
    };

    fetchContact();
  }, []);

  const handleWhatsApp = () => {
    if (contact?.whatsapp) {
      const phone = contact.whatsapp.replace(/\D/g, "");
      window.open(`https://wa.me/${phone}?text=Assalamualaikum, saya ingin bertanya tentang pendaftaran santri.`, "_blank");
    }
  };

  if (loading) {
    return (
      <section id="kontak" className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">Memuat kontak...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="kontak" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-heading">
            Hubungi <span className="text-primary">Kami</span>
          </h2>
          <p className="section-subheading">
            Jangan ragu untuk menghubungi kami untuk informasi lebih lanjut
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            {/* Address */}
            <div className="card-elevated p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">Alamat</h3>
                <p className="text-muted-foreground">
                  {contact?.address || "Jl. Pesantren No. 123, Kecamatan ABC, Kabupaten XYZ"}
                </p>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="card-elevated p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">WhatsApp</h3>
                <p className="text-muted-foreground mb-3">
                  {contact?.whatsapp || "081234567890"}
                </p>
                <Button 
                  onClick={handleWhatsApp}
                  className="bg-[#25D366] hover:bg-[#128C7E] text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat WhatsApp
                </Button>
              </div>
            </div>

            {/* Email */}
            <div className="card-elevated p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">Email</h3>
                <a 
                  href={`mailto:${contact?.email || "info@pesantren.id"}`}
                  className="text-primary hover:underline"
                >
                  {contact?.email || "info@pesantren.id"}
                </a>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="card-elevated overflow-hidden h-[400px] lg:h-full min-h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.84513!3d-6.208763!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMzEuNSJTIDEwNsKwNTAnNDIuNSJF!5e0!3m2!1sen!2sid!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Pondok Pesantren Al-Hidayah"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
