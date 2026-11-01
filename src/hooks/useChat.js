import { useCallback, useEffect, useMemo, useState } from "react";
import { assistantApi } from "../api/client.js";

const STORAGE_KEY = "hamdanesh.conversations";
const LEGACY_STORAGE_KEY = "hamdanesh.messages";
const MAX_CONVERSATIONS = 40;
const MAX_MESSAGES_PER_CONVERSATION = 40;

function createId() {
  return globalThis.crypto?.randomUUID?.() || `chat-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function localTime() {
  return new Intl.DateTimeFormat("fa-IR", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tehran" }).format(new Date());
}

function titleFromMessages(messages) {
  const firstUserMessage = messages.find((message) => message.role === "user" && !message.error)?.content?.trim();
  if (!firstUserMessage) return "گفت‌وگوی تازه";
  const title = firstUserMessage.replace(/\s+/g, " ");
  return title.length > 34 ? `${title.slice(0, 34)}…` : title;
}

function normalizeMessages(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && ["user", "assistant"].includes(item.role) && typeof item.content === "string")
    .slice(-MAX_MESSAGES_PER_CONVERSATION);
}

function createConversation(messages = []) {
  const now = new Date().toISOString();
  const cleanMessages = normalizeMessages(messages);
  return {
    id: createId(),
    title: titleFromMessages(cleanMessages),
    createdAt: now,
    updatedAt: now,
    messages: cleanMessages,
  };
}

function normalizeConversation(value) {
  if (!value || typeof value !== "object") return null;
  const messages = normalizeMessages(value.messages);
  const id = typeof value.id === "string" && value.id ? value.id : createId();
  return {
    id,
    title: typeof value.title === "string" && value.title ? value.title : titleFromMessages(messages),
    createdAt: typeof value.createdAt === "string" ? value.createdAt : new Date().toISOString(),
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : new Date().toISOString(),
    messages,
  };
}

function readChatState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved && Array.isArray(saved.conversations)) {
      const conversations = saved.conversations.map(normalizeConversation).filter(Boolean).slice(0, MAX_CONVERSATIONS);
      if (conversations.length) {
        const activeId = conversations.some((conversation) => conversation.id === saved.activeConversationId)
          ? saved.activeConversationId
          : conversations[0].id;
        return { conversations, activeConversationId: activeId };
      }
    }

    // Migrate the single-chat storage used by the previous version.
    const legacyMessages = normalizeMessages(JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY) || "[]"));
    const conversation = createConversation(legacyMessages);
    return { conversations: [conversation], activeConversationId: conversation.id };
  } catch {
    const conversation = createConversation();
    return { conversations: [conversation], activeConversationId: conversation.id };
  }
}

function sortRecentFirst(conversations) {
  return [...conversations].sort((first, second) => second.updatedAt.localeCompare(first.updatedAt));
}

function updateConversation(state, conversationId, messages) {
  const now = new Date().toISOString();
  const existing = state.conversations.find((conversation) => conversation.id === conversationId);
  if (!existing) return state;
  const nextMessages = messages.slice(-MAX_MESSAGES_PER_CONVERSATION);
  return {
    ...state,
    conversations: sortRecentFirst(
      state.conversations.map((conversation) => conversation.id === conversationId
        ? {
            ...conversation,
            title: titleFromMessages(nextMessages),
            updatedAt: now,
            messages: nextMessages,
          }
        : conversation),
    ).slice(0, MAX_CONVERSATIONS),
  };
}

export function useChat() {
  const [chatState, setChatState] = useState(readChatState);
  const [busy, setBusy] = useState(false);

  const conversations = useMemo(() => sortRecentFirst(chatState.conversations), [chatState.conversations]);
  const activeConversation = conversations.find((conversation) => conversation.id === chatState.activeConversationId) || conversations[0];
  const messages = activeConversation?.messages || [];

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatState));
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // Keep the current session usable if browser storage is unavailable.
    }
  }, [chatState]);

  const sendMessage = useCallback(async (text) => {
    const message = text.trim();
    const conversationId = activeConversation?.id;
    if (!message || busy || !conversationId) return null;

    const previousMessages = activeConversation.messages;
    const history = previousMessages
      .filter((item) => !item.error)
      .slice(-12)
      .map(({ role, content }) => ({ role, content: content.slice(0, 1000) }));
    const userMessage = { role: "user", content: message, time: localTime() };

    setChatState((current) => updateConversation(current, conversationId, [...previousMessages, userMessage]));
    setBusy(true);
    try {
      const result = await assistantApi.sendMessage(message, history);
      setChatState((current) => {
        const conversation = current.conversations.find((item) => item.id === conversationId);
        if (!conversation) return current;
        return updateConversation(current, conversationId, [
          ...conversation.messages,
          {
            role: "assistant",
            content: result.answer,
            sources: result.sources || [],
            refused: result.refused,
            time: localTime(),
          },
        ]);
      });
      return result;
    } catch (error) {
      setChatState((current) => {
        const conversation = current.conversations.find((item) => item.id === conversationId);
        if (!conversation) return current;
        return updateConversation(current, conversationId, [
          ...conversation.messages,
          { role: "assistant", content: error.message, error: true, time: localTime() },
        ]);
      });
      return null;
    } finally {
      setBusy(false);
    }
  }, [activeConversation, busy]);

  const selectConversation = useCallback((conversationId) => {
    setChatState((current) => current.conversations.some((item) => item.id === conversationId)
      ? { ...current, activeConversationId: conversationId }
      : current);
  }, []);

  const newConversation = useCallback(() => {
    const current = chatState.conversations.find((item) => item.id === chatState.activeConversationId);
    if (current && current.messages.length === 0) return current.id;

    const conversation = createConversation();
    setChatState((previous) => ({
      activeConversationId: conversation.id,
      conversations: [conversation, ...previous.conversations].slice(0, MAX_CONVERSATIONS),
    }));
    return conversation.id;
  }, [chatState.activeConversationId, chatState.conversations]);

  const deleteConversation = useCallback((conversationId) => {
    setChatState((current) => {
      const remaining = current.conversations.filter((conversation) => conversation.id !== conversationId);
      if (remaining.length === 0) {
        const conversation = createConversation();
        return { conversations: [conversation], activeConversationId: conversation.id };
      }
      const activeConversationId = current.activeConversationId === conversationId
        ? sortRecentFirst(remaining)[0].id
        : current.activeConversationId;
      return { conversations: remaining, activeConversationId };
    });
  }, []);

  return {
    messages,
    busy,
    conversations,
    activeConversationId: activeConversation?.id || null,
    sendMessage,
    selectConversation,
    newConversation,
    deleteConversation,
  };
}
