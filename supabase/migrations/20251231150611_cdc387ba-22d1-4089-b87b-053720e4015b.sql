-- Create profiles table for admin users
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- Create user roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

-- Handle new user trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Pesantren profile table
CREATE TABLE public.pesantren_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Pondok Pesantren Al-Hidayah',
  short_history TEXT DEFAULT 'Pesantren kami berdiri sejak tahun 1985...',
  vision TEXT DEFAULT 'Mencetak generasi Qurani yang berakhlak mulia',
  mission TEXT[] DEFAULT ARRAY['Menyelenggarakan pendidikan Islam berkualitas', 'Membina akhlak santri dengan teladan Rasulullah', 'Mengembangkan potensi santri secara optimal'],
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pesantren_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read pesantren profile" ON public.pesantren_profile
FOR SELECT USING (true);

CREATE POLICY "Admins can update pesantren profile" ON public.pesantren_profile
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Activities table
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('harian', 'mingguan', 'tahunan')),
  time_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read activities" ON public.activities
FOR SELECT USING (true);

CREATE POLICY "Admins can insert activities" ON public.activities
FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update activities" ON public.activities
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete activities" ON public.activities
FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Gallery table
CREATE TABLE public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read gallery" ON public.gallery
FOR SELECT USING (true);

CREATE POLICY "Admins can insert gallery" ON public.gallery
FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update gallery" ON public.gallery
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete gallery" ON public.gallery
FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Contact info table
CREATE TABLE public.contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address TEXT NOT NULL DEFAULT 'Jl. Pesantren No. 123, Kecamatan ABC',
  whatsapp TEXT DEFAULT '081234567890',
  email TEXT DEFAULT 'info@pesantren.id',
  maps_embed TEXT DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0!2d106.8!3d-6.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read contact info" ON public.contact_info
FOR SELECT USING (true);

CREATE POLICY "Admins can update contact info" ON public.contact_info
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Insert initial data
INSERT INTO public.pesantren_profile (name, short_history, vision, mission) VALUES (
  'Pondok Pesantren Al-Hidayah',
  'Pondok Pesantren Al-Hidayah didirikan pada tahun 1985 oleh KH. Ahmad Dahlan sebagai lembaga pendidikan Islam yang bertujuan mencetak generasi muda yang berakhlak mulia dan berwawasan luas. Sejak berdiri, pesantren kami telah meluluskan ribuan santri yang kini berkontribusi di berbagai bidang.',
  'Mencetak generasi Qurani yang berakhlak mulia, berwawasan luas, dan berkontribusi positif bagi masyarakat',
  ARRAY['Menyelenggarakan pendidikan Islam yang berkualitas dan berkarakter', 'Membina akhlak santri dengan teladan Rasulullah SAW', 'Mengembangkan potensi akademik dan non-akademik santri', 'Membangun lingkungan pesantren yang kondusif untuk pembelajaran']
);

INSERT INTO public.contact_info (address, whatsapp, email) VALUES (
  'Jl. Pesantren No. 123, Desa Sukamaju, Kecamatan Barokah, Kabupaten Amanah, Jawa Barat 12345',
  '081234567890',
  'info@alhidayah.sch.id'
);

-- Insert sample activities
INSERT INTO public.activities (title, description, category, time_info) VALUES
('Sholat Berjamaah', 'Sholat lima waktu berjamaah di masjid pesantren', 'harian', '05:00 - 21:00'),
('Tadarus Al-Quran', 'Membaca dan mengkaji Al-Quran bersama ustadz', 'harian', 'Setelah Subuh & Maghrib'),
('Kajian Kitab Kuning', 'Pembelajaran kitab-kitab klasik Islam', 'harian', '08:00 - 11:00'),
('Muhadharah', 'Latihan pidato dan ceramah untuk santri', 'mingguan', 'Setiap Jumat Malam'),
('Khataman Al-Quran', 'Upacara wisuda santri yang telah khatam Al-Quran', 'tahunan', 'Bulan Ramadhan'),
('Haul Pendiri', 'Peringatan wafatnya pendiri pesantren', 'tahunan', '15 Muharram');

-- Create storage bucket for gallery
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);

-- Storage policies
CREATE POLICY "Anyone can view gallery images" ON storage.objects
FOR SELECT USING (bucket_id = 'gallery');

CREATE POLICY "Admins can upload gallery images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete gallery images" ON storage.objects
FOR DELETE USING (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));