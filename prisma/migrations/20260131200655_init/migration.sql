-- CreateTable
CREATE TABLE "Theme" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lightTheme" TEXT NOT NULL,
    "darkTheme" TEXT,
    "componentOverrides" TEXT NOT NULL DEFAULT '{}',
    "borderRadiusOverrides" TEXT NOT NULL DEFAULT '{}',
    "componentStates" TEXT NOT NULL DEFAULT '{}',
    "alphaOverrides" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);
