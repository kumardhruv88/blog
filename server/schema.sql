-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  username VARCHAR(50) UNIQUE NOT NULL,
  avatar_url TEXT,
  cover_image_url TEXT,
  bio TEXT,
  location VARCHAR(100),
  website VARCHAR(255),
  github_url VARCHAR(255),
  linkedin_url VARCHAR(255),
  twitter_url VARCHAR(255),
  devto_url VARCHAR(255),
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT FALSE,
  default_editor VARCHAR(10) DEFAULT 'markdown',
  theme VARCHAR(10) DEFAULT 'dark',
  posts_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  bookmarks_received INTEGER DEFAULT 0,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7),
  icon VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  meta_title VARCHAR(60),
  meta_description VARCHAR(160),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. POSTS TABLE
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image_url TEXT,
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'draft',
  visibility VARCHAR(20) DEFAULT 'public',
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  reading_time INTEGER,
  views INTEGER DEFAULT 0,
  unique_views INTEGER DEFAULT 0,
  bookmarks_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  meta_title VARCHAR(60),
  meta_description VARCHAR(160),
  focus_keyword VARCHAR(100),
  canonical_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TAGS TABLE
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  posts_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. POST_TAGS TABLE (Junction)
CREATE TABLE public.post_tags (
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (post_id, tag_id)
);

-- 6. COMMENTS TABLE
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'approved',
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. COMMENT_LIKES TABLE
CREATE TABLE public.comment_likes (
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (comment_id, user_id)
);

-- 8. BOOKMARKS TABLE
CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- 9. VIEWS TABLE
CREATE TABLE public.views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. FOLLOWERS TABLE
CREATE TABLE public.followers (
  follower_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- 11. SETTINGS TABLE
CREATE TABLE public.settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name VARCHAR(100) DEFAULT 'TechScribe',
  site_tagline VARCHAR(200),
  logo_url TEXT,
  favicon_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#64FFDA',
  accent_color VARCHAR(7) DEFAULT '#8B5CF6',
  meta_title VARCHAR(60),
  meta_description VARCHAR(160),
  og_image_url TEXT,
  google_analytics_id VARCHAR(50),
  twitter_handle VARCHAR(50),
  github_url VARCHAR(255),
  linkedin_url VARCHAR(255),
  allow_registration BOOLEAN DEFAULT TRUE,
  require_email_verification BOOLEAN DEFAULT TRUE,
  comment_moderation BOOLEAN DEFAULT FALSE,
  custom_css TEXT,
  custom_js TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. ACTIVITY_LOGS TABLE
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. NEWSLETTER_SUBSCRIBERS TABLE
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. RPC FUNCTIONS
CREATE OR REPLACE FUNCTION increment_post_view(post_id_input UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.posts
  SET views = views + 1
  WHERE id = post_id_input;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_comments_count(post_id_input UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.posts
  SET comments_count = comments_count + 1
  WHERE id = post_id_input;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_comments_count(post_id_input UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.posts
  SET comments_count = GREATEST(0, comments_count - 1)
  WHERE id = post_id_input;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_bookmarks_count(post_id_input UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.posts
  SET bookmarks_count = bookmarks_count + 1
  WHERE id = post_id_input;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_bookmarks_count(post_id_input UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.posts
  SET bookmarks_count = GREATEST(0, bookmarks_count - 1)
  WHERE id = post_id_input;
END;
$$ LANGUAGE plpgsql;


-- INDEXES for Performance
CREATE INDEX idx_posts_slug ON public.posts(slug);
CREATE INDEX idx_posts_author ON public.posts(author_id);
CREATE INDEX idx_posts_category ON public.posts(category_id);
CREATE INDEX idx_posts_status ON public.posts(status);
CREATE INDEX idx_posts_published_at ON public.posts(published_at DESC);
CREATE INDEX idx_comments_post ON public.comments(post_id);
CREATE INDEX idx_bookmarks_user ON public.bookmarks(user_id);
CREATE INDEX idx_views_post ON public.views(post_id);
CREATE INDEX idx_users_clerk_id ON public.users(clerk_id);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Basic Public Access Policies (Can be refined later)
CREATE POLICY "Public profiles are viewable by everyone" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public posts are viewable by everyone" ON public.posts FOR SELECT USING (status = 'published');
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Tags are viewable by everyone" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Comments are viewable by everyone" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
