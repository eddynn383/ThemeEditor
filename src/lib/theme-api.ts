import { Theme, SavedTheme } from "@/components/ThemeProvider";

export type { SavedTheme };

const API_BASE_URL = "/api/themes";

export async function getAllThemes(): Promise<SavedTheme[]> {
  const response = await fetch(API_BASE_URL);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch themes");
  }

  return data.themes || [];
}

export async function getTheme(id: string): Promise<SavedTheme | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);

    if (response.status === 404) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch theme");
    }

    return data.theme;
  } catch (error) {
    console.error("Error fetching theme:", error);
    return null;
  }
}

export async function saveTheme(
  theme: Omit<SavedTheme, "createdAt" | "updatedAt">
): Promise<SavedTheme> {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(theme),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to save theme");
  }

  return data.theme;
}

export async function updateTheme(
  id: string,
  updates: Partial<SavedTheme>
): Promise<SavedTheme> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to update theme");
  }

  return data.theme;
}

export async function deleteTheme(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to delete theme");
  }
}

// Initialize default theme if it doesn't exist
export async function initializeDefaultTheme(
  lightTheme: Theme,
  darkTheme: Theme | null
): Promise<SavedTheme> {
  try {
    // First, try to get the default theme directly
    const existingDefault = await getTheme("default");

    if (existingDefault) {
      return existingDefault;
    }

    // If not found, create it
    const newDefaultTheme: Omit<SavedTheme, "createdAt" | "updatedAt"> = {
      id: "default",
      name: "Default Theme",
      lightTheme,
      darkTheme,
      componentOverrides: {},
      borderRadiusOverrides: {},
      componentStates: {},
      alphaOverrides: {},
    };

    return await saveTheme(newDefaultTheme);
  } catch (error) {
    console.error("Error initializing default theme:", error);
    throw error;
  }
}

// Get or set the active theme ID
export function getActiveThemeId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("activeThemeId");
}

export function setActiveThemeId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("activeThemeId", id);
}

export function clearActiveThemeId(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("activeThemeId");
}
