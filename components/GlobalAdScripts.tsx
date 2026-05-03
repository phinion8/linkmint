"use client";

import { useEffect } from "react";

function isInAppBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /Telegram|FBAN|FBAV|Instagram|Line\/|Snapchat|Twitter|WhatsApp|WeChat|MicroMessenger|Discord/i.test(ua);
}

export default function GlobalAdScripts() {
  useEffect(() => {
    const inApp = isInAppBrowser();

    // Popunder — SKIP for in-app browsers (breaks back button)
    if (!inApp) {
      const popunder = document.createElement("script");
      popunder.src = "https://pl29321604.profitablecpmratenetwork.com/f2/57/b8/f257b844adcb37aa5873d4916d70d37c.js";
      popunder.async = true;
      popunder.setAttribute("data-cfasync", "false");
      document.head.appendChild(popunder);
    }

    // Social Bar — safe for all browsers
    const socialBar = document.createElement("script");
    socialBar.src = "https://pl29321607.profitablecpmratenetwork.com/a1/be/eb/a1beebc96cc0bcdb42e278de8d2b2ba6.js";
    socialBar.async = true;
    socialBar.setAttribute("data-cfasync", "false");
    document.head.appendChild(socialBar);

    return () => {
      // Don't remove — these scripts register global handlers
    };
  }, []);

  return null;
}
