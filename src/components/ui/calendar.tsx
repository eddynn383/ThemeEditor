"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
        ),
        month_grid: "w-full border-collapse space-x-1",
        weekdays: "flex",
        weekday:
          "text-[var(--text-200)] rounded-md w-8 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100"
        ),
        range_start:
          "day-range-start aria-selected:bg-[var(--accent-400)] aria-selected:text-white rounded-l-md",
        range_end:
          "day-range-end aria-selected:bg-[var(--accent-400)] aria-selected:text-white rounded-r-md",
        selected:
          "bg-[var(--accent-400)] text-white hover:bg-[var(--accent-500)] hover:text-white focus:bg-[var(--accent-400)] focus:text-white rounded-md",
        today: "bg-[var(--accent-100)] text-[var(--accent-400)]",
        outside: "day-outside text-[var(--text-300)] aria-selected:text-[var(--text-300)]",
        disabled: "text-[var(--text-300)] opacity-50",
        range_middle:
          "aria-selected:bg-[var(--accent-100)] aria-selected:text-[var(--accent-400)]",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...props }) =>
          orientation === "left" ? (
            <ChevronLeft className="size-4" {...props} />
          ) : (
            <ChevronRight className="size-4" {...props} />
          ),
      }}
      {...props}
    />
  );
}

export { Calendar };
