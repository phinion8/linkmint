import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import TelegramBot from "node-telegram-bot-api";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { customAlphabet } from "nanoid";

// ===== CONFIG =====
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SITE_URL = process.env.SITE_URL || "http://localhost:3000";

if (!BOT_TOKEN) {
  console.error("TELEGRAM_BOT_TOKEN is required");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 6);

// Store authenticated sessions: chatId -> userId
const sessions = new Map<number, { userId: string; name: string; email: string }>();

// ===== HELPERS =====

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// ===== COMMANDS =====

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const session = sessions.get(chatId);

  const welcome = session
    ? `Welcome back, *${session.name}*! 👋\n\nJust paste any URL and I'll shorten it for you.\n\nCommands:\n/stats — Your link stats\n/links — Recent links\n/logout — Sign out`
    : `🔗 *LinkMint Bot*\n\nShorten URLs and earn from every click — right from Telegram.\n\nTo get started:\n/login your@email.com password\n\nDon't have an account?\n/register YourName your@email.com password`;

  bot.sendMessage(chatId, welcome, { parse_mode: "Markdown" });
});

bot.onText(/\/login (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const args = match![1].trim().split(/\s+/);

  if (args.length < 2) {
    bot.sendMessage(chatId, "Usage: `/login email password`", { parse_mode: "Markdown" });
    return;
  }

  const [email, password] = args;

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("is_active", true)
    .single();

  if (!user) {
    bot.sendMessage(chatId, "❌ Invalid email or account not found.");
    return;
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    bot.sendMessage(chatId, "❌ Incorrect password.");
    return;
  }

  sessions.set(chatId, { userId: user.id, name: user.name, email: user.email });
  bot.sendMessage(chatId, `✅ Logged in as *${user.name}*!\n\nNow just paste any URL to shorten it.`, { parse_mode: "Markdown" });
});

bot.onText(/\/register (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const args = match![1].trim().split(/\s+/);

  if (args.length < 3) {
    bot.sendMessage(chatId, "Usage: `/register YourName email password`", { parse_mode: "Markdown" });
    return;
  }

  const [name, email, password] = args;

  if (password.length < 6) {
    bot.sendMessage(chatId, "❌ Password must be at least 6 characters.");
    return;
  }

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    bot.sendMessage(chatId, "❌ Email already registered. Use `/login` instead.", { parse_mode: "Markdown" });
    return;
  }

  const password_hash = await bcrypt.hash(password, 12);

  const { data: user, error } = await supabase
    .from("users")
    .insert({ email, password_hash, name, role: "publisher" })
    .select()
    .single();

  if (error || !user) {
    bot.sendMessage(chatId, "❌ Registration failed. Try again.");
    return;
  }

  sessions.set(chatId, { userId: user.id, name: user.name, email: user.email });
  bot.sendMessage(chatId, `🎉 Account created! Welcome, *${user.name}*.\n\nPaste any URL to shorten it.`, { parse_mode: "Markdown" });
});

bot.onText(/\/logout/, (msg) => {
  const chatId = msg.chat.id;
  sessions.delete(chatId);
  bot.sendMessage(chatId, "👋 Logged out. Use `/login` to sign in again.", { parse_mode: "Markdown" });
});

bot.onText(/\/stats/, async (msg) => {
  const chatId = msg.chat.id;
  const session = sessions.get(chatId);

  if (!session) {
    bot.sendMessage(chatId, "Please `/login` first.", { parse_mode: "Markdown" });
    return;
  }

  const { data: links } = await supabase
    .from("links")
    .select("id, total_clicks, is_active")
    .eq("user_id", session.userId);

  const { data: wallet } = await supabase
    .from("user_wallets")
    .select("balance, total_earned")
    .eq("user_id", session.userId)
    .single();

  const totalLinks = links?.length || 0;
  const activeLinks = links?.filter((l) => l.is_active).length || 0;
  const totalClicks = links?.reduce((sum, l) => sum + l.total_clicks, 0) || 0;

  const stats = `📊 *Your Stats*

🔗 Total Links: *${totalLinks}* (${activeLinks} active)
👆 Total Clicks: *${totalClicks}*
💰 Balance: *$${wallet ? Number(wallet.balance).toFixed(2) : "0.00"}*
📈 Total Earned: *$${wallet ? Number(wallet.total_earned).toFixed(2) : "0.00"}*`;

  bot.sendMessage(chatId, stats, { parse_mode: "Markdown" });
});

bot.onText(/\/links/, async (msg) => {
  const chatId = msg.chat.id;
  const session = sessions.get(chatId);

  if (!session) {
    bot.sendMessage(chatId, "Please `/login` first.", { parse_mode: "Markdown" });
    return;
  }

  const { data: links } = await supabase
    .from("links")
    .select("short_code, title, total_clicks, is_active, created_at")
    .eq("user_id", session.userId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (!links || links.length === 0) {
    bot.sendMessage(chatId, "No links yet. Paste a URL to create one!");
    return;
  }

  let text = "📋 *Your Recent Links*\n\n";
  links.forEach((link, i) => {
    const status = link.is_active ? "🟢" : "🔴";
    const title = link.title || "Untitled";
    text += `${i + 1}. ${status} *${title}*\n   ${SITE_URL}/${link.short_code}\n   👆 ${link.total_clicks} clicks\n\n`;
  });

  bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const help = `🔗 *LinkMint Bot — Commands*

/start — Welcome message
/login email password — Sign in
/register name email password — Create account
/logout — Sign out
/stats — Your earnings & click stats
/links — Your recent shortened links
/help — Show this help

*Shortening a URL:*
Just paste any URL and I'll shorten it instantly!`;

  bot.sendMessage(chatId, help, { parse_mode: "Markdown" });
});

// ===== URL SHORTENING (any message that looks like a URL) =====

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.trim();

  // Ignore commands
  if (!text || text.startsWith("/")) return;

  // Check if it's a URL
  if (!isValidUrl(text)) return;

  const session = sessions.get(chatId);
  if (!session) {
    bot.sendMessage(chatId, "Please `/login` first to shorten URLs.", { parse_mode: "Markdown" });
    return;
  }

  // Check link limits
  const { data: settings } = await supabase.from("global_settings").select("*").single();
  const { count: linkCount } = await supabase
    .from("links")
    .select("*", { count: "exact", head: true })
    .eq("user_id", session.userId);

  if (settings && linkCount !== null && linkCount >= settings.max_links_per_user) {
    bot.sendMessage(chatId, `❌ Link limit reached (${settings.max_links_per_user}). Delete some links first.`);
    return;
  }

  // Generate short code
  const shortCode = nanoid();

  // Create link
  const { error } = await supabase
    .from("links")
    .insert({
      short_code: shortCode,
      original_url: text,
      user_id: session.userId,
      title: null,
    });

  if (error) {
    bot.sendMessage(chatId, "❌ Failed to create short link. Try again.");
    return;
  }

  // Create default steps
  if (settings) {
    const steps = Array.from({ length: settings.default_steps }, (_, i) => ({
      link_id: undefined as string | undefined, // will be set below
      step_order: i + 1,
      timer_seconds: settings.default_timer_seconds,
      button_text: "Continue",
    }));

    // Get the created link to get its ID
    const { data: link } = await supabase
      .from("links")
      .select("id")
      .eq("short_code", shortCode)
      .single();

    if (link) {
      await supabase.from("link_steps").insert(
        steps.map((s) => ({ ...s, link_id: link.id }))
      );
    }
  }

  const shortUrl = `${SITE_URL}/${shortCode}`;

  bot.sendMessage(
    chatId,
    `✅ *Link shortened!*\n\n🔗 ${shortUrl}\n\nOriginal: ${text.length > 60 ? text.substring(0, 60) + "..." : text}`,
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📋 Copy Link", callback_data: `copy_${shortCode}` }],
        ],
      },
    }
  );
});

// Handle copy button callback
bot.on("callback_query", (query) => {
  if (query.data?.startsWith("copy_")) {
    const shortCode = query.data.replace("copy_", "");
    const shortUrl = `${SITE_URL}/${shortCode}`;
    bot.answerCallbackQuery(query.id, { text: `Link: ${shortUrl}`, show_alert: false });
    bot.sendMessage(query.message!.chat.id, `\`${shortUrl}\``, { parse_mode: "Markdown" });
  }
});

console.log("🤖 LinkMint Telegram bot is running...");
