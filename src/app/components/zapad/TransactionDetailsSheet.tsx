import { TransactionExtras } from "./TransactionExtras";
import type { ElementType } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "../ui/sheet";
import { cn } from "../ui/utils";
import { formatMoney } from "../../utils/format";
import { usePrivacy } from "../../contexts/PrivacyContext";

type Tx = {
  id: string;
  merchant: string;
  meta: string;
  category: string;
  amount: number;
  currency: string;
  status: "Completed" | "Pending" | "Scheduled" | "Waiting for approval";
  icon: ElementType;
  iconBg: string;
  date: string;
};

interface TransactionDetailsSheetProps {
  transaction: Tx | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isBusiness: boolean;
}

export function TransactionDetailsSheet({
  transaction,
  open,
  onOpenChange,
  isBusiness,
}: TransactionDetailsSheetProps) {
  const { isPrivate } = usePrivacy();

  if (!transaction) return null;

  const Icon = transaction.icon;
  const positive = transaction.amount > 0;
  

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 overflow-hidden border-l-0 rounded-l-5xl bg-neutral-50 flex flex-col">
        {/* Header section */}
        <div className="bg-white px-8 pt-12 pb-8 rounded-b-5xl shadow-sm relative z-10 flex flex-col items-center text-center shrink-0">
          <div className={cn("size-24 rounded-xl flex items-center justify-center mb-6", transaction.iconBg)}>
            <Icon className="size-10" />
          </div>
          
          <SheetTitle className="text-2xl font-medium mb-1">{transaction.merchant}</SheetTitle>
          <SheetDescription className="text-base font-medium text-neutral-500 mb-6">
            {transaction.category}
          </SheetDescription>
          
          <div className={cn("text-5xl font-medium tracking-tight mb-2", positive ? "text-emerald-700" : "text-black")}>
            {isPrivate ? "•••" : (
              <>
                {formatMoney(transaction.amount, transaction.currency, { showPlus: positive })}
              </>
            )}
          </div>
          <div className="text-sm font-normal text-neutral-400">
            {transaction.date}
          </div>
        </div>

        {/* Details section */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          
          <div className="bg-white p-5 rounded-3xl space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-sm font-normal text-neutral-500">Payment method</span>
              <span className="text-sm font-medium">{transaction.meta.split('·')[0].trim()}</span>
            </div>
            <div className="h-px bg-neutral-100" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-normal text-neutral-500">Operation details</span>
              <span className="text-sm font-medium">{transaction.meta.split('·')[1]?.trim() || transaction.category}</span>
            </div>
            <div className="h-px bg-neutral-100" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-normal text-neutral-500">Operation ID</span>
              <span className="text-sm font-medium font-mono text-neutral-400">#{`ZB-${isBusiness ? "B" : "P"}-${transaction.id.toUpperCase()}`}</span>
            </div>
          </div>

          <TransactionExtras key={`${isBusiness}-${transaction.id}`} transaction={transaction} business={isBusiness} isPrivate={isPrivate} />

        </div>
      </SheetContent>
    </Sheet>
  );
}

