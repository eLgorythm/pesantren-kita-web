import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Profile {
  id: string;
  name: string;
  short_history: string | null;
  vision: string | null;
  mission: string[] | null;
}

export function ProfileManager() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newMission, setNewMission] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("pesantren_profile")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else if (data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);

    const { error } = await supabase
      .from("pesantren_profile")
      .update({
        name: profile.name,
        short_history: profile.short_history,
        vision: profile.vision,
        mission: profile.mission,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Berhasil", description: "Profil berhasil diperbarui" });
    }
    setSaving(false);
  };

  const addMission = () => {
    if (!newMission.trim() || !profile) return;
    setProfile({
      ...profile,
      mission: [...(profile.mission || []), newMission.trim()],
    });
    setNewMission("");
  };

  const removeMission = (index: number) => {
    if (!profile) return;
    setProfile({
      ...profile,
      mission: profile.mission?.filter((_, i) => i !== index) || [],
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return <p className="text-muted-foreground">Profil tidak ditemukan</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informasi Umum</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Pesantren</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="history">Sejarah Singkat</Label>
            <Textarea
              id="history"
              rows={4}
              value={profile.short_history || ""}
              onChange={(e) => setProfile({ ...profile, short_history: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visi & Misi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vision">Visi</Label>
            <Textarea
              id="vision"
              rows={2}
              value={profile.vision || ""}
              onChange={(e) => setProfile({ ...profile, vision: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Misi</Label>
            <div className="space-y-2">
              {profile.mission?.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex-1 p-2 bg-muted rounded text-sm">{item}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMission(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Tambah misi baru..."
                value={newMission}
                onChange={(e) => setNewMission(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addMission()}
              />
              <Button variant="outline" onClick={addMission}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Simpan Perubahan
      </Button>
    </div>
  );
}
