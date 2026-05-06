-- Enable Row Level Security on ALL tables
-- Our app uses service_role key which bypasses RLS,
-- so this blocks public/anon API access without affecting our app

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE step_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- No policies needed — we use service_role key which bypasses RLS
-- This simply blocks anon/public key access to all tables
