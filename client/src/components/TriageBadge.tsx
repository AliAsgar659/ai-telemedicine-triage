import { cn } from "cn";
import type { UrgencyLevel } from "@/lib/types";

const LABELS: Record<UrgencyLevel, string> = {
  emergency: "Emergency",
  urgent: "Urgent",
  routine: "Routine",
};

const STYLES: Record<UrgencyLevel, string> = {
  emergency: "bg-urgency-emergency-bg text-urgency-emergency border-urgency-emergency/30",
  urgent: "bg-urgency-urgent-bg text-urgency-urgent border-urgency-urgent/30",
  routine: "bg-urgency-routine-bg text-urgency-routine border-urgency-routine/30",
};

export function TriageBadge({ level, className }: { level: UrgencyLevel; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
        STYLES[level],
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {LABELS[level]}
    </span>
  );
}
