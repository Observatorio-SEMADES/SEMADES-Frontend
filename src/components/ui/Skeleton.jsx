import React from "react";
import "../../styles/ui.css";

// Placeholder de carregamento com shimmer (respeita prefers-reduced-motion via
// CSS). Use enquanto o conteúdo real ainda não chegou.
export default function Skeleton({ width = "100%", height = 16, radius = 8, className = "", style }) {
  return (
    <span
      className={`skeleton ${className}`.trim()}
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  );
}
