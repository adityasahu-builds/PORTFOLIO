"use client";

import dynamic from "next/dynamic";

const CursorGlow = dynamic(
  () => import("@/components/ui/CursorGlow").then((m) => m.CursorGlow),
  { ssr: false }
);

export function CursorGlowLoader() {
  return <CursorGlow />;
}
