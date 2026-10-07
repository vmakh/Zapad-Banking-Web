import { useRef } from "react";

type AutoFocusHandler = (event: Event) => void;

/** Radix has no trigger ref for dialogs opened by application state. */
export function useReturnFocus(onOpenAutoFocus?: AutoFocusHandler, onCloseAutoFocus?: AutoFocusHandler) {
  const opener = useRef<HTMLElement | null>(null);
  return {
    onOpenAutoFocus(event: Event) {
      const active = document.activeElement;
      if (active instanceof HTMLElement && active !== document.body
        && !(event.target instanceof HTMLElement && event.target.contains(active))) {
        opener.current = active;
      }
      onOpenAutoFocus?.(event);
    },
    onCloseAutoFocus(event: Event) {
      onCloseAutoFocus?.(event);
      const connectedOpener = opener.current?.isConnected ? opener.current : null;
      // Deep links have no trigger, and query-driven pages may replace the opener.
      // Do not move focus behind another open dialog when nested overlays close.
      const target = connectedOpener ?? (!document.querySelector('[role="dialog"][data-state="open"]')
        ? document.querySelector<HTMLElement>('main[tabindex="-1"]') : null);
      opener.current = null;
      if (!event.defaultPrevented && target?.isConnected) {
        target.focus({ preventScroll: true });
        if (document.activeElement === target) event.preventDefault();
      }
    },
  };
}
