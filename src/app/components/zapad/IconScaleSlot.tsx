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
  iconRole = "leading",
  children,
}: {
  className?: string;
  innerClassName?: string;
  innerStyle?: CSSProperties;
  iconRole?: "leading" | "heading" | "action" | "detail";
  children: ReactNode;
}) {
  return (
    <div data-slot="functional-icon" data-icon-role={iconRole} className={cn("zb-scale-slot", className)}>
      <div
        className={cn("zb-scale-slot__target", innerClassName)}
        style={innerStyle}
      >
        {children}
      </div>
    </div>
  );
}
