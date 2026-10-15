import { FieldFeedback } from "../components/ui/field-feedback";
import { useI18n } from "../i18n/I18nProvider";
import { cardLimitError } from "../utils/cardLimit";
import { getCards, updateCard } from "../data/cards";
import { PaymentCard } from "../components/zapad/PaymentCard";
import { useState, Fragment, useEffect, useId, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { PlusIcon as Plus } from "@phosphor-icons/react/dist/csr/Plus";
import { SlidersHorizontalIcon as SlidersHorizontal } from "@phosphor-icons/react/dist/csr/SlidersHorizontal";
import { LockSimpleIcon as Lock } from "@phosphor-icons/react/dist/csr/LockSimple";
import { SnowflakeIcon as Snowflake } from "@phosphor-icons/react/dist/csr/Snowflake";
import { EyeIcon as Eye } from "@phosphor-icons/react/dist/csr/Eye";
import { EyeSlashIcon as EyeOff } from "@phosphor-icons/react/dist/csr/EyeSlash";
import { WifiHighIcon as Wifi } from "@phosphor-icons/react/dist/csr/WifiHigh";
import { CreditCardIcon as CreditCard } from "@phosphor-icons/react/dist/csr/CreditCard";
import { ShieldCheckIcon as ShieldCheck } from "@phosphor-icons/react/dist/csr/ShieldCheck";
import { WarningIcon as AlertTriangle } from "@phosphor-icons/react/dist/csr/Warning";
import { CheckCircleIcon as CheckCircle2 } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { CaretRightIcon as ChevronRight } from "@phosphor-icons/react/dist/csr/CaretRight";
import { DeviceMobileIcon as Smartphone } from "@phosphor-icons/react/dist/csr/DeviceMobile";
import { GlobeIcon as Globe } from "@phosphor-icons/react/dist/csr/Globe";
import { ShoppingCartIcon as ShoppingCart } from "@phosphor-icons/react/dist/csr/ShoppingCart";
import { MoneyIcon as Banknote } from "@phosphor-icons/react/dist/csr/Money";
import { toast } from "sonner";
import { usePrivacy } from "../contexts/PrivacyContext";
import { useAppProfile } from "../hooks/useAppProfile";
import { formatMoney } from "../utils/format";
import { PAGE_MAX_WIDTH } from "../utils/paths";
import { cn } from "../components/ui/utils";

interface CardData {
  id: string;
  type: string;
  gradient: string;
  textClass: string;
  last4: string;
  expiry: string;
  holder: string;
  monthlySpend: number;
  monthlyLimit: number;
  frozen: boolean;
  onlineEnabled?: boolean;
  limits: {
    online: number;
    contactless: number;
    atm: number;
    international: boolean;
  };
}

function getCardsForProfile(isBusiness: boolean): CardData[] { return getCards(isBusiness ? "business" : "personal"); }

function CardDisplay({
  card,
  isPrivate,
  frozen,
}: {
  card: CardData;
  isPrivate: boolean;
  frozen: boolean;
}) {
  useI18n();
  return <PaymentCard holder={card.holder} name={card.type} last4={card.last4} expiry={card.expiry} isPrivate={isPrivate} frozen={frozen}/>;
}

function FreezeDialog({
  open,
  onClose,
  card,
  onToggle,
}: {
  open: boolean;
  onClose: () => void;
  card: CardData;
  onToggle: () => boolean;
}) {
  const { t } = useI18n();
  const action = card.frozen ? t("Unfreeze") : t("Freeze");
  const Icon = card.frozen ? Snowflake : Lock;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm rounded-4xl p-8 border border-slate-200/60 shadow-2xl">
        <div
            className={cn("size-16 rounded-lg mx-auto flex items-center justify-center", card.frozen ? "bg-sky-100 text-sky-600" : "bg-slate-100 text-slate-700")}
          >
            <Icon className="size-8" />
          </div>
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl font-semibold text-slate-900">
            {card.frozen ? t("Unfreeze card") : t("Freeze card")}
          </DialogTitle>
          <DialogDescription className="text-sm font-normal text-slate-500 mt-2">
            {card.frozen
              ? t("This demo card will return to the active state.")
              : t("This demo card will be marked as frozen. You can unfreeze it at any time. Freezing does not cancel a subscription, merchant contract or completed payment.")}
          </DialogDescription>
        </DialogHeader>

        {!card.frozen && (
          <div className="rounded-lg bg-amber-50 border border-amber-100 p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm font-normal text-amber-700">
              {t("This setting is saved on this device. No real card or payment is affected.")}
            </p>
          </div>
        )}

        <div data-form-actions className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-12 px-6 rounded-lg font-medium border-slate-200 text-slate-700"
          >
            {t("Cancel")}
          </Button>
          <Button
            onClick={() => {
              if (!onToggle()) return;
              toast.success(card.frozen ? t("Card unfrozen successfully") : t("Card frozen successfully"), {
                description: card.frozen
                  ? t("Demo card preference saved on this device.")
                  : t("Demo card preference saved on this device."),
              });
              onClose();
            }}
            className={cn("h-12 px-6 rounded-lg font-medium shadow-sm", card.frozen
                ? "bg-sky-500 hover:bg-sky-600 text-white"
                : "bg-slate-900 hover:bg-slate-800 text-white")}
          >
            {action}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LimitsDialog({
  open,
  onClose,
  card,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  card: CardData;
  onSave: (limits: CardData["limits"]) => boolean;
}) {
  const { t } = useI18n();
  const [online, setOnline] = useState(String(card.limits.online));
  const [contactless, setContactless] = useState(String(card.limits.contactless));
  const [atm, setAtm] = useState(String(card.limits.atm));
  const [intl, setIntl] = useState(card.limits.international);
  const fieldId = useId();
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [focusRequest, setFocusRequest] = useState<{ index: number } | null>(null);
  useEffect(() => {
    if (focusRequest) inputs.current[focusRequest.index]?.focus();
  }, [focusRequest]);
  useEffect(() => { if (open) { setSubmitted(false); setOnline(String(card.limits.online)); setContactless(String(card.limits.contactless)); setAtm(String(card.limits.atm)); setIntl(card.limits.international); } }, [open, card]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md rounded-4xl p-8 border border-slate-200/60 shadow-2xl">
        <DialogHeader className="mb-7">
          <div className="flex items-center gap-4">
            <div data-slot="functional-icon" className="size-11 rounded-sm bg-slate-100 text-slate-700 flex items-center justify-center">
              <Lock className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-slate-900">
                {t("Spending limits")}
              </DialogTitle>
              <DialogDescription className="text-sm font-normal text-slate-500 mt-0.5">
                {t("{card} · •••• {last4} · Daily limits", { card: t(card.type), last4: card.last4 })}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div data-form-fields className="space-y-6">
          {[
            { label: "Online payments", icon: Globe, value: online, onChange: setOnline },
            { label: "Contactless / POS", icon: ShoppingCart, value: contactless, onChange: setContactless },
            { label: "ATM withdrawals", icon: Banknote, value: atm, onChange: setAtm },
          ].map((item, index) => {
            const Icon = item.icon;
            const error = submitted ? cardLimitError(item.value) : "";
            const id = `${fieldId}-${index}`;
            return (
              <div key={item.label} className="space-y-2">
                <Label htmlFor={id} className="text-xs font-medium text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Icon className="size-3.5" /> {t(item.label)}
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-slate-400 pointer-events-none">
                    €
                  </span>
                  <Input
                    id={id}
                    ref={element => { inputs.current[index] = element; }}
                    aria-label={t(item.label)}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                    min="0"
                    max="1000000"
                    step="0.01"
                    inputMode="decimal"
                    type="number"
                    value={item.value}
                    onChange={(e) => item.onChange(e.target.value)}
                    data-leading-adornment
                    className="pl-8 h-12 rounded-lg border-slate-200/80 bg-slate-50 focus-visible:bg-white focus-visible:ring-slate-300 font-medium text-slate-900 shadow-sm"
                  />
                </div>
                {error && <FieldFeedback tone="error" id={`${id}-error`} className="text-sm text-destructive">{t(error)}</FieldFeedback>}
              </div>
            );
          })}

          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3">
              <Globe className="size-5 text-slate-500" />
              <div>
                <div className="font-medium text-slate-900 text-sm">{t("International payments")}</div>
                <div className="text-xs font-normal text-slate-400">{t("Payments outside Montenegro")}</div>
              </div>
            </div>
            <Switch
              aria-label={t("International payments")}
              checked={intl}
              onCheckedChange={setIntl}
            />
          </div>
        </div>

        <div data-form-actions className="grid grid-cols-2 gap-3 mt-7">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-12 px-6 rounded-lg font-medium border-slate-200 text-slate-700"
          >
            {t("Cancel")}
          </Button>
          <Button
            onClick={() => {
              setSubmitted(true);
              const invalidIndex = [online, contactless, atm].findIndex(value => !!cardLimitError(value));
              if (invalidIndex !== -1) { setFocusRequest({ index: invalidIndex }); return; }
              if (!onSave({
                online: parseFloat(online) || 0,
                contactless: parseFloat(contactless) || 0,
                atm: parseFloat(atm) || 0,
                international: intl,
              })) return;
              toast.success(t("Limits updated"), {
                description: t("Demo spending limits saved on this device."),
              });
              onClose();
            }}
            className="h-12 px-6 rounded-lg font-medium bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
          >
            {t("Save limits")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailsDialog({
  open,
  onClose,
  card,
  isPrivate,
}: {
  open: boolean;
  onClose: () => void;
  card: CardData;
  isPrivate: boolean;
}) {
  const { t } = useI18n();
  const [revealed, setRevealed] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { setRevealed(false); onClose(); } }}>
      <DialogContent className="sm:max-w-sm rounded-4xl p-8 border border-slate-200/60 shadow-2xl">
        <DialogHeader className="mb-7">
          <div className="flex items-center gap-4">
            <div data-slot="functional-icon" className="size-11 rounded-sm bg-slate-100 text-slate-700 flex items-center justify-center">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-slate-900">
                {t("Card details")}
              </DialogTitle>
              <DialogDescription className="text-sm font-normal text-slate-500 mt-0.5">
                {t("Sensitive information — never share")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {!revealed ? (
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-8 flex flex-col items-center gap-4 mb-7">
            <div className="size-16 rounded-full bg-slate-200 flex items-center justify-center">
              <Eye className="size-7 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600 text-center">
              {t("Tap below to reveal your full card number and CVV.")}
            </p>
          </div>
        ) : (
          <div className="rounded-xl bg-slate-50 border border-slate-100 divide-y divide-slate-100 mb-7 overflow-hidden">
            <div className="px-5 py-4">
              <div className="text-xs font-medium uppercase text-slate-400 tracking-wider mb-1.5">
                {t("Card number")}
              </div>
              <code className="font-mono font-semibold text-slate-900 text-lg tracking-widest">
                {isPrivate ? "•••• •••• •••• ••••" : `4532 8821 4409 ${card.last4}`}
              </code>
            </div>
            <div className="px-5 py-4">
              <div className="text-xs font-medium uppercase text-slate-400 tracking-wider mb-1.5">
                {t("CVV")}
              </div>
              <code className="font-mono font-semibold text-slate-900 text-lg">
                {isPrivate ? "•••" : "742"}
              </code>
            </div>
            <div className="px-5 py-4">
              <div className="text-xs font-medium uppercase text-slate-400 tracking-wider mb-1.5">
                {t("Expiry")}
              </div>
              <code className="font-mono font-semibold text-slate-900 text-lg">
                {card.expiry}
              </code>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {!revealed && (
            <Button
              onClick={() => setRevealed(true)}
              className="w-full h-12 px-6 rounded-lg font-medium bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
            >
              <Eye className="size-4 mr-2" /> {t("Reveal details")}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => { setRevealed(false); onClose(); }}
            className="w-full h-12 px-6 rounded-lg font-medium border-slate-200 text-slate-700"
          >
            {revealed ? t("Close") : t("Cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function WalletPromoBanner({ onSetupWallet }: { onSetupWallet: () => void }) {
  const { t } = useI18n();
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border py-6">
      <div className="flex items-start gap-3">
        <Smartphone className="size-5 shrink-0 text-muted-foreground mt-1" />
        <div>
          <h2 className="text-base font-semibold text-foreground">{t("Apple Pay & Google Pay")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("Pay with your ZapadBanka card. Wallet setup is a preview.")}</p>
        </div>
      </div>
      <Button variant="outline" onClick={onSetupWallet}>
        {t("Set up wallet")} <ChevronRight className="size-4 ml-1" />
      </Button>
    </div>
  );
}

export function CardsPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { cardId } = useParams();
  const [cardParams, setCardParams] = useSearchParams();
  const cardAction = cardParams.get("action");
  const { isPrivate } = usePrivacy();
  const { profileSlug, isBusiness } = useAppProfile();

  const brandBg = isBusiness ? "bg-brand-business" : "bg-brand-personal";
  const brandHover = isBusiness ? "hover:bg-brand-business-dark" : "hover:bg-brand-personal-dark";
  const brandText = "text-primary-foreground";

  const [cards, setCards] = useState<CardData[]>(() => getCardsForProfile(isBusiness));
  const [freezeDialog, setFreezeDialog] = useState<string | null>(null);
  const [limitsDialog, setLimitsDialog] = useState<string | null>(null);
  const [onlineDialog, setOnlineDialog] = useState<string | null>(null);
  
  const [preview, setPreview] = useState<"wallet" | "order" | null>(null);
  const [detailsDialog, setDetailsDialog] = useState<string | null>(null);

  useEffect(() => {
    setCards(getCardsForProfile(isBusiness));
    setFreezeDialog(cardAction === "freeze" ? cardId ?? null : null);
    setLimitsDialog(cardAction === "limits" ? cardId ?? null : null);
    setDetailsDialog(cardAction === "details" ? cardId ?? null : null);
    setOnlineDialog(null);

  }, [profileSlug, isBusiness, cardId, cardAction]);

  const saveCard = (id: string, changes: Partial<CardData>) => {
    try { setCards(updateCard(isBusiness ? "business" : "personal", id, changes)); return true; }
    catch (error) { toast.error(error instanceof Error ? t(error.message) : t("Could not save card settings")); return false; }
  };
  const toggleFreeze = (id: string) => saveCard(id,{frozen: !cards.find(c=>c.id===id)?.frozen});
  const updateLimits = (id: string, limits: CardData["limits"]) => saveCard(id,{limits});
  if (cardId && !cards.some(card => card.id === cardId)) return <div className="p-8 space-y-4"><h1 className="text-2xl font-semibold">{t("Card not found")}</h1><p>{t("This link does not belong to the selected profile or is no longer available.")}</p><Button variant="outline" onClick={() => navigate(`/${profileSlug}/cards`)}>{t("Back to cards")}</Button></div>;


  return (
    <div className={cn(PAGE_MAX_WIDTH, "mx-auto p-6 md:p-8 space-y-8")}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-balance leading-none font-semibold tracking-tight text-slate-900">{t("Cards")}</h1>
          <p className="text-base font-normal text-slate-500 mt-1.5">
            {t("Manage your debit and credit cards · Preferences saved on this device")}
          </p>
        </div>
        <Button
          className={cn(brandBg, brandHover, brandText, "rounded-lg h-11 px-5 font-medium shadow-sm transition-all hover:shadow-md")}
          onClick={() => setPreview("order")}
        >
          <Plus className="size-4 mr-2" /> {t("Order new card")}
        </Button>
      </div>

      <Dialog open={preview !== null} onOpenChange={open => !open && setPreview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{preview === "wallet" ? t("Digital wallet") : t("Order a card")}</DialogTitle>
            <DialogDescription>{preview === "wallet" ? t("Wallet setup is a preview. Connecting a card to Apple Pay or Google Pay is not available in this prototype.") : t("Card ordering is not available in this prototype. Your existing cards and settings are available below.")}</DialogDescription>
          </DialogHeader>
          <Button variant="outline" onClick={() => setPreview(null)}>{t("Back to cards")}</Button>
        </DialogContent>
      </Dialog>
      <div className="grid md:grid-cols-2 gap-6">
        {cards.map((card) => {
          const spendPct = Math.min((card.monthlySpend / card.monthlyLimit) * 100, 100);

          return (
            <Card key={card.id} className="@container min-w-0 p-4 sm:p-7 border-slate-200/60 bg-white rounded-4xl shadow-sm">
              <CardDisplay card={card} isPrivate={isPrivate} frozen={card.frozen} />

              {/* Spend bar */}
              <div className="mt-6 space-y-2">
                <div className="flex flex-wrap justify-between gap-2 text-xs font-medium text-slate-400 uppercase tracking-wide min-w-0">
                  <span className="shrink-0">{t("Monthly spend")}</span>
                  <span className="text-slate-700 text-right whitespace-nowrap min-w-0">
                    {isPrivate
                      ? "••• / •••"
                      : `${formatMoney(card.monthlySpend, "EUR", { decimals: 0 })} / ${formatMoney(card.monthlyLimit, "EUR", { decimals: 0 })}`}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700", spendPct > 80 ? "bg-rose-500" : spendPct > 60 ? "bg-amber-500" : "bg-slate-400")}
                    style={{ width: `${spendPct}%` }}
                  />
                </div>
                <div className="text-xs font-normal text-slate-400">
                  {t("{percent}% of monthly limit used", { percent: Math.round(spendPct) })}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 @sm:grid-cols-4 gap-1 border-t border-border pt-3">
                {[
                  { label: card.frozen ? "Unfreeze" : "Freeze", icon: Snowflake, run: () => setFreezeDialog(card.id), active: card.frozen },
                  { label: "Details", icon: Eye, run: () => setDetailsDialog(card.id) },
                  { label: "Limits", icon: SlidersHorizontal, run: () => setLimitsDialog(card.id) },
                  { label: "Online", icon: Globe, run: () => setOnlineDialog(card.id), online: true },
                ].map(action => <Button key={action.label} variant="ghost" onClick={action.run} aria-label={action.online ? (isPrivate ? t("Online payments {status} for {card}", { status: card.onlineEnabled === false ? t("off") : t("on"), card: t(card.type) }) : t("Online payments {status} for {card} ending {last4}", { status: card.onlineEnabled === false ? t("off") : t("on"), card: t(card.type), last4: card.last4 })) : undefined} className="min-w-0 h-auto flex-col gap-2 px-1 py-2 whitespace-normal">
                  <span data-icon-role="action" data-slot={action.active ? "status-icon" : "functional-icon"} className={cn("relative flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground", action.active && "bg-sky-50 text-sky-700")}>
                    <action.icon className="size-5" aria-hidden="true" />
                    {action.online && <span className={cn("absolute right-0 top-0 size-2 rounded-full border-2 border-white", card.onlineEnabled === false ? "bg-slate-400" : "bg-emerald-500")} />}
                  </span>
                  <span className="min-w-0 w-full break-words text-center text-sm leading-5">{t(action.label)}</span>
                </Button>)}
              </div>

              {/* Status */}

            </Card>
          );
        })}
      </div>


      <WalletPromoBanner
        onSetupWallet={() => setPreview("wallet")}
      />

      {/* Dialogs */}
      {cards.map((card) => (
        <Fragment key={card.id}>
          {onlineDialog === card.id && <OnlineDialog card={card} enabled={card.onlineEnabled ?? true} onClose={() => setOnlineDialog(null)} onSave={enabled => { if (saveCard(card.id, {onlineEnabled: enabled})) { setOnlineDialog(null); toast.success(t("Online payments updated"), {description:t("Demo preference saved on this device.")}); } }}/>}
          <FreezeDialog
            open={freezeDialog === card.id}
            onClose={() => { setFreezeDialog(null); setCardParams({}, {replace:true}); }}
            card={card}
            onToggle={() => toggleFreeze(card.id)}
          />
          {limitsDialog === card.id && <LimitsDialog
            open={limitsDialog === card.id}
            onClose={() => { setLimitsDialog(null); setCardParams({}, {replace:true}); }}
            card={card}
            onSave={(limits) => updateLimits(card.id, limits)}
          />}
          <DetailsDialog
            open={detailsDialog === card.id}
            onClose={() => { setDetailsDialog(null); setCardParams({}, {replace:true}); }}
            card={card}
            isPrivate={isPrivate}
          />
        </Fragment>
      ))}
    </div>
  );
}

function OnlineDialog({card, enabled, onClose, onSave}: {card: CardData; enabled: boolean; onClose: () => void; onSave: (enabled: boolean) => void}) {
  const { t } = useI18n();
 const [draft, setDraft] = useState(enabled);
 return <Dialog open onOpenChange={open => !open && onClose()}><DialogContent><DialogHeader><DialogTitle>{t("Online payments")}</DialogTitle><DialogDescription>{t(card.type)} · •••• {card.last4}</DialogDescription></DialogHeader><p className="text-sm text-slate-600">{t("Preview the online-payment preference for this demo card. This setting is saved on this device and cannot control real purchases.")}</p><label className="flex items-center justify-between py-4"><span>{t("Allow online payments")}</span><Switch aria-label={t("Allow online payments")} checked={draft} onCheckedChange={setDraft}/></label>{card.frozen && <p className="text-sm text-slate-500">{t("This demo card is marked as frozen. Changing this preference does not unfreeze it.")}</p>}<div data-form-actions className="flex gap-3"><Button variant="outline" onClick={onClose}>{t("Cancel")}</Button><Button onClick={()=>onSave(draft)}>{t("Save changes")}</Button></div></DialogContent></Dialog>;
}
