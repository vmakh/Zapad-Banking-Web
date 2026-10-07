import { cn } from "../components/ui/utils";
import { BalanceHero } from "../components/zapad/BalanceHero";
import { useSearchParams } from "react-router";
import { Transactions } from "../components/zapad/Transactions";
import { AlertsCard, CardWidget } from "../components/zapad/RightPanel";
import { ExpenseAnalytics } from "../components/zapad/ExpenseAnalytics";
import { SavingsGoals } from "../components/zapad/SavingsGoals";
import { useAppProfile } from "../hooks/useAppProfile";
import { getAccounts, getPrimaryAccount } from "../data/accounts";
import { formatDashboardDate } from "../utils/date";
import { PAGE_MAX_WIDTH, profilePath } from "../utils/paths";

export function DashboardPage() {
  const { profile, profileSlug, isBusiness } = useAppProfile();
  const accounts = getAccounts(profile.kind);
  const [params, setParams] = useSearchParams();
  const primaryAccount = accounts.find(a => a.id === params.get("account")) ?? getPrimaryAccount(profile.kind);
  const activityHref = profilePath(profileSlug, `transactions?account=${encodeURIComponent(primaryAccount.id)}`);

  return (
    <div className={cn("dashboard-page", PAGE_MAX_WIDTH, "mx-auto space-y-5 md:space-y-6 p-3 md:p-5 lg:p-6")}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-balance-compact leading-tight font-medium tracking-tight mb-1.5">
            Good afternoon, {profile.greetingName}
          </h1>
          <p className="text-sm sm:text-base font-medium text-neutral-500">
            {isBusiness
              ? `You're managing ${profile.name}.`
              : "Here's your financial overview"}
          </p>
        </div>
        <div className="text-left sm:text-right text-sm font-medium shrink-0">
          <div className="font-medium text-slate-900">{formatDashboardDate()}</div>
          <div className="text-muted-foreground font-medium mt-0.5 flex items-center gap-1.5 sm:justify-end">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400" />
            </span>
            Demo workspace
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-dashboard lg:gap-6 lg:items-start">
        <div className="min-w-0">
          <BalanceHero
            isBusiness={isBusiness}
            primaryAccount={primaryAccount}
            profileKind={profile.kind}
            accounts={accounts}
            onAccountChange={id => setParams({account:id}, {replace:true})}
          />
        </div>
        <AlertsCard business={isBusiness} profileSlug={profileSlug} compact />
      </div>
      <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-dashboard lg:gap-6 lg:items-start">
        <div className="min-w-0 space-y-4 md:space-y-5">
          <Transactions
            key={primaryAccount.id}
            profileKind={profile.kind}
            account={primaryAccount}
            limit={5}
            viewAllHref={activityHref}
            compact
          />
          <SavingsGoals
            profileKind={profile.kind}
            profileSlug={profileSlug}
            maxGoals={2}
            viewAllHref={profilePath(profileSlug, "savings")}
            compact
          />
          <ExpenseAnalytics
            business={isBusiness}
            transactionsHref={profilePath(profileSlug, "transactions")}
            compact
          />

        </div>
        <div className="min-w-0">
          <CardWidget
            business={isBusiness}
            profileSlug={profileSlug}
            profileKind={profile.kind}
            compact
          />
        </div>
      </div>

      <footer className="pt-4 md:pt-6 pb-2 text-center text-xs sm:text-sm font-normal text-neutral-500">
        Independent concept · Simulated accounts and transactions
      </footer>
    </div>
  );
}
