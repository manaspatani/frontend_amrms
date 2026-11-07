import { cn } from "@/lib/utils";

interface ApiStatusPillProps {
  className?: string;
}

export function ApiStatusPill({ className }: ApiStatusPillProps) {
  return (
    <div
      role="status"
      aria-label="API Status: Online"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-foreground bg-secondary/60 shadow-xs",
        className
      )}
    >
      <span
        className="size-2 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0"
        aria-hidden="true"
      />
      <span>Online</span>
    </div>
  );
}
