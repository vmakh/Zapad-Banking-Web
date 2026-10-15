import { WarningCircleIcon as AlertCircle } from "@phosphor-icons/react/dist/csr/WarningCircle";
import { CheckCircleIcon as CheckCircle } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { InfoIcon as Info } from "@phosphor-icons/react/dist/csr/Info";
import { ChatTextIcon as MessageSquare } from "@phosphor-icons/react/dist/csr/ChatText";
import { ShieldWarningIcon as ShieldAlert } from "@phosphor-icons/react/dist/csr/ShieldWarning";
import { TrendUpIcon as TrendingUp } from "@phosphor-icons/react/dist/csr/TrendUp";
import type { InboxMessage, ProfileKind } from "./types";

const personalMessages: InboxMessage[] = [
  {
    id: 1,
    type: "alert",
    icon: AlertCircle,
    iconColor: "text-orange-600 bg-orange-50",
    title: "Sample device alert",
    body: "Example of a new-device alert for an iPhone 15 in Podgorica. No sign-in was detected; authentication is not connected in this demo.",
    time: "2 hours ago",
    unread: true,
    category: "Security",
    actionLabel: "Security help",
    actionPath: "settings",
  },
  {
    id: 2,
    type: "info",
    icon: Info,
    iconColor: "text-sky-700 bg-sky-50",
    title: "Your May sample statement is ready",
    body: "View the May 2026 sample statement. PDF export is unavailable.",
    time: "5 hours ago",
    unread: true,
    category: "Statements",
    actionLabel: "View",
    actionPath: "statements?account=p-main&month=2026-05",
  },
  {
    id: 3,
    type: "success",
    icon: CheckCircle,
    iconColor: "text-emerald-700 bg-emerald-50",
    title: "Transfer completed",
    body: "Sample transfer of {amount} to John Sample completed on May 7.",
    bodyAmount: 120,
    time: "Yesterday",
    unread: false,
    category: "Transactions",
    actionPath: "transactions",
  },
  {
    id: 4,
    type: "info",
    icon: TrendingUp,
    iconColor: "text-violet-700 bg-violet-50",
    title: "Sample savings rate",
    body: "The sample savings account uses an illustrative {rate}% APY. This is a demo value, not a current bank offer.",
    bodyRate: 1.8,
    time: "2 days ago",
    unread: false,
    category: "Savings",
    actionPath: "savings",
  },
  {
    id: 5,
    type: "info",
    icon: MessageSquare,
    iconColor: "text-brand-personal bg-blue-50",
    title: "Explore transfer previews",
    body: "Choose a recipient and review a transfer in Payments. Confirming saves a local preview; no money is sent.",
    time: "3 days ago",
    unread: false,
    category: "Updates",
  },
  {
    id: 6,
    type: "info",
    icon: Info,
    iconColor: "text-slate-700 bg-slate-50",
    title: "Sample maintenance notice",
    body: "Example service notice for May 15, 02:00 to 04:00. No maintenance is scheduled by this prototype.",
    time: "4 days ago",
    unread: false,
    category: "System",
  },
];

const businessMessages: InboxMessage[] = [
  {
    id: 1,
    type: "warning",
    icon: ShieldAlert,
    iconColor: "text-orange-600 bg-orange-50",
    title: "Sample invoice to review",
    body: "Review demo invoice INV-2034 for {amount} to Techno d.o.o. Any approval is a local preview; no payment is processed.",
    bodyAmount: 4820,
    time: "1 hour ago",
    unread: true,
    category: "Payments",
    actionLabel: "Review invoice",
    actionPath: "transactions?transaction=1",
  },
  {
    id: 2,
    type: "info",
    icon: Info,
    iconColor: "text-amber-600 bg-amber-50",
    title: "Sample statement ready",
    body: "View the May 2026 sample for your operating account. This is not an official tax document.",
    time: "3 hours ago",
    unread: true,
    category: "Statements",
    actionLabel: "View",
    actionPath: "statements?account=b-operating",
  },
  {
    id: 3,
    type: "success",
    icon: CheckCircle,
    iconColor: "text-emerald-700 bg-emerald-50",
    title: "Client payment received",
    body: "Sample payment of {amount} from Client · Alfa doo was credited to your Operating account on May 5.",
    bodyAmount: 4800,
    time: "Yesterday",
    unread: false,
    category: "Transactions",
    actionPath: "transactions",
  },
  {
    id: 4,
    type: "info",
    icon: TrendingUp,
    iconColor: "text-blue-700 bg-blue-50",
    title: "Illustrative credit line",
    body: "Explore a sample working capital credit line up to {amount} at {rate}% APR. No credit assessment or approval has taken place.",
    bodyAmount: 150000,
    bodyRate: 4.2,
    time: "2 days ago",
    unread: false,
    category: "Credit",
    actionLabel: "Learn more",
    actionPath: "loans",
  },
  {
    id: 5,
    type: "info",
    icon: MessageSquare,
    iconColor: "text-brand-business bg-orange-50",
    title: "Sample payroll summary",
    body: "Illustrative April 2026 payroll: {amount} for 4 employees. No salaries have been paid by this prototype.",
    bodyAmount: 8200,
    time: "3 days ago",
    unread: false,
    category: "Payroll",
  },
];

export function getInboxMessages(kind: ProfileKind): InboxMessage[] {
  return kind === "business" ? businessMessages : personalMessages;
}

export function getUnreadInboxCount(kind: ProfileKind): number {
  return getInboxMessages(kind).filter((m) => m.unread).length;
}

export const INBOX_CATEGORIES = [
  "All",
  "Security",
  "Transactions",
  "Statements",
  "Payments",
  "Tax",
  "Savings",
  "Updates",
  "System",
  "Credit",
  "Payroll",
  "Marketing",
] as const;
