import { createHashRouter, Navigate } from "react-router";
import { RootLayout } from "./components/layout/RootLayout";
import { ProfileRedirect } from "./components/routing/ProfileRedirect";

function RouteLoading() {
  return <main className="min-h-screen grid place-items-center bg-background text-foreground"><p role="status">Loading banking demo…</p></main>;
}

function RouteError() {
  return <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 bg-background text-foreground">
    <h1 className="text-2xl font-semibold">This screen couldn’t load</h1>
    <p>Check your connection, then try again.</p>
    <button className="rounded-lg border px-6 py-3" onClick={() => window.location.reload()}>Reload screen</button>
    <a className="underline" href="/cases/zapad-banka/">Return to the case study</a>
  </main>;
}

export const router = createHashRouter([
  { path: "/", element: <ProfileRedirect /> },
  {
    path: "/:profile",
    Component: RootLayout,
    HydrateFallback: RouteLoading,
    ErrorBoundary: RouteError,
    children: [
      { index: true, lazy: async () => ({ Component: (await import("./pages/DashboardPage")).DashboardPage }) },
      { path: "payments", lazy: async () => ({ Component: (await import("./pages/PaymentsPage")).PaymentsPage }) },
      { path: "accounts", lazy: async () => ({ Component: (await import("./pages/AccountsPage")).AccountsPage }) },
      { path: "accounts/:accountId", lazy: async () => ({ Component: (await import("./pages/AccountsPage")).AccountsPage }) },
      { path: "cards", lazy: async () => ({ Component: (await import("./pages/CardsPage")).CardsPage }) },
      { path: "cards/:cardId", lazy: async () => ({ Component: (await import("./pages/CardsPage")).CardsPage }) },
      { path: "exchange", lazy: async () => ({ Component: (await import("./pages/ExchangePage")).ExchangePage }) },
      { path: "loans", lazy: async () => ({ Component: (await import("./pages/LoansPage")).LoansPage }) },
      { path: "savings", lazy: async () => ({ Component: (await import("./pages/SavingsPage")).SavingsPage }) },
      { path: "savings/goals/:goalId", lazy: async () => ({ Component: (await import("./pages/SavingsPage")).SavingsPage }) },
      { path: "investments", lazy: async () => ({ Component: (await import("./pages/InvestmentsPage")).InvestmentsPage }) },
      { path: "statements", lazy: async () => ({ Component: (await import("./pages/StatementsPage")).StatementsPage }) },
      { path: "transactions", lazy: async () => ({ Component: (await import("./pages/TransactionsPage")).TransactionsPage }) },
      { path: "inbox", lazy: async () => ({ Component: (await import("./pages/InboxPage")).InboxPage }) },
      { path: "settings", lazy: async () => ({ Component: (await import("./pages/SettingsPage")).SettingsPage }) },
      { path: "help", lazy: async () => ({ Component: (await import("./pages/HelpPage")).HelpPage }) },
      { path: "money", element: <Navigate to="payments" replace /> },
      { path: "messages", element: <Navigate to="inbox" replace /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
