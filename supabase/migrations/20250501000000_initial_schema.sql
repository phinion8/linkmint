-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'publisher' CHECK (role IN ('admin', 'publisher')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Links table
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  short_code VARCHAR(10) UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT true,
  total_clicks INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_links_short_code ON links(short_code);
CREATE INDEX idx_links_user_id ON links(user_id);

-- Link steps configuration (per-link step overrides)
CREATE TABLE link_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  timer_seconds INTEGER NOT NULL DEFAULT 5,
  ad_html TEXT,
  button_text VARCHAR(50) NOT NULL DEFAULT 'Continue',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(link_id, step_order)
);

CREATE INDEX idx_link_steps_link_id ON link_steps(link_id);

-- Step templates (admin-defined defaults)
CREATE TABLE step_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  timer_seconds INTEGER NOT NULL DEFAULT 5,
  ad_html TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Click tracking
CREATE TABLE clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  country VARCHAR(2),
  device_type VARCHAR(20),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clicks_link_id ON clicks(link_id);
CREATE INDEX idx_clicks_created_at ON clicks(created_at);

-- Visit sessions (tracks multi-step progress)
CREATE TABLE visit_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  click_id UUID REFERENCES clicks(id),
  session_token VARCHAR(64) UNIQUE NOT NULL,
  current_step INTEGER NOT NULL DEFAULT 1,
  total_steps INTEGER NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_visit_sessions_token ON visit_sessions(session_token);

-- Global settings (single row)
CREATE TABLE global_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  default_steps INTEGER NOT NULL DEFAULT 3,
  default_timer_seconds INTEGER NOT NULL DEFAULT 5,
  max_links_per_user INTEGER NOT NULL DEFAULT 100,
  site_name VARCHAR(100) NOT NULL DEFAULT 'LinkMint',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default settings
INSERT INTO global_settings (default_steps, default_timer_seconds, max_links_per_user, site_name)
VALUES (3, 5, 100, 'LinkMint');

-- Function to increment click count
CREATE OR REPLACE FUNCTION increment_click_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE links SET total_clicks = total_clicks + 1, updated_at = NOW()
  WHERE id = NEW.link_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_clicks
AFTER INSERT ON clicks
FOR EACH ROW EXECUTE FUNCTION increment_click_count();

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_links_updated_at
BEFORE UPDATE ON links
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_settings_updated_at
BEFORE UPDATE ON global_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
