"use client";

import { useEffect, useRef } from "react";

// Each banner ad runs in its own iframe to avoid atOptions conflicts
function BannerAd({ atKey, width, height, className }: {
  atKey: string;
  width: number;
  height: number;
  className?: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const html = `<!DOCTYPE html>
<html><head><style>*{margin:0;padding:0;}body{overflow:hidden;background:transparent;}</style></head>
<body>
<script>
  atOptions = {
    'key' : '${atKey}',
    'format' : 'iframe',
    'height' : ${height},
    'width' : ${width},
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/${atKey}/invoke.js"><\/script>
</body></html>`;

    iframe.srcdoc = html;
  }, [atKey, width, height]);

  return (
    <iframe
      ref={iframeRef}
      width={width}
      height={height}
      scrolling="no"
      frameBorder="0"
      className={className}
      style={{ border: "none", overflow: "hidden", display: "block", margin: "0 auto" }}
    />
  );
}

// ===== POPUNDER =====
export function AdPopunder() {
  const loaded = useRef(false);
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    const s = document.createElement("script");
    s.src = "https://pl29321604.profitablecpmratenetwork.com/f2/57/b8/f257b844adcb37aa5873d4916d70d37c.js";
    s.async = true;
    document.body.appendChild(s);
  }, []);
  return null;
}

// ===== SOCIAL BAR =====
export function AdSocialBar() {
  const loaded = useRef(false);
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    const s = document.createElement("script");
    s.src = "https://pl29321607.profitablecpmratenetwork.com/a1/be/eb/a1beebc96cc0bcdb42e278de8d2b2ba6.js";
    s.async = true;
    document.body.appendChild(s);
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

    const s = document.createElement("script");
    s.async = true;
    s.setAttribute("data-cfasync", "false");
    s.src = "https://pl29321605.profitablecpmratenetwork.com/548622c2a4cf597fb044eb0e76e31022/invoke.js";
    container.appendChild(s);
  }, []);

  return <div ref={ref} className="w-full" />;
}

// ===== BANNER ADS (each in isolated iframe) =====

export function AdBanner468x60() {
  return <BannerAd atKey="06c12128d7cf514d4c0fa34ab8b771dd" width={468} height={60} />;
}

export function AdBanner300x250() {
  return <BannerAd atKey="e8997f327d8f87fe80490572d676eac8" width={300} height={250} />;
}

export function AdBanner160x300() {
  return <BannerAd atKey="10d0df8ff961565720b7572e2b5c0d7c" width={160} height={300} />;
}

export function AdBanner160x600() {
  return <BannerAd atKey="c38fb8b6325e37352d72b47734769c0e" width={160} height={600} />;
}

export function AdBanner320x50() {
  return <BannerAd atKey="1b02ee4875dfb2c5ad0d62463a30eacb" width={320} height={50} />;
}

export function AdBanner728x90() {
  return <BannerAd atKey="04b123b93f1331ceb2ef4f22dea814b6" width={728} height={90} />;
}
