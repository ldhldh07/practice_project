import { cn } from "@shared/lib/cn";
import type { HighlightSegment } from "@shared/lib/split-by-highlight";

type HighlightTextProps = {
  segments: HighlightSegment[];
  className?: string;
};

export const HighlightText = ({ segments, className }: HighlightTextProps) => {
  return (
    <span className={cn(className)}>
      {segments.map((s, i) =>
        s.highlighted ? (
          <mark key={i} className="rounded-sm bg-primary/20 px-0.5 text-foreground">
            {s.value}
          </mark>
        ) : (
          <span key={i}>{s.value}</span>
        ),
      )}
    </span>
  );
};
