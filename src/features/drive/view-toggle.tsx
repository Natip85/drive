"use client";

import { Check, Grid, List } from "lucide-react";
import { cn } from "~/lib/utils";

interface ViewToggleProps {
  viewMode: "list" | "grid";
  setViewMode: (mode: "list" | "grid") => void;
}

export function ViewToggle({ viewMode, setViewMode }: ViewToggleProps) {
  return (
    <div className="my-5 flex items-center justify-end">
      <button
        onClick={() => setViewMode("grid")}
        className={cn(
          "flex size-12 items-center justify-center gap-1 rounded-l-full border border-black px-8 transition-all",
          viewMode === "grid"
            ? "bg-sidebar text-primary-foreground"
            : "bg-transparent text-muted-foreground hover:bg-muted",
        )}
        aria-pressed={viewMode === "grid"}
        title="Grid view"
      >
        {viewMode === "grid" && (
          <span className="flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full bg-primary-foreground">
            <Check className="size-2.5 text-primary" />
          </span>
        )}
        <Grid className="size-6 flex-shrink-0" />
      </button>

      <button
        onClick={() => setViewMode("list")}
        className={cn(
          "flex size-12 items-center justify-center gap-1 rounded-r-full border border-black px-8 transition-all",
          viewMode === "list"
            ? "bg-sidebar text-primary-foreground"
            : "bg-transparent text-muted-foreground hover:bg-muted",
        )}
        aria-pressed={viewMode === "list"}
        title="List view"
      >
        <List className="size-6 flex-shrink-0" />
        {viewMode === "list" && (
          <span className="flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full bg-primary-foreground">
            <Check className="size-2.5 text-primary" />
          </span>
        )}
      </button>
    </div>
  );
}
