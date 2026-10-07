import { readDemo, writeDemo } from "../utils/demoStorage";
import type { BankCard, ProfileKind } from "./types";

let personalCards: BankCard[] = [
  {
    id: "p1",
    type: "Visa Platinum",
    gradient: "from-[#141519] to-[#141519]",
    textClass: "text-white",
    last4: "4821",
    expiry: "12/28",
    holder: "A. DEMO",
    monthlySpend: 2184,
    monthlyLimit: 8000,
    frozen: false,
    limits: { online: 2000, contactless: 500, atm: 500, international: true },
  },
  {
    id: "p2",
    type: "Mastercard Gold",
    gradient: "from-[#141519] to-[#141519]",
    textClass: "text-white",
    last4: "9013",
    expiry: "08/27",
    holder: "A. DEMO",
    monthlySpend: 842,
    monthlyLimit: 5000,
    frozen: false,
    limits: { online: 1000, contactless: 300, atm: 200, international: false },
  },
];

let businessCards: BankCard[] = [
  {
    id: "b1",
    type: "Business Platinum",
    gradient: "from-[#141519] to-[#141519]",
    textClass: "text-white",
    last4: "1102",
    expiry: "09/27",
    holder: "DEMO CORP",
    monthlySpend: 8420,
    monthlyLimit: 20000,
    frozen: false,
    limits: { online: 5000, contactless: 2000, atm: 1000, international: true },
  },
  {
    id: "b2",
    type: "Virtual Business",
    gradient: "from-[#141519] to-[#141519]",
    textClass: "text-white",
    last4: "7711",
    expiry: "05/28",
    holder: "DEMO CORP",
    monthlySpend: 2180,
    monthlyLimit: 10000,
    frozen: false,
    limits: { online: 3000, contactless: 1000, atm: 500, international: false },
  },
];

type CardPreferences = Pick<BankCard, "frozen" | "onlineEnabled" | "limits">;
function validLimits(value: unknown): value is BankCard["limits"] {
 if (!value || typeof value !== "object" || Array.isArray(value)) return false;
 const limits = value as Record<string, unknown>;
 return [limits.online, limits.contactless, limits.atm].every(n =>
  typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= 1000000
  && /^\d+(\.\d{1,2})?$/.test(String(n))) && typeof limits.international === "boolean";
}

const loaded = new Set<ProfileKind>();
export function getCards(kind: ProfileKind): BankCard[] {
  if (!loaded.has(kind)) {
    const stored = readDemo<unknown>("cards:"+kind, []);
    const hydrate = (cards: BankCard[]) => cards.map(card => {
      const saved = Array.isArray(stored) ? stored.find(c => c?.id === card.id) : null;
      if (!saved) return card;
      const limits=saved.limits;
      return {...card, frozen:typeof saved.frozen==="boolean"?saved.frozen:card.frozen, onlineEnabled:typeof saved.onlineEnabled==="boolean"?saved.onlineEnabled:card.onlineEnabled,limits:validLimits(limits)?limits:card.limits};
    });
    if(kind==="business") businessCards=hydrate(businessCards);else personalCards=hydrate(personalCards);
    loaded.add(kind);
  }
  return kind === "business" ? businessCards : personalCards;
}

export function getCardById(kind: ProfileKind, id: string): BankCard | undefined {
  return getCards(kind).find((c) => c.id === id);
}

export function getPrimaryCard(kind: ProfileKind): BankCard {
  return getCards(kind)[0];
}

export function updateCard(kind: ProfileKind, id: string, changes: Partial<CardPreferences>) {
 const cards = getCards(kind);
 if (!cards.some(card => card.id === id)) throw new Error("This card no longer exists.");
 if (!changes || typeof changes !== "object" || Object.keys(changes).some(key => !["frozen", "onlineEnabled", "limits"].includes(key))
  || ("frozen" in changes && typeof changes.frozen !== "boolean")
  || ("onlineEnabled" in changes && typeof changes.onlineEnabled !== "boolean")
  || ("limits" in changes && !validLimits(changes.limits))) throw new Error("Card settings are invalid. Check the limits and try again.");
 const next = cards.map(card => card.id === id ? {...card, ...changes} : card);
 if (!writeDemo("cards:"+kind,next.map(({id,frozen,onlineEnabled,limits})=>({id,frozen,onlineEnabled,limits})))) throw new Error("Your browser could not save card settings. Allow local storage and try again.");
 if (kind === "business") businessCards = next; else personalCards = next;
 return next;
}
