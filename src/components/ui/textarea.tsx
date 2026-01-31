import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "resize-none border-[var(--bg-300)] placeholder:text-[var(--text-300)] bg-[var(--bg-200)] text-[var(--text-100)] flex min-h-16 w-full rounded-md border px-3 py-2 text-base transition-colors outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-400)] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
