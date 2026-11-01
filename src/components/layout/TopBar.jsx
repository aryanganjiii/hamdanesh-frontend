import Icon from "../common/Icon.jsx";

export default function TopBar({ page, onNewChat }) {
  return (
    <header className="topbar">
      <div className="breadcrumbs"><span>سازمان نمونه</span><span className="crumb-separator">/</span><strong>{page === "documents" ? "مدیریت اسناد" : "دستیار هوشمند"}</strong></div>
      <div className="topbar-actions">
        <span className="privacy-chip"><span className="privacy-dot" />پاسخ مستند به دانش سازمانی</span>
        <button className="icon-button" onClick={onNewChat} type="button" title="گفت‌وگوی تازه" aria-label="گفت‌وگوی تازه"><Icon name="plus" size={17} /></button>
      </div>
    </header>
  );
}
