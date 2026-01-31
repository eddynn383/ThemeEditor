"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  initializeDefaultTheme,
  getActiveThemeId,
  setActiveThemeId,
  getTheme,
} from "../lib/theme-api";

export type ColorShades = {
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
};

export type StatusColors = {
  success: ColorShades;
  fail: ColorShades;
  warning: ColorShades;
  info: ColorShades;
};

export type Theme = {
  accent: ColorShades;
  background: Partial<ColorShades>;
  text: Partial<ColorShades>;
  status: StatusColors;
};

export interface SavedTheme {
  id: string;
  name: string;
  lightTheme: Theme;
  darkTheme: Theme | null;
  componentOverrides: {
    [componentId: string]: {
      [colorKey: string]: string;
    };
  };
  borderRadiusOverrides: {
    [componentId: string]: number;
  };
  componentStates: {
    [componentId: string]: unknown;
  };
  alphaOverrides?: {
    [componentId: string]: {
      [colorKey: string]: number;
    };
  };
  createdAt?: string;
  updatedAt?: string;
}

type ThemeMode = "light" | "dark";
type EditingMode = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  mode: ThemeMode;
  editingMode: EditingMode;
  setMode: (mode: ThemeMode) => void;
  setEditingMode: (mode: EditingMode) => void;
  updateAccentBase: (color: string) => void;
  updateBackgroundBase: (color: string) => void;
  updateTextBase: (color: string) => void;
  updateShade: (
    type: "accent" | "background" | "text" | "success" | "fail" | "warning" | "info",
    shade: keyof ColorShades,
    color: string
  ) => void;
  updateStatusBase: (
    status: "success" | "fail" | "warning" | "info",
    color: string
  ) => void;
  resetDarkTheme: () => void;
  hasDarkThemeCustomizations: boolean;
  // Database & state management
  currentThemeId: string | null;
  currentThemeName: string;
  setCurrentThemeName: (name: string) => void;
  lightTheme: Theme;
  darkTheme: Theme | null;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
  loadTheme: (themeId: string) => Promise<void>;
  setCurrentThemeId: (id: string | null) => void;
  // Component customizations
  componentOverrides: { [componentId: string]: { [colorKey: string]: string } };
  setComponentOverrides: (overrides: {
    [componentId: string]: { [colorKey: string]: string };
  }) => void;
  borderRadiusOverrides: { [componentId: string]: number };
  setBorderRadiusOverrides: (overrides: { [componentId: string]: number }) => void;
  componentStates: { [componentId: string]: unknown };
  setComponentStates: (states: { [componentId: string]: unknown }) => void;
  // Alpha overrides
  alphaOverrides: { [componentId: string]: { [colorKey: string]: number } };
  setAlphaOverrides: (overrides: {
    [componentId: string]: { [colorKey: string]: number };
  }) => void;
  // Theme list refresh
  refreshThemeList: () => void;
  onThemeListRefresh: (callback: () => void) => () => void;
  themeListVersion: number;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper functions to convert between color formats
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(
  h: number,
  s: number,
  l: number
): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return { r: r * 255, g: g * 255, b: b * 255 };
}

// Generate lighter shades
function generateLighterShade(baseColor: string, targetLightness: number): string {
  const rgb = hexToRgb(baseColor);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const newRgb = hslToRgb(hsl.h, hsl.s, targetLightness);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

// Generate darker shades
function generateDarkerShade(baseColor: string, targetLightness: number): string {
  const rgb = hexToRgb(baseColor);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const newRgb = hslToRgb(hsl.h, hsl.s, targetLightness);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

// Generate accent shades from 400
function generateAccentShades(base400: string): ColorShades {
  const lightest = 95;
  const darkest = 10;
  const totalRange = lightest - darkest;
  const step = totalRange / 6;

  return {
    100: generateLighterShade(base400, lightest),
    200: generateLighterShade(base400, lightest - step),
    300: generateLighterShade(base400, lightest - step * 2),
    400: base400,
    500: generateDarkerShade(base400, lightest - step * 4),
    600: generateDarkerShade(base400, lightest - step * 5),
    700: generateDarkerShade(base400, darkest),
  };
}

// Generate background shades from 100
function generateBackgroundShades(base100: string): Partial<ColorShades> {
  const rgb = hexToRgb(base100);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const lightest = hsl.l;
  const darkest = 10;
  const totalRange = lightest - darkest;
  const step = totalRange / 6;

  return {
    100: base100,
    200: generateDarkerShade(base100, lightest - step),
    300: generateDarkerShade(base100, lightest - step * 2),
    400: generateDarkerShade(base100, lightest - step * 3),
    500: generateDarkerShade(base100, lightest - step * 4),
    600: generateDarkerShade(base100, lightest - step * 5),
    700: generateDarkerShade(base100, darkest),
  };
}

// Generate text shades from 100
function generateTextShades(base100: string): Partial<ColorShades> {
  const rgb = hexToRgb(base100);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const darkest = hsl.l;
  const lightest = 95;
  const totalRange = lightest - darkest;
  const step = totalRange / 6;

  return {
    100: base100,
    200: generateLighterShade(base100, darkest + step),
    300: generateLighterShade(base100, darkest + step * 2),
    400: generateLighterShade(base100, darkest + step * 3),
    500: generateLighterShade(base100, darkest + step * 4),
    600: generateLighterShade(base100, darkest + step * 5),
    700: generateLighterShade(base100, lightest),
  };
}

// Generate status color shades (same as accent but for status colors)
function generateStatusShades(base400: string): ColorShades {
  return generateAccentShades(base400);
}

// Default status colors
const defaultStatusColors: StatusColors = {
  success: generateStatusShades("#22c55e"), // Green
  fail: generateStatusShades("#ef4444"),    // Red
  warning: generateStatusShades("#f59e0b"), // Amber/Orange
  info: generateStatusShades("#3b82f6"),    // Blue
};

// Helper to ensure theme has status colors (for backward compatibility)
function ensureStatusColors(theme: Theme | null): Theme | null {
  if (!theme) return null;
  return {
    ...theme,
    status: theme.status ?? defaultStatusColors,
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [editingMode, setEditingMode] = useState<EditingMode>("light");
  const [lightTheme, setLightTheme] = useState<Theme>({
    accent: generateAccentShades("#6366f1"),
    background: generateBackgroundShades("#ffffff"),
    text: generateTextShades("#1f2937"),
    status: defaultStatusColors,
  });
  const [darkTheme, setDarkTheme] = useState<Theme | null>(null);
  const [currentThemeId, setCurrentThemeId] = useState<string | null>(null);
  const [currentThemeName, setCurrentThemeName] = useState<string>("Default Theme");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [componentOverrides, setComponentOverrides] = useState<{
    [componentId: string]: { [colorKey: string]: string };
  }>({});
  const [borderRadiusOverrides, setBorderRadiusOverrides] = useState<{
    [componentId: string]: number;
  }>({});
  const [componentStates, setComponentStates] = useState<{
    [componentId: string]: unknown;
  }>({});
  const [alphaOverrides, setAlphaOverrides] = useState<{
    [componentId: string]: { [colorKey: string]: number };
  }>({});
  const [themeListRefreshCallbacks, setThemeListRefreshCallbacks] = useState<
    (() => void)[]
  >([]);
  const [themeListVersion, setThemeListVersion] = useState(0);

  // Get the active theme based on editing mode
  const theme = editingMode === "light" ? lightTheme : darkTheme || lightTheme;

  // Apply CSS variables to document root whenever theme or mode changes
  useEffect(() => {
    const root = document.documentElement;
    const activeTheme = mode === "light" ? lightTheme : darkTheme || lightTheme;

    // Helper to apply shade variables
    const applyShades = (
      type: "accent" | "bg" | "text",
      shades: Partial<ColorShades>
    ) => {
      const shadeKeys = [100, 200, 300, 400, 500, 600, 700] as const;
      shadeKeys.forEach((shade) => {
        const value = shades[shade];
        if (value) {
          root.style.setProperty(`--${type}-${shade}`, value);
        }
      });
    };

    // Apply accent colors
    applyShades("accent", activeTheme.accent);

    // Apply background colors
    if (mode === "dark") {
      const bgShades = activeTheme.background;
      root.style.setProperty("--bg-100", bgShades[700] || bgShades[100] || "#000000");
      root.style.setProperty("--bg-200", bgShades[600] || bgShades[200] || "#1a1a1a");
      root.style.setProperty("--bg-300", bgShades[500] || bgShades[300] || "#333333");
      root.style.setProperty("--bg-400", bgShades[400] || bgShades[400] || "#4d4d4d");
      root.style.setProperty("--bg-500", bgShades[300] || bgShades[500] || "#666666");
      root.style.setProperty("--bg-600", bgShades[200] || bgShades[600] || "#808080");
      root.style.setProperty("--bg-700", bgShades[100] || bgShades[700] || "#999999");
    } else {
      applyShades("bg", activeTheme.background);
    }

    // Apply text colors
    if (mode === "dark") {
      const textShades = activeTheme.text;
      root.style.setProperty("--text-100", textShades[700] || textShades[100] || "#ffffff");
      root.style.setProperty("--text-200", textShades[600] || textShades[200] || "#e6e6e6");
      root.style.setProperty("--text-300", textShades[500] || textShades[300] || "#cccccc");
      root.style.setProperty("--text-400", textShades[400] || textShades[400] || "#b3b3b3");
      root.style.setProperty("--text-500", textShades[300] || textShades[500] || "#999999");
      root.style.setProperty("--text-600", textShades[200] || textShades[600] || "#808080");
      root.style.setProperty("--text-700", textShades[100] || textShades[700] || "#666666");
    } else {
      applyShades("text", activeTheme.text);
    }

    // Apply status colors (with fallback to defaults if not defined)
    const statusTypes = ["success", "fail", "warning", "info"] as const;
    statusTypes.forEach((statusType) => {
      const statusShades = activeTheme.status?.[statusType] ?? defaultStatusColors[statusType];
      const shadeKeys = [100, 200, 300, 400, 500, 600, 700] as const;
      shadeKeys.forEach((shade) => {
        root.style.setProperty(`--${statusType}-${shade}`, statusShades[shade]);
      });
    });
  }, [lightTheme, darkTheme, mode]);

  // Initialize default theme and load active theme on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        const defaultThemeFromDB = await initializeDefaultTheme(
          lightTheme,
          darkTheme
        );

        const activeThemeId = getActiveThemeId();

        if (activeThemeId && activeThemeId !== "default") {
          const savedTheme = await getTheme(activeThemeId);
          if (savedTheme) {
            setLightTheme(ensureStatusColors(savedTheme.lightTheme) as Theme);
            setDarkTheme(ensureStatusColors(savedTheme.darkTheme));
            setCurrentThemeId(savedTheme.id);
            setCurrentThemeName(savedTheme.name);
            setComponentOverrides(savedTheme.componentOverrides || {});
            setBorderRadiusOverrides(savedTheme.borderRadiusOverrides || {});
            setComponentStates(savedTheme.componentStates || {});
            setAlphaOverrides(savedTheme.alphaOverrides || {});
            setHasUnsavedChanges(false);
          } else {
            setLightTheme(ensureStatusColors(defaultThemeFromDB.lightTheme) as Theme);
            setDarkTheme(ensureStatusColors(defaultThemeFromDB.darkTheme));
            setComponentOverrides(defaultThemeFromDB.componentOverrides || {});
            setBorderRadiusOverrides(defaultThemeFromDB.borderRadiusOverrides || {});
            setComponentStates(defaultThemeFromDB.componentStates || {});
            setAlphaOverrides(defaultThemeFromDB.alphaOverrides || {});
            setActiveThemeId("default");
            setCurrentThemeId("default");
            setCurrentThemeName("Default Theme");
          }
        } else {
          setLightTheme(ensureStatusColors(defaultThemeFromDB.lightTheme) as Theme);
          setDarkTheme(ensureStatusColors(defaultThemeFromDB.darkTheme));
          setComponentOverrides(defaultThemeFromDB.componentOverrides || {});
          setBorderRadiusOverrides(defaultThemeFromDB.borderRadiusOverrides || {});
          setComponentStates(defaultThemeFromDB.componentStates || {});
          setAlphaOverrides(defaultThemeFromDB.alphaOverrides || {});
          setActiveThemeId("default");
          setCurrentThemeId("default");
          setCurrentThemeName("Default Theme");
        }
      } catch (error) {
        console.error("Error initializing theme:", error);
        setActiveThemeId("default");
        setCurrentThemeId("default");
        setCurrentThemeName("Default Theme");
      }
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateAccentBase = (color: string) => {
    const newShades = generateAccentShades(color);
    if (editingMode === "light") {
      setLightTheme((prev) => ({ ...prev, accent: newShades }));
    } else {
      setDarkTheme((prev) => ({ ...(prev || lightTheme), accent: newShades }));
    }
    setHasUnsavedChanges(true);
  };

  const updateBackgroundBase = (color: string) => {
    const newShades = generateBackgroundShades(color);
    if (editingMode === "light") {
      setLightTheme((prev) => ({ ...prev, background: newShades }));
    } else {
      setDarkTheme((prev) => ({ ...(prev || lightTheme), background: newShades }));
    }
    setHasUnsavedChanges(true);
  };

  const updateTextBase = (color: string) => {
    const newShades = generateTextShades(color);
    if (editingMode === "light") {
      setLightTheme((prev) => ({ ...prev, text: newShades }));
    } else {
      setDarkTheme((prev) => ({ ...(prev || lightTheme), text: newShades }));
    }
    setHasUnsavedChanges(true);
  };

  const updateStatusBase = (
    status: "success" | "fail" | "warning" | "info",
    color: string
  ) => {
    const newShades = generateStatusShades(color);
    if (editingMode === "light") {
      setLightTheme((prev) => ({
        ...prev,
        status: {
          ...prev.status,
          [status]: newShades,
        },
      }));
    } else {
      setDarkTheme((prev) => ({
        ...(prev || lightTheme),
        status: {
          ...(prev || lightTheme).status,
          [status]: newShades,
        },
      }));
    }
    setHasUnsavedChanges(true);
  };

  const updateShade = (
    type: "accent" | "background" | "text" | "success" | "fail" | "warning" | "info",
    shade: keyof ColorShades,
    color: string
  ) => {
    const isStatusColor = ["success", "fail", "warning", "info"].includes(type);

    if (editingMode === "light") {
      if (isStatusColor) {
        setLightTheme((prev) => ({
          ...prev,
          status: {
            ...prev.status,
            [type]: {
              ...prev.status[type as keyof StatusColors],
              [shade]: color,
            },
          },
        }));
      } else {
        setLightTheme((prev) => ({
          ...prev,
          [type]: {
            ...prev[type as "accent" | "background" | "text"],
            [shade]: color,
          },
        }));
      }
    } else {
      if (isStatusColor) {
        setDarkTheme((prev) => ({
          ...(prev || lightTheme),
          status: {
            ...(prev || lightTheme).status,
            [type]: {
              ...(prev || lightTheme).status[type as keyof StatusColors],
              [shade]: color,
            },
          },
        }));
      } else {
        setDarkTheme((prev) => ({
          ...(prev || lightTheme),
          [type]: {
            ...(prev || lightTheme)[type as "accent" | "background" | "text"],
            [shade]: color,
          },
        }));
      }
    }
    setHasUnsavedChanges(true);
  };

  const resetDarkTheme = () => {
    setDarkTheme(null);
    setHasUnsavedChanges(true);
  };

  const hasDarkThemeCustomizations = darkTheme !== null;

  // Load a theme from saved data
  const loadTheme = async (themeId: string) => {
    try {
      const savedTheme = await getTheme(themeId);
      if (savedTheme) {
        setLightTheme(ensureStatusColors(savedTheme.lightTheme) as Theme);
        setDarkTheme(ensureStatusColors(savedTheme.darkTheme));
        setCurrentThemeId(savedTheme.id);
        setCurrentThemeName(savedTheme.name);
        setComponentOverrides(savedTheme.componentOverrides || {});
        setBorderRadiusOverrides(savedTheme.borderRadiusOverrides || {});
        setComponentStates(savedTheme.componentStates || {});
        setAlphaOverrides(savedTheme.alphaOverrides || {});
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  };

  const refreshThemeList = () => {
    themeListRefreshCallbacks.forEach((callback) => callback());
    setThemeListVersion((v) => v + 1);
  };

  const onThemeListRefresh = (callback: () => void) => {
    setThemeListRefreshCallbacks((prev) => [...prev, callback]);
    return () => {
      setThemeListRefreshCallbacks((prev) =>
        prev.filter((cb) => cb !== callback)
      );
    };
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        mode,
        editingMode,
        setMode,
        setEditingMode,
        updateAccentBase,
        updateBackgroundBase,
        updateTextBase,
        updateStatusBase,
        updateShade,
        resetDarkTheme,
        hasDarkThemeCustomizations,
        currentThemeId,
        currentThemeName,
        setCurrentThemeName,
        lightTheme,
        darkTheme,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        loadTheme,
        setCurrentThemeId,
        componentOverrides,
        setComponentOverrides,
        borderRadiusOverrides,
        setBorderRadiusOverrides,
        componentStates,
        setComponentStates,
        alphaOverrides,
        setAlphaOverrides,
        refreshThemeList,
        onThemeListRefresh,
        themeListVersion,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
