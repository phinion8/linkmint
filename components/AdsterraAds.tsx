"use client";

import { useEffect, useRef } from "react";

let adCounter = 0;

function AdUnit({ atKey, width, height, invokeUrl, className }: {
  atKey: string;
  width: number;
  height: number;
  invokeUrl: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !ref.current) return;
    loaded.current = true;

    const container = ref.current;
    const id = `ad-${atKey}-${++adCounter}`;
    container.id = id;

    // Set atOptions on window before loading invoke script
    const optionsScript = document.createElement("script");
    optionsScript.textContent = `
      window.atOptions = {
        'key' : '${atKey}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `;
    container.appendChild(optionsScript);

    const invokeScript = document.createElement("script");
    invokeScript.src = invokeUrl;
    invokeScript.async = true;
    container.appendChild(invokeScript);
  }, [atKey, width, height, invokeUrl]);

  return <div ref={ref} className={className || `w-full max-w-[${width}px] mx-auto min-h-[${height}px]`} />;
}

// ===== POPUNDER =====
export function AdPopunder() {
  const loaded = useRef(false);
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    const script = document.createElement("script");
    script.src = "https://pl29321604.profitablecpmratenetwork.com/f2/57/b8/f257b844adcb37aa5873d4916d70d37c.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);
  return null;
}

// ===== SOCIAL BAR =====
export function AdSocialBar() {
  const loaded = useRef(false);
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    const script = document.createElement("script");
    script.src = "https://pl29321607.profitablecpmratenetwork.com/a1/be/eb/a1beebc96cc0bcdb42e278de8d2b2ba6.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);
  return null;
}

// ===== NATIVE BANNER =====
export function AdNativeBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !ref.current) return;
    loaded.current = true;

    const container = ref.current;

    const div = document.createElement("div");
    div.id = "container-548622c2a4cf597fb044eb0e76e31022";
    container.appendChild(div);

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = "https://pl29321605.profitablecpmratenetwork.com/548622c2a4cf597fb044eb0e76e31022/invoke.js";
    container.appendChild(script);
  }, []);

  return <div ref={ref} className="w-full" />;
}

// ===== BANNER ADS =====

export function AdBanner468x60() {
  return (
    <AdUnit
      atKey="06c12128d7cf514d4c0fa34ab8b771dd"
      width={468}
      height={60}
      invokeUrl="https://www.highperformanceformat.com/06c12128d7cf514d4c0fa34ab8b771dd/invoke.js"
      className="w-full max-w-[468px] mx-auto min-h-[60px]"
    />
  );
}

export function AdBanner300x250() {
  return (
    <AdUnit
      atKey="e8997f327d8f87fe80490572d676eac8"
      width={300}
      height={250}
      invokeUrl="https://www.highperformanceformat.com/e8997f327d8f87fe80490572d676eac8/invoke.js"
      className="w-full max-w-[300px] mx-auto min-h-[250px]"
    />
  );
}

export function AdBanner160x300() {
  return (
    <AdUnit
      atKey="10d0df8ff961565720b7572e2b5c0d7c"
      width={160}
      height={300}
      invokeUrl="https://www.highperformanceformat.com/10d0df8ff961565720b7572e2b5c0d7c/invoke.js"
      className="w-full max-w-[160px] mx-auto min-h-[300px]"
    />
  );
}

export function AdBanner160x600() {
  return (
    <AdUnit
      atKey="c38fb8b6325e37352d72b47734769c0e"
      width={160}
      height={600}
      invokeUrl="https://www.highperformanceformat.com/c38fb8b6325e37352d72b47734769c0e/invoke.js"
      className="w-full max-w-[160px] mx-auto min-h-[600px]"
    />
  );
}

export function AdBanner320x50() {
  return (
    <AdUnit
      atKey="1b02ee4875dfb2c5ad0d62463a30eacb"
      width={320}
      height={50}
      invokeUrl="https://www.highperformanceformat.com/1b02ee4875dfb2c5ad0d62463a30eacb/invoke.js"
      className="w-full max-w-[320px] mx-auto min-h-[50px]"
    />
  );
}

export function AdBanner728x90() {
  return (
    <AdUnit
      atKey="04b123b93f1331ceb2ef4f22dea814b6"
      width={728}
      height={90}
      invokeUrl="https://www.highperformanceformat.com/04b123b93f1331ceb2ef4f22dea814b6/invoke.js"
      className="w-full max-w-[728px] mx-auto min-h-[90px]"
    />
  );
}
