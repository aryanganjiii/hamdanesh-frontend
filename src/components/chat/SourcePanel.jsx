import Icon from "../common/Icon.jsx";

const number = new Intl.NumberFormat("fa-IR");

export default function SourcePanel({ sources, open, onClose }) {
  return (
    <aside className={`source-panel ${open ? "open" : ""}`} aria-label="منابع پاسخ" aria-hidden={!open}>
      <div className="source-panel-head">
        <div><span className="eyebrow">شفافیت پاسخ</span><h2>منابع استفاده‌شده</h2></div>
        <button className="icon-button" onClick={onClose} type="button" aria-label="بستن منابع"><Icon name="close" size={16} /></button>
      </div>
      <p className="source-intro">این بخش‌ها در شکل‌گیری پاسخ نقش داشته‌اند. برای اطمینان، متن اصلی سند را بخوانید.</p>
      <div className="source-list">
        {sources.length ? sources.map((source, index) => (
          <article className="source-card" key={`${source.chunk_id}-${index}`}>
            <div className="source-card-title">
              <span className="source-number">{number.format(index + 1)}</span>
              <span><strong>{source.title}</strong><small>{source.heading_path || source.filename} · {source.category}</small></span>
            </div>
            <p>{source.snippet}</p>
            <div className="relevance-row"><span>ارتباط</span><span className="relevance-track"><span className="relevance-fill" style={{ width: `${Math.max(8, Math.min(100, Number(source.score || 0) * 100))}%` }} /></span><span>{number.format(Math.round(Number(source.score || 0) * 100))}٪</span></div>
          </article>
        )) : <div className="source-placeholder">هنوز منبعی برای نمایش وجود ندارد.</div>}
      </div>
    </aside>
  );
}
