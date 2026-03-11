
-- Blog posts table
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'Company News',
  cover_image_url text,
  author_name text NOT NULL DEFAULT 'Dr. Alexis Collier',
  read_time_minutes integer NOT NULL DEFAULT 5,
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamp with time zone,
  meta_description text,
  og_image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Changelog entries table
CREATE TABLE public.changelog_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL DEFAULT 'Feature',
  version text,
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.changelog_entries ENABLE ROW LEVEL SECURITY;

-- Blog: public read for published posts
CREATE POLICY "Anyone can read published blog posts"
  ON public.blog_posts FOR SELECT
  USING (is_published = true);

-- Blog: admin-only write
CREATE POLICY "Admins can manage blog posts"
  ON public.blog_posts FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Changelog: public read for published entries
CREATE POLICY "Anyone can read published changelog entries"
  ON public.changelog_entries FOR SELECT
  USING (is_published = true);

-- Changelog: admin-only write
CREATE POLICY "Admins can manage changelog entries"
  ON public.changelog_entries FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
