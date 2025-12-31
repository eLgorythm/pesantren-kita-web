import { useEffect, useState } from "react";
import { BookOpen, Target, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PesantrenProfile {
  name: string;
  short_history: string;
  vision: string;
  mission: string[];
}

export const ProfileSection = () => {
  const [profile, setProfile] = useState<PesantrenProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("pesantren_profile")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <section id="profil" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">Memuat profil...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="profil" className="py-20 bg-secondary/30 islamic-pattern">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-heading">
            Profil <span className="text-primary">Pesantren</span>
          </h2>
          <p className="section-subheading">
            Mengenal lebih dekat Pondok Pesantren Al-Hidayah
          </p>
        </div>

        {/* Sejarah */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="card-elevated p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">Sejarah Pesantren</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {profile?.short_history || "Pesantren kami telah berdiri sejak puluhan tahun yang lalu dengan misi mencetak generasi Islam yang berkualitas."}
            </p>
          </div>
        </div>

        {/* Visi & Misi */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Visi */}
          <div className="card-elevated p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">Visi</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {profile?.vision || "Menjadi lembaga pendidikan Islam terdepan yang mencetak generasi Qurani."}
            </p>
          </div>

          {/* Misi */}
          <div className="card-elevated p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">Misi</h3>
            </div>
            <ul className="space-y-3">
              {(profile?.mission || ["Menyelenggarakan pendidikan Islam berkualitas"]).map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
