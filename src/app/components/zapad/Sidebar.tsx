import { useState } from "react";
import {
  LayoutDashboard,
  Wallet,
  Send,
  CreditCard,
  Repeat,
  Landmark,
  PiggyBank,
  TrendingUp,
  FileText,
  Inbox,
  Settings,
  HelpCircle,
  LogOut,
  List,
  type LucideIcon,
} from "lucide-react";
import { cn } from "../ui/utils";
import type { ProfileSlug } from "../../data/types";
import { profilePath } from "../../utils/paths";
import { Link, useNavigate } from "react-router";
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
} from "../ui/alert-dialog";

import logoImg from "../../../imports/logoNew.png";

type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
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
  const navigate = useNavigate();
  const { unreadCount } = useInbox();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const brandBg = isBusiness ? "bg-brand-business" : "bg-brand-personal";
  const groups = buildNavGroups(unreadCount);

  const handleNav = (id: string) => {
    onChange(id);
    onItemClick?.();
  };

  const goUtility = (segment: string) => {
    navigate(profilePath(profileSlug, segment));
    onItemClick?.();
  };

  const handleHomeClick = () => {
    onChange("dashboard");
    onItemClick?.();
  };

  const utilityActive = (id: string) => active === id;

  return (
    <div className={cn("bank-sidebar flex flex-col h-full bg-neutral-950 text-white", className)}>
      <div className="flex h-22 shrink-0 items-center border-b border-white/5 px-8">
        <Link
          to={profilePath(profileSlug)}
          onClick={handleHomeClick}
          className="flex min-w-0 items-center gap-3 rounded-lg text-left text-white no-underline transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          aria-label="Go to dashboard"
        >
          <img
            src={logoImg}
            alt=""
            className="size-10 shrink-0 object-contain brightness-0 invert"
            loading="eager"
          />
          <span className="text-xl font-semibold tracking-tight">ZapadBanka</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-5 space-y-6 scrollbar-hide" aria-label="Main navigation">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="px-4 mb-2 text-micro font-semibold uppercase tracking-label text-white/35">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id || (active === "exchange" && item.id === "payments");
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNav(item.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 group relative",
                      isActive
                        ? "bg-white text-black shadow-lg shadow-white/5"
                        : "text-white/60 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-5 transition-transform duration-300",
                        isActive ? "" : "",
                      )}
                    />
                    <span className="flex-1 text-left">{item.label}</span>
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
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/5 p-5 space-y-1.5 shrink-0">
        <button
          type="button"
          onClick={() => goUtility("settings")}
          aria-current={utilityActive("settings") ? "page" : undefined}
          className={cn(
            "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 group",
            utilityActive("settings")
              ? "bg-white text-black shadow-lg"
              : "text-white/60 hover:bg-white/10 hover:text-white",
          )}
        >
          <Settings className="size-5 transition-transform duration-300 group-hover:rotate-45" />
          Settings
        </button>
        <button
          type="button"
          onClick={() => goUtility("help")}
          aria-current={utilityActive("help") ? "page" : undefined}
          className={cn(
            "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 group",
            utilityActive("help")
              ? "bg-white text-black shadow-lg"
              : "text-white/60 hover:bg-white/10 hover:text-white",
          )}
        >
          <HelpCircle className="size-5 transition-transform duration-300" />
          Support
        </button>
        <button
          type="button"
          onClick={() => setLogoutOpen(true)}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all duration-300 group"
        >
          <LogOut className="size-5 zb-group-hover-shift-left" />
          Log out
        </button>
      </div>

      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-semibold">Log out?</AlertDialogTitle>
            <AlertDialogDescription className="font-semibold">
              You will need to sign in again to access your accounts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-medium rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="font-medium rounded-lg bg-slate-900 hover:bg-slate-800"
              onClick={() => navigate("/")}
            >
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
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
