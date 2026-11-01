import { useEffect, useRef } from "react";
import MessageItem from "./MessageItem.jsx";

export default function MessageList({ messages, busy, onSourceClick }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  return (
    <div className="conversation" aria-live="polite" aria-label="پیام‌های گفت‌وگو">
      {messages.map((message, index) => <MessageItem key={`${message.time}-${index}`} message={message} onSourceClick={onSourceClick} />)}
      {busy && (
        <article className="message assistant">
          <span className="message-avatar" aria-hidden="true">✦</span>
          <div className="message-bubble typing-indicator" aria-label="دستیار در حال پاسخ‌گویی است"><i /><i /><i /></div>
        </article>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
