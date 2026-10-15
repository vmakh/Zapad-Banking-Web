import { useI18n } from "../../i18n/I18nProvider";
import { useState, type MouseEvent } from "react";
import { HouseSimpleIcon as LayoutDashboard } from "@phosphor-icons/react/dist/csr/HouseSimple";
import { BankIcon as Wallet } from "@phosphor-icons/react/dist/csr/Bank";
import { PaperPlaneTiltIcon as Send } from "@phosphor-icons/react/dist/csr/PaperPlaneTilt";
import { CreditCardIcon as CreditCard } from "@phosphor-icons/react/dist/csr/CreditCard";
import { ArrowsLeftRightIcon as Repeat } from "@phosphor-icons/react/dist/csr/ArrowsLeftRight";
import { BankIcon as Landmark } from "@phosphor-icons/react/dist/csr/Bank";
import { PiggyBankIcon as PiggyBank } from "@phosphor-icons/react/dist/csr/PiggyBank";
import { TrendUpIcon as TrendingUp } from "@phosphor-icons/react/dist/csr/TrendUp";
import { FileTextIcon as FileText } from "@phosphor-icons/react/dist/csr/FileText";
import { TrayIcon as Inbox } from "@phosphor-icons/react/dist/csr/Tray";
import { GearSixIcon as Settings } from "@phosphor-icons/react/dist/csr/GearSix";
import { QuestionIcon as HelpCircle } from "@phosphor-icons/react/dist/csr/Question";
import { SignOutIcon as LogOut } from "@phosphor-icons/react/dist/csr/SignOut";
import { ReceiptIcon as List } from "@phosphor-icons/react/dist/csr/Receipt";
import type { Icon as BankIcon } from "@phosphor-icons/react";
import { cn } from "../ui/utils";
import type { ProfileSlug } from "../../data/types";
import { profilePath } from "../../utils/paths";
import { Link } from "react-router";
import { useInbox } from "../../contexts/InboxContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

import logoImg from "../../../imports/logoNew.png";

type NavItem = {
  id: string;
  label: string;
  icon: BankIcon;
  badge?: number;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

function buildNavGroups(unread: number): NavGroup[] {
  return [
    {
      label: "Money",
      items: [
        { id: "dashboard", label: "Home", icon: LayoutDashboard },
        { id: "payments", label: "Payments", icon: Send },
      ],
    },
    {
      label: "Products",
      items: [
        { id: "accounts", label: "Accounts", icon: Wallet },
        { id: "cards", label: "Cards", icon: CreditCard },
        { id: "savings", label: "Savings goals", icon: PiggyBank },
        { id: "investments", label: "Investments", icon: TrendingUp },
        { id: "loans", label: "Loans", icon: Landmark },
      ],
    },
    {
      label: "Services",
      items: [
        { id: "statements", label: "Statements", icon: FileText },
        { id: "transactions", label: "Activity", icon: List },
        { id: "inbox", label: "Inbox", icon: Inbox, badge: unread > 0 ? unread : undefined },
      ],
    },
  ];
}

export function SidebarContent({
  active,
  onChange,
  profileSlug,
  isBusiness,
  onItemClick,
  className,
}: {
  active: string;
  onChange: (id: string) => void;
  profileSlug: ProfileSlug;
  isBusiness?: boolean;
  onItemClick?: () => void;
  className?: string;
}) {
  const { t, intlLocale } = useI18n();
  const { unreadCount } = useInbox();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const brandBg = isBusiness ? "bg-brand-business" : "bg-brand-personal";
  const groups = buildNavGroups(unreadCount);

  const handleNav = (id: string) => {
    onChange(id);
    onItemClick?.();
  };

  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    handleNav(id);
  };

  const utilityActive = (id: string) => active === id;

  return (
    <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
    <div className={cn("bank-sidebar flex flex-col h-full bg-neutral-950 text-white", className)}>
      <div className="flex h-22 shrink-0 items-center border-b border-white/5 pl-5 pr-16 lg:px-8">
        <Link
          to={profilePath(profileSlug)}
          onClick={event => handleLinkClick(event, "dashboard")}
          className="flex min-w-0 items-center gap-3 rounded-lg text-left text-white no-underline transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          aria-label={t("Go to dashboard")}
        >
          <img
            src={logoImg}
            alt=""
            className="size-10 shrink-0 object-contain brightness-0 invert"
            loading="eager"
          />
          <span className="text-lg lg:text-xl font-semibold tracking-tight">ZapadBanka</span>
        </Link>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto py-3 px-3 space-y-3" aria-label={t("Main navigation")}>
        {groups.map((group) => (
          <div key={t(group.label)}>
            <p className="px-4 mb-1 text-micro font-semibold uppercase tracking-label text-white/35">
              {t(group.label)}
            </p>
            <div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id || (active === "exchange" && item.id === "payments");
                return (
                  <Link
                    data-slot="navigation-link"
                    key={item.id}
                    to={profilePath(profileSlug, item.id === "dashboard" ? "" : item.id)}
                    onClick={event => handleLinkClick(event, item.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2 rounded-2xl text-sm font-medium no-underline transition-all duration-300 group relative",
                      isActive
                        ? "bg-white text-black shadow-lg shadow-white/5"
                        : "text-white/60 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <Icon
                      weight={isActive ? "fill" : "regular"}
                      aria-hidden="true"
                      className={cn(
                        "size-6 transition-transform duration-300",
                        isActive ? "" : "",
                      )}
                    />
                    <span className="flex-1 text-left">{t(item.label)}</span>
                    {item.badge ? (
                      <span
                        data-slot="navigation-badge"
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-semibold tracking-wider text-white shadow-sm",
                          brandBg,
                        )}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/5 p-3 space-y-1 shrink-0">
        <Link
          data-slot="navigation-link"
          to={profilePath(profileSlug, "settings")}
          onClick={event => handleLinkClick(event, "settings")}
          aria-current={utilityActive("settings") ? "page" : undefined}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-2 rounded-2xl text-sm font-medium no-underline transition-all duration-300 group",
            utilityActive("settings")
              ? "bg-white text-black shadow-lg"
              : "text-white/60 hover:bg-white/10 hover:text-white",
          )}
        >
          <Settings weight={utilityActive("settings") ? "fill" : "regular"} aria-hidden="true" className="size-5 transition-transform duration-300 group-hover:rotate-45" />{t("Settings")}</Link>
        <Link
          data-slot="navigation-link"
          to={profilePath(profileSlug, "help")}
          onClick={event => handleLinkClick(event, "help")}
          aria-current={utilityActive("help") ? "page" : undefined}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-2 rounded-2xl text-sm font-medium no-underline transition-all duration-300 group",
            utilityActive("help")
              ? "bg-white text-black shadow-lg"
              : "text-white/60 hover:bg-white/10 hover:text-white",
          )}
        >
          <HelpCircle weight={utilityActive("help") ? "fill" : "regular"} aria-hidden="true" className="size-5 transition-transform duration-300" />{t("Support")}</Link>
        <AlertDialogTrigger asChild><button
          type="button"
          className="w-full flex items-center gap-3 px-4 py-2 rounded-2xl text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all duration-300 group"
        >
          <LogOut className="size-5 zb-group-hover-shift-left" />{t("Log out")}</button></AlertDialogTrigger>
      </div>

        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-semibold">{t("Return to the demo overview?")}</AlertDialogTitle>
            <AlertDialogDescription>{t("This prototype has no sign-in session to end. Return to the overview; your saved demo changes stay on this device.")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-medium rounded-lg">{t("Cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="font-medium rounded-lg bg-slate-900 hover:bg-slate-800"
              onClick={() => handleNav("dashboard")}
            >{t("Return to overview")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
    </div>
    </AlertDialog>
  );
}

export function Sidebar({
  active,
  onChange,
  profileSlug,
  isBusiness,
}: {
  active: string;
  onChange: (id: string) => void;
  profileSlug: ProfileSlug;
  isBusiness?: boolean;
}) {
  return (
    <aside className="hidden lg:flex w-72 shrink-0 border-r border-white/5 relative z-50" aria-hidden={false}>
      <SidebarContent
        active={active}
        onChange={onChange}
        profileSlug={profileSlug}
        isBusiness={isBusiness}
        className="w-full"
      />
    </aside>
  );
}
