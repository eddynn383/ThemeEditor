"use client";

import { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { getAllThemes, SavedTheme } from "../lib/theme-api";
import { Loader2 } from "lucide-react";

export function ThemeSelector() {
  const { currentThemeId, hasUnsavedChanges, loadTheme, themeListVersion } =
    useTheme();

  const [savedThemes, setSavedThemes] = useState<SavedTheme[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved themes on mount and when theme list changes
  useEffect(() => {
    loadThemes();
  }, [themeListVersion]);

  const loadThemes = async () => {
    setLoading(true);
    setError(null);
    try {
      const themes = await getAllThemes();
      setSavedThemes(themes);
    } catch (err) {
      setError("Failed to load themes");
      console.error("Error loading themes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = async (themeId: string) => {
    if (hasUnsavedChanges) {
      if (
        !confirm(
          "You have unsaved changes. Switching themes will discard them. Continue?"
        )
      ) {
        return;
      }
    }

    try {
      await loadTheme(themeId);
    } catch (err) {
      setError("Failed to load theme");
      console.error("Error loading theme:", err);
    }
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center p-4 rounded-lg border"
        style={{
          backgroundColor: "var(--bg-200)",
          borderColor: "var(--bg-300)",
        }}
      >
        <Loader2
          className="size-4 animate-spin"
          style={{ color: "var(--accent-400)" }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="p-4 rounded-lg border text-xs"
        style={{
          backgroundColor: "var(--bg-200)",
          borderColor: "var(--bg-300)",
          color: "var(--text-200)",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm" style={{ color: "var(--text-100)" }}>
        Active Theme
      </label>
      <div className="flex gap-2">
        <Select
          value={currentThemeId || "default"}
          onValueChange={handleThemeChange}
        >
          <SelectTrigger className="flex-1 theme-select-trigger">
            <SelectValue placeholder="Select a theme" />
          </SelectTrigger>
          <SelectContent className="theme-select-content">
            {savedThemes.map((theme) => (
              <SelectItem
                key={theme.id}
                value={theme.id}
                className="theme-select-item"
              >
                <div className="flex items-center justify-between gap-2 w-full">
                  <span>{theme.name}</span>
                  {theme.id === currentThemeId && hasUnsavedChanges && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: "var(--accent-100)",
                        color: "var(--accent-400)",
                      }}
                    >
                      *
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {hasUnsavedChanges && (
        <p className="text-xs" style={{ color: "var(--text-300)" }}>
          You have unsaved changes
        </p>
      )}
    </div>
  );
}
