import Composer from "./Composer.jsx";
import MessageList from "./MessageList.jsx";
import Suggestions from "./Suggestions.jsx";

const formatNumber = (value) => new Intl.NumberFormat("fa-IR").format(value || 0);

export default function ChatPage({ messages, busy, stats, onSend, onSourceClick, hidden = false }) {
  const hasMessages = messages.length > 0;

  return (
    <section className="page chat-page" hidden={hidden}>
      <div className={`chat-column ${hasMessages || busy ? "has-messages" : ""}`}>
        <div className="chat-heading">
          <div className="eyebrow"><span className="sparkle">✦</span> دستیار دانشیار</div>
          <h1>سلام، چطور می‌تونم کمک کنم؟</h1>
          <p>از آیین‌نامه‌ها، فرایندها و اسناد سازمانی‌تان سؤال کنید.<br />پاسخ‌ها با ارجاع به منابع بارگذاری‌شده ارائه می‌شوند.</p>
          <div className="chat-stats">
            <span><i className="stat-icon">▤</i><strong>{formatNumber(stats.documents)}</strong> سند</span>
            <span className="stat-separator" />
            <span><i className="stat-icon">⌗</i><strong>{formatNumber(stats.chunks)}</strong> بخش دانشی</span>
            <span className="stat-separator" />
            <span><i className="stat-icon green">●</i>پاسخ مبتنی بر منبع</span>
          </div>
        </div>

        <MessageList messages={messages} busy={busy} onSourceClick={onSourceClick} />
        {!hasMessages && <Suggestions onSelect={onSend} />}
        <Composer busy={busy} onSubmit={onSend} />
        <p className="disclaimer">دستیار ممکن است اشتباه کند. برای تصمیم‌های مهم، متن سند اصلی را بررسی کنید.</p>
      </div>
    </section>
  );
}
