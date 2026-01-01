import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Image, Users, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Stats {
  activitiesCount: number;
  galleryCount: number;
  todayViews: number;
  totalViews: number;
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get activities count
      const { count: activitiesCount } = await supabase
        .from("activities")
        .select("*", { count: "exact", head: true });

      // Get gallery count
      const { count: galleryCount } = await supabase
        .from("gallery")
        .select("*", { count: "exact", head: true });

      // Get today's views
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: todayViews } = await supabase
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today.toISOString());

      // Get total views
      const { count: totalViews } = await supabase
        .from("page_views")
        .select("*", { count: "exact", head: true });

      setStats({
        activitiesCount: activitiesCount || 0,
        galleryCount: galleryCount || 0,
        todayViews: todayViews || 0,
        totalViews: totalViews || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
    setLoading(false);
  };

  const statItems = [
    {
      label: "Total Kegiatan",
      value: stats?.activitiesCount || 0,
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Foto Galeri",
      value: stats?.galleryCount || 0,
      icon: Image,
      color: "text-accent-foreground",
      bgColor: "bg-accent/20",
    },
    {
      label: "Pengunjung Hari Ini",
      value: stats?.todayViews || 0,
      icon: Users,
      color: "text-secondary-foreground",
      bgColor: "bg-secondary",
    },
    {
      label: "Total Pengunjung",
      value: stats?.totalViews || 0,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-10 w-10 rounded-lg mb-3" />
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statItems.map((item) => (
        <Card key={item.label} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center mb-3`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground">{item.value}</p>
            <p className="text-sm text-muted-foreground">{item.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
