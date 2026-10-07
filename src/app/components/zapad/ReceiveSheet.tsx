import { copyText } from "../../utils/clipboard";
import { CurrencyFlag } from "./CurrencyIcon";
import { cn } from "../ui/utils";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { ArrowDownLeft, Copy, CheckCheck, Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "../ui/command";
import { getProfileBySlug } from "../../data/profiles";
import { toast } from "sonner";
import { usePrivacy } from "../../contexts/PrivacyContext";
import { getAccounts } from "../../data/accounts";
import type { ProfileKind } from "../../data/types";

export function ReceiveSheet({
  open,
  onClose,
  profileKind,
  initialAccountId,
}: {
  open: boolean;
  onClose: () => void;
  profileKind: ProfileKind;
  initialAccountId?: string;
}) {
  const { isPrivate } = usePrivacy();
  const [copied, setCopied] = useState<string | null>(null);
  const [accountPickerOpen, setAccountPickerOpen] = useState(false);
  const accounts = getAccounts(profileKind);
  const [selectedAccount, setSelectedAccount] = useState(() => Math.max(0, accounts.findIndex(account => account.id === initialAccountId)));

  const acc = accounts[selectedAccount];

  if (!acc) return null;

  const details = [
    { id: "beneficiary", label: "Beneficiary", value: getProfileBySlug(profileKind).name },
    { id: "iban", label: "IBAN", value: acc.iban },
    { id: "currency", label: "Currency", value: acc.currency },
    { id: "bank", label: "Bank", value: "ZapadBanka AD Podgorica" },
    { id: "bic", label: "BIC / SWIFT", value: "ZAPAME22" },
  ];

  const copyToClipboard = async (text: string, field: string) => {
    setCopied(null);
    if (!await copyText(text)) { toast.error("Could not copy. Select and copy the details manually."); return; }
    setCopied(field);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-0">
        <div className="p-8">
          <SheetHeader className="mb-8 text-left">
            <div className="flex items-center gap-4 mb-2">
              <div className="size-11 shrink-0 rounded-xl bg-muted text-muted-foreground flex items-center justify-center">
                <ArrowDownLeft className="size-5" />
              </div>
              <div>
                <SheetTitle className="text-2xl font-semibold tracking-tight text-slate-900">
                  Receive money
                </SheetTitle>
                <SheetDescription className="text-sm font-normal text-slate-500 mt-0.5">
                  Copy your demo account details. Payment links and QR codes are unavailable.
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="mb-6 space-y-2">
            <Label id="receive-account-label" className="text-sm text-muted-foreground">Receive to</Label>
            <Popover open={accountPickerOpen} onOpenChange={setAccountPickerOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={accountPickerOpen} aria-labelledby="receive-account-label receive-account-value" className="w-full h-auto min-h-14 justify-between gap-3 text-left whitespace-normal">
                  <CurrencyFlag currency={acc.currency} />
                  <span id="receive-account-value" className="min-w-0 flex-1">
                    <span className="block break-words">{acc.name}</span>
                    <span className="block text-xs font-normal text-muted-foreground">{acc.currency} · {isPrivate ? "••••" : acc.iban.slice(-7)}</span>
                  </span>
                  <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0" style={{ width: "var(--radix-popover-trigger-width)" }}>
                <Command>
                  <CommandInput placeholder="Search name, currency or IBAN" aria-label="Search accounts" />
                  <CommandList className="max-h-64 overscroll-contain">
                    <CommandEmpty>No matching accounts.</CommandEmpty>
                    <CommandGroup>
                      {accounts.map((account, index) => (
                        <CommandItem key={account.id} value={account.id} keywords={[account.name, account.currency, account.iban, account.iban.replace(/\s/g, "")]} onSelect={() => { setSelectedAccount(index); setCopied(null); setAccountPickerOpen(false); }} className="min-h-14 gap-3">
                          <CurrencyFlag currency={account.currency} />
                          <span className="min-w-0 flex-1">
                            <span className="block break-words">{account.name}</span>
                            <span className="block text-xs text-muted-foreground">{account.currency} · {isPrivate ? "••••" : account.iban.slice(-7)}</span>
                          </span>
                          <Check aria-hidden="true" className={cn("size-4 shrink-0", selectedAccount !== index && "invisible")} />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="rounded-xl bg-muted/40 border border-border p-5 mb-6">
            <dl className="space-y-3">
              {details.map(field => (
                <div key={field.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <dt className="text-xs text-muted-foreground mb-1">{field.label}</dt>
                    <dd className={cn("text-sm text-foreground break-words select-text", (field.id === "iban" || field.id === "bic") && "font-mono")}>
                      {field.id === "iban" && isPrivate ? "ME25 •••• •••• •••• ••••" : field.value}
                    </dd>
                  </div>
                  <Button type="button" variant="ghost" size="icon" aria-label={`Copy ${field.label}`} onClick={() => copyToClipboard(field.value, field.id)} className="shrink-0 text-muted-foreground">
                    {copied === field.id ? <CheckCheck className="size-4" /> : <Copy className="size-4" />}
                  </Button>
                </div>
              ))}
            </dl>
            <Button type="button" onClick={() => copyToClipboard(details.map(field => `${field.label}: ${field.value}`).join("\n"), "all")} className="w-full mt-5 gap-2">
              {copied === "all" ? <CheckCheck className="size-4" /> : <Copy className="size-4" />} Copy all details
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">Payment requests, share links and QR codes are not supported in this prototype. Copying details does not confirm an incoming payment.</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
