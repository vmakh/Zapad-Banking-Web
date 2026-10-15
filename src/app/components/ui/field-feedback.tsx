import * as React from "react";
import { cn } from "./utils";

/** Shared help/error text for both manual forms and react-hook-form fields. */
const FieldFeedback = React.forwardRef<HTMLParagraphElement,
  React.ComponentPropsWithoutRef<"p"> & { tone?: "hint" | "error" }
>(function FieldFeedback({ tone = "hint", className, ...props }, ref) {
  return <p ref={ref} data-form-feedback={tone} className={cn("text-xs font-normal", tone === "error" ? "text-destructive" : "text-muted-foreground", className)} {...props} />;
});

export { FieldFeedback };
