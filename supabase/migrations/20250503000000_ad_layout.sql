-- Add ad layout preference to global settings
ALTER TABLE global_settings
  ADD COLUMN IF NOT EXISTS ad_layout VARCHAR(10) NOT NULL DEFAULT 'v1';
