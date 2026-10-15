import { localizedMerchant, localizedTransactionMeta } from "../../i18n/display";
import { useI18n } from "../../i18n/I18nProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { formatDate } from "../../utils/date";
import { cn } from "../ui/utils";
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { BellIcon as Bell } from "@phosphor-icons/react/dist/csr/Bell";
import { MagnifyingGlassIcon as Search } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import { ShieldIcon as Shield } from "@phosphor-icons/react/dist/csr/Shield";
import { CaretDownIcon as ChevronDown } from "@phosphor-icons/react/dist/csr/CaretDown";
import { CheckIcon as Check } from "@phosphor-icons/react/dist/csr/Check";
import { EyeIcon as Eye } from "@phosphor-icons/react/dist/csr/Eye";
import { EyeSlashIcon as EyeOff } from "@phosphor-icons/react/dist/csr/EyeSlash";
import { ListIcon as Menu } from "@phosphor-icons/react/dist/csr/List";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { usePrivacy } from "../../contexts/PrivacyContext";
import { useInbox } from "../../contexts/InboxContext";
import { profiles } from "../../data/profiles";

export { profiles };
import type { Profile, ProfileSlug } from "../../data/types";
import { getTransactions } from "../../data/transactions";
import { getRecipients } from "../../data/recipients";
import { inboxPath, profilePath } from "../../utils/paths";

export function TopBar({
  profile,
  profileSlug,
  onProfileChange,
  onMenuClick,
}: {
  profile: Profile;
  profileSlug: ProfileSlug;
  onProfileChange: (slug: ProfileSlug) => void;
  onMenuClick?: () => void;
}) {
  const { t, intlLocale } = useI18n();
  const navigate = useNavigate();
  const { isPrivate, togglePrivacy } = usePrivacy();
  const { unreadCount } = useInbox();
  const [searchOpen, setSearchOpen] = useState(false);
  const searchOpener = useRef<HTMLButtonElement | null>(null);
  const [query, setQuery] = useState("");

  const isBusiness = profile.kind === "business";
  const brandBg = isBusiness ? "bg-brand-business" : "bg-brand-personal";
  const brandInk = isBusiness ? "text-brand-business-foreground" : "text-brand-personal-foreground";
  const brandBorder = isBusiness ? "border-brand-business/20" : "border-brand-personal/20";
  const brandHover = isBusiness ? "hover:border-brand-business/30" : "hover:border-brand-personal/30";

  const searchResults = useMemo(() => {
    const q = query.trim().toLocaleLowerCase(intlLocale);
    const ibanQuery = q.replace(/\s/g, "");
    if (!q) return { transactions: [], recipients: [] };
    const transactions = getTransactions(profile.kind).filter(
      (transaction) =>
        localizedMerchant(transaction.merchant).toLocaleLowerCase(intlLocale).includes(q) ||
        localizedTransactionMeta(transaction.meta).toLowerCase().includes(q) ||
        t(transaction.category).toLowerCase().includes(q),
    );
    const recipients = getRecipients(profile.kind).filter(
      (r) => r.name.toLowerCase().includes(q) || r.iban.replace(/\s/g, "").toLowerCase().includes(ibanQuery),
    );
    return { transactions: transactions.slice(0, 5), recipients: recipients.slice(0, 5) };
  }, [query, profile.kind, searchOpen, t, intlLocale]);

  return (
    <>
      <header data-slot="bank-topbar" className="h-22 border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50 flex items-center gap-1 sm:gap-4 md:gap-6 px-2 sm:px-4 md:px-8 min-w-0">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden shrink-0 rounded-full size-11 hover:bg-slate-100 text-slate-700"
          onClick={onMenuClick}
          data-navigation-trigger
          aria-label={t("Open navigation menu")}
        >
          <Menu className="size-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={t("Switch profile. Current: {name}, {kind}", { name: profile.name, kind: t(isBusiness ? "Business" : "Personal") })}
              className={cn("flex items-center gap-2 sm:gap-4 px-2 sm:px-4 py-2.5 rounded-lg border shrink-0", brandBorder, brandHover, "transition-all duration-300 hover:shadow-md bg-white zb-hover-lift w-14 sm:w-64")}
            >
              <Avatar className="size-10 sm:size-11 shrink-0">
                <AvatarFallback data-profile-kind={profile.kind} className={cn("text-sm font-medium", brandBg, brandInk)}>
                  {profile.initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-1 flex-col items-start leading-tight min-w-0">
                <span className="text-base font-semibold text-slate-900 tracking-tight truncate w-full text-left">
                  {profile.name}
                </span>
                <span className="text-xs font-medium text-slate-500 mt-0.5 uppercase tracking-wider">
                  {t(isBusiness ? "Business" : "Personal")}
                </span>
              </div>
              <ChevronDown className="size-4 text-slate-400 shrink-0 hidden sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-80 p-3 rounded-xl border border-slate-200/60 shadow-xl bg-white/95 backdrop-blur-md"
          >
            <DropdownMenuLabel className="px-4 py-3 text-xs font-medium uppercase tracking-widest text-slate-400">{t("Switch profile")}</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100 mb-2" />
            {profiles.map((p) => {
              const pBrandBg = p.kind === "business" ? "bg-brand-business" : "bg-brand-personal";
              const pBrandInk = p.kind === "business" ? "text-brand-business-foreground" : "text-brand-personal-foreground";
              const pBrandText = p.kind === "business" ? "text-brand-business-text" : "text-brand-personal";
              return (
                <DropdownMenuItem
                  key={p.id}
                  aria-current={p.slug === profileSlug ? "true" : undefined}
                  data-profile-option="true"
                  onClick={() => onProfileChange(p.slug)}
                  className="py-3.5 px-4 rounded-lg text-slate-900 focus:bg-slate-50 cursor-pointer transition-colors"
                >
                  <Avatar className="size-10 sm:size-11 mr-2 shrink-0">
                    <AvatarFallback data-profile-kind={p.kind} className={cn("text-sm font-medium", pBrandBg, pBrandInk)}>
                      {p.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-semibold tracking-tight truncate">{p.name}</div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">{t(p.subtitle)}</div>
                  </div>
                  {p.slug === profileSlug && <Check className={cn("size-5", pBrandText)} />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          onClick={event => { searchOpener.current = event.currentTarget; setSearchOpen(true); }}
          className="hidden xl:flex flex-1 min-w-0 max-w-xl h-12 justify-start gap-3 px-5 font-normal"
          aria-label={t("Search transactions and recipients")}
          aria-haspopup="dialog"
          aria-expanded={searchOpen}
          aria-controls={searchOpen ? "global-search-dialog" : undefined}
        >
          <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="truncate text-muted-foreground">{t("Search transactions, recipients...")}</span>
        </Button>

        <div className="flex items-center gap-0 sm:gap-3 ml-auto shrink-0">
          <LanguageSwitcher compact />
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden rounded-full size-11 hover:bg-slate-100 text-slate-600"
            aria-label={t("Search")}
            aria-haspopup="dialog"
            onClick={event => { searchOpener.current = event.currentTarget; setSearchOpen(true); }}
          >
            <Search className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full size-11 sm:size-12 hover:bg-slate-100 text-slate-600 transition-colors"
            onClick={togglePrivacy}
            id="privacy-toggle"
            aria-label={t(isPrivate ? "Show balances" : "Hide balances")}
            aria-pressed={isPrivate}
          >
            {isPrivate ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex rounded-full size-11 sm:size-12 hover:bg-slate-100 text-slate-600 transition-colors"
            aria-label={t("Security")}
            onClick={() => navigate(`${profilePath(profileSlug, "settings")}#security`)}
          >
            <Shield className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full relative size-11 sm:size-12 hover:bg-slate-100 text-slate-600 transition-colors"
            aria-label={t("Notifications")}
            onClick={() => navigate(inboxPath(profileSlug, "unread"))}
          >
            <Bell className="size-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 min-w-4.5 h-4.5 px-1 rounded-full bg-muted ring-2 ring-white text-micro font-semibold text-foreground flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        </div>
      </header>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent id="global-search-dialog" className="sm:max-w-lg rounded-2xl p-0 overflow-hidden"
          onCloseAutoFocus={event => {
            event.preventDefault();
            const opener = searchOpener.current;
            if (!opener && document.querySelector('[role="dialog"][data-state="open"]')) return;
            opener?.focus({ preventScroll: true });
            if (!opener || document.activeElement !== opener) document.querySelector<HTMLElement>('main[tabindex="-1"]')?.focus({ preventScroll: true });
          }}
        >
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-semibold">{t("Search")}</DialogTitle>
            <DialogDescription>{t("Find a transaction or saved recipient in this profile.")}</DialogDescription>
          </DialogHeader>
          <div className="p-6 pt-4 space-y-4 max-h-sheet overflow-y-auto">
            <Input
              autoFocus
              aria-label={t("Search transactions and recipients")}
              placeholder={t("Transactions, recipients...")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 rounded-lg font-normal"
            />
            {query.trim() === "" ? (
              <p className="text-sm font-normal text-slate-400 text-center py-6">{t("Type to search transactions and recipients")}</p>
            ) : (
              <>
                {searchResults.recipients.length > 0 && (
                  <div>
                    <p className="text-xs font-medium uppercase text-slate-400 tracking-wider mb-2">{t("Recipients")}</p>
                    <div className="space-y-1">
                      {searchResults.recipients.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-50 font-medium text-slate-900 text-sm wrap-anywhere"
                          onClick={() => {
                            searchOpener.current = null;
                            setSearchOpen(false);
                            navigate(profilePath(profileSlug, `payments?action=send&recipient=${r.id}`));
                          }}
                        >
                          {r.name}
                          <span className="block text-xs font-normal text-slate-400 font-mono">{isPrivate ? "••••" : r.iban}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {searchResults.transactions.length > 0 && (
                  <div>
                    <p className="text-xs font-medium uppercase text-slate-400 tracking-wider mb-2">{t("Transactions")}</p>
                    <div className="space-y-1">
                      {searchResults.transactions.map((transaction) => (
                        <button
                          key={transaction.id}
                          type="button"
                          className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-50"
                          onClick={() => {
                            searchOpener.current = null;
                            setSearchOpen(false);
                            navigate(profilePath(profileSlug, `transactions?transaction=${transaction.id}`));
                          }}
                        >
                          <span className="font-medium text-slate-900 text-sm">{localizedMerchant(transaction.merchant)}</span>
                          <span className="block text-xs font-normal text-slate-400">{formatDate(transaction.date)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {searchResults.recipients.length === 0 && searchResults.transactions.length === 0 && (
                  <p role="status" className="text-sm font-normal text-muted-foreground text-center py-4">{t("No results. Try another name, category or IBAN.")}</p>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
