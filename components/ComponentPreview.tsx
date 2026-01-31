"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "./ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Calendar } from "./ui/calendar";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Slider } from "./ui/slider";
import { useState, useMemo } from "react";
import {
    Info,
    AlertCircle,
    ChevronRight,
    Settings2,
    RotateCcw,
    X,
    CheckCircle2,
    XCircle,
    AlertTriangle,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { useTheme } from "./ThemeProvider";
import { CheckboxDemo } from "./CheckboxDemo";

const chartData = [
    { name: "Jan", value: 400, revenue: 240 },
    { name: "Feb", value: 300, revenue: 139 },
    { name: "Mar", value: 600, revenue: 980 },
    { name: "Apr", value: 800, revenue: 390 },
    { name: "May", value: 500, revenue: 480 },
];

const pieChartData = [
    { name: "Category A", value: 400 },
    { name: "Category B", value: 300 },
    { name: "Category C", value: 300 },
    { name: "Category D", value: 200 },
];

interface ComponentConfig {
    id: string;
    name: string;
    category: string;
    description: string;
    defaultColors: Array<{ key: string; color: string; state?: string }>;
    defaultBorderRadius: number;
    render: (
        getColor: (key: string, defaultColor: string) => string,
        borderRadius: number,
        componentState: Record<string, unknown>
    ) => React.ReactNode;
    controls?: Array<{
        key: string;
        label: string;
        type: "select" | "toggle" | "number";
        options?: string[];
        defaultValue?: unknown;
    }>;
}

// Helper component for toggle buttons
function ToggleButton({
    size,
    defaultClass,
    toggledClass,
    style,
    defaultText,
    toggledText,
}: {
    size: "sm" | "default" | "lg";
    defaultClass: string;
    toggledClass: string;
    style: React.CSSProperties;
    defaultText: string;
    toggledText: string;
}) {
    const [isToggled, setIsToggled] = useState(false);
    return (
        <Button
            size={size}
            className={isToggled ? toggledClass : defaultClass}
            onClick={() => setIsToggled(!isToggled)}
            style={style}
        >
            {isToggled ? toggledText : defaultText}
        </Button>
    );
}

const componentConfigs: ComponentConfig[] = [
    {
        id: "button-primary",
        name: "Button (Primary)",
        category: "Buttons",
        description: "Primary action button with hover and disabled states",
        defaultBorderRadius: 4,
        defaultColors: [
            { key: "defaultBg", color: "accent-400", state: "default bg" },
            { key: "defaultBorder", color: "accent-400", state: "default border" },
            { key: "defaultText", color: "accent-100", state: "default text" },
            { key: "hoverBg", color: "accent-500", state: "hover bg" },
            { key: "hoverBorder", color: "accent-500", state: "hover border" },
            { key: "hoverText", color: "accent-100", state: "hover text" },
            { key: "disabledBg", color: "bg-300", state: "disabled bg" },
            { key: "disabledBorder", color: "bg-300", state: "disabled border" },
            { key: "disabledText", color: "text-300", state: "disabled text" },
        ],
        controls: [
            {
                key: "size",
                label: "Size",
                type: "select",
                options: ["small", "medium", "large"],
                defaultValue: "medium",
            },
        ],
        render: (getColor, borderRadius, state) => {
            const size = (state.size as string) || "medium";
            const buttonSize =
                size === "small" ? "sm" : size === "large" ? "lg" : "default";

            return (
                <div className="flex gap-3 flex-wrap">
                    <style>{`
            .btn-primary-demo {
              background-color: ${getColor("defaultBg", "accent-400")};
              border-color: ${getColor("defaultBorder", "accent-400")};
              color: ${getColor("defaultText", "accent-100")};
              transition: all 0.2s;
            }
            .btn-primary-demo:hover:not(:disabled) {
              background-color: ${getColor("hoverBg", "accent-500")} !important;
              border-color: ${getColor("hoverBorder", "accent-500")} !important;
              color: ${getColor("hoverText", "accent-100")} !important;
            }
          `}</style>
                    <Button
                        size={buttonSize}
                        className="btn-primary-demo"
                        style={{
                            borderRadius: `${borderRadius}px`,
                            borderWidth: "1px",
                            borderStyle: "solid",
                        }}
                    >
                        Primary Button
                    </Button>
                    <Button
                        size={buttonSize}
                        disabled
                        style={{
                            backgroundColor: getColor("disabledBg", "bg-300"),
                            borderColor: getColor("disabledBorder", "bg-300"),
                            color: getColor("disabledText", "text-300"),
                            borderRadius: `${borderRadius}px`,
                            borderWidth: "1px",
                            borderStyle: "solid",
                            opacity: 1,
                        }}
                    >
                        Disabled
                    </Button>
                </div>
            );
        },
    },
    {
        id: "button-secondary",
        name: "Button (Secondary)",
        category: "Buttons",
        description: "Secondary button with outline style",
        defaultBorderRadius: 4,
        defaultColors: [
            { key: "defaultBg", color: "bg-200", state: "default bg" },
            { key: "defaultBorder", color: "bg-200", state: "default border" },
            { key: "defaultText", color: "text-100", state: "default text" },
            { key: "hoverBg", color: "bg-300", state: "hover bg" },
            { key: "hoverBorder", color: "bg-300", state: "hover border" },
            { key: "hoverText", color: "text-100", state: "hover text" },
            { key: "disabledBg", color: "bg-200", state: "disabled bg" },
            { key: "disabledBorder", color: "bg-200", state: "disabled border" },
            { key: "disabledText", color: "text-300", state: "disabled text" },
        ],
        controls: [
            {
                key: "size",
                label: "Size",
                type: "select",
                options: ["small", "medium", "large"],
                defaultValue: "medium",
            },
        ],
        render: (getColor, borderRadius, state) => {
            const size = (state.size as string) || "medium";
            const buttonSize =
                size === "small" ? "sm" : size === "large" ? "lg" : "default";

            return (
                <div className="flex gap-3 flex-wrap">
                    <style>{`
            .btn-secondary-demo {
              background-color: ${getColor("defaultBg", "bg-200")};
              border-color: ${getColor("defaultBorder", "bg-200")};
              color: ${getColor("defaultText", "text-100")};
              transition: all 0.2s;
            }
            .btn-secondary-demo:hover:not(:disabled) {
              background-color: ${getColor("hoverBg", "bg-300")} !important;
              border-color: ${getColor("hoverBorder", "bg-300")} !important;
              color: ${getColor("hoverText", "text-100")} !important;
            }
          `}</style>
                    <Button
                        variant="outline"
                        size={buttonSize}
                        className="btn-secondary-demo"
                        style={{
                            borderRadius: `${borderRadius}px`,
                            borderWidth: "1px",
                            borderStyle: "solid",
                        }}
                    >
                        Secondary Button
                    </Button>
                    <Button
                        variant="outline"
                        size={buttonSize}
                        disabled
                        style={{
                            backgroundColor: getColor("disabledBg", "bg-200"),
                            borderColor: getColor("disabledBorder", "bg-200"),
                            color: getColor("disabledText", "text-300"),
                            borderRadius: `${borderRadius}px`,
                            borderWidth: "1px",
                            borderStyle: "solid",
                            opacity: 1,
                        }}
                    >
                        Disabled
                    </Button>
                </div>
            );
        },
    },
    {
        id: "input",
        name: "Input",
        category: "Form Controls",
        description: "Text input field with solid and outline variants",
        defaultBorderRadius: 4,
        defaultColors: [
            { key: "solidBg", color: "bg-200", state: "solid bg" },
            { key: "solidBorder", color: "bg-300", state: "solid border" },
            { key: "solidText", color: "text-100", state: "solid text" },
        ],
        controls: [
            {
                key: "placeholder",
                label: "Placeholder",
                type: "select",
                options: ["Enter text...", "Type here...", "Search..."],
                defaultValue: "Enter text...",
            },
        ],
        render: (getColor, borderRadius, state) => {
            const inputId = `input-preview-${Math.random().toString(36).substr(2, 9)}`;

            return (
                <>
                    <style>{`
            #${inputId} {
              background-color: ${getColor("solidBg", "bg-200")} !important;
              border-color: ${getColor("solidBorder", "bg-300")} !important;
              color: ${getColor("solidText", "text-100")} !important;
              border-radius: ${borderRadius}px !important;
            }
          `}</style>
                    <Input
                        id={inputId}
                        placeholder={(state.placeholder as string) || "Enter text..."}
                        className="max-w-sm"
                    />
                </>
            );
        },
    },
    {
        id: "switch",
        name: "Switch",
        category: "Form Controls",
        description: "Toggle switch for on/off states",
        defaultBorderRadius: 12,
        defaultColors: [
            { key: "defaultBg", color: "bg-300", state: "default bg" },
            { key: "selectedBg", color: "accent-400", state: "selected bg" },
            { key: "defaultThumb", color: "bg-100", state: "default thumb" },
            { key: "selectedThumb", color: "accent-100", state: "selected thumb" },
        ],
        render: (getColor, borderRadius) => {
            const switchId = `switch-${Math.random().toString(36).substr(2, 9)}`;
            return (
                <>
                    <style>{`
            #${switchId}-enabled[data-state="checked"] {
              background-color: ${getColor("selectedBg", "accent-400")} !important;
            }
            #${switchId}-enabled[data-state="unchecked"] {
              background-color: ${getColor("defaultBg", "bg-300")} !important;
            }
            #${switchId}-enabled[data-state="checked"] > span {
              background-color: ${getColor("selectedThumb", "accent-100")} !important;
            }
            #${switchId}-enabled[data-state="unchecked"] > span {
              background-color: ${getColor("defaultThumb", "bg-100")} !important;
            }
          `}</style>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Switch
                                id={`${switchId}-enabled`}
                                defaultChecked
                                style={
                                    {
                                        borderRadius: `${borderRadius}px`,
                                    } as React.CSSProperties
                                }
                            />
                            <span style={{ color: "var(--text-100)" }}>Toggle Switch</span>
                        </div>
                    </div>
                </>
            );
        },
    },
    {
        id: "checkbox",
        name: "Checkbox",
        category: "Form Controls",
        description: "Checkbox for binary choices",
        defaultBorderRadius: 2,
        defaultColors: [
            { key: "uncheckedBg", color: "bg-100", state: "unchecked bg" },
            { key: "uncheckedBorder", color: "bg-300", state: "unchecked border" },
            { key: "checkedBg", color: "accent-400", state: "checked bg" },
            { key: "checkedBorder", color: "accent-400", state: "checked border" },
            { key: "checkedText", color: "accent-100", state: "checked text" },
        ],
        render: (getColor, borderRadius) => {
            const uniqueId = Math.random().toString(36).substr(2, 9);
            return (
                <CheckboxDemo
                    getColor={getColor}
                    borderRadius={borderRadius}
                    uniqueId={uniqueId}
                />
            );
        },
    },
    {
        id: "card",
        name: "Card",
        category: "Layout",
        description: "Content card container",
        defaultBorderRadius: 8,
        defaultColors: [
            { key: "defaultBg", color: "bg-200", state: "default bg" },
            { key: "defaultBorder", color: "bg-300", state: "default border" },
            { key: "defaultTitle", color: "text-100", state: "default title" },
            { key: "defaultDesc", color: "text-300", state: "default desc" },
            { key: "hoverBorder", color: "accent-400", state: "hover border" },
        ],
        render: (getColor, borderRadius) => {
            const cardId = `card-${Math.random().toString(36).substr(2, 9)}`;

            return (
                <>
                    <style>{`
            .${cardId}-card {
              background-color: ${getColor("defaultBg", "bg-200")} !important;
              border-color: ${getColor("defaultBorder", "bg-300")} !important;
              cursor: pointer;
              transition: all 0.2s ease;
            }
            .${cardId}-card:hover {
              border-color: ${getColor("hoverBorder", "accent-400")} !important;
            }
            .${cardId}-card .card-title {
              color: ${getColor("defaultTitle", "text-100")};
            }
            .${cardId}-card .card-desc {
              color: ${getColor("defaultDesc", "text-300")};
            }
          `}</style>

                    <div className="grid grid-cols-3 gap-4" style={{ width: "100%" }}>
                        {[0, 1, 2].map((index) => (
                            <Card
                                key={index}
                                className={`${cardId}-card p-4`}
                                style={{
                                    borderRadius: `${borderRadius}px`,
                                }}
                            >
                                <h4 className="card-title text-sm font-medium">
                                    Card Title {index + 1}
                                </h4>
                                <p className="text-xs card-desc mt-1">
                                    This is a sample card with some content.
                                </p>
                            </Card>
                        ))}
                    </div>
                </>
            );
        },
    },
    {
        id: "tabs",
        name: "Tabs",
        category: "Layout",
        description: "Tabbed navigation interface",
        defaultBorderRadius: 4,
        defaultColors: [
            { key: "active", color: "accent-400", state: "active" },
            { key: "inactive", color: "text-200", state: "inactive" },
            { key: "contentBg", color: "bg-200", state: "content bg" },
        ],
        render: (getColor, borderRadius) => {
            const tabsId = `tabs-${Math.random().toString(36).substr(2, 9)}`;

            return (
                <>
                    <style>{`
            .tabs-list-${tabsId} [data-state="active"] {
              background-color: ${getColor("active", "accent-400")} !important;
              color: white !important;
            }
            .tabs-list-${tabsId} [data-state="inactive"] {
              color: ${getColor("inactive", "text-200")} !important;
            }
          `}</style>
                    <Tabs defaultValue="tab1" className="w-96">
                        <TabsList
                            className={`tabs-list-${tabsId}`}
                            style={{ backgroundColor: "var(--bg-200)" }}
                        >
                            <TabsTrigger
                                value="tab1"
                                style={{ borderRadius: `${borderRadius}px` }}
                            >
                                Tab 1
                            </TabsTrigger>
                            <TabsTrigger
                                value="tab2"
                                style={{ borderRadius: `${borderRadius}px` }}
                            >
                                Tab 2
                            </TabsTrigger>
                            <TabsTrigger
                                value="tab3"
                                style={{ borderRadius: `${borderRadius}px` }}
                            >
                                Tab 3
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent
                            value="tab1"
                            className="p-4 rounded"
                            style={{
                                backgroundColor: getColor("contentBg", "bg-200"),
                                color: "var(--text-100)",
                                borderRadius: `${borderRadius}px`,
                            }}
                        >
                            Content for Tab 1
                        </TabsContent>
                        <TabsContent
                            value="tab2"
                            className="p-4 rounded"
                            style={{
                                backgroundColor: getColor("contentBg", "bg-200"),
                                color: "var(--text-100)",
                                borderRadius: `${borderRadius}px`,
                            }}
                        >
                            Content for Tab 2
                        </TabsContent>
                        <TabsContent
                            value="tab3"
                            className="p-4 rounded"
                            style={{
                                backgroundColor: getColor("contentBg", "bg-200"),
                                color: "var(--text-100)",
                                borderRadius: `${borderRadius}px`,
                            }}
                        >
                            Content for Tab 3
                        </TabsContent>
                    </Tabs>
                </>
            );
        },
    },
    {
        id: "alert",
        name: "Alert",
        category: "Feedback",
        description: "Alert messages for notifications",
        defaultBorderRadius: 4,
        defaultColors: [
            { key: "bg", color: "bg-200", state: "background" },
            { key: "border", color: "bg-300", state: "border" },
            { key: "icon", color: "text-200", state: "icon" },
            { key: "title", color: "text-100", state: "title" },
            { key: "desc", color: "text-200", state: "description" },
        ],
        controls: [
            {
                key: "status",
                label: "Status",
                type: "select",
                options: ["default", "brand", "success", "fail", "warning", "info"],
                defaultValue: "default",
            },
        ],
        render: (getColor, borderRadius, state) => {
            const status = (state.status as string) || "default";

            // Get colors based on status
            const getStatusColors = () => {
                switch (status) {
                    case "brand":
                        return {
                            bg: "accent-100",
                            border: "accent-300",
                            icon: "accent-400",
                        };
                    case "success":
                        return {
                            bg: "success-100",
                            border: "success-300",
                            icon: "success-400",
                        };
                    case "fail":
                        return {
                            bg: "fail-100",
                            border: "fail-300",
                            icon: "fail-400",
                        };
                    case "warning":
                        return {
                            bg: "warning-100",
                            border: "warning-300",
                            icon: "warning-400",
                        };
                    case "info":
                        return {
                            bg: "info-100",
                            border: "info-300",
                            icon: "info-400",
                        };
                    default:
                        return {
                            bg: "bg-200",
                            border: "bg-300",
                            icon: "text-200",
                        };
                }
            };

            const statusColors = getStatusColors();

            const getStatusTitle = () => {
                switch (status) {
                    case "brand":
                        return "Brand Message";
                    case "success":
                        return "Success!";
                    case "fail":
                        return "Error!";
                    case "warning":
                        return "Warning!";
                    case "info":
                        return "Information";
                    default:
                        return "Notification";
                }
            };

            const getStatusDescription = () => {
                switch (status) {
                    case "brand":
                        return "This is a branded alert message using accent colors.";
                    case "success":
                        return "Your operation was completed successfully.";
                    case "fail":
                        return "An error occurred. Please try again.";
                    case "warning":
                        return "Please review before proceeding.";
                    case "info":
                        return "Here is some useful information.";
                    default:
                        return "This is a default alert message.";
                }
            };

            const IconComponent = status === "success" ? CheckCircle2 :
                status === "fail" ? XCircle :
                    status === "warning" ? AlertTriangle :
                        Info;

            return (
                <Alert
                    className="w-96"
                    style={{
                        backgroundColor: getColor("bg", statusColors.bg),
                        borderColor: `var(--${statusColors.border})`,
                        color: getColor("title", "text-100"),
                        borderRadius: `${borderRadius}px`,
                    }}
                >
                    <IconComponent
                        className="size-4"
                        style={{ color: getColor("icon", statusColors.icon) }}
                    />
                    <AlertTitle>{getStatusTitle()}</AlertTitle>
                    <AlertDescription style={{ color: getColor("desc", "text-200") }}>
                        {getStatusDescription()}
                    </AlertDescription>
                </Alert>
            );
        },
    },
    {
        id: "progress",
        name: "Progress Bar",
        category: "Feedback",
        description: "Progress indicator",
        defaultBorderRadius: 12,
        defaultColors: [
            { key: "track", color: "bg-300", state: "track" },
            { key: "bar", color: "accent-400", state: "bar" },
        ],
        controls: [
            { key: "value", label: "Progress", type: "number", defaultValue: 65 },
        ],
        render: (getColor, borderRadius, state) => {
            const progress = (state.value as number) || 65;

            return (
                <div className="w-80">
                    <div className="flex justify-between mb-2">
                        <span style={{ color: "var(--text-200)" }}>
                            Progress: {progress}%
                        </span>
                    </div>
                    <div
                        className="w-full h-2 overflow-hidden"
                        style={{
                            backgroundColor: getColor("track", "bg-300"),
                            borderRadius: `${borderRadius}px`,
                        }}
                    >
                        <div
                            className="h-full transition-all duration-300"
                            style={{
                                width: `${progress}%`,
                                backgroundColor: getColor("bar", "accent-400"),
                            }}
                        />
                    </div>
                </div>
            );
        },
    },
    {
        id: "badge",
        name: "Badge",
        category: "Display",
        description: "Small status indicators",
        defaultBorderRadius: 4,
        defaultColors: [
            { key: "bg", color: "accent-100", state: "bg" },
            { key: "text", color: "accent-400", state: "text" },
        ],
        render: (getColor, borderRadius) => (
            <div className="flex gap-2 flex-wrap">
                <Badge
                    style={{
                        backgroundColor: getColor("bg", "accent-100"),
                        color: getColor("text", "accent-400"),
                        borderRadius: `${borderRadius}px`,
                    }}
                >
                    Badge
                </Badge>
                <Badge
                    style={{
                        backgroundColor: getColor("bg", "accent-100"),
                        color: getColor("text", "accent-400"),
                        borderRadius: `${borderRadius}px`,
                    }}
                >
                    New
                </Badge>
                <Badge
                    style={{
                        backgroundColor: getColor("bg", "accent-100"),
                        color: getColor("text", "accent-400"),
                        borderRadius: `${borderRadius}px`,
                    }}
                >
                    Active
                </Badge>
            </div>
        ),
    },
    {
        id: "table",
        name: "Table",
        category: "Display",
        description: "Data table component",
        defaultBorderRadius: 4,
        defaultColors: [
            { key: "header", color: "bg-200", state: "header" },
            { key: "row", color: "bg-100", state: "row" },
            { key: "text", color: "text-100", state: "text" },
            { key: "border", color: "bg-300", state: "border" },
        ],
        render: (getColor, borderRadius) => (
            <div
                className="border rounded-lg overflow-hidden"
                style={{
                    borderColor: getColor("border", "bg-300"),
                    borderRadius: `${borderRadius}px`,
                }}
            >
                <Table>
                    <TableHeader
                        style={{ backgroundColor: getColor("header", "bg-200") }}
                    >
                        <TableRow>
                            <TableHead style={{ color: getColor("text", "text-100") }}>
                                Name
                            </TableHead>
                            <TableHead style={{ color: getColor("text", "text-100") }}>
                                Status
                            </TableHead>
                            <TableHead style={{ color: getColor("text", "text-100") }}>
                                Value
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow style={{ borderColor: getColor("border", "bg-300") }}>
                            <TableCell style={{ color: getColor("text", "text-100") }}>
                                Item 1
                            </TableCell>
                            <TableCell>
                                <span
                                    className="px-2 py-1 rounded text-xs"
                                    style={{
                                        backgroundColor: "var(--accent-100)",
                                        color: "var(--accent-400)",
                                    }}
                                >
                                    Active
                                </span>
                            </TableCell>
                            <TableCell style={{ color: "var(--text-200)" }}>$100</TableCell>
                        </TableRow>
                        <TableRow style={{ borderColor: getColor("border", "bg-300") }}>
                            <TableCell style={{ color: getColor("text", "text-100") }}>
                                Item 2
                            </TableCell>
                            <TableCell>
                                <span
                                    className="px-2 py-1 rounded text-xs"
                                    style={{
                                        backgroundColor: "var(--bg-300)",
                                        color: "var(--text-300)",
                                    }}
                                >
                                    Inactive
                                </span>
                            </TableCell>
                            <TableCell style={{ color: "var(--text-200)" }}>$200</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        ),
    },
    {
        id: "chart-bar",
        name: "Bar Chart",
        category: "Charts",
        description: "Bar chart visualization",
        defaultBorderRadius: 4,
        defaultColors: [
            { key: "bars", color: "accent-400", state: "bars" },
            { key: "grid", color: "bg-300", state: "grid" },
            { key: "labels", color: "text-200", state: "labels" },
        ],
        render: (getColor, borderRadius) => (
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={getColor("grid", "bg-300")}
                    />
                    <XAxis dataKey="name" stroke={getColor("labels", "text-200")} />
                    <YAxis stroke={getColor("labels", "text-200")} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "var(--bg-200)",
                            borderColor: "var(--bg-300)",
                            color: "var(--text-100)",
                        }}
                    />
                    <Bar dataKey="value" fill={getColor("bars", "accent-400")} />
                </BarChart>
            </ResponsiveContainer>
        ),
    },
    {
        id: "chart-line",
        name: "Line Chart",
        category: "Charts",
        description: "Line chart visualization",
        defaultBorderRadius: 4,
        defaultColors: [
            { key: "line", color: "accent-400", state: "line" },
            { key: "grid", color: "bg-300", state: "grid" },
            { key: "labels", color: "text-200", state: "labels" },
        ],
        render: (getColor, borderRadius) => (
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={getColor("grid", "bg-300")}
                    />
                    <XAxis dataKey="name" stroke={getColor("labels", "text-200")} />
                    <YAxis stroke={getColor("labels", "text-200")} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "var(--bg-200)",
                            borderColor: "var(--bg-300)",
                            color: "var(--text-100)",
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke={getColor("line", "accent-400")}
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        ),
    },
    {
        id: "chart-pie",
        name: "Pie Chart",
        category: "Charts",
        description: "Pie chart visualization",
        defaultBorderRadius: 4,
        defaultColors: [
            { key: "slice1", color: "accent-400", state: "slice 1" },
            { key: "slice2", color: "accent-500", state: "slice 2" },
            { key: "slice3", color: "accent-600", state: "slice 3" },
            { key: "slice4", color: "text-300", state: "slice 4" },
        ],
        render: (getColor, borderRadius) => (
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                            `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {pieChartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={getColor(
                                    `slice${index + 1}`,
                                    index === 0
                                        ? "accent-400"
                                        : index === 1
                                            ? "accent-500"
                                            : index === 2
                                                ? "accent-600"
                                                : "text-300"
                                )}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "var(--bg-200)",
                            borderColor: "var(--bg-300)",
                            color: "var(--text-100)",
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        ),
    },
    {
        id: "calendar",
        name: "Calendar",
        category: "Display",
        description: "Date picker calendar",
        defaultBorderRadius: 8,
        defaultColors: [
            { key: "bg", color: "bg-200", state: "bg" },
            { key: "border", color: "bg-300", state: "border" },
            { key: "text", color: "text-100", state: "text" },
            { key: "selected", color: "accent-400", state: "selected" },
        ],
        render: (getColor, borderRadius) => (
            <div
                className="inline-block p-4 rounded"
                style={{
                    backgroundColor: getColor("bg", "bg-200"),
                    borderColor: getColor("border", "bg-300"),
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderRadius: `${borderRadius}px`,
                }}
            >
                <Calendar mode="single" className="rounded-md" />
            </div>
        ),
    },
];

export function ComponentPreview() {
    const {
        componentOverrides,
        setComponentOverrides,
        borderRadiusOverrides,
        setBorderRadiusOverrides,
        componentStates,
        setComponentStates,
        alphaOverrides,
        setAlphaOverrides,
        setHasUnsavedChanges,
    } = useTheme();

    const [selectedComponent, setSelectedComponent] = useState(
        componentConfigs[0]
    );
    const [settingsOpen, setSettingsOpen] = useState(true);
    const [editingColor, setEditingColor] = useState<{
        key: string;
        color: string;
        label: string;
    } | null>(null);

    const getColor = (
        componentId: string,
        colorKey: string,
        defaultColor: string
    ) => {
        return componentOverrides[componentId]?.[colorKey] || defaultColor;
    };

    const getBorderRadius = (componentId: string, defaultRadius: number) => {
        return borderRadiusOverrides[componentId] ?? defaultRadius;
    };

    const getAlpha = (componentId: string, colorKey: string) => {
        return alphaOverrides[componentId]?.[colorKey] ?? 100;
    };

    const getColorWithAlpha = (
        componentId: string,
        colorKey: string,
        defaultColor: string
    ) => {
        const color = getColor(componentId, colorKey, defaultColor);
        const alpha = getAlpha(componentId, colorKey);

        if (alpha === 100) {
            return `var(--${color})`;
        }

        return `color-mix(in srgb, var(--${color}) ${alpha}%, transparent)`;
    };

    const handleColorChange = (
        componentId: string,
        colorKey: string,
        newColor: string
    ) => {
        setComponentOverrides({
            ...componentOverrides,
            [componentId]: {
                ...componentOverrides[componentId],
                [colorKey]: newColor,
            },
        });
        setHasUnsavedChanges(true);
    };

    const handleAlphaChange = (
        componentId: string,
        colorKey: string,
        newAlpha: number
    ) => {
        setAlphaOverrides({
            ...alphaOverrides,
            [componentId]: {
                ...alphaOverrides[componentId],
                [colorKey]: newAlpha,
            },
        });
        setHasUnsavedChanges(true);
    };

    const handleBorderRadiusChange = (componentId: string, radius: number) => {
        setBorderRadiusOverrides({
            ...borderRadiusOverrides,
            [componentId]: radius,
        });
        setHasUnsavedChanges(true);
    };

    const handleReset = (componentId: string) => {
        const newColorOverrides = { ...componentOverrides };
        delete newColorOverrides[componentId];
        setComponentOverrides(newColorOverrides);

        const newRadiusOverrides = { ...borderRadiusOverrides };
        delete newRadiusOverrides[componentId];
        setBorderRadiusOverrides(newRadiusOverrides);

        const newStates = { ...componentStates };
        delete newStates[componentId];
        setComponentStates(newStates);

        const newAlphaOverrides = { ...alphaOverrides };
        delete newAlphaOverrides[componentId];
        setAlphaOverrides(newAlphaOverrides);

        setHasUnsavedChanges(true);
    };

    const handleControlChange = (
        componentId: string,
        controlKey: string,
        value: unknown
    ) => {
        setComponentStates({
            ...componentStates,
            [componentId]: {
                ...(componentStates[componentId] as Record<string, unknown>),
                [controlKey]: value,
            },
        });
        setHasUnsavedChanges(true);
    };

    const categories = Array.from(
        new Set(componentConfigs.map((c) => c.category))
    );

    const currentBorderRadius = getBorderRadius(
        selectedComponent.id,
        selectedComponent.defaultBorderRadius
    );
    const currentState =
        (componentStates[selectedComponent.id] as Record<string, unknown>) || {};

    const formatLabel = (label: string): string => {
        const lowerLabel = label.toLowerCase();
        if (lowerLabel === "bg") return "Background";
        if (lowerLabel === "border") return "Border color";
        if (lowerLabel === "text") return "Text color";
        return label;
    };

    const groupedColors: {
        [key: string]: Array<{ key: string; color: string; label: string }>;
    } = {};
    selectedComponent.defaultColors.forEach((c) => {
        const stateParts = c.state?.split(" ") || ["default"];
        const stateGroup = stateParts.length > 1 ? stateParts[0] : "default";
        const rawLabel =
            stateParts.length > 1 ? stateParts.slice(1).join(" ") : c.state || c.key;
        const label = formatLabel(rawLabel);

        if (!groupedColors[stateGroup]) {
            groupedColors[stateGroup] = [];
        }
        groupedColors[stateGroup].push({ key: c.key, color: c.color, label });
    });

    return (
        <div
            className="flex h-full"
            style={{ backgroundColor: "var(--bg-100)" }}
        >
            {/* Left Sidebar - Component Navigation */}
            <div
                className="w-64 h-full border-r flex flex-col"
                style={{ borderColor: "var(--bg-200)" }}
            >
                <div
                    className="flex items-center p-4 min-h-[64px] border-b"
                    style={{ borderColor: "var(--bg-200)" }}
                >
                    <h2 className="text-base font-bold" style={{ color: "var(--text-100)" }}>
                        Components
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto pb-24">
                    {categories.map((category) => (
                        <div key={category}>
                            <div
                                className="px-4 py-2 text-xs uppercase tracking-wide"
                                style={{
                                    color: "var(--text-300)",
                                    backgroundColor: "var(--bg-100)",
                                }}
                            >
                                {category}
                            </div>
                            {componentConfigs
                                .filter((c) => c.category === category)
                                .map((component) => (
                                    <button
                                        key={component.id}
                                        onClick={() => setSelectedComponent(component)}
                                        className="w-full px-4 py-2.5 text-left flex items-center justify-between transition-all"
                                        style={{
                                            backgroundColor:
                                                selectedComponent.id === component.id
                                                    ? "var(--bg-200)"
                                                    : "transparent",
                                            color:
                                                selectedComponent.id === component.id
                                                    ? "var(--text-100)"
                                                    : "var(--text-200)",
                                            borderLeft:
                                                selectedComponent.id === component.id
                                                    ? "2px solid var(--accent-400)"
                                                    : "2px solid transparent",
                                        }}
                                    >
                                        <span className="text-sm">{component.name}</span>
                                        {selectedComponent.id === component.id && (
                                            <ChevronRight
                                                className="size-4"
                                                style={{ color: "var(--accent-400)" }}
                                            />
                                        )}
                                    </button>
                                ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Preview Area */}
            <div className="flex-1 h-full flex flex-col">
                {/* Header */}
                <div
                    className="h-16 border-b px-4 flex items-center justify-between"
                    style={{ borderColor: "var(--bg-200)" }}
                >
                    <div>
                        <h3 style={{ color: "var(--text-100)" }}>
                            {selectedComponent.name}
                        </h3>
                        <p className="text-sm" style={{ color: "var(--text-300)" }}>
                            {selectedComponent.description}
                        </p>
                    </div>
                    <button
                        onClick={() => setSettingsOpen(!settingsOpen)}
                        className="p-2 rounded transition-all"
                        style={{
                            backgroundColor: settingsOpen
                                ? "var(--bg-300)"
                                : "var(--bg-200)",
                            color: "var(--text-100)",
                        }}
                    >
                        <Settings2 className="size-5" />
                    </button>
                </div>

                {/* Preview Canvas */}
                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 p-4 overflow-auto">
                        <div
                            className="min-h-full rounded-lg flex items-center justify-center p-12"
                            style={{
                                backgroundColor: "var(--bg-100)",
                                // borderColor: "var(--bg-200)",
                                // borderStyle: "dashed",
                            }}
                        >
                            {selectedComponent.render(
                                (key, defaultColor) =>
                                    getColorWithAlpha(selectedComponent.id, key, defaultColor),
                                currentBorderRadius,
                                currentState
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar - Settings Panel */}
                    {settingsOpen && (
                        <div
                            className="w-80 h-full border-l flex flex-col flex-shrink-0"
                            style={{
                                borderColor: "var(--bg-200)",
                            }}
                        >
                            {/* Settings Header */}
                            <div
                                className="p-4 border-b flex items-center justify-between flex-shrink-0"
                                style={{ borderColor: "var(--bg-200)" }}
                            >
                                <h3 className="text-base font-bold" style={{ color: "var(--text-100)" }}>
                                    Settings
                                </h3>
                                <button
                                    onClick={() => handleReset(selectedComponent.id)}
                                    className="p-1.5 rounded hover:bg-opacity-80 transition-all"
                                    style={{
                                        backgroundColor: "var(--bg-200)",
                                        color: "var(--text-300)",
                                    }}
                                    title="Reset all settings"
                                >
                                    <RotateCcw className="size-4" />
                                </button>
                            </div>

                            {/* Settings Body - Scrollable */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="p-4 pb-24 space-y-6">
                                    {/* Component Controls */}
                                    {selectedComponent.controls &&
                                        selectedComponent.controls.length > 0 && (
                                            <div className="space-y-4">
                                                <h4
                                                    className="text-xs uppercase tracking-wide"
                                                    style={{ color: "var(--text-300)" }}
                                                >
                                                    Props
                                                </h4>
                                                {selectedComponent.controls.map((control) => (
                                                    <div key={control.key}>
                                                        <label
                                                            className="block text-sm mb-2"
                                                            style={{ color: "var(--text-200)" }}
                                                        >
                                                            {control.label}
                                                        </label>
                                                        {control.type === "select" && (
                                                            <Select
                                                                value={
                                                                    (currentState[control.key] as string) ||
                                                                    (control.defaultValue as string)
                                                                }
                                                                onValueChange={(value) =>
                                                                    handleControlChange(
                                                                        selectedComponent.id,
                                                                        control.key,
                                                                        value
                                                                    )
                                                                }
                                                            >
                                                                <SelectTrigger
                                                                    style={{
                                                                        backgroundColor: "var(--bg-200)",
                                                                        borderColor: "var(--bg-300)",
                                                                        color: "var(--text-100)",
                                                                    }}
                                                                >
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {control.options?.map((option) => (
                                                                        <SelectItem key={option} value={option}>
                                                                            {option}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                        {control.type === "number" && (
                                                            <Input
                                                                type="number"
                                                                value={
                                                                    (currentState[control.key] as number) ??
                                                                    (control.defaultValue as number)
                                                                }
                                                                onChange={(e) =>
                                                                    handleControlChange(
                                                                        selectedComponent.id,
                                                                        control.key,
                                                                        parseInt(e.target.value)
                                                                    )
                                                                }
                                                                style={{
                                                                    backgroundColor: "var(--bg-200)",
                                                                    borderColor: "var(--bg-300)",
                                                                    color: "var(--text-100)",
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                    {/* Border Radius */}
                                    <div>
                                        <h4
                                            className="text-xs uppercase tracking-wide mb-3"
                                            style={{ color: "var(--text-300)" }}
                                        >
                                            Border Radius
                                        </h4>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="range"
                                                min="0"
                                                max="24"
                                                step="1"
                                                value={currentBorderRadius}
                                                onChange={(e) =>
                                                    handleBorderRadiusChange(
                                                        selectedComponent.id,
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                                className="flex-1"
                                            />
                                            <span
                                                className="text-sm w-12 text-right"
                                                style={{ color: "var(--text-200)" }}
                                            >
                                                {currentBorderRadius}px
                                            </span>
                                        </div>
                                    </div>

                                    {/* Colors */}
                                    <div>
                                        <h4
                                            className="text-xs uppercase tracking-wide mb-3"
                                            style={{ color: "var(--text-300)" }}
                                        >
                                            Colors
                                        </h4>
                                        <div className="space-y-4">
                                            {Object.entries(groupedColors).map(
                                                ([stateGroup, colors]) => (
                                                    <div key={stateGroup}>
                                                        {stateGroup !== "default" && (
                                                            <div
                                                                className="text-xs uppercase tracking-wide mb-2 opacity-60"
                                                                style={{ color: "var(--text-200)" }}
                                                            >
                                                                {stateGroup}
                                                            </div>
                                                        )}
                                                        <div className="space-y-2">
                                                            {colors.map(({ key, color, label }) => {
                                                                const currentColor = getColor(
                                                                    selectedComponent.id,
                                                                    key,
                                                                    color
                                                                );
                                                                const currentAlpha = getAlpha(
                                                                    selectedComponent.id,
                                                                    key
                                                                );
                                                                return (
                                                                    <button
                                                                        key={key}
                                                                        onClick={() =>
                                                                            setEditingColor({
                                                                                key,
                                                                                color: currentColor,
                                                                                label,
                                                                            })
                                                                        }
                                                                        className="w-full flex items-center gap-3 p-2.5 rounded border transition-all hover:scale-[1.02]"
                                                                        style={{
                                                                            backgroundColor: "var(--bg-200)",
                                                                            borderColor: "var(--bg-300)",
                                                                        }}
                                                                    >
                                                                        <div
                                                                            className="size-8 rounded border flex-shrink-0"
                                                                            style={{
                                                                                backgroundColor: getColorWithAlpha(
                                                                                    selectedComponent.id,
                                                                                    key,
                                                                                    color
                                                                                ),
                                                                                borderColor: "var(--bg-400)",
                                                                            }}
                                                                        />
                                                                        <div className="flex-1 text-left">
                                                                            <div
                                                                                className="text-xs"
                                                                                style={{ color: "var(--text-200)" }}
                                                                            >
                                                                                {label}
                                                                            </div>
                                                                            <div
                                                                                className="text-xs"
                                                                                style={{ color: "var(--text-300)" }}
                                                                            >
                                                                                {currentColor}{" "}
                                                                                {currentAlpha !== 100
                                                                                    ? `(${currentAlpha}%)`
                                                                                    : ""}
                                                                            </div>
                                                                        </div>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Color Edit Modal */}
            {editingColor && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => setEditingColor(null)}
                >
                    <div
                        className="w-full max-w-md p-6 rounded-lg shadow-xl"
                        style={{
                            backgroundColor: "var(--bg-100)",
                            color: "var(--text-100)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3>Edit Color</h3>
                            <button
                                onClick={() => setEditingColor(null)}
                                className="p-1 rounded hover:bg-opacity-80"
                                style={{
                                    backgroundColor: "var(--bg-200)",
                                    color: "var(--text-300)",
                                }}
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <p className="text-sm mb-4" style={{ color: "var(--text-200)" }}>
                            {selectedComponent.name} - {editingColor.label}
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm mb-2">
                                    Current: {editingColor.color}
                                </label>
                                <div
                                    className="w-full h-24 rounded-md border mb-4"
                                    style={{
                                        backgroundColor: getColorWithAlpha(
                                            selectedComponent.id,
                                            editingColor.key,
                                            editingColor.color
                                        ),
                                        borderColor: "var(--bg-200)",
                                    }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-2">Select New Color</label>
                                <select
                                    value={editingColor.color}
                                    onChange={(e) => {
                                        handleColorChange(
                                            selectedComponent.id,
                                            editingColor.key,
                                            e.target.value
                                        );
                                        setEditingColor({
                                            ...editingColor,
                                            color: e.target.value,
                                        });
                                    }}
                                    className="w-full px-3 py-2 rounded border"
                                    style={{
                                        backgroundColor: "var(--bg-200)",
                                        borderColor: "var(--bg-300)",
                                        color: "var(--text-100)",
                                    }}
                                >
                                    <optgroup label="Accent">
                                        {[100, 200, 300, 400, 500, 600, 700].map((shade) => (
                                            <option key={`accent-${shade}`} value={`accent-${shade}`}>
                                                accent-{shade}
                                            </option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="Background">
                                        {[100, 200, 300, 400, 500, 600, 700].map((shade) => (
                                            <option key={`bg-${shade}`} value={`bg-${shade}`}>
                                                bg-{shade}
                                            </option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="Text">
                                        {[100, 200, 300, 400, 500, 600, 700].map((shade) => (
                                            <option key={`text-${shade}`} value={`text-${shade}`}>
                                                text-{shade}
                                            </option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm mb-2">
                                    Opacity: {getAlpha(selectedComponent.id, editingColor.key)}%
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="10"
                                        value={getAlpha(selectedComponent.id, editingColor.key)}
                                        onChange={(e) =>
                                            handleAlphaChange(
                                                selectedComponent.id,
                                                editingColor.key,
                                                parseInt(e.target.value)
                                            )
                                        }
                                        className="flex-1"
                                    />
                                    <span
                                        className="text-sm w-12 text-right"
                                        style={{ color: "var(--text-200)" }}
                                    >
                                        {getAlpha(selectedComponent.id, editingColor.key)}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <Button
                                onClick={() => setEditingColor(null)}
                                className="flex-1"
                                style={{
                                    backgroundColor: "var(--bg-300)",
                                    color: "var(--text-100)",
                                }}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
