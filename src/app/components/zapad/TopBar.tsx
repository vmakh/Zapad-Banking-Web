import { cn } from "../ui/utils";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  Bell,
  Search,
  Shield,
  ChevronDown,
  Check,
  Eye,
  EyeOff,
  Menu,
} from "lucide-react";
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
  const navigate = useNavigate();
  const { isPrivate, togglePrivacy } = usePrivacy();
  const { unreadCount } = useInbox();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const isBusiness = profile.kind === "business";
  const brandBg = isBusiness ? "bg-brand-business" : "bg-brand-personal";
  const brandBorder = isBusiness ? "border-brand-business/20" : "border-brand-personal/20";
  const brandHover = isBusiness ? "hover:border-brand-business/30" : "hover:border-brand-personal/30";

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { transactions: [], recipients: [] };
    const transactions = getTransactions(profile.kind).filter(
      (t) =>
        t.merchant.toLowerCase().includes(q) ||
        t.meta.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q),
    );
    const recipients = getRecipients(profile.kind).filter(
      (r) => r.name.toLowerCase().includes(q) || r.iban.toLowerCase().includes(q),
    );
    return { transactions: transactions.slice(0, 5), recipients: recipients.slice(0, 5) };
  }, [query, profile.kind]);

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
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn("flex items-center gap-2 sm:gap-4 px-2 sm:px-4 py-2.5 rounded-lg border shrink-0", brandBorder, brandHover, "transition-all duration-300 hover:shadow-md bg-white zb-hover-lift w-16 sm:w-64")}
            >
              <Avatar className="size-10 sm:size-11 shrink-0">
                <AvatarFallback data-profile-kind={profile.kind} className={cn("text-sm font-medium", brandBg, "text-white")}>
                  {profile.initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-1 flex-col items-start leading-tight min-w-0">
                <span className="text-base font-semibold text-slate-900 tracking-tight truncate w-full text-left">
                  {profile.name}
                </span>
                <span className="text-xs font-medium text-slate-500 mt-0.5 uppercase tracking-wider">
                  {isBusiness ? "Business" : "Personal"}
                </span>
              </div>
              <ChevronDown className="size-4 text-slate-400 shrink-0 hidden sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-80 p-3 rounded-xl border border-slate-200/60 shadow-xl bg-white/95 backdrop-blur-md"
          >
            <DropdownMenuLabel className="px-4 py-3 text-xs font-medium uppercase tracking-widest text-slate-400">
              Switch profile
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100 mb-2" />
            {profiles.map((p) => {
              const pBrandBg = p.kind === "business" ? "bg-brand-business" : "bg-brand-personal";
              const pBrandText = p.kind === "business" ? "text-brand-business" : "text-brand-personal";
              return (
                <DropdownMenuItem
                  key={p.id}
                  aria-current={p.slug === profileSlug ? "true" : undefined}
                  data-profile-option="true"
                  onClick={() => onProfileChange(p.slug)}
                  className="py-3.5 px-4 rounded-lg text-slate-900 focus:bg-slate-50 cursor-pointer transition-colors"
                >
                  <Avatar className="size-10 sm:size-11 mr-2 shrink-0">
                    <AvatarFallback data-profile-kind={p.kind} className={cn("text-sm font-medium text-white", pBrandBg)}>
                      {p.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-semibold tracking-tight truncate">{p.name}</div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">{p.subtitle}</div>
                  </div>
                  {p.slug === profileSlug && <Check className={cn("size-5", pBrandText)} />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex-1 min-w-0 max-w-xl relative hidden md:block">
          <Search className="size-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Search transactions, recipients..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setSearchOpen(false);
            }}
            className="pl-14 h-12 text-base bg-slate-50/50 border-slate-200/60 rounded-full font-normal placeholder:text-slate-400 text-slate-900 focus-visible:ring-slate-300 focus-visible:bg-white shadow-sm transition-all w-full"
            aria-expanded={searchOpen}
            aria-controls="global-search-dialog"
          />
        </div>

        <div className="flex items-center gap-0 sm:gap-3 ml-auto shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full size-11 hover:bg-slate-100 text-slate-600"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full size-11 sm:size-12 hover:bg-slate-100 text-slate-600 transition-colors"
            onClick={togglePrivacy}
            id="privacy-toggle"
            aria-label={isPrivate ? "Show balances" : "Hide balances"}
            aria-pressed={isPrivate}
          >
            {isPrivate ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full size-11 sm:size-12 hover:bg-slate-100 text-slate-600 transition-colors"
            aria-label="Security"
            onClick={() => navigate(`${profilePath(profileSlug, "settings")}#security`)}
          >
            <Shield className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full relative size-11 sm:size-12 hover:bg-slate-100 text-slate-600 transition-colors"
            aria-label="Notifications"
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
        <DialogContent id="global-search-dialog" className="sm:max-w-lg rounded-2xl p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-semibold">Search</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-4 space-y-4 max-h-sheet overflow-y-auto">
            <Input
              autoFocus
              placeholder="Transactions, recipients..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 rounded-lg font-normal"
            />
            {query.trim() === "" ? (
              <p className="text-sm font-normal text-slate-400 text-center py-6">
                Type to search transactions and recipients
              </p>
            ) : (
              <>
                {searchResults.recipients.length > 0 && (
                  <div>
                    <p className="text-xs font-medium uppercase text-slate-400 tracking-wider mb-2">Recipients</p>
                    <div className="space-y-1">
                      {searchResults.recipients.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-50 font-medium text-slate-900 text-sm"
                          onClick={() => {
                            setSearchOpen(false);
                            navigate(profilePath(profileSlug, `payments?action=send&recipient=${r.id}`));
                          }}
                        >
                          {r.name}
                          <span className="block text-xs font-normal text-slate-400 font-mono">{r.iban}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {searchResults.transactions.length > 0 && (
                  <div>
                    <p className="text-xs font-medium uppercase text-slate-400 tracking-wider mb-2">Transactions</p>
                    <div className="space-y-1">
                      {searchResults.transactions.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-50"
                          onClick={() => {
                            setSearchOpen(false);
                            navigate(profilePath(profileSlug, `transactions?transaction=${t.id}`));
                          }}
                        >
                          <span className="font-medium text-slate-900 text-sm">{t.merchant}</span>
                          <span className="block text-xs font-normal text-slate-400">{t.date}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {searchResults.recipients.length === 0 && searchResults.transactions.length === 0 && (
                  <p className="text-sm font-normal text-slate-400 text-center py-4">No results</p>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
