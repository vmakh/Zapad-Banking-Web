import { GoalDialog } from "./GoalDialog";
import { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { Plus, ChevronRight, Target } from "lucide-react";
import { useGoals } from "../../data/goals";
import type { ProfileKind, ProfileSlug, SavingsGoal } from "../../data/types";
import { usePrivacy } from "../../contexts/PrivacyContext";
import { formatMoney } from "../../utils/format";
import { cn } from "../ui/utils";
import { IconScaleSlot } from "./IconScaleSlot";

function GoalCard({
  goal,
  isPrivate,
  onClick,
}: {
  goal: SavingsGoal;
  isPrivate: boolean;
  onClick: () => void;
}) {
  const progress = Math.min((goal.current / goal.target) * 100, 100);
  const Icon = goal.icon;
  const remaining = goal.target - goal.current;

  return (
    <button
      onClick={onClick}
      className="text-left p-4 sm:p-5 rounded-xl bg-slate-50/80 border border-slate-200/60 hover:bg-white hover:border-slate-300 hover:shadow-md transition-surface-shadow duration-300 group w-full min-w-0"
    >
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <IconScaleSlot
            className="size-10 shrink-0 rounded-action"
            innerClassName={`${goal.iconBg} ${goal.iconColor} shadow-sm`}
          >
            <Icon className="size-5" />
          </IconScaleSlot>
          <div className="min-w-0">
            <div className="font-medium text-slate-900 leading-snug break-words">
              {goal.name}
            </div>
            {goal.deadline && (
              <div className="text-xs font-normal text-slate-400 mt-0.5">
                Target: {goal.deadline}
              </div>
            )}
          </div>
        </div>
        <ChevronRight className="size-4 text-slate-300 group-hover:text-slate-500 transition-colors mt-1 shrink-0" />
      </div>

      <div className="space-y-2.5">
        <div className="flex flex-wrap justify-between items-end gap-x-3 gap-y-1 min-w-0">
          <span className="text-2xl font-semibold text-slate-900 tracking-tight break-words min-w-0">
            {isPrivate
              ? "•••"
              : formatMoney(goal.current, "EUR")}
          </span>
          <span className="text-sm font-medium text-slate-400">
            {isPrivate
              ? "/ •••"
              : `/ ${formatMoney(goal.target, "EUR")}`}
          </span>
        </div>

        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-slate-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
          />
        </div>

        <div className="flex flex-wrap justify-between items-center gap-2">
          <span className="text-xs font-medium text-slate-500">
            {Math.round(progress)}% saved
          </span>
          {!isPrivate && (
            <span className="text-xs font-normal text-slate-400">
              {formatMoney(remaining, "EUR", { decimals: 0 })} to go
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export function SavingsGoals({
  profileKind,
  profileSlug,
  maxGoals,
  viewAllHref,
  compact = false,
}: {
  profileKind: ProfileKind;
  profileSlug: ProfileSlug;
  maxGoals?: number;
  viewAllHref?: string;
  compact?: boolean;
}) {
  const { isPrivate } = usePrivacy();
  const business = profileKind === "business";
  const allGoals = useGoals(profileKind);
  const goals = maxGoals ? allGoals.slice(0, maxGoals) : allGoals;
  const brandColor = business ? "bg-brand-business" : "bg-brand-personal";
  const brandText = "text-white";
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [creating, setCreating] = useState(false);

  const totalSaved = allGoals.reduce((s, g) => s + g.current, 0);
  const totalTarget = allGoals.reduce((s, g) => s + g.target, 0);
  const overallProgress = totalTarget ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <>
      <div className={cn("@container min-w-0", compact ? "space-y-4" : "space-y-5")}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight flex items-center gap-2.5">
              <div
                className="size-8 shrink-0 rounded-action-inner bg-muted text-muted-foreground flex items-center justify-center"
              >
                <Target className="size-4" />
              </div>
              Savings Goals
            </h2>
            <p className="text-sm font-normal text-slate-400 mt-1">
              {allGoals.length} active goals ·{" "}
              {isPrivate ? "••• overall" : `${overallProgress}% overall`}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {viewAllHref && (
              <Button variant="ghost" className={cn("font-medium text-slate-600", compact ? "h-9 px-3 text-sm" : "h-10 px-5")} asChild>
                <Link to={viewAllHref}>
                  View all <ChevronRight className="size-4 ml-1" />
                </Link>
              </Button>
            )}
            <Button
              variant="outline"
              type="button"
              className={cn(
                "rounded-lg font-medium shadow-sm transition-all hover:shadow-md zb-hover-lift",
                compact ? "h-9 px-3 text-sm" : "h-10 px-5",
                brandColor,
                brandText,
              )}
              onClick={() => setCreating(true)}
            >
              <Plus className="size-4 mr-1.5" />
              New goal
            </Button>
          </div>
        </div>

        <div className={cn("grid grid-cols-1 gap-4 @xl:grid-cols-2", !compact && "@4xl:grid-cols-3")}>
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              isPrivate={isPrivate}
              onClick={() => setSelectedGoal(goal)}
            />
          ))}
        </div>
      </div>

      {(selectedGoal || creating) && <GoalDialog kind={profileKind} goalId={selectedGoal?.id} onClose={() => { setSelectedGoal(null); setCreating(false); }} />}
    </>
  );
}
