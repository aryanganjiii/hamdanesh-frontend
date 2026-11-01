import Icon from "../common/Icon.jsx";

export default function MessageItem({ message, onSourceClick }) {
  return (
    <article className={`message ${message.role}`}>
      <span className="message-avatar" aria-hidden="true">{message.role === "user" ? "ش" : <Icon name="sparkles" size={15} />}</span>
      <div className="message-body">
        <div className="message-name">{message.role === "user" ? "شما" : "دستیار دانشیار"}</div>
        <div className={`message-bubble ${message.error ? "message-error" : ""}`}>{message.content}</div>
        {message.role === "assistant" && message.sources?.length > 0 && (
          <div className="message-sources">
            {message.sources.map((source, index) => (
              <button className="source-chip" key={`${source.chunk_id}-${index}`} onClick={() => onSourceClick(message.sources)} type="button">
                [{new Intl.NumberFormat("fa-IR").format(index + 1)}] {source.title}
              </button>
            ))}
          </div>
        )}
        <div className="message-time">{message.time}</div>
      </div>
    </article>
  );
}
