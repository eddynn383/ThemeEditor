"use client";

import { useState, useRef, useEffect } from "react";

type ColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
};

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hexValue, setHexValue] = useState(value);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHexValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setHexValue(newValue);
    if (/^#[0-9A-F]{6}$/i.test(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <div className="relative" ref={pickerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md border transition-colors"
        style={{
          borderColor: "var(--bg-200)",
          backgroundColor: "var(--bg-100)",
          color: "var(--text-100)",
        }}
      >
        <div
          className="size-6 rounded border"
          style={{
            backgroundColor: value,
            borderColor: "var(--bg-200)",
          }}
        />
        <span className="text-sm">{value}</span>
      </button>

      {isOpen && (
        <div
          className="absolute top-full mt-2 right-0 p-4 rounded-lg shadow-lg z-10"
          style={{
            backgroundColor: "var(--bg-100)",
            border: "1px solid var(--bg-200)",
          }}
        >
          <div className="space-y-3">
            <input
              type="color"
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setHexValue(e.target.value);
              }}
              className="w-full h-32 cursor-pointer rounded"
            />
            <input
              type="text"
              value={hexValue}
              onChange={handleHexChange}
              placeholder="#000000"
              className="w-full px-3 py-2 rounded border"
              style={{
                borderColor: "var(--bg-200)",
                backgroundColor: "var(--bg-200)",
                color: "var(--text-100)",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
