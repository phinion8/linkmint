"use client";

import { useEffect, useRef } from "react";

// Helper to inject script tags into a container
function useAdScript(containerRef: React.RefObject<HTMLDivElement | null>, scripts: string[], deps: unknown[] = []) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    scripts.forEach((scriptContent) => {
      const temp = document.createElement("div");
      temp.innerHTML = scriptContent;

      // Extract and execute scripts
      const scriptEls = temp.querySelectorAll("script");
      const nonScriptContent = scriptContent.replace(/<script[\s\S]*?<\/script>/gi, "");

      if (nonScriptContent.trim()) {
        const div = document.createElement("div");
        div.innerHTML = nonScriptContent;
        container.appendChild(div);
      }

      scriptEls.forEach((s) => {
        const newScript = document.createElement("script");
        if (s.src) newScript.src = s.src;
        if (s.textContent) newScript.textContent = s.textContent;
        Array.from(s.attributes).forEach((attr) => {
          if (attr.name !== "src") newScript.setAttribute(attr.name, attr.value);
        });
        container.appendChild(newScript);
      });
    });

    return () => {
      container.innerHTML = "";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// ===== POPUNDER (fires once per page) =====
export function AdPopunder() {
  const loaded = useRef(false);
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    const script = document.createElement("script");
    script.src = "https://pl29321604.profitablecpmratenetwork.com/f2/57/b8/f257b844adcb37aa5873d4916d70d37c.js";
    document.body.appendChild(script);
  }, []);
  return null;
}

// ===== SOCIAL BAR (floating notification ads) =====
export function AdSocialBar() {
  const loaded = useRef(false);
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    const script = document.createElement("script");
    script.src = "https://pl29321607.profitablecpmratenetwork.com/a1/be/eb/a1beebc96cc0bcdb42e278de8d2b2ba6.js";
    document.body.appendChild(script);
  }, []);
  return null;
}

// ===== NATIVE BANNER =====
export function AdNativeBanner() {
  const ref = useRef<HTMLDivElement>(null);
  useAdScript(ref, [
    `<script async="async" data-cfasync="false" src="https://pl29321605.profitablecpmratenetwork.com/548622c2a4cf597fb044eb0e76e31022/invoke.js"></script>`,
    `<div id="container-548622c2a4cf597fb044eb0e76e31022"></div>`,
  ]);
  return <div ref={ref} className="w-full" />;
}

// ===== BANNER 468x60 =====
export function AdBanner468x60() {
  const ref = useRef<HTMLDivElement>(null);
  useAdScript(ref, [
    `<script>atOptions = {'key':'06c12128d7cf514d4c0fa34ab8b771dd','format':'iframe','height':60,'width':468,'params':{}};</script>`,
    `<script src="https://www.highperformanceformat.com/06c12128d7cf514d4c0fa34ab8b771dd/invoke.js"></script>`,
  ]);
  return <div ref={ref} className="w-full max-w-[468px] mx-auto min-h-[60px]" />;
}

// ===== BANNER 300x250 =====
export function AdBanner300x250() {
  const ref = useRef<HTMLDivElement>(null);
  useAdScript(ref, [
    `<script>atOptions = {'key':'e8997f327d8f87fe80490572d676eac8','format':'iframe','height':250,'width':300,'params':{}};</script>`,
    `<script src="https://www.highperformanceformat.com/e8997f327d8f87fe80490572d676eac8/invoke.js"></script>`,
  ]);
  return <div ref={ref} className="w-full max-w-[300px] mx-auto min-h-[250px]" />;
}

// ===== BANNER 160x300 =====
export function AdBanner160x300() {
  const ref = useRef<HTMLDivElement>(null);
  useAdScript(ref, [
    `<script>atOptions = {'key':'10d0df8ff961565720b7572e2b5c0d7c','format':'iframe','height':300,'width':160,'params':{}};</script>`,
    `<script src="https://www.highperformanceformat.com/10d0df8ff961565720b7572e2b5c0d7c/invoke.js"></script>`,
  ]);
  return <div ref={ref} className="w-full max-w-[160px] mx-auto min-h-[300px]" />;
}

// ===== BANNER 160x600 =====
export function AdBanner160x600() {
  const ref = useRef<HTMLDivElement>(null);
  useAdScript(ref, [
    `<script>atOptions = {'key':'c38fb8b6325e37352d72b47734769c0e','format':'iframe','height':600,'width':160,'params':{}};</script>`,
    `<script src="https://www.highperformanceformat.com/c38fb8b6325e37352d72b47734769c0e/invoke.js"></script>`,
  ]);
  return <div ref={ref} className="w-full max-w-[160px] mx-auto min-h-[600px]" />;
}

// ===== BANNER 320x50 =====
export function AdBanner320x50() {
  const ref = useRef<HTMLDivElement>(null);
  useAdScript(ref, [
    `<script>atOptions = {'key':'1b02ee4875dfb2c5ad0d62463a30eacb','format':'iframe','height':50,'width':320,'params':{}};</script>`,
    `<script src="https://www.highperformanceformat.com/1b02ee4875dfb2c5ad0d62463a30eacb/invoke.js"></script>`,
  ]);
  return <div ref={ref} className="w-full max-w-[320px] mx-auto min-h-[50px]" />;
}

// ===== BANNER 728x90 =====
export function AdBanner728x90() {
  const ref = useRef<HTMLDivElement>(null);
  useAdScript(ref, [
    `<script>atOptions = {'key':'04b123b93f1331ceb2ef4f22dea814b6','format':'iframe','height':90,'width':728,'params':{}};</script>`,
    `<script src="https://www.highperformanceformat.com/04b123b93f1331ceb2ef4f22dea814b6/invoke.js"></script>`,
  ]);
  return <div ref={ref} className="w-full max-w-[728px] mx-auto min-h-[90px]" />;
}
