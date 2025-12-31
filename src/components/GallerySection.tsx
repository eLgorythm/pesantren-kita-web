import { useEffect, useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import galleryStudy from "@/assets/gallery-study.jpg";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  description: string | null;
}

export const GallerySection = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setGallery(data);
      }
      setLoading(false);
    };

    fetchGallery();
  }, []);

  // Default gallery images if database is empty
  const defaultGallery: GalleryItem[] = [
    {
      id: "1",
      title: "Kegiatan Belajar Mengajar",
      image_url: galleryStudy,
      description: "Santri sedang mengaji bersama",
    },
  ];

  const displayGallery = gallery.length > 0 ? gallery : defaultGallery;

  if (loading) {
    return (
      <section id="galeri" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">Memuat galeri...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="galeri" className="py-20 bg-secondary/30 islamic-pattern">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-heading">
            Galeri <span className="text-primary">Pesantren</span>
          </h2>
          <p className="section-subheading">
            Momen-momen berharga dari berbagai kegiatan di Pondok Pesantren Al-Hidayah
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {displayGallery.map((item, index) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-xl card-elevated cursor-pointer"
              onClick={() => setSelectedImage(item)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6">
                <div>
                  <h3 className="text-primary-foreground font-display font-semibold text-lg">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-primary-foreground/80 text-sm mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <ZoomIn className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card border-border">
            <VisuallyHidden>
              <DialogTitle>{selectedImage?.title || "Gallery Image"}</DialogTitle>
            </VisuallyHidden>
            {selectedImage && (
              <div className="relative">
                <img
                  src={selectedImage.image_url}
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/90 to-transparent p-6">
                  <h3 className="text-primary-foreground font-display font-semibold text-xl">
                    {selectedImage.title}
                  </h3>
                  {selectedImage.description && (
                    <p className="text-primary-foreground/80 mt-2">
                      {selectedImage.description}
                    </p>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};
