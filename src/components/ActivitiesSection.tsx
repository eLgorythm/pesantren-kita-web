import { useEffect, useState } from "react";
import { Calendar, Clock, Sun, Moon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Activity {
  id: string;
  title: string;
  description: string | null;
  category: string;
  time_info: string | null;
}

export const ActivitiesSection = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error && data) {
        setActivities(data);
      }
      setLoading(false);
    };

    fetchActivities();
  }, []);

  const getActivitiesByCategory = (category: string) => {
    return activities.filter((a) => a.category === category);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "harian":
        return <Sun className="w-5 h-5" />;
      case "mingguan":
        return <Calendar className="w-5 h-5" />;
      case "tahunan":
        return <Moon className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <section id="kegiatan" className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">Memuat kegiatan...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="kegiatan" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-heading">
            Kegiatan <span className="text-primary">Pesantren</span>
          </h2>
          <p className="section-subheading">
            Program pembelajaran dan kegiatan santri di Pondok Pesantren Al-Hidayah
          </p>
        </div>

        {/* Activities Tabs */}
        <Tabs defaultValue="harian" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-secondary/50 p-1 rounded-xl">
            <TabsTrigger 
              value="harian" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-3 font-medium transition-all"
            >
              <Sun className="w-4 h-4 mr-2" />
              Harian
            </TabsTrigger>
            <TabsTrigger 
              value="mingguan"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-3 font-medium transition-all"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Mingguan
            </TabsTrigger>
            <TabsTrigger 
              value="tahunan"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-3 font-medium transition-all"
            >
              <Moon className="w-4 h-4 mr-2" />
              Tahunan
            </TabsTrigger>
          </TabsList>

          {["harian", "mingguan", "tahunan"].map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getActivitiesByCategory(category).length > 0 ? (
                  getActivitiesByCategory(category).map((activity, index) => (
                    <div
                      key={activity.id}
                      className="card-elevated p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          {getCategoryIcon(category)}
                        </div>
                        <h3 className="font-display font-semibold text-lg text-foreground">
                          {activity.title}
                        </h3>
                      </div>
                      {activity.description && (
                        <p className="text-muted-foreground mb-4">{activity.description}</p>
                      )}
                      {activity.time_info && (
                        <div className="flex items-center gap-2 text-sm text-accent font-medium">
                          <Clock className="w-4 h-4" />
                          {activity.time_info}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    Belum ada kegiatan {category} yang ditambahkan.
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};
