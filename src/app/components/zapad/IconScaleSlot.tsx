import type { CSSProperties, ReactNode } from "react";
import { cn } from "../ui/utils";

/**
 * Fixed-size wrapper so icon scale on hover does not shift layout.
 * Pair with zb-hover-scale-* on the inner target.
 */
export function IconScaleSlot({
  className,
  innerClassName,
  innerStyle,
  children,
}: {
  className?: string;
  innerClassName?: string;
  innerStyle?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div className={cn("zb-scale-slot", className)}>
      <div
        className={cn("zb-scale-slot__target", innerClassName)}
        style={innerStyle}
      >
        {children}
      </div>
    </div>
  );
}
