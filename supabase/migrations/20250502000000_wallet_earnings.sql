-- Add CPM rate to global settings
ALTER TABLE global_settings
  ADD COLUMN IF NOT EXISTS cpm_rate DECIMAL(10, 4) NOT NULL DEFAULT 1.5000;

-- Update default row
UPDATE global_settings SET cpm_rate = 1.5000;

-- User wallets
CREATE TABLE user_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  balance DECIMAL(12, 4) NOT NULL DEFAULT 0,
  total_earned DECIMAL(12, 4) NOT NULL DEFAULT 0,
  total_withdrawn DECIMAL(12, 4) NOT NULL DEFAULT 0,
  min_payout DECIMAL(10, 4) NOT NULL DEFAULT 5.0000,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_wallets_user_id ON user_wallets(user_id);

-- Earnings log (per-click revenue)
CREATE TABLE earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  click_id UUID REFERENCES clicks(id) ON DELETE SET NULL,
  amount DECIMAL(10, 6) NOT NULL,
  cpm_rate DECIMAL(10, 4) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_earnings_user_id ON earnings(user_id);
CREATE INDEX idx_earnings_link_id ON earnings(link_id);
CREATE INDEX idx_earnings_created_at ON earnings(created_at);

-- Payout requests
CREATE TABLE payout_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(12, 4) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'rejected')),
  payout_method VARCHAR(50),
  payout_details TEXT,
  admin_note TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payout_requests_user_id ON payout_requests(user_id);
CREATE INDEX idx_payout_requests_status ON payout_requests(status);

-- Function to auto-create wallet on user creation
CREATE OR REPLACE FUNCTION create_user_wallet()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_wallets (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_wallet
AFTER INSERT ON users
FOR EACH ROW EXECUTE FUNCTION create_user_wallet();

-- Function to record earnings on each completed visit session
CREATE OR REPLACE FUNCTION record_earning()
RETURNS TRIGGER AS $$
DECLARE
  v_link RECORD;
  v_cpm DECIMAL(10, 4);
  v_amount DECIMAL(10, 6);
BEGIN
  IF NEW.completed = true AND (OLD.completed IS NULL OR OLD.completed = false) THEN
    SELECT * INTO v_link FROM links WHERE id = NEW.link_id;
    SELECT cpm_rate INTO v_cpm FROM global_settings LIMIT 1;

    -- Calculate earning: CPM / 1000
    v_amount := v_cpm / 1000;

    -- Insert earning record
    INSERT INTO earnings (user_id, link_id, click_id, amount, cpm_rate)
    VALUES (v_link.user_id, NEW.link_id, NEW.click_id, v_amount, v_cpm);

    -- Update wallet
    UPDATE user_wallets
    SET balance = balance + v_amount,
        total_earned = total_earned + v_amount,
        updated_at = NOW()
    WHERE user_id = v_link.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_record_earning
AFTER UPDATE ON visit_sessions
FOR EACH ROW EXECUTE FUNCTION record_earning();

-- Auto-update wallet timestamps
CREATE TRIGGER trigger_wallet_updated_at
BEFORE UPDATE ON user_wallets
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create wallets for existing users
INSERT INTO user_wallets (user_id)
SELECT id FROM users
WHERE id NOT IN (SELECT user_id FROM user_wallets);
