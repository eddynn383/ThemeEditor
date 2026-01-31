"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";

import { cn } from "../../lib/utils";

function Checkbox({
  className,
  checked,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  checked?: boolean | "indeterminate";
}) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      checked={checked}
      className={cn(
        "peer border bg-[var(--bg-100)] data-[state=checked]:bg-[var(--accent-400)] data-[state=checked]:text-white data-[state=checked]:border-[var(--accent-400)] data-[state=indeterminate]:bg-[var(--accent-400)] data-[state=indeterminate]:text-white data-[state=indeterminate]:border-[var(--accent-400)] border-[var(--bg-300)] size-4 shrink-0 rounded-[4px] shadow-xs transition-all outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-400)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        {checked === "indeterminate" ? (
          <Minus className="size-3.5" />
        ) : (
          <Check className="size-3.5" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
