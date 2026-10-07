import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getInboxMessages } from "../data/messages";
import type { InboxMessage, ProfileKind } from "../data/types";

type InboxContextValue = {
  messages: InboxMessage[];
  unreadCount: number;
  markRead: (id: number) => void;
  markAllRead: () => void;
  dismiss: (id: number) => void;
};

const InboxContext = createContext<InboxContextValue | null>(null);

export function InboxProvider({
  profileKind,
  children,
}: {
  profileKind: ProfileKind;
  children: ReactNode;
}) {
  const [messages, setMessages] = useState<InboxMessage[]>(() =>
    getInboxMessages(profileKind),
  );

  useEffect(() => {
    setMessages(getInboxMessages(profileKind));
  }, [profileKind]);

  const markRead = useCallback((id: number) => {
    setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, unread: false } : m)));
  }, []);

  const markAllRead = useCallback(() => {
    setMessages((ms) => ms.map((m) => ({ ...m, unread: false })));
  }, []);

  const dismiss = useCallback((id: number) => {
    setMessages((ms) => ms.filter((m) => m.id !== id));
  }, []);

  const unreadCount = useMemo(
    () => messages.filter((m) => m.unread).length,
    [messages],
  );

  const value = useMemo(
    () => ({
      messages,
      unreadCount,
      markRead,
      markAllRead,
      dismiss,
    }),
    [messages, unreadCount, markRead, markAllRead, dismiss],
  );

  return <InboxContext.Provider value={value}>{children}</InboxContext.Provider>;
}

export function useInbox() {
  const ctx = useContext(InboxContext);
  if (!ctx) throw new Error("useInbox must be used within InboxProvider");
  return ctx;
}
