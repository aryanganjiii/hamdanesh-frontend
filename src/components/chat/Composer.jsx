import { useEffect, useRef, useState } from "react";
import Icon from "../common/Icon.jsx";

const MAX_MESSAGE_CHARS = 1000;

export default function Composer({ busy, onSubmit }) {
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.style.height = "auto";
    inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
  }, [message]);

  async function submit(event) {
    event.preventDefault();
    if (!message.trim() || busy) return;
    const currentMessage = message;
    setMessage("");
    await onSubmit(currentMessage);
    inputRef.current?.focus();
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <form className="composer" onSubmit={submit}>
      <label className="sr-only" htmlFor="message-input">پیام خود را بنویسید</label>
      <textarea
        ref={inputRef}
        id="message-input"
        rows="1"
        maxLength={MAX_MESSAGE_CHARS}
        placeholder="از دانش سازمانی سؤال کنید…"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={handleKeyDown}
        required
      />
      <div className="composer-footer">
        <div className="composer-hint"><span className="keycap">Enter</span> برای ارسال <span className="hint-divider">·</span> <span className="keycap">Shift + Enter</span> برای خط جدید</div>
        <div className="composer-actions">
          <span>{new Intl.NumberFormat("fa-IR").format(message.length)} / ۱٬۰۰۰</span>
          <button className="send-button" disabled={busy || !message.trim()} type="submit"><span>ارسال</span><Icon name="send" size={15} /></button>
        </div>
      </div>
    </form>
  );
}
