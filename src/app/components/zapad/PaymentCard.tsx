import bankMark from "../../../assets/zapad-mark.png";
import { cn } from "../ui/utils";
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
  const business = /business/i.test(name);
  const virtual = /virtual/i.test(name);
  const visa = name.startsWith("Visa");
  return <div data-bank-profile={business ? "business" : "personal"} aria-label={name} className={cn("payment-card min-h-48 max-w-sm mx-auto", business && "payment-card--copper", virtual && "payment-card--blue", frozen && "is-frozen")}>
    <img src={bankMark} alt="" aria-hidden="true" className="payment-card-motif" />
    <div className="payment-card-top">
      <strong className="flex items-center gap-2 min-w-0"><img src={bankMark} alt="" aria-hidden="true" className="h-7 w-6 object-contain brightness-0 invert"/><span>Zapad Banka</span></strong>
      <span>{frozen ? "Frozen" : virtual ? "Virtual" : business ? "Business" : "Personal"}</span>
    </div>
    <div className="payment-card-middle"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 9a6 6 0 0 1 0 6M8 6a12 12 0 0 1 0 12M12 3a18 18 0 0 1 0 18M16 1a22 22 0 0 1 0 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg><span className="text-xs tracking-widest uppercase">{name}</span></div>
    <div className="payment-card-bottom"><p className="payment-card-number">•••• {isPrivate ? "••••" : last4}</p>{visa ? <b className="payment-card-visa" aria-label="Visa">VISA</b> : <span className="payment-card-mastercard" aria-label="Mastercard"><i/><i/></span>}</div>
    <div className="flex items-end justify-between gap-3 text-xs uppercase tracking-wide"><span className="min-w-0 break-words">{isPrivate ? "•••• ••••" : holder}</span><span className="shrink-0">{isPrivate ? "••/••" : expiry}</span></div>
  </div>;
}
