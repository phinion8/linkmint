import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

// Lazy-initialized server-side client with service role key (full access)
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!_supabase) {
      _supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
    }
    return Reflect.get(_supabase, prop);
  },
});

// Types for our database tables
export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: "admin" | "publisher";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Link {
  id: string;
  short_code: string;
  original_url: string;
  user_id: string;
  title: string | null;
  is_active: boolean;
  total_clicks: number;
  created_at: string;
  updated_at: string;
}

export interface LinkStep {
  id: string;
  link_id: string;
  step_order: number;
  timer_seconds: number;
  ad_html: string | null;
  button_text: string;
  created_at: string;
}

export interface StepTemplate {
  id: string;
  name: string;
  timer_seconds: number;
  ad_html: string | null;
  is_default: boolean;
  created_at: string;
}

export interface Click {
  id: string;
  link_id: string;
  ip_address: string | null;
  user_agent: string | null;
  referrer: string | null;
  country: string | null;
  device_type: string | null;
  created_at: string;
}

export interface VisitSession {
  id: string;
  link_id: string;
  click_id: string | null;
  session_token: string;
  current_step: number;
  total_steps: number;
  completed: boolean;
  expires_at: string;
  created_at: string;
}

export interface GlobalSettings {
  id: string;
  default_steps: number;
  default_timer_seconds: number;
  max_links_per_user: number;
  site_name: string;
  cpm_rate: number;
  created_at: string;
  updated_at: string;
}

export interface UserWallet {
  id: string;
  user_id: string;
  balance: number;
  total_earned: number;
  total_withdrawn: number;
  min_payout: number;
  created_at: string;
  updated_at: string;
}

export interface Earning {
  id: string;
  user_id: string;
  link_id: string;
  click_id: string | null;
  amount: number;
  cpm_rate: number;
  created_at: string;
}

export interface PayoutRequest {
  id: string;
  user_id: string;
  amount: number;
  status: "pending" | "approved" | "paid" | "rejected";
  payout_method: string | null;
  payout_details: string | null;
  admin_note: string | null;
  processed_at: string | null;
  created_at: string;
}
