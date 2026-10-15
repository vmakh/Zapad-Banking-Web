import { useI18n } from "../../i18n/I18nProvider";
import bankMark from "../../../assets/zapad-mark.png";
import { cn } from "../ui/utils";
import { ContactlessPaymentIcon } from "@phosphor-icons/react/dist/csr/ContactlessPayment";
interface PaymentCardProps {
  name: string;
  last4: string;
  expiry: string;
  holder?: string;
  isPrivate?: boolean;
  frozen?: boolean;
}

/** Mobile CardArtwork identity, composed for a bounded desktop card. */
export function PaymentCard({name, last4, expiry, holder, isPrivate = false, frozen = false}: PaymentCardProps) {
  const { t } = useI18n();
  const business = /business/i.test(name);
  const virtual = /virtual/i.test(name);
  const visa = name.startsWith("Visa");
  return <div data-bank-profile={business ? "business" : "personal"} aria-label={t(name)} className={cn("payment-card min-h-48 max-w-sm mx-auto", business && "payment-card--copper", virtual && "payment-card--blue", frozen && "is-frozen")}>
    <img src={bankMark} alt="" aria-hidden="true" className="payment-card-motif" />
    <div className="payment-card-top">
      <strong className="flex items-center gap-2 min-w-0"><img src={bankMark} alt="" aria-hidden="true" className="h-7 w-6 object-contain brightness-0 invert"/><span>Zapad Banka</span></strong>
      <span>{t(frozen ? "Frozen" : virtual ? "Virtual" : business ? "Business" : "Personal")}</span>
    </div>
    <div className="payment-card-middle"><ContactlessPaymentIcon aria-hidden="true" weight="regular"/><span className="text-xs tracking-widest uppercase">{t(name)}</span></div>
    <div className="payment-card-bottom"><p className="payment-card-number">•••• {isPrivate ? "••••" : last4}</p>{visa ? <b className="payment-card-visa" aria-label={t("Visa")}>VISA</b> : <span className="payment-card-mastercard" aria-label={t("Mastercard")}><i/><i/></span>}</div>
    <div className="flex items-end justify-between gap-3 text-xs uppercase tracking-wide"><span className="min-w-0 break-words">{isPrivate ? "•••• ••••" : holder}</span><span className="shrink-0">{isPrivate ? "••/••" : expiry}</span></div>
  </div>;
}
