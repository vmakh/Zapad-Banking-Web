import { useI18n } from "../../i18n/I18nProvider";
import { usePrivacy } from "../../contexts/PrivacyContext";
import { maskMoneyInText } from "../../utils/privacyText";
import { cn } from "../ui/utils";
import { PaymentCard } from "./PaymentCard";
import { Link, useNavigate } from "react-router";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { demoRate } from "../../utils/paymentQuote";
import { formatMoney, formatNumber } from "../../utils/format";
import { WarningCircleIcon as AlertCircle } from "@phosphor-icons/react/dist/csr/WarningCircle";
import { ClockIcon as Clock3 } from "@phosphor-icons/react/dist/csr/Clock";
import { FileTextIcon as FileText } from "@phosphor-icons/react/dist/csr/FileText";
import { ReceiptIcon as ReceiptText } from "@phosphor-icons/react/dist/csr/Receipt";
import { DeviceMobileIcon as Smartphone } from "@phosphor-icons/react/dist/csr/DeviceMobile";
import { ArrowRightIcon as ArrowRight } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { LockSimpleIcon as Lock } from "@phosphor-icons/react/dist/csr/LockSimple";
import { SnowflakeIcon as Snowflake } from "@phosphor-icons/react/dist/csr/Snowflake";
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
  const { t } = useI18n();
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
  const { t } = useI18n();
  const { isPrivate } = usePrivacy();
  const items = business
    ? [
        {
          icon: ReceiptText,
          statusIcon: Clock3,
          title: "Sample invoice to review",
          desc: t("Invoice {reference} · {amount}", { reference: "INV-2034", amount: formatMoney(4820, "EUR") }),
          cta: "Review",
          href: profilePath(profileSlug, "transactions?transaction=1"),
        },
        {
          icon: FileText,
          statusIcon: null,
          title: "Sample statement ready",
          desc: "May 2026 · Sample",
          cta: "Open",
          href: statementsPath(profileSlug, { account: "b-operating" }),
        },
      ]
    : [
        {
          icon: Smartphone,
          statusIcon: AlertCircle,
          title: "Sample device alert",
          desc: "iPhone 15 · Demo scenario",
          cta: "Security help",
          href: profilePath(profileSlug, "settings"),
        },
        {
          icon: FileText,
          statusIcon: null,
          title: "Statement ready",
          desc: "May 2026 · Sample",
          cta: "View",
          href: statementsPath(profileSlug, { account: "p-main" }),
        },
      ];

  return (
    <Card className={cn(panelCardPad(compact), "border-border bg-card rounded-2xl shadow-none")}>
      <div className={cn("flex items-center justify-between", panelSectionGap(compact))}>
        <h3 className="text-lg font-semibold text-foreground">{t("Needs attention")}</h3>
        <span className="size-6 rounded-full bg-muted text-muted-foreground text-xs font-medium flex items-center justify-center">{items.length}</span>
      </div>
      <div className="space-y-3">
        {items.map((it) => {
          const Icon = it.icon;
          const StatusIcon = it.statusIcon;
          return (
            <Link
              key={it.href}
              to={it.href}
              className={cn("group flex items-start rounded-xl hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors", compact ? "gap-3 p-3" : "gap-4 p-4")}
            >
              <div className="relative size-10 shrink-0" aria-hidden="true">
                <IconScaleSlot className="size-full rounded-full" innerClassName="bg-muted text-foreground">
                  <Icon className="size-6" />
                </IconScaleSlot>
                {StatusIcon && <span className="absolute -bottom-0.5 -right-0.5 flex size-4.5 items-center justify-center rounded-full bg-amber-100 text-amber-800 ring-2 ring-card">
                  <StatusIcon className="size-3" />
                </span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground">{t(it.title)}</div>
                <div className="text-xs font-normal text-muted-foreground mt-1 wrap-anywhere">
                  {isPrivate ? maskMoneyInText(t(it.desc)) : t(it.desc)}
                </div>
                <span className="inline-flex items-center gap-1.5 font-medium text-foreground mt-2 text-xs group-hover:text-primary-text transition-colors">
                  {t(it.cta)} <ArrowRight className="size-3.5" aria-hidden="true" />
                </span>
              </div>
            </Link>
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
  const { t } = useI18n();
  const navigate = useNavigate();
  const { isPrivate } = usePrivacy();
  const card = getPrimaryCard(profileKind);
  const cardsHref = cardPath(profileSlug, card.id);

  return (
    <Card className={cn(panelCardPad(compact), "border border-slate-200/60 bg-white rounded-4xl shadow-sm")}>
      <div className={cn("flex items-center justify-between", panelSectionGap(compact))}>
        <h3 className="text-base md:text-lg font-semibold text-slate-900">{t("Card")}</h3>
        <Button variant="ghost" className="font-medium h-9 px-3 rounded-full hover:bg-slate-100 text-slate-600" asChild>
          <Link to={profilePath(profileSlug, "cards")}>{t("Manage")}<ArrowRight className="size-4 ml-1.5" />
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
          <span className="text-xs font-medium">{t(card.frozen ? "Unfreeze" : "Freeze")}</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          className={cn("h-auto flex-col rounded-2xl border-slate-200 hover:bg-slate-50 text-slate-700 transition-all hover:border-slate-300", compact ? "gap-1.5 py-2.5" : "gap-2.5 py-3.5")}
          onClick={() => navigate(`${cardsHref}?action=limits`)}
        >
          <Lock className="size-5" />
          <span className="text-xs font-medium">{t("Limits")}</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          className={cn("h-auto flex-col rounded-2xl border-slate-200 hover:bg-slate-50 text-slate-700 transition-all hover:border-slate-300", compact ? "gap-1.5 py-2.5" : "gap-2.5 py-3.5")}
          onClick={() => navigate(`${cardsHref}?action=details`)}
        >
          <FileText className="size-5" />
          <span className="text-xs font-medium">{t("Details")}</span>
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
  const { t } = useI18n();
  const brandBg = business ? "bg-brand-business" : "bg-brand-personal";
  const brandHover = business ? "hover:bg-brand-business-dark" : "hover:bg-brand-personal-dark";

  return (
    <Card
      className={cn(panelCardPad(compact), "border border-slate-200/60 bg-white rounded-4xl shadow-sm")}
      aria-label={t("Currency exchange widget")}
    >
      <div className={cn("flex items-center justify-between", panelSectionGap(compact))}>
        <h3 className="text-base md:text-lg font-semibold text-slate-900">{t("Exchange")}</h3>
        <span className="text-xs font-medium text-muted-foreground">{t("Illustrative")}</span>
      </div>
      <dl className="space-y-3">
        <div className="rounded-lg border border-border bg-secondary p-4">
          <dt className="text-xs font-medium text-muted-foreground mb-2">{t("Example amount")}</dt>
          <dd className="text-2xl font-semibold text-foreground tabular-nums">{formatMoney(1000, "EUR")}</dd>
        </div>
        <div className="rounded-lg border border-border bg-secondary p-4">
          <dt className="text-xs font-medium text-muted-foreground mb-2">{t("Converted example")}</dt>
          <dd className="text-2xl font-semibold text-foreground tabular-nums">{formatMoney(1000 * demoRate("EUR", "USD"), "USD")}</dd>
        </div>
      </dl>
      <Button variant="outline"
        className={cn("w-full text-sm font-medium", "text-primary-foreground", "rounded-lg", brandBg, brandHover, "shadow-sm transition-all hover:shadow", compact ? "mt-4 h-11 px-5" : "mt-6 h-12 px-6")}
        asChild
      >
        <Link to={profilePath(profileSlug, "exchange")}>{t("Preview exchange")}</Link>
      </Button>
      <p className="text-xs font-normal text-slate-500 text-center mt-4">{t("1 EUR = {rate} USD · Demo rate", { rate: formatNumber(demoRate("EUR", "USD"), { maximumFractionDigits: 3 }) })}</p>
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
  const { t } = useI18n();
  const offerHref = profilePath(profileSlug, business ? "loans" : "savings");

  return (
    <Link to={offerHref} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-4xl">
      <Card className={cn(panelCardPad(compact), "border border-border bg-card rounded-xl group")}>
      <div className={cn("flex items-start relative z-10", compact ? "gap-4" : "gap-5")}>
        <div>
          <div className="text-base font-semibold text-slate-900">
            {t(business
              ? "Explore a sample business loan"
              : "Explore sample savings options")}
          </div>
          <p className="text-sm font-normal text-slate-500 mt-1.5 leading-snug">
            {t(business
              ? "Preview illustrative terms. No credit decision is made."
              : "Compare illustrative deposits. No account is opened.")}
          </p>
          <span className="inline-block mt-3 text-primary-text text-sm font-medium group-hover:underline">{t("Learn more →")}</span>
        </div>
      </div>
      </Card>
    </Link>
  );
}
