import { usePrivacy } from "../../contexts/PrivacyContext";
import { maskMoneyInText } from "../../utils/privacyText";
import { cn } from "../ui/utils";
import { CurrencyFlag } from "./CurrencyIcon";
import { PaymentCard } from "./PaymentCard";
import { Link, useNavigate } from "react-router";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  AlertCircle,
  CreditCard,
  FileText,
  ShieldAlert,
  ArrowRight,
  Wifi,
  Lock,
  Snowflake,
} from "lucide-react";
import type { ProfileKind, ProfileSlug } from "../../data/types";
import { getPrimaryCard } from "../../data/cards";
import { cardPath, paymentsPath, profilePath, statementsPath } from "../../utils/paths";
import { IconScaleSlot } from "./IconScaleSlot";

const panelCardPad = (compact: boolean) => (compact ? "p-4 md:p-5" : "p-6 md:p-8");
const panelSectionGap = (compact: boolean) => (compact ? "mb-4" : "mb-6");

export function RightPanel({
  business,
  profileSlug,
  profileKind,
  compact = false,
}: {
  business: boolean;
  profileSlug: ProfileSlug;
  profileKind: ProfileKind;
  compact?: boolean;
}) {
  return (
    <div className={cn(compact ? "space-y-4 xl:sticky xl:top-20" : "space-y-5 xl:sticky xl:top-24")}>
      <AlertsCard business={business} profileSlug={profileSlug} compact={compact} />
      <CardWidget business={business} profileSlug={profileSlug} profileKind={profileKind} compact={compact} />
      {!compact && <FxWidget business={business} profileSlug={profileSlug} compact={compact} />}
      {!compact && <OffersCard business={business} profileSlug={profileSlug} compact={compact} />}
    </div>
  );
}


export function AlertsCard({
  business,
  profileSlug,
  compact = false,
}: {
  business: boolean;
  profileSlug: ProfileSlug;
  compact?: boolean;
}) {
  const navigate = useNavigate();
  const { isPrivate } = usePrivacy();
  const items = business
    ? [
        {
          icon: ShieldAlert,
          color: "text-orange-600 bg-orange-50",
          title: "Payment awaiting approval",
          desc: "Invoice INV-2034 · €4,820.00",
          cta: "Review",
          href: profilePath(profileSlug, "transactions?transaction=1"),
        },
        {
          icon: AlertCircle,
          color: "text-amber-600 bg-amber-50",
          title: "Sample statement ready",
          desc: "May 2026 · Sample",
          cta: "Open",
          href: statementsPath(profileSlug, { account: "b-operating" }),
        },
      ]
    : [
        {
          icon: AlertCircle,
          color: "text-orange-600 bg-orange-50",
          title: "New device login",
          desc: "iPhone 15 · 2 hours ago",
          cta: "Security help",
          href: profilePath(profileSlug, "settings"),
        },
        {
          icon: FileText,
          color: "text-sky-600 bg-sky-50",
          title: "Statement ready",
          desc: "May 2026 · Sample",
          cta: "View",
          href: statementsPath(profileSlug, { account: "p-main" }),
        },
      ];

  return (
    <Card className={cn(panelCardPad(compact), "border border-slate-200/60 bg-white rounded-4xl shadow-sm")}>
      <div className={cn("flex items-center justify-between", panelSectionGap(compact))}>
        <h3 className="text-base md:text-lg font-semibold text-slate-900">Needs attention</h3>
        <span className="size-6 rounded-full bg-muted text-foreground text-xs font-medium flex items-center justify-center shadow-sm">{items.length}</span>
      </div>
      <div className="space-y-3">
        {items.map((it, i) => {
          const Icon = it.icon;
          return (
            <div
              key={i}
              role="button"
              tabIndex={0}
              onClick={() => navigate(it.href)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(it.href);
                }
              }}
              className={cn("flex items-start rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 cursor-pointer transition-surface group", compact ? "gap-3 p-3" : "gap-4 p-4")}
            >
              <IconScaleSlot className={cn("rounded-md shrink-0", compact ? "size-10" : "size-12")} innerClassName={`shadow-sm ${it.color}`}>
                <Icon className="size-5" />
              </IconScaleSlot>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-900">{it.title}</div>
                <div className="text-xs font-normal text-slate-500 truncate mt-1">
                  {isPrivate ? maskMoneyInText(it.desc) : it.desc}
                </div>
                <span className="inline-block h-8 font-medium text-slate-900 mt-2 text-xs group-hover:text-blue-600 transition-colors">
                  {it.cta} →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export function CardWidget({
  business,
  profileSlug,
  profileKind,
  compact = false,
}: {
  business: boolean;
  profileSlug: ProfileSlug;
  profileKind: ProfileKind;
  compact?: boolean;
}) {
  const navigate = useNavigate();
  const { isPrivate } = usePrivacy();
  const card = getPrimaryCard(profileKind);
  const cardsHref = cardPath(profileSlug, card.id);

  return (
    <Card className={cn(panelCardPad(compact), "border border-slate-200/60 bg-white rounded-4xl shadow-sm")}>
      <div className={cn("flex items-center justify-between", panelSectionGap(compact))}>
        <h3 className="text-base md:text-lg font-semibold text-slate-900">Card</h3>
        <Button variant="ghost" className="font-medium h-9 px-3 rounded-full hover:bg-slate-100 text-slate-600" asChild>
          <Link to={profilePath(profileSlug, "cards")}>
            Manage <ArrowRight className="size-4 ml-1.5" />
          </Link>
        </Button>
      </div>

      <PaymentCard isPrivate={isPrivate} holder={card.holder} name={card.type} last4={card.last4} expiry={card.expiry} frozen={card.frozen}/>

      <div className={cn("grid w-full max-w-sm mx-auto grid-cols-3 gap-2 sm:gap-3", compact ? "mt-4" : "mt-5")}>
        <Button
          type="button"
          variant="outline"
          className={cn("h-auto flex-col rounded-2xl border-slate-200 hover:bg-slate-50 text-slate-700 transition-all hover:border-slate-300", compact ? "gap-1.5 py-2.5" : "gap-2.5 py-3.5")}
          onClick={() => navigate(`${cardsHref}?action=freeze`)}
        >
          <Snowflake className="size-5" />
          <span className="text-xs font-medium">{card.frozen ? "Unfreeze" : "Freeze"}</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          className={cn("h-auto flex-col rounded-2xl border-slate-200 hover:bg-slate-50 text-slate-700 transition-all hover:border-slate-300", compact ? "gap-1.5 py-2.5" : "gap-2.5 py-3.5")}
          onClick={() => navigate(`${cardsHref}?action=limits`)}
        >
          <Lock className="size-5" />
          <span className="text-xs font-medium">Limits</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          className={cn("h-auto flex-col rounded-2xl border-slate-200 hover:bg-slate-50 text-slate-700 transition-all hover:border-slate-300", compact ? "gap-1.5 py-2.5" : "gap-2.5 py-3.5")}
          onClick={() => navigate(`${cardsHref}?action=details`)}
        >
          <FileText className="size-5" />
          <span className="text-xs font-medium">Details</span>
        </Button>
      </div>
    </Card>
  );
}

function FxWidget({
  business,
  profileSlug,
  compact = false,
}: {
  business: boolean;
  profileSlug: ProfileSlug;
  compact?: boolean;
}) {
  const brandBg = business ? "bg-brand-business" : "bg-brand-personal";
  const brandHover = business ? "hover:bg-brand-business-dark" : "hover:bg-brand-personal-dark";

  return (
    <Card
      className={cn(panelCardPad(compact), "border border-slate-200/60 bg-white rounded-4xl shadow-sm")}
      aria-label="Currency exchange widget"
    >
      <div className={cn("flex items-center justify-between", panelSectionGap(compact))}>
        <h3 className="text-base md:text-lg font-semibold text-slate-900">Exchange</h3>
        <span className="text-xs font-medium text-emerald-600 flex items-center gap-1.5 uppercase tracking-wide">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Demo
        </span>
      </div>
      <div className="space-y-2" aria-hidden="true">
        <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
          <div className="text-xs font-medium uppercase text-slate-500 tracking-wider mb-2">
            You pay
          </div>
          <div className="flex items-center gap-3 min-w-0 overflow-hidden">
            <Input
              readOnly
              tabIndex={-1}
              defaultValue="1,000"
              className="border-0 bg-transparent px-0 h-10 text-3xl font-semibold shadow-none focus-visible:ring-0 text-slate-900 w-0 flex-1 min-w-0 pointer-events-none"
            />
            <Button variant="outline" className="h-10 px-5 font-medium rounded-full border-slate-200 text-slate-900 bg-white hover:bg-slate-50 gap-2 shrink-0 shadow-sm">
              <CurrencyFlag currency="EUR" />
              EUR ▾
            </Button>
          </div>
        </div>
        <div className="flex justify-center py-1 relative z-10">
          <div data-slot="supporting-surface" className={cn("size-10 rounded-full", "text-white", "flex items-center justify-center", brandBg, "shadow-md ring-4 ring-white")}>
            <ArrowRight className="size-4 rotate-90" />
          </div>
        </div>
        <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
          <div className="text-xs font-medium uppercase text-slate-500 tracking-wider mb-2">
            You receive
          </div>
          <div className="flex items-center gap-3 min-w-0 overflow-hidden">
            <Input
              readOnly
              tabIndex={-1}
              defaultValue="1,087"
              className="border-0 bg-transparent px-0 h-10 text-3xl font-semibold shadow-none focus-visible:ring-0 text-slate-900 w-0 flex-1 min-w-0 pointer-events-none"
            />
            <Button variant="outline" className="h-10 px-5 font-medium rounded-full border-slate-200 text-slate-900 bg-white hover:bg-slate-50 gap-2 shrink-0 shadow-sm">
              <CurrencyFlag currency="USD" />
              USD ▾
            </Button>
          </div>
        </div>
      </div>
      <Button variant="outline"
        className={cn("w-full text-sm font-medium", "text-white", "rounded-lg", brandBg, brandHover, "shadow-sm transition-all hover:shadow", compact ? "mt-4 h-11 px-5" : "mt-6 h-12 px-6")}
        asChild
      >
        <Link to={profilePath(profileSlug, "exchange")}>Convert now</Link>
      </Button>
      <p className="text-xs font-normal text-slate-500 text-center mt-4">
        1 EUR = 1.087 USD <span className="mx-1">•</span> Updated 5s ago
      </p>
    </Card>
  );
}

function OffersCard({
  business,
  profileSlug,
  compact = false,
}: {
  business: boolean;
  profileSlug: ProfileSlug;
  compact?: boolean;
}) {
  const offerHref = profilePath(profileSlug, business ? "loans" : "savings");

  return (
    <Link to={offerHref} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-4xl">
      <Card className={cn(panelCardPad(compact), "border border-border bg-card rounded-xl group")}>
      <div className={cn("flex items-start relative z-10", compact ? "gap-4" : "gap-5")}>
        <div>
          <div className="text-base font-semibold text-slate-900">
            {business
              ? "Working capital up to €150k"
              : "Earn 3.2% APY on savings"}
          </div>
          <p className="text-sm font-normal text-slate-500 mt-1.5 leading-snug">
            {business
              ? "Pre-approved credit line. Decision in 24h."
              : "Open a fixed-term deposit instantly."}
          </p>
          <span className="inline-block mt-3 text-blue-600 text-sm font-medium group-hover:text-blue-700">
            Learn more →
          </span>
        </div>
      </div>
      </Card>
    </Link>
  );
}
