import { useI18n } from "../i18n/I18nProvider";
import { localizedMessageBody } from "../i18n/display";
import { usePrivacy } from "../contexts/PrivacyContext";
import { maskMoneyInText } from "../utils/privacyText";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { BellSlashIcon as BellOff } from "@phosphor-icons/react/dist/csr/BellSlash";
import { TrashIcon as Trash2 } from "@phosphor-icons/react/dist/csr/Trash";
import { toast } from "sonner";
import { cn } from "../components/ui/utils";
import { useAppProfile } from "../hooks/useAppProfile";
import { useInbox } from "../contexts/InboxContext";
import { INBOX_CATEGORIES } from "../data/messages";
import type { InboxMessage } from "../data/types";
import { PAGE_MAX_WIDTH, profilePath } from "../utils/paths";

export function InboxPage() {
  const { t } = useI18n();
  const { profile, profileSlug } = useAppProfile();
  const navigate = useNavigate();
  const { isPrivate } = usePrivacy();
  const [searchParams] = useSearchParams();
  const unreadOnly = searchParams.get("filter") === "unread";

  const { messages, unreadCount, markRead, markAllRead, dismiss } = useInbox();

  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    setActiveCategory("All");
  }, [profile.kind]);

  const availableCategories = useMemo(
    () =>
      INBOX_CATEGORIES.filter(
        (c) => c === "All" || messages.some((m) => m.category === c && (!unreadOnly || m.unread)),
      ),
    [messages, unreadOnly],
  );
  const selectedCategory = availableCategories.some(category => category === activeCategory) ? activeCategory : "All";

  const filtered = useMemo(() => {
    let list = selectedCategory === "All" ? messages : messages.filter((m) => m.category === selectedCategory);
    if (unreadOnly) list = list.filter((m) => m.unread);
    return list;
  }, [messages, selectedCategory, unreadOnly]);

  const handleMarkAllRead = () => {
    markAllRead();
    toast.success(t("All messages marked as read"));
  };

  const handleDismiss = (id: number) => {
    dismiss(id);
    toast.info(t("Message dismissed"));
  };

  const handleAction = (message: InboxMessage) => {
    markRead(message.id);
    if (message.actionPath) {
      navigate(profilePath(profileSlug, message.actionPath));
    }
  };

  return (
    <div className={cn(PAGE_MAX_WIDTH, "mx-auto p-6 md:p-8 space-y-8")}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-balance leading-none font-semibold tracking-tight text-slate-900">
            {t("Inbox")}
          </h1>
          <p className="text-base font-normal text-slate-500 mt-1.5">
            {unreadOnly ? t("Unread sample notifications") : t("Sample notifications and alerts. No live banking activity.")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {unreadCount > 0 && (
            <Badge variant="secondary" className="h-8 px-4 rounded-full font-semibold">
              {t("{count} new", { count: unreadCount })}
            </Badge>
          )}
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={handleMarkAllRead}
              className="h-9 rounded-lg border-slate-200 font-medium text-slate-600 text-sm hover:bg-slate-50"
            >
              {t("Mark all read")}
            </Button>
          )}
        </div>
      </div>

      {unreadOnly && (
        <p className="text-sm font-normal text-slate-500">
          {t("Showing unread only.")}{" "}
          <Link to={profilePath(profileSlug, "inbox")} className="text-primary-text font-medium hover:underline">
            {t("View all messages")}
          </Link>
        </p>
      )}

      <div role="group" aria-label={t("Filter messages by category")} className="flex gap-2 flex-wrap">
        {availableCategories.map((cat) => (
          <Button
            key={t(cat)}
            type="button"
            variant="ghost"
            aria-pressed={selectedCategory === cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-3 border font-medium",
              selectedCategory === cat
                ? "bg-accent text-accent-foreground border-primary"
                : "bg-card border-border text-muted-foreground hover:bg-muted",
            )}
          >
            {t(cat)}
            {cat !== "All" && (
              <span className="ml-1.5">
                {messages.filter((m) => m.category === cat && (!unreadOnly || m.unread)).length}
              </span>
            )}
          </Button>
        ))}
      </div>

      <Card className="border-slate-200/60 bg-white divide-y divide-slate-50 rounded-4xl overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div role="status" className="px-6 py-12 text-center space-y-3">
            <BellOff className="size-10 text-muted-foreground mx-auto" aria-hidden="true" />
            <h2>{unreadOnly ? t("You're all caught up") : t("No messages in this view")}</h2>
            <p className="text-sm text-muted-foreground">{unreadOnly ? t("There are no unread sample messages.") : t("This demo has no more messages to show.")}</p>
            {messages.length > 0 && <Button variant="outline" onClick={() => { setActiveCategory("All"); navigate(profilePath(profileSlug, "inbox")); }}>{t("View all messages")}</Button>}
          </div>
        ) : (
          filtered.map((message) => {
            const Icon = message.icon;
            return (
              <article
                key={message.id}
                className={cn(
                  "p-4 sm:p-6 transition-colors",
                  message.unread ? "bg-accent/40" : "bg-card",
                )}
              >
                <div className="flex gap-3 sm:gap-5">
                  <div data-slot="functional-icon" className={cn("hidden sm:flex size-10 rounded-lg items-center justify-center shrink-0", message.iconColor)}>
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className={cn("font-semibold", message.unread ? "text-slate-900" : "text-slate-700")}>
                          {t(message.title)}
                        </h3>
                        {message.unread && <span className="size-2 rounded-full bg-primary shrink-0"><span className="sr-only">{t("Unread")}</span></span>}
                        <span className="text-xs font-medium text-muted-foreground">
                          {t(message.category)}
                        </span>
                      </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDismiss(message.id)}
                          aria-label={t("Dismiss message: {title}", { title: t(message.title) })}
                          className="size-11 shrink-0 text-muted-foreground"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{t(message.time)}</p>
                    <p className="text-sm font-normal text-slate-500 leading-relaxed">{isPrivate ? maskMoneyInText(localizedMessageBody(message)) : localizedMessageBody(message)}</p>
                    {(message.unread || message.actionLabel) && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {message.actionLabel && (
                          <Button variant="outline"
                            size="sm"
                            onClick={() => handleAction(message)}
                            className="font-medium"
                          >
                            {t(message.actionLabel)}
                          </Button>
                        )}
                        {message.unread && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markRead(message.id)}
                            className="h-9 rounded-sm font-medium text-xs text-slate-500 hover:text-slate-800"
                          >
                            {t("Mark as read")}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </Card>

      <p role="status" className="text-center text-sm text-muted-foreground">{t("Showing {shown} of {total} sample messages", { shown: filtered.length, total: messages.length })}</p>
    </div>
  );
}
