"use client";

import { useEffect } from "react";

export default function GlobalAdScripts() {
  useEffect(() => {
    // Popunder
    const popunder = document.createElement("script");
    popunder.src = "https://pl29321604.profitablecpmratenetwork.com/f2/57/b8/f257b844adcb37aa5873d4916d70d37c.js";
    popunder.async = true;
    popunder.setAttribute("data-cfasync", "false");
    document.head.appendChild(popunder);

    // Social Bar
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
