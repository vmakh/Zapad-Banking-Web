"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";
import { CheckCircleIcon } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { InfoIcon } from "@phosphor-icons/react/dist/csr/Info";
import { WarningIcon } from "@phosphor-icons/react/dist/csr/Warning";
import { WarningCircleIcon } from "@phosphor-icons/react/dist/csr/WarningCircle";
import { SpinnerGapIcon } from "@phosphor-icons/react/dist/csr/SpinnerGap";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      richColors
      theme={theme as ToasterProps["theme"]}
      className="group"
      icons={{
        success: <CheckCircleIcon className="size-5" aria-hidden="true" />,
        info: <InfoIcon className="size-5" aria-hidden="true" />,
        warning: <WarningIcon className="size-5" aria-hidden="true" />,
        error: <WarningCircleIcon className="size-5" aria-hidden="true" />,
        loading: <SpinnerGapIcon className="size-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />,
        close: <XIcon className="size-3" aria-hidden="true" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
