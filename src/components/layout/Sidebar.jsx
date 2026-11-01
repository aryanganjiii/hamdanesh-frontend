import { useState } from "react";
import Icon from "../common/Icon.jsx";
import ChatHistoryList from "../chat/ChatHistoryList.jsx";

export default function Sidebar({
  page,
  onPageChange,
  onUploadClick,
  documents,
  health,
  onAbout,
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  onNewChat,
}) {
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);
  const providerReady = health.ai_enabled && health.provider_configured;

  function selectConversation(conversationId) {
    onSelectConversation(conversationId);
    onPageChange("chat");
    setMobileHistoryOpen(false);
  }

  function deleteConversation(conversation) {
    onDeleteConversation(conversation);
  }

  return (
    <aside className="sidebar" aria-label="ناوبری اصلی">
      <a className="brand" href="#home" onClick={(event) => { event.preventDefault(); onPageChange("chat"); }}>
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 40 40" fill="none"><path d="M20 4 34 12v16L20 36 6 28V12L20 4Z" fill="currentColor" opacity=".14"/><path d="M13 15.5h14M13 20h14M13 24.5h9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/><circle cx="29" cy="27" r="4" fill="#fff"/><path d="m27.5 27 1 1 2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
        <span className="brand-copy"><strong>هم‌دانش</strong><small>دستیار سازمانی</small></span>
      </a>

      <button className="workspace-switcher" type="button" aria-label="فضای سازمان نمونه">
        <span className="org-avatar">س</span>
        <span className="workspace-copy"><strong>سازمان نمونه</strong><small>فضای دانش شما</small></span>
        <Icon name="chevron" size={16} className="chevron" />
      </button>

      <div className="nav-label">فضای کار</div>
      <nav className="primary-nav">
        <button className={`nav-item ${page === "chat" ? "active" : ""}`} onClick={() => onPageChange("chat")} type="button">
          <Icon name="sparkles" size={18} className="nav-icon" /><span>دستیار هوشمند</span><kbd>⌘ 1</kbd>
        </button>
        <button className={`nav-item ${page === "documents" ? "active" : ""}`} onClick={() => onPageChange("documents")} type="button">
          <Icon name="book" size={18} className="nav-icon" /><span>مدیریت اسناد</span><span className="nav-count">{new Intl.NumberFormat("fa-IR").format(documents.length)}</span>
        </button>
        <button className="nav-item mobile-history-trigger" onClick={() => setMobileHistoryOpen(true)} type="button" aria-label="نمایش تاریخچه‌ی گفتگوها">
          <Icon name="history" size={18} className="nav-icon" /><span>تاریخچه‌ی گفتگوها</span>
        </button>
      </nav>

      <div className="sidebar-divider" />
      <div className="nav-label nav-label-row"><span>دانش سازمانی</span><button className="icon-button small" onClick={onUploadClick} type="button" title="افزودن سند" aria-label="افزودن سند"><Icon name="plus" size={16} /></button></div>
      <div className="sidebar-documents">
        {documents.length ? documents.slice(0, 7).map((document) => (
          <button className="sidebar-doc" key={document.id} onClick={() => onPageChange("documents")} type="button" title={document.filename}>
            <Icon name="book" size={14} className="sidebar-doc-icon" /><span className="sidebar-doc-title">{document.title}</span>
          </button>
        )) : <p className="sidebar-empty">هنوز سندی اضافه نشده</p>}
        {documents.length > 7 && <button className="sidebar-doc" type="button" onClick={() => onPageChange("documents")}>مشاهده‌ی اسناد بیشتر</button>}
      </div>

      <div className="sidebar-divider history-divider" />
      <section className="sidebar-history-section" aria-label="تاریخچه‌ی گفتگوها">
        <div className="nav-label nav-label-row">
          <span>گفت‌وگوهای اخیر</span>
          <button className="icon-button small" onClick={onNewChat} type="button" title="گفت‌وگوی تازه" aria-label="گفت‌وگوی تازه"><Icon name="plus" size={16} /></button>
        </div>
        <ChatHistoryList
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelect={selectConversation}
          onDelete={deleteConversation}
        />
      </section>

      <div className="sidebar-spacer" />
      <div className="sidebar-status"><span className={`status-dot ${providerReady ? "ready" : ""}`} /><span>{providerReady ? "سرویس هوش مصنوعی آماده است" : "تنظیمات هوش مصنوعی ناقص است"}</span></div>
      <div className="sidebar-user">
        <span className="user-avatar">د</span>
        <span className="user-copy"><strong>دموی دانشگاهی</strong><small>مدیریت دانش</small></span>
        <button className="icon-button small" onClick={onAbout} type="button" aria-label="درباره‌ی پروژه"><Icon name="dots" size={17} /></button>
      </div>

      {mobileHistoryOpen && (
          <div className="mobile-history-backdrop" onClick={() => setMobileHistoryOpen(false)} role="presentation">
          <section className="mobile-history-drawer" onClick={(event) => event.stopPropagation()} aria-label="تاریخچه‌ی گفتگوها">
            <div className="mobile-history-header">
              <div><span className="eyebrow">گفت‌وگوهای ذخیره‌شده</span><h2>تاریخچه‌ی گفتگوها</h2></div>
              <button className="icon-button" onClick={() => setMobileHistoryOpen(false)} type="button" aria-label="بستن تاریخچه"><Icon name="close" size={16} /></button>
            </div>
            <ChatHistoryList
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelect={selectConversation}
              onDelete={deleteConversation}
            />
            <button className="primary-button mobile-new-chat" onClick={() => { onNewChat(); setMobileHistoryOpen(false); }} type="button"><Icon name="plus" size={16} /> گفت‌وگوی تازه</button>
          </section>
        </div>
      )}
    </aside>
  );
}
