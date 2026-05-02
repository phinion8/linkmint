"use client";

import { useEffect, useRef } from "react";

interface AdPlaceholderProps {
  slot?: string;
  size?: "468x60" | "160x300" | "320x50" | "300x250" | "160x600" | "728x90" | "native";
  customHtml?: string | null;
}

const sizeMap: Record<string, { width: string; height: string; label: string }> = {
  "468x60": { width: "w-full max-w-[468px]", height: "min-h-[60px]", label: "468 x 60" },
  "160x300": { width: "w-full max-w-[160px]", height: "min-h-[300px]", label: "160 x 300" },
  "320x50": { width: "w-full max-w-[320px]", height: "min-h-[50px]", label: "320 x 50" },
  "300x250": { width: "w-full max-w-[300px]", height: "min-h-[250px]", label: "300 x 250" },
  "160x600": { width: "w-full max-w-[160px]", height: "min-h-[600px]", label: "160 x 600" },
  "728x90": { width: "w-full max-w-[728px]", height: "min-h-[90px]", label: "728 x 90" },
  "native": { width: "w-full", height: "min-h-[100px]", label: "Native Banner" },
};

function AdContainer({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const temp = document.createElement("div");
    temp.innerHTML = html;

    const scripts: { src?: string; text: string; attrs: Record<string, string> }[] = [];

    temp.querySelectorAll("script").forEach((script) => {
      const attrs: Record<string, string> = {};
      for (const attr of Array.from(script.attributes)) {
        if (attr.name !== "src") attrs[attr.name] = attr.value;
      }
      scripts.push({
        src: script.src || undefined,
        text: script.textContent || "",
        attrs,
      });
      script.remove();
    });

    container.innerHTML = temp.innerHTML;

    scripts.forEach((scriptData) => {
      const script = document.createElement("script");
      if (scriptData.src) script.src = scriptData.src;
      if (scriptData.text) script.textContent = scriptData.text;
      Object.entries(scriptData.attrs).forEach(([key, value]) => {
        script.setAttribute(key, value);
      });
      container.appendChild(script);
    });

    return () => {
      container.innerHTML = "";
    };
  }, [html]);

  return <div ref={containerRef} />;
}

export default function AdPlaceholder({
  slot = "default",
  size = "300x250",
  customHtml,
}: AdPlaceholderProps) {
  const { width, height, label } = sizeMap[size] || sizeMap["300x250"];

  if (customHtml) {
    return (
      <div className={`${width} mx-auto`}>
        <AdContainer html={customHtml} />
      </div>
    );
  }

  return (
    <div
      className={`${width} ${height} mx-auto bg-white/[0.02] border border-dashed border-white/[0.06] rounded-2xl flex flex-col items-center justify-center gap-1.5`}
    >
      <div className="text-zinc-700 text-xs font-medium tracking-wider">AD</div>
      <div className="text-zinc-800 text-[10px]">{label}</div>
    </div>
  );
}
