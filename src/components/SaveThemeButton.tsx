"use client";

import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import {
  Save,
  Plus,
  Check,
  X,
  Loader2,
  MoreVertical,
  Pencil,
  Trash2,
  Copy,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  saveTheme,
  updateTheme,
  deleteTheme,
  setActiveThemeId,
} from "@/lib/theme-api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function SaveThemeButton() {
  const {
    lightTheme,
    darkTheme,
    currentThemeId,
    currentThemeName,
    setCurrentThemeName,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    setCurrentThemeId,
    loadTheme,
    componentOverrides,
    borderRadiusOverrides,
    componentStates,
    alphaOverrides,
    refreshThemeList,
  } = useTheme();

  const [saving, setSaving] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [showRenameInput, setShowRenameInput] = useState(false);
  const [newThemeName, setNewThemeName] = useState("");
  const [renameThemeName, setRenameThemeName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async () => {
    if (!currentThemeId || currentThemeId === "default") {
      setShowNameInput(true);
      setNewThemeName(currentThemeName);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const themeData = {
        id: currentThemeId,
        name: currentThemeName,
        lightTheme,
        darkTheme,
        componentOverrides,
        borderRadiusOverrides,
        componentStates,
        alphaOverrides,
      };

      await updateTheme(currentThemeId, themeData);
      setActiveThemeId(currentThemeId);
      setHasUnsavedChanges(false);
      refreshThemeList();
    } catch (err) {
      setError("Failed to update theme");
      console.error("Error updating theme:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAsNew = async () => {
    if (!newThemeName.trim()) {
      setError("Please enter a theme name");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const themeId = crypto.randomUUID();
      const themeData = {
        id: themeId,
        name: newThemeName,
        lightTheme,
        darkTheme,
        componentOverrides,
        borderRadiusOverrides,
        componentStates,
        alphaOverrides,
      };

      await saveTheme(themeData);
      setCurrentThemeId(themeId);
      setCurrentThemeName(newThemeName);
      setActiveThemeId(themeId);
      setHasUnsavedChanges(false);
      setShowNameInput(false);
      setNewThemeName("");
      refreshThemeList();
    } catch (err) {
      setError("Failed to save theme");
      console.error("Error saving theme:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!currentThemeId || currentThemeId === "default") {
      setError("Cannot delete default theme");
      return;
    }

    if (
      !confirm(
        "Are you sure you want to delete this theme? This action cannot be undone."
      )
    ) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await deleteTheme(currentThemeId);
      await loadTheme("default");
      setHasUnsavedChanges(false);
      refreshThemeList();
    } catch (err) {
      setError("Failed to delete theme");
      console.error("Error deleting theme:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleRename = async () => {
    if (!renameThemeName.trim()) {
      setError("Please enter a theme name");
      return;
    }

    if (!currentThemeId || currentThemeId === "default") {
      setError("Cannot rename default theme");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const themeData = {
        id: currentThemeId,
        name: renameThemeName,
        lightTheme,
        darkTheme,
        componentOverrides,
        borderRadiusOverrides,
        componentStates,
        alphaOverrides,
      };

      await updateTheme(currentThemeId, themeData);
      setCurrentThemeName(renameThemeName);
      setActiveThemeId(currentThemeId);
      setShowRenameInput(false);
      setRenameThemeName("");
      refreshThemeList();
    } catch (err) {
      setError("Failed to rename theme");
      console.error("Error renaming theme:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = async () => {
    setSaving(true);
    setError(null);

    try {
      const themeId = crypto.randomUUID();
      const themeData = {
        id: themeId,
        name: `${currentThemeName} (Copy)`,
        lightTheme,
        darkTheme,
        componentOverrides,
        borderRadiusOverrides,
        componentStates,
        alphaOverrides,
      };

      await saveTheme(themeData);
      setCurrentThemeId(themeId);
      setCurrentThemeName(`${currentThemeName} (Copy)`);
      setActiveThemeId(themeId);
      setHasUnsavedChanges(false);
      refreshThemeList();
    } catch (err) {
      setError("Failed to duplicate theme");
      console.error("Error duplicating theme:", err);
    } finally {
      setSaving(false);
    }
  };

  if (showNameInput) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={newThemeName}
          onChange={(e) => setNewThemeName(e.target.value)}
          placeholder="Enter theme name"
          className="w-48"
          style={{
            backgroundColor: "var(--bg-200)",
            borderColor: "var(--bg-300)",
            color: "var(--text-100)",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSaveAsNew();
            if (e.key === "Escape") {
              setShowNameInput(false);
              setNewThemeName("");
            }
          }}
          autoFocus
        />
        <Button
          onClick={handleSaveAsNew}
          disabled={saving || !newThemeName.trim()}
          size="sm"
          style={{
            backgroundColor: "var(--accent-400)",
            color: "white",
          }}
        >
          {saving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Check className="size-4" />
          )}
        </Button>
        <Button
          onClick={() => {
            setShowNameInput(false);
            setNewThemeName("");
          }}
          variant="outline"
          size="sm"
          style={{
            backgroundColor: "var(--bg-200)",
            borderColor: "var(--bg-300)",
            color: "var(--text-200)",
          }}
        >
          <X className="size-4" />
        </Button>
      </div>
    );
  }

  if (showRenameInput) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={renameThemeName}
          onChange={(e) => setRenameThemeName(e.target.value)}
          placeholder="Enter theme name"
          className="w-48"
          style={{
            backgroundColor: "var(--bg-200)",
            borderColor: "var(--bg-300)",
            color: "var(--text-100)",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleRename();
            if (e.key === "Escape") {
              setShowRenameInput(false);
              setRenameThemeName("");
            }
          }}
          autoFocus
        />
        <Button
          onClick={handleRename}
          disabled={saving || !renameThemeName.trim()}
          size="sm"
          style={{
            backgroundColor: "var(--accent-400)",
            color: "white",
          }}
        >
          {saving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Check className="size-4" />
          )}
        </Button>
        <Button
          onClick={() => {
            setShowRenameInput(false);
            setRenameThemeName("");
          }}
          variant="outline"
          size="sm"
          style={{
            backgroundColor: "var(--bg-200)",
            borderColor: "var(--bg-300)",
            color: "var(--text-200)",
          }}
        >
          <X className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {hasUnsavedChanges && (
        <span
          className="text-xs px-2 py-1 rounded"
          style={{
            backgroundColor: "var(--accent-100)",
            color: "var(--accent-400)",
          }}
        >
          Unsaved changes
        </span>
      )}
      {/* Update Button */}
      <Button
        onClick={handleUpdate}
        disabled={saving || !hasUnsavedChanges}
        size="sm"
        className="flex items-center gap-2"
        style={{
          backgroundColor: "var(--accent-400)",
          color: "white",
        }}
      >
        {saving ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Save className="size-4" />
        )}
        Update
      </Button>

      {/* Save as New Button */}
      <Button
        onClick={() => {
          setShowNameInput(true);
          setNewThemeName(currentThemeName);
        }}
        disabled={saving}
        size="sm"
        variant="outline"
        className="flex items-center gap-2"
        style={{
          backgroundColor: "var(--bg-200)",
          borderColor: "var(--bg-300)",
          color: "var(--text-100)",
        }}
      >
        <Plus className="size-4" />
        Save as New
      </Button>

      {/* More Actions Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            disabled={saving}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            style={{
              backgroundColor: "var(--bg-200)",
              color: "var(--text-200)",
            }}
          >
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          style={{
            backgroundColor: "var(--bg-200)",
            borderColor: "var(--bg-300)",
          }}
        >
          <DropdownMenuItem
            onClick={handleDuplicate}
            className="flex items-center gap-2 cursor-pointer"
            style={{
              color: "var(--text-200)",
            }}
          >
            <Copy className="size-4" />
            Duplicate
          </DropdownMenuItem>
          {currentThemeId !== "default" && (
            <>
              <DropdownMenuItem
                onClick={() => {
                  setShowRenameInput(true);
                  setRenameThemeName(currentThemeName);
                }}
                className="flex items-center gap-2 cursor-pointer"
                style={{
                  color: "var(--text-200)",
                }}
              >
                <Pencil className="size-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="flex items-center gap-2 cursor-pointer"
                style={{
                  color: "var(--text-200)",
                }}
              >
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {error && (
        <span className="text-xs" style={{ color: "var(--text-100)" }}>
          {error}
        </span>
      )}
    </div>
  );
}
