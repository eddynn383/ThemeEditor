"use client";

import { useState } from "react";
import { useTheme, ColorShades, StatusColors } from "./ThemeProvider";
import { ThemePreview } from "./ThemePreview";
import { ThemeSelector } from "./ThemeSelector";
import { ShadeEditor } from "./ShadeEditor";
import { Switch } from "./ui/switch";

export function ThemeEditor() {
    const {
        theme,
        mode,
        setMode,
        editingMode,
        setEditingMode,
        updateAccentBase,
        updateBackgroundBase,
        updateTextBase,
        updateStatusBase,
        updateShade,
    } = useTheme();

    const [editingShade, setEditingShade] = useState<{
        type: "accent" | "background" | "text" | "success" | "fail" | "warning" | "info";
        shade: keyof ColorShades;
        color: string;
    } | null>(null);

    const statusColorConfigs: {
        key: keyof StatusColors;
        label: string;
        defaultColor: string;
    }[] = [
            { key: "success", label: "Success", defaultColor: "#22c55e" },
            { key: "fail", label: "Fail", defaultColor: "#ef4444" },
            { key: "warning", label: "Warning", defaultColor: "#f59e0b" },
            { key: "info", label: "Info", defaultColor: "#3b82f6" },
        ];

    // Default status colors for fallback
    const defaultStatusShades: ColorShades = {
        100: "#f0fdf4",
        200: "#bbf7d0",
        300: "#86efac",
        400: "#22c55e",
        500: "#16a34a",
        600: "#15803d",
        700: "#166534",
    };

    // Safely get status color shades with fallback
    const getStatusShades = (key: keyof StatusColors): ColorShades => {
        return theme.status?.[key] ?? defaultStatusShades;
    };

    // In dark mode, reverse the shade mapping
    const shadeMapping =
        mode === "dark"
            ? {
                100: 700,
                200: 600,
                300: 500,
                400: 400,
                500: 300,
                600: 200,
                700: 100,
            }
            : {
                100: 100,
                200: 200,
                300: 300,
                400: 400,
                500: 500,
                600: 600,
                700: 700,
            };

    const handleShadeSave = (color: string) => {
        if (editingShade) {
            updateShade(editingShade.type, editingShade.shade, color);
        }
    };

    return (
        <div
            className="min-h-screen flex w-full h-screen overflow-hidden"
            style={{
                backgroundColor: "var(--bg-100)",
                color: "var(--text-100)",
            }}
        >
            {/* Left Sidebar */}
            <div
                className="w-80 border-r p-6 space-y-8 overflow-y-auto"
                style={{ borderColor: "var(--bg-200)" }}
            >
                <div>
                    <h2 className="mb-6 text-xl font-semibold">Theme Editor</h2>

                    {/* Theme Selector */}
                    <div className="mb-8">
                        <ThemeSelector />
                    </div>

                    {/* Mode Toggles */}
                    <div className="space-y-4 mb-8">
                        {/* Preview Mode Toggle */}
                        <div
                            className="flex items-center justify-between p-4 rounded-lg"
                            style={{ backgroundColor: "var(--bg-200)" }}
                        >
                            <span className="text-sm">Preview Dark Mode</span>
                            <Switch
                                checked={mode === "dark"}
                                onCheckedChange={(checked) =>
                                    setMode(checked ? "dark" : "light")
                                }
                            />
                        </div>

                        {/* Editing Mode Toggle */}
                        <div
                            className="flex items-center justify-between p-4 rounded-lg"
                            style={{ backgroundColor: "var(--bg-200)" }}
                        >
                            <span className="text-sm">Edit Dark Theme</span>
                            <Switch
                                checked={editingMode === "dark"}
                                onCheckedChange={(checked) =>
                                    setEditingMode(checked ? "dark" : "light")
                                }
                            />
                        </div>
                    </div>

                    {/* Accent Color */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-medium">Accent color</label>
                            <input
                                type="color"
                                value={theme.accent[400]}
                                onChange={(e) => updateAccentBase(e.target.value)}
                                className="w-10 h-10 cursor-pointer rounded transition-all hover:scale-110 border-0"
                                style={{
                                    backgroundColor: theme.accent[400],
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-7 gap-1.5">
                            {([100, 200, 300, 400, 500, 600, 700] as const).map((shade) => {
                                const mappedShade = shadeMapping[
                                    shade
                                ] as keyof ColorShades;
                                return (
                                    <button
                                        key={shade}
                                        onClick={() =>
                                            setEditingShade({
                                                type: "accent",
                                                shade: mappedShade,
                                                color: theme.accent[mappedShade],
                                            })
                                        }
                                        className="aspect-square rounded transition-all hover:scale-110"
                                        style={{
                                            backgroundColor: theme.accent[mappedShade],
                                        }}
                                        title={`${shade}`}
                                    />
                                );
                            })}
                        </div>
                        <div className="grid grid-cols-7 gap-1.5 mt-1">
                            {([100, 200, 300, 400, 500, 600, 700] as const).map((shade) => (
                                <div
                                    key={shade}
                                    className="text-center text-xs"
                                    style={{ color: "var(--text-200)" }}
                                >
                                    {shade}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Background Color */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-medium">Background color</label>
                            <input
                                type="color"
                                value={theme.background[100] || "#ffffff"}
                                onChange={(e) => updateBackgroundBase(e.target.value)}
                                className="w-10 h-10 cursor-pointer rounded transition-all hover:scale-110 border-0"
                                style={{
                                    backgroundColor: theme.background[100] || "#ffffff",
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-7 gap-1.5">
                            {([100, 200, 300, 400, 500, 600, 700] as const).map((shade) => {
                                const mappedShade = shadeMapping[
                                    shade
                                ] as keyof ColorShades;
                                const color = theme.background[mappedShade];
                                return (
                                    <button
                                        key={shade}
                                        onClick={() =>
                                            color &&
                                            setEditingShade({
                                                type: "background",
                                                shade: mappedShade,
                                                color: color,
                                            })
                                        }
                                        className="aspect-square rounded transition-all hover:scale-110 border"
                                        style={{
                                            backgroundColor: color,
                                            borderColor: "var(--bg-300)",
                                        }}
                                        title={`${shade}`}
                                    />
                                );
                            })}
                        </div>
                        <div className="grid grid-cols-7 gap-1.5 mt-1">
                            {([100, 200, 300, 400, 500, 600, 700] as const).map((shade) => (
                                <div
                                    key={shade}
                                    className="text-center text-xs"
                                    style={{ color: "var(--text-200)" }}
                                >
                                    {shade}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Text Color */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-medium">Text color</label>
                            <input
                                type="color"
                                value={theme.text[100] || "#1f2937"}
                                onChange={(e) => updateTextBase(e.target.value)}
                                className="w-10 h-10 cursor-pointer rounded transition-all hover:scale-110 border-0"
                                style={{
                                    backgroundColor: theme.text[100] || "#1f2937",
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-7 gap-1.5">
                            {([100, 200, 300, 400, 500, 600, 700] as const).map((shade) => {
                                const mappedShade = shadeMapping[
                                    shade
                                ] as keyof ColorShades;
                                const color = theme.text[mappedShade];
                                return (
                                    <button
                                        key={shade}
                                        onClick={() =>
                                            color &&
                                            setEditingShade({
                                                type: "text",
                                                shade: mappedShade,
                                                color: color,
                                            })
                                        }
                                        className="aspect-square rounded transition-all hover:scale-110 border"
                                        style={{
                                            backgroundColor: color,
                                            borderColor: "var(--bg-300)",
                                        }}
                                        title={`${shade}`}
                                    />
                                );
                            })}
                        </div>
                        <div className="grid grid-cols-7 gap-1.5 mt-1">
                            {([100, 200, 300, 400, 500, 600, 700] as const).map((shade) => (
                                <div
                                    key={shade}
                                    className="text-center text-xs"
                                    style={{ color: "var(--text-200)" }}
                                >
                                    {shade}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Status Colors Section */}
                    <div
                        className="pt-6 border-t"
                        style={{ borderColor: "var(--bg-300)" }}
                    >
                        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-200)" }}>
                            Status Colors
                        </h3>

                        {statusColorConfigs.map(({ key, label, defaultColor }) => {
                            const statusShades = getStatusShades(key);
                            return (
                                <div key={key} className="mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-sm font-medium">{label}</label>
                                        <input
                                            type="color"
                                            value={statusShades[400]}
                                            onChange={(e) => updateStatusBase(key, e.target.value)}
                                            className="w-10 h-10 cursor-pointer rounded transition-all hover:scale-110 border-0"
                                            style={{
                                                backgroundColor: statusShades[400],
                                            }}
                                        />
                                    </div>
                                    <div className="grid grid-cols-7 gap-1.5">
                                        {([100, 200, 300, 400, 500, 600, 700] as const).map((shade) => {
                                            const mappedShade = shadeMapping[shade] as keyof ColorShades;
                                            return (
                                                <button
                                                    key={shade}
                                                    onClick={() =>
                                                        setEditingShade({
                                                            type: key,
                                                            shade: mappedShade,
                                                            color: statusShades[mappedShade],
                                                        })
                                                    }
                                                    className="aspect-square rounded transition-all hover:scale-110"
                                                    style={{
                                                        backgroundColor: statusShades[mappedShade],
                                                    }}
                                                    title={`${shade}`}
                                                />
                                            );
                                        })}
                                    </div>
                                    <div className="grid grid-cols-7 gap-1.5 mt-1">
                                        {([100, 200, 300, 400, 500, 600, 700] as const).map((shade) => (
                                            <div
                                                key={shade}
                                                className="text-center text-xs"
                                                style={{ color: "var(--text-200)" }}
                                            >
                                                {shade}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content - Preview */}
            <div className="flex-1 h-full overflow-hidden">
                <ThemePreview />
            </div>

            {/* Shade Editor Modal */}
            {editingShade && (
                <ShadeEditor
                    type={editingShade.type}
                    shade={editingShade.shade}
                    initialColor={editingShade.color}
                    onSave={handleShadeSave}
                    onClose={() => setEditingShade(null)}
                />
            )}
        </div>
    );
}
