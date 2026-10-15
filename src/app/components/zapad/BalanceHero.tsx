import type { CSSProperties } from "react";
import { useI18n } from "../../i18n/I18nProvider";
import { CurrencyFlag } from "./CurrencyIcon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { cn } from "../ui/utils";
import { Link } from "react-router";
import { ArrowUpRightIcon as ArrowUpRight } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import { ArrowDownLeftIcon as ArrowDownLeft } from "@phosphor-icons/react/dist/csr/ArrowDownLeft";
import { ArrowsLeftRightIcon as ArrowLeftRight } from "@phosphor-icons/react/dist/csr/ArrowsLeftRight";
import { CaretRightIcon as ChevronRight } from "@phosphor-icons/react/dist/csr/CaretRight";
import { usePrivacy } from "../../contexts/PrivacyContext";
import type { BankAccount, ProfileKind } from "../../data/types";
import { formatMoney } from "../../utils/format";
import { paymentsPath, profilePath } from "../../utils/paths";

export function BalanceHero({ isBusiness, primaryAccount, profileKind, accounts, onAccountChange }: {
  isBusiness: boolean; primaryAccount: BankAccount; profileKind: ProfileKind; accounts: BankAccount[]; onAccountChange: (id: string) => void;
}) {
  const { t } = useI18n();
  const { isPrivate } = usePrivacy();
  const formattedBalance = isPrivate ? "••••••" : formatMoney(primaryAccount.balance, primaryAccount.currency);
  return <section className={cn("dashboard-balance", isBusiness ? "is-business" : "")} aria-label={t("Account overview")}>
    <div className="mb-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border pb-4">
      <div className="min-w-0 w-full sm:w-72 sm:max-w-full"><Select value={primaryAccount.id} onValueChange={onAccountChange}><SelectTrigger aria-label={t("Overview account")} className="min-h-11 bg-white"><SelectValue><CurrencyFlag currency={primaryAccount.currency} />{t(primaryAccount.name)} · {primaryAccount.currency}</SelectValue></SelectTrigger><SelectContent>{accounts.map(account => <SelectItem key={account.id} value={account.id}><CurrencyFlag currency={account.currency} />{t(account.name)} · {account.currency} · {account.ibanShort}</SelectItem>)}</SelectContent></Select></div>
      <Link className="inline-flex min-h-11 shrink-0 items-center gap-1 text-sm text-muted-foreground hover:text-foreground" to={profilePath(profileKind,"accounts")}>{t("Manage accounts")}<ChevronRight size={16} aria-hidden="true" /></Link>
    </div>
    <dl className="balance-summary">
      <dt className="balance-heading">{t("Available balance")}</dt>
      <dd className="balance-amount" style={{ "--balance-chars": formattedBalance.length } as CSSProperties}>{formattedBalance}</dd>
    </dl>
    <p className="mt-2 text-sm text-muted-foreground">{t(primaryAccount.type)} · {isPrivate ? "••••" : primaryAccount.ibanShort}</p>
    <nav className="balance-actions" aria-label={t("Account actions")}>
      <Link to={`${paymentsPath(profileKind, "send")}&source=${encodeURIComponent(primaryAccount.id)}&origin=home`}><ArrowUpRight size={18}/>{t("Transfer")}</Link>
      <Link to={`${paymentsPath(profileKind, "receive")}&source=${encodeURIComponent(primaryAccount.id)}&origin=home`}><ArrowDownLeft size={18}/>{t("Receive")}</Link>
      <Link to={`${profilePath(profileKind, "exchange")}?source=${encodeURIComponent(primaryAccount.id)}&origin=home&originAccount=${encodeURIComponent(primaryAccount.id)}`}><ArrowLeftRight size={18}/>{t("Exchange")}</Link>
    </nav>
  </section>;
}
