"use client";

import { useState } from "react";
import { ColorShades } from "./ThemeProvider";
import { Button } from "./ui/button";
import { X, ChevronRight } from "lucide-react";

type ShadeEditorProps = {
  type: "accent" | "background" | "text" | "success" | "fail" | "warning" | "info";
  shade: keyof ColorShades;
  initialColor: string;
  onSave: (color: string) => void;
  onClose: () => void;
};

export function ShadeEditor({
  type,
  shade,
  initialColor,
  onSave,
  onClose,
}: ShadeEditorProps) {
  const [color, setColor] = useState(initialColor);
  const [hexValue, setHexValue] = useState(initialColor);

  const typeLabels: Record<string, string> = {
    accent: "Accent",
    background: "Background",
    text: "Text",
    success: "Success",
    fail: "Fail",
    warning: "Warning",
    info: "Info",
  };

  const handleSave = () => {
    onSave(color);
    onClose();
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHexValue(value);
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      setColor(value);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="w-full max-w-2xl p-6 rounded-lg shadow-xl"
        style={{
          backgroundColor: "var(--bg-100)",
          color: "var(--text-100)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="mb-1">Edit Shade</h2>
            <p className="text-sm" style={{ color: "var(--text-200)" }}>
              {typeLabels[type]} - {shade}
            </p>
          </div>
          <button onClick={onClose} style={{ color: "var(--text-100)" }}>
            <X className="size-5" />
          </button>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] gap-6 mb-6">
          {/* Left side - Original color */}
          <div className="flex flex-col">
            <label
              className="block text-sm mb-2"
              style={{ color: "var(--text-200)" }}
            >
              Original Color
            </label>
            <div
              className="w-full h-64 rounded-md border"
              style={{
                backgroundColor: initialColor,
                borderColor: "var(--bg-200)",
              }}
            />
            <div
              className="mt-2 text-center text-sm"
              style={{ color: "var(--text-200)" }}
            >
              {initialColor}
            </div>
          </div>

          {/* Chevron Icon */}
          <div className="flex items-center pt-8">
            <ChevronRight
              className="size-6"
              style={{ color: "var(--text-300)" }}
            />
          </div>

          {/* Right side - New color with color picker */}
          <div className="flex flex-col">
            <label
              className="block text-sm mb-2"
              style={{ color: "var(--text-200)" }}
            >
              New Color
            </label>
            <input
              type="color"
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                setHexValue(e.target.value);
              }}
              className="w-full h-64 cursor-pointer rounded-md border"
              style={{ borderColor: "var(--bg-200)" }}
            />
            <input
              type="text"
              value={hexValue}
              onChange={handleHexChange}
              placeholder="#000000"
              className="w-full px-3 py-2 rounded border mt-2"
              style={{
                borderColor: "var(--bg-200)",
                backgroundColor: "var(--bg-200)",
                color: "var(--text-100)",
              }}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            className="flex-1"
            style={{
              backgroundColor: "var(--bg-300)",
              color: "var(--text-100)",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1"
            style={{
              backgroundColor: "var(--accent-400)",
              color: "white",
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
