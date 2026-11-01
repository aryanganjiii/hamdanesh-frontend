import Icon from "../common/Icon.jsx";

export default function ChatHistoryList({ conversations, activeConversationId, onSelect, onDelete }) {
  const savedConversations = conversations.filter((conversation) => conversation.messages.length > 0);

  if (!savedConversations.length) {
    return <p className="sidebar-empty chat-history-empty">گفت‌وگوهای قبلی اینجا نمایش داده می‌شوند.</p>;
  }

  return (
    <div className="chat-history-list">
      {savedConversations.map((conversation) => (
        <div className={`chat-history-item ${conversation.id === activeConversationId ? "active" : ""}`} key={conversation.id}>
          <button
            className="chat-history-select"
            onClick={() => onSelect(conversation.id)}
            type="button"
            title={conversation.title}
            aria-current={conversation.id === activeConversationId ? "page" : undefined}
          >
            <Icon name="history" size={14} className="chat-history-icon" />
            <span className="chat-history-title">{conversation.title}</span>
          </button>
          <button
            className="chat-history-delete"
            onClick={() => onDelete(conversation)}
            type="button"
            aria-label={`حذف گفت‌وگوی ${conversation.title}`}
            title="حذف گفت‌وگو"
          >×</button>
        </div>
      ))}
    </div>
  );
}
