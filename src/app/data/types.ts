import type { ElementType } from "react";
import type { Icon as BankIcon } from "@phosphor-icons/react";

export type ProfileKind = "personal" | "business";
export type ProfileSlug = "personal" | "business";

export type Profile = {
  id: string;
  slug: ProfileSlug;
  kind: ProfileKind;
  name: string;
  /** Short name for greetings (e.g. "Alex", "Demo Corp") */
  greetingName: string;
  subtitle: string;
  initials: string;
};

export type BankAccount = {
  id: string;
  name: string;
  iban: string;
  ibanShort: string;
  balance: number;
  currency: string;
  type: string;
  gradient: string;
  textClass: string;
  accent: string;
};

export type Recipient = {
  currency: string;
  id: string;
  name: string;
  iban: string;
  initials: string;
  color: string;
  bank: string;
  lastSent: string;
};

export type Transaction = {
  id: string;
  merchant: string;
  meta: string;
  category: string;
  amount: number;
  currency: string;
  status: "Completed" | "Pending" | "Scheduled" | "Waiting for approval";
  icon: ElementType;
  iconBg: string;
  date: string;
};

export type SavingsGoal = {
  id: string;
  name: string;
  icon: BankIcon;
  iconBg: string;
  iconColor: string;
  current: number;
  target: number;
  deadline?: string;
  barColor: string;
};

export type InboxMessage = {
  id: number;
  type: "alert" | "info" | "success" | "warning";
  icon: BankIcon;
  iconColor: string;
  title: string;
  body: string;
  bodyAmount?: number;
  bodyRate?: number;
  time: string;
  unread: boolean;
  category: string;
  actionLabel?: string;
  actionPath?: string;
};

export type BankCard = {
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
};

export type PaymentAction = "send" | "receive" | "pay" | "transfer";
