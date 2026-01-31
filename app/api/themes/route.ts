import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// GET all themes
export async function GET() {
    try {
        const themes = await prisma.theme.findMany({
            orderBy: { updatedAt: "desc" },
        });

        const parsedThemes = themes.map((theme: { lightTheme: string; darkTheme: string; componentOverrides: string; borderRadiusOverrides: string; componentStates: string; alphaOverrides: string; }) => ({
            ...theme,
            lightTheme: JSON.parse(theme.lightTheme),
            darkTheme: theme.darkTheme ? JSON.parse(theme.darkTheme) : null,
            componentOverrides: JSON.parse(theme.componentOverrides),
            borderRadiusOverrides: JSON.parse(theme.borderRadiusOverrides),
            componentStates: JSON.parse(theme.componentStates),
            alphaOverrides: JSON.parse(theme.alphaOverrides),
        }));

        return NextResponse.json({ themes: parsedThemes });
    } catch (error) {
        console.error("Error fetching themes:", error);
        return NextResponse.json(
            { error: "Failed to fetch themes" },
            { status: 500 }
        );
    }
}

// POST create new theme
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            id,
            name,
            lightTheme,
            darkTheme,
            componentOverrides,
            borderRadiusOverrides,
            componentStates,
            alphaOverrides,
        } = body;

        const theme = await prisma.theme.create({
            data: {
                id: id || undefined,
                name,
                lightTheme: JSON.stringify(lightTheme),
                darkTheme: darkTheme ? JSON.stringify(darkTheme) : null,
                componentOverrides: JSON.stringify(componentOverrides || {}),
                borderRadiusOverrides: JSON.stringify(borderRadiusOverrides || {}),
                componentStates: JSON.stringify(componentStates || {}),
                alphaOverrides: JSON.stringify(alphaOverrides || {}),
            },
        });

        return NextResponse.json({
            theme: {
                ...theme,
                lightTheme: JSON.parse(theme.lightTheme),
                darkTheme: theme.darkTheme ? JSON.parse(theme.darkTheme) : null,
                componentOverrides: JSON.parse(theme.componentOverrides),
                borderRadiusOverrides: JSON.parse(theme.borderRadiusOverrides),
                componentStates: JSON.parse(theme.componentStates),
                alphaOverrides: JSON.parse(theme.alphaOverrides),
            },
        });
    } catch (error) {
        console.error("Error creating theme:", error);
        return NextResponse.json(
            { error: "Failed to create theme" },
            { status: 500 }
        );
    }
}
