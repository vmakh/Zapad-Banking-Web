import { useI18n } from "./i18n/I18nProvider";
import { useEffect } from "react";
import { createHashRouter, Navigate, useParams } from "react-router";
import { RootLayout } from "./components/layout/RootLayout";
import { ProfileRedirect } from "./components/routing/ProfileRedirect";
import { Button } from "./components/ui/button";

function RouteLoading() {
  const { t, intlLocale } = useI18n();
  return <main className="min-h-dvh grid place-items-center bg-background text-foreground"><p role="status">{t("Loading banking demo…")}</p></main>;
}

function RouteError() {
  const { t, intlLocale } = useI18n();
  return <main className="min-h-dvh flex flex-col items-center justify-center gap-6 p-8 bg-background text-foreground text-center">
    <h1 className="text-2xl font-semibold">{t("This screen couldn’t load")}</h1>
    <p>{t("Check your connection, then try again.")}</p>
    <Button onClick={() => window.location.reload()}>{t("Reload screen")}</Button>
    <Button variant="outline" asChild><a href="#/personal">{t("Back to demo home")}</a></Button>
  </main>;
}

function DesignSystemRedirect() {
  const {profile} = useParams();
  useEffect(()=>{window.location.replace(`/design-system.html?context=${profile === "business" ? "business" : profile === "personal" ? "personal" : "compare"}`);},[profile]);
  return <main className="min-h-screen grid place-items-center"><p role="status">Opening design system…</p></main>;
}

export const router = createHashRouter([
  { path: "/design-system", Component: DesignSystemRedirect },
  { path: "/:profile/design-system", Component: DesignSystemRedirect },
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
