import { usePrivacy } from "../contexts/PrivacyContext";
import { maskMoneyInText } from "../utils/privacyText";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { BellOff, ChevronDown, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "../components/ui/utils";
import { useAppProfile } from "../hooks/useAppProfile";
import { useInbox } from "../contexts/InboxContext";
import { INBOX_CATEGORIES } from "../data/messages";
import type { InboxMessage } from "../data/types";
import { PAGE_MAX_WIDTH, profilePath } from "../utils/paths";

export function InboxPage() {
  const { profile, profileSlug, isBusiness } = useAppProfile();
  const navigate = useNavigate();
  const { isPrivate } = usePrivacy();
  const [searchParams] = useSearchParams();
  const unreadOnly = searchParams.get("filter") === "unread";

  const { messages, unreadCount, markRead, markAllRead, dismiss } = useInbox();

  const brandBg = isBusiness ? "bg-brand-business" : "bg-brand-personal";
  const brandText = "text-white";

  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    setActiveCategory("All");
  }, [profile.kind]);

  const availableCategories = useMemo(
    () =>
      INBOX_CATEGORIES.filter(
        (c) => c === "All" || messages.some((m) => m.category === c),
      ),
    [messages],
  );

  const filtered = useMemo(() => {
    let list = activeCategory === "All" ? messages : messages.filter((m) => m.category === activeCategory);
    if (unreadOnly) list = list.filter((m) => m.unread);
    return list;
  }, [messages, activeCategory, unreadOnly]);

  const handleMarkAllRead = () => {
    markAllRead();
    toast.success("All messages marked as read");
  };

  const handleDismiss = (id: number) => {
    dismiss(id);
    toast.info("Message dismissed");
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
            Inbox
          </h1>
          <p className="text-base font-normal text-slate-500 mt-1.5">
            {unreadOnly ? "Unread notifications" : "Important notifications and alerts"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Badge variant="secondary" className="h-8 px-4 rounded-full font-semibold">
              {unreadCount} new
            </Badge>
          )}
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={handleMarkAllRead}
              className="h-9 rounded-lg border-slate-200 font-medium text-slate-600 text-sm hover:bg-slate-50"
            >
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {unreadOnly && (
        <p className="text-sm font-normal text-slate-500">
          Showing unread only.{" "}
          <Link to={profilePath(profileSlug, "inbox")} className="text-blue-600 font-medium hover:underline">
            View all messages
          </Link>
        </p>
      )}

      <div className="flex gap-2 flex-wrap">
        {availableCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              activeCategory === cat
                ? "bg-muted text-foreground border border-border"
                : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
            )}
          >
            {cat}
            {cat !== "All" && (
              <span className="ml-1.5">
                {messages.filter((m) => m.category === cat).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <Card className="border-slate-200/60 bg-white divide-y divide-slate-50 rounded-4xl overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="px-8 py-16 text-center">
            <BellOff className="size-10 text-slate-300 mx-auto mb-3" />
            <p className="font-medium text-slate-400">No messages in this view</p>
          </div>
        ) : (
          filtered.map((message) => {
            const Icon = message.icon;
            return (
              <div
                key={message.id}
                className={cn(
                  "p-6 md:p-8 transition-colors group",
                  message.unread ? "bg-blue-50/40 hover:bg-blue-50/60" : "hover:bg-slate-50/50",
                )}
              >
                <div className="flex gap-3 sm:gap-5">
                  <div className={cn("size-12 rounded-md flex items-center justify-center shrink-0 shadow-sm", message.iconColor)}>
                    <Icon className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className={cn("font-semibold", message.unread ? "text-slate-900" : "text-slate-700")}>
                          {message.title}
                        </h3>
                        {message.unread && <span className="size-2 rounded-full bg-blue-500 shrink-0" />}
                        <span className="text-xs font-medium text-slate-400 px-2.5 py-1 rounded-full bg-slate-100">
                          {message.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-xs font-normal text-slate-400 hidden sm:block">{message.time}</span>
                        <button
                          type="button"
                          onClick={() => handleDismiss(message.id)}
                          aria-label="Dismiss message"
                          className="size-8 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-500 hover:bg-slate-100 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 transition-all"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-normal text-slate-500 leading-relaxed">{isPrivate ? maskMoneyInText(message.body) : message.body}</p>
                    {(message.unread || message.actionLabel) && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {message.actionLabel && (
                          <Button variant="outline"
                            size="sm"
                            onClick={() => handleAction(message)}
                            className={cn("h-9 rounded-sm font-medium text-xs shadow-sm", brandBg, brandText)}
                          >
                            {message.actionLabel}
                          </Button>
                        )}
                        {message.unread && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markRead(message.id)}
                            className="h-9 rounded-sm font-medium text-xs text-slate-500 hover:text-slate-800"
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </Card>

      <div className="flex justify-center">
        <Button
          variant="outline"
          className="rounded-lg h-11 border-slate-200 font-medium text-slate-600 hover:bg-slate-50 gap-2"
          onClick={() => {
            setActiveCategory("All");
            toast.success("Showing all messages");
          }}
        >
          <ChevronDown className="size-4" /> Load older messages
        </Button>
      </div>
    </div>
  );
}
