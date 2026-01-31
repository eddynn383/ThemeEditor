import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

// GET single theme
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const theme = await prisma.theme.findUnique({
            where: { id },
        });

        if (!theme) {
            return NextResponse.json({ error: "Theme not found" }, { status: 404 });
        }

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
        console.error("Error fetching theme:", error);
        return NextResponse.json(
            { error: "Failed to fetch theme" },
            { status: 500 }
        );
    }
}

// PUT update theme
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const {
            name,
            lightTheme,
            darkTheme,
            componentOverrides,
            borderRadiusOverrides,
            componentStates,
            alphaOverrides,
        } = body;

        const theme = await prisma.theme.update({
            where: { id },
            data: {
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
        console.error("Error updating theme:", error);
        return NextResponse.json(
            { error: "Failed to update theme" },
            { status: 500 }
        );
    }
}

// DELETE theme
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.theme.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting theme:", error);
        return NextResponse.json(
            { error: "Failed to delete theme" },
            { status: 500 }
        );
    }
}
