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
import {
  Plus,
  SlidersHorizontal,
  Lock,
  Snowflake,
  Eye,
  EyeOff,
  Wifi,
  CreditCard,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Smartphone,
  Globe,
  ShoppingCart,
  Banknote,
} from "lucide-react";
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
  const action = card.frozen ? "Unfreeze" : "Freeze";
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
            {action} card
          </DialogTitle>
          <DialogDescription className="text-sm font-normal text-slate-500 mt-2">
            {card.frozen
              ? "This demo card will return to the active state."
              : "This demo card will be marked as frozen. You can unfreeze it at any time. Freezing does not cancel a subscription, merchant contract or completed payment."}
          </DialogDescription>
        </DialogHeader>

        {!card.frozen && (
          <div className="rounded-lg bg-amber-50 border border-amber-100 p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm font-normal text-amber-700">
              This setting is saved on this device. No real card or payment is affected.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-12 px-6 rounded-lg font-medium border-slate-200 text-slate-700"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!onToggle()) return;
              toast.success(`Card ${card.frozen ? "unfrozen" : "frozen"} successfully`, {
                description: card.frozen
                  ? "Demo card preference saved on this device."
                  : "Demo card preference saved on this device.",
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
  const [online, setOnline] = useState(String(card.limits.online));
  const [contactless, setContactless] = useState(String(card.limits.contactless));
  const [atm, setAtm] = useState(String(card.limits.atm));
  const [intl, setIntl] = useState(card.limits.international);
  const fieldId = useId();
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [touched, setTouched] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => { if (open) { setSubmitted(false); setTouched([]); setOnline(String(card.limits.online)); setContactless(String(card.limits.contactless)); setAtm(String(card.limits.atm)); setIntl(card.limits.international); } }, [open, card]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md rounded-4xl p-8 border border-slate-200/60 shadow-2xl">
        <DialogHeader className="mb-7">
          <div className="flex items-center gap-4">
            <div className="size-11 rounded-sm bg-slate-100 text-slate-700 flex items-center justify-center">
              <Lock className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-slate-900">
                Spending limits
              </DialogTitle>
              <DialogDescription className="text-sm font-normal text-slate-500 mt-0.5">
                {card.type} · •••• {card.last4} · Daily limits
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5">
          {[
            { label: "Online payments", icon: Globe, value: online, onChange: setOnline },
            { label: "Contactless / POS", icon: ShoppingCart, value: contactless, onChange: setContactless },
            { label: "ATM withdrawals", icon: Banknote, value: atm, onChange: setAtm },
          ].map((item, index) => {
            const Icon = item.icon;
            const error = (submitted || touched.includes(index)) ? cardLimitError(item.value) : "";
            const id = `${fieldId}-${index}`;
            return (
              <div key={item.label} className="space-y-2">
                <Label htmlFor={id} className="text-xs font-medium text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Icon className="size-3.5" /> {item.label}
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-slate-400 pointer-events-none">
                    €
                  </span>
                  <Input
                    id={id}
                    ref={element => { inputs.current[index] = element; }}
                    aria-label={item.label}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                    onBlur={() => setTouched(previous => previous.includes(index) ? previous : [...previous, index])}
                    min="0"
                    max="1000000"
                    step="0.01"
                    inputMode="decimal"
                    type="number"
                    value={item.value}
                    onChange={(e) => item.onChange(e.target.value)}
                    className="pl-8 h-12 rounded-lg border-slate-200/80 bg-slate-50 focus-visible:bg-white focus-visible:ring-slate-300 font-medium text-slate-900 shadow-sm"
                  />
                </div>
                {error && <p id={`${id}-error`} className="text-sm text-destructive">{error}</p>}
              </div>
            );
          })}

          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3">
              <Globe className="size-5 text-slate-500" />
              <div>
                <div className="font-medium text-slate-900 text-sm">International payments</div>
                <div className="text-xs font-normal text-slate-400">Payments outside Montenegro</div>
              </div>
            </div>
            <Switch
              aria-label="International payments"
              checked={intl}
              onCheckedChange={setIntl}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-7">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-12 px-6 rounded-lg font-medium border-slate-200 text-slate-700"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setSubmitted(true);
              const invalidIndex = [online, contactless, atm].findIndex(value => !!cardLimitError(value));
              if (invalidIndex !== -1) { inputs.current[invalidIndex]?.focus(); return; }
              if (!onSave({
                online: parseFloat(online) || 0,
                contactless: parseFloat(contactless) || 0,
                atm: parseFloat(atm) || 0,
                international: intl,
              })) return;
              toast.success("Limits updated", {
                description: "Demo spending limits saved on this device.",
              });
              onClose();
            }}
            className="h-12 px-6 rounded-lg font-medium bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
          >
            Save limits
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
  const [revealed, setRevealed] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { setRevealed(false); onClose(); } }}>
      <DialogContent className="sm:max-w-sm rounded-4xl p-8 border border-slate-200/60 shadow-2xl">
        <DialogHeader className="mb-7">
          <div className="flex items-center gap-4">
            <div className="size-11 rounded-sm bg-slate-100 text-slate-700 flex items-center justify-center">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-slate-900">
                Card details
              </DialogTitle>
              <DialogDescription className="text-sm font-normal text-slate-500 mt-0.5">
                Sensitive information — never share
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
              Tap below to reveal your full card number and CVV.
            </p>
          </div>
        ) : (
          <div className="rounded-xl bg-slate-50 border border-slate-100 divide-y divide-slate-100 mb-7 overflow-hidden">
            <div className="px-5 py-4">
              <div className="text-xs font-medium uppercase text-slate-400 tracking-wider mb-1.5">
                Card number
              </div>
              <code className="font-mono font-semibold text-slate-900 text-lg tracking-widest">
                {isPrivate ? "•••• •••• •••• ••••" : `4532 8821 4409 ${card.last4}`}
              </code>
            </div>
            <div className="px-5 py-4">
              <div className="text-xs font-medium uppercase text-slate-400 tracking-wider mb-1.5">
                CVV
              </div>
              <code className="font-mono font-semibold text-slate-900 text-lg">
                {isPrivate ? "•••" : "742"}
              </code>
            </div>
            <div className="px-5 py-4">
              <div className="text-xs font-medium uppercase text-slate-400 tracking-wider mb-1.5">
                Expiry
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
              <Eye className="size-4 mr-2" /> Reveal details
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => { setRevealed(false); onClose(); }}
            className="w-full h-12 px-6 rounded-lg font-medium border-slate-200 text-slate-700"
          >
            {revealed ? "Close" : "Cancel"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function WalletPromoBanner({ onSetupWallet }: { onSetupWallet: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border py-6">
      <div className="flex items-start gap-3">
        <Smartphone className="size-5 shrink-0 text-muted-foreground mt-1" />
        <div>
          <h2 className="text-base font-semibold text-foreground">Apple Pay & Google Pay</h2>
          <p className="mt-1 text-sm text-muted-foreground">Pay with your ZapadBanka card. Wallet setup is a preview.</p>
        </div>
      </div>
      <Button variant="outline" onClick={onSetupWallet}>
        Set up wallet <ChevronRight className="size-4 ml-1" />
      </Button>
    </div>
  );
}

export function CardsPage() {
  const navigate = useNavigate();
  const { cardId } = useParams();
  const [cardParams, setCardParams] = useSearchParams();
  const cardAction = cardParams.get("action");
  const { isPrivate } = usePrivacy();
  const { profileSlug, isBusiness } = useAppProfile();

  const brandBg = isBusiness ? "bg-brand-business" : "bg-brand-personal";
  const brandHover = isBusiness ? "hover:bg-brand-business-dark" : "hover:bg-brand-personal-dark";
  const brandText = "text-white";

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
    catch (error) { toast.error(error instanceof Error ? error.message : "Could not save card settings"); return false; }
  };
  const toggleFreeze = (id: string) => saveCard(id,{frozen: !cards.find(c=>c.id===id)?.frozen});
  const updateLimits = (id: string, limits: CardData["limits"]) => saveCard(id,{limits});
  if (cardId && !cards.some(card => card.id === cardId)) return <div className="p-8 space-y-4"><h1 className="text-2xl font-semibold">Card not found</h1><p>This link does not belong to the selected profile or is no longer available.</p><Button variant="outline" onClick={() => navigate(`/${profileSlug}/cards`)}>Back to cards</Button></div>;


  return (
    <div className={cn(PAGE_MAX_WIDTH, "mx-auto p-6 md:p-8 space-y-8")}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-balance leading-none font-semibold tracking-tight text-slate-900">Cards</h1>
          <p className="text-base font-normal text-slate-500 mt-1.5">
            Manage your debit and credit cards · Preferences saved on this device
          </p>
        </div>
        <Button
          className={cn(brandBg, brandHover, brandText, "rounded-lg h-11 px-5 font-medium shadow-sm transition-all hover:shadow-md")}
          onClick={() => setPreview("order")}
        >
          <Plus className="size-4 mr-2" /> Order new card
        </Button>
      </div>

      <Dialog open={preview !== null} onOpenChange={open => !open && setPreview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{preview === "wallet" ? "Digital wallet" : "Order a card"}</DialogTitle>
            <DialogDescription>{preview === "wallet" ? "Wallet setup is a preview. Connecting a card to Apple Pay or Google Pay is not available in this prototype." : "Card ordering is not available in this prototype. Your existing cards and settings are available below."}</DialogDescription>
          </DialogHeader>
          <Button variant="outline" onClick={() => setPreview(null)}>Back to cards</Button>
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
                  <span className="shrink-0">Monthly spend</span>
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
                  {Math.round(spendPct)}% of monthly limit used
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 grid grid-cols-2 @2xs:grid-cols-4 gap-3">
                <Button
                  variant="outline"
                  onClick={() => setFreezeDialog(card.id)}
                  className={cn("h-auto flex-col gap-2.5 px-4 py-3.5 rounded-2xl border-slate-200 hover:bg-slate-50 font-medium transition-all hover:border-slate-300", card.frozen ? "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-50 hover:border-sky-300" : "text-slate-700")}
                >
                  <Snowflake className={cn("size-5", card.frozen ? "text-sky-500" : "")} />
                  <span className="text-xs">{card.frozen ? "Unfreeze" : "Freeze"}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setLimitsDialog(card.id)}
                  className="h-auto flex-col gap-2.5 px-4 py-3.5 rounded-2xl border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition-all hover:border-slate-300"
                >
                  <SlidersHorizontal className="size-5" />
                  <span className="text-xs">Limits</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDetailsDialog(card.id)}
                  className="h-auto flex-col gap-2.5 px-4 py-3.5 rounded-2xl border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition-all hover:border-slate-300"
                >
                  <Eye className="size-5" />
                  <span className="text-xs">Details</span>
                </Button>
                <Button variant="outline" aria-label={`Online payments ${card.onlineEnabled === false ? "off" : "on"} for ${card.type}${isPrivate ? "" : ` ending ${card.last4}`}`} onClick={() => setOnlineDialog(card.id)} className="h-auto flex-col gap-2.5 px-3 py-3.5 rounded-2xl"><Lock className="size-5"/><span className="text-xs">Online {card.onlineEnabled === false ? "off" : "on"}</span></Button>
              </div>

              {card.onlineEnabled === false && <p className="mt-3 text-sm text-muted-foreground">Online payments are off. Your saved online limit applies when you enable them again.</p>}

              {/* Limits summary */}
              <p className="mt-5 text-xs font-medium text-muted-foreground">Daily spending limits</p>
              <div className="mt-3 grid grid-cols-1 @md:grid-cols-2 gap-3">
                {[
                  { icon: Globe, label: "Online", value: card.limits.online },
                  { icon: ShoppingCart, label: "Contactless", value: card.limits.contactless },
                  { icon: Banknote, label: "ATM", value: card.limits.atm },
                  { icon: card.limits.international ? CheckCircle2 : Lock, label: "International", value: null, on: card.limits.international },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-2 min-w-0 px-3 py-3 rounded-xl bg-slate-50 border border-slate-100">
                      <Icon className={cn("size-3.5 shrink-0", item.on === false ? "text-rose-400" : item.on === true ? "text-emerald-500" : "text-slate-400")} />
                      <span className="text-xs font-normal text-slate-500">{item.label}</span>
                      <span className="ml-auto shrink-0 whitespace-nowrap text-xs font-semibold tabular-nums text-slate-700">
                        {item.value != null ? (isPrivate ? "•••" : formatMoney(item.value, "EUR", { decimals: Number.isInteger(item.value) ? 0 : 2 })) : (item.on ? "On" : "Off")}
                      </span>
                    </div>
                  );
                })}
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
          {onlineDialog === card.id && <OnlineDialog card={card} enabled={card.onlineEnabled ?? true} onClose={() => setOnlineDialog(null)} onSave={enabled => { if (saveCard(card.id, {onlineEnabled: enabled})) { setOnlineDialog(null); toast.success("Online payments updated", {description:"Demo preference saved on this device."}); } }}/>}
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
 const [draft, setDraft] = useState(enabled);
 return <Dialog open onOpenChange={open => !open && onClose()}><DialogContent><DialogHeader><DialogTitle>Online payments</DialogTitle><DialogDescription>{card.type} · •••• {card.last4}</DialogDescription></DialogHeader><p className="text-sm text-slate-600">Control internet and in-app purchases for this card. Spending limits are managed separately.</p><label className="flex items-center justify-between py-4"><span>Allow online payments</span><Switch aria-label="Allow online payments" checked={draft} onCheckedChange={setDraft}/></label>{card.frozen && <p className="text-sm text-slate-500">This card is frozen. Unfreeze it before making any payment.</p>}<div className="flex gap-3"><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={()=>onSave(draft)}>Save changes</Button></div></DialogContent></Dialog>;
}
