import { cn } from "../ui/utils";
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import type { AppOutletContext } from "../../hooks/useAppProfile";
import { profilePath, statementsPath } from "../../utils/paths";
import {
  Send,
  Receipt,
  Repeat,
  ArrowLeftRight,
  Download,
  UserPlus,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { TransferModal } from "./TransferModal";

export function QuickActions() {
  const navigate = useNavigate();
  const { profileSlug, isBusiness } = useOutletContext<AppOutletContext>();

  const brandBg = isBusiness ? "bg-brand-business" : "bg-brand-personal";
  const brandText = "text-white";

  const actions = [
    { id: "send", icon: Send, label: "Transfer", color: brandBg, text: brandText },
    {
      id: "pay",
      icon: Receipt,
      label: "Bills",
      color: brandBg,
      text: brandText,
    },
    {
      id: "exchange",
      icon: Repeat,
      label: "Exchange",
      color: "bg-slate-900",
      text: "text-white",
    },
    {
      id: "transfer",
      icon: ArrowLeftRight,
      label: "Between accounts",
      color: brandBg,
      text: brandText,
    },
    {
      id: "statement",
      icon: Download,
      label: "Statement",
      color: "bg-slate-100",
      text: "text-slate-900",
    },
    {
      id: "add",
      icon: UserPlus,
      label: "Add payee",
      color: "bg-slate-100",
      text: "text-slate-900",
    },
    {
      id: "card",
      icon: CreditCard,
      label: "Card",
      color: "bg-slate-100",
      text: "text-slate-900",
    },
  ];

  const [transferOpen, setTransferOpen] = useState(false);
  const [transferType, setTransferType] = useState<"send" | "pay" | "transfer">(
    "send"
  );

  const handleActionClick = (id: string) => {
    if (id === "send" || id === "pay" || id === "transfer") {
      setTransferType(id);
      setTransferOpen(true);
    } else if (id === "exchange") {
      navigate(profilePath(profileSlug, "exchange"));
    } else if (id === "statement") {
      navigate(statementsPath(profileSlug));
    } else if (id === "add") {
      navigate(profilePath(profileSlug, "payments?action=send"));
    } else if (id === "card") {
      navigate(profilePath(profileSlug, "cards"));
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 md:gap-3">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.id}
              onClick={() => handleActionClick(a.id)}
              className="group flex flex-col items-center gap-2 md:gap-3 p-3 md:p-4 rounded-3xl bg-white hover:shadow-md transition-field duration-300 border border-slate-200/60 hover:border-slate-300"
            >
              <div
                className={cn("size-14 rounded-lg", a.color, a.text, "flex items-center justify-center zb-group-hover-lift-up shadow-sm")}
              >
                <Icon className="size-6" />
              </div>
              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                {a.label}
              </span>
            </button>
          );
        })}
      </div>

      <TransferModal
        open={transferOpen}
        onOpenChange={setTransferOpen}
        type={transferType}
      />
    </>
  );
}
