"use client";

import { ComponentPreview } from "./ComponentPreview";
import { SaveThemeButton } from "./SaveThemeButton";

export function ThemePreview() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div
        className="h-14 border-b px-6 flex items-center justify-between gap-3"
        style={{ borderColor: "var(--bg-200)" }}
      >
        <h2>Component Preview</h2>
        <SaveThemeButton />
      </div>
      <div className="flex-1 overflow-hidden">
        <ComponentPreview />
      </div>
    </div>
  );
}
