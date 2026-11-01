import { useState } from "react";
import Icon from "../common/Icon.jsx";
import DocumentTable from "./DocumentTable.jsx";

const categories = ["عمومی", "منابع انسانی", "فناوری اطلاعات", "فرایندها", "مالی", "سایر"];
const number = (value) => new Intl.NumberFormat("fa-IR").format(value || 0);

export default function DocumentsPage({ documents, stats, onUploadClick, onCategoryChange, onDelete, onImportSamples, importing, onRefresh, hidden = false }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("عمومی");
  const normalizedQuery = query.toLocaleLowerCase("fa");
  const matchingDocuments = documents.filter((document) =>
    `${document.title} ${document.filename} ${document.category}`.toLocaleLowerCase("fa").includes(normalizedQuery),
  );

  function changeCategory(event) {
    setCategory(event.target.value);
    onCategoryChange(event.target.value);
  }

  return (
    <section className="page documents-page" hidden={hidden}>
      <div className="page-header">
        <div><div className="eyebrow"><span className="eyebrow-dot" /> مدیریت دانش</div><h1>اسناد سازمانی</h1><p>منابع دانشی را اضافه کنید تا دستیار بتواند بر اساس آن‌ها پاسخ دهد.</p></div>
        <button className="primary-button" onClick={onUploadClick} type="button"><Icon name="plus" size={16} /> افزودن سند</button>
      </div>

      <div className="summary-grid">
        <article className="summary-card"><span className="summary-icon blue">▤</span><div><small>تعداد اسناد</small><strong>{number(stats.documents)}</strong></div><span className="summary-trend">منابع دانشی</span></article>
        <article className="summary-card"><span className="summary-icon violet">⌗</span><div><small>بخش‌های بازیابی</small><strong>{number(stats.chunks)}</strong></div><span className="summary-trend">قطعه‌های متنی</span></article>
        <article className="summary-card"><span className="summary-icon green-bg">◉</span><div><small>بردارهای آماده</small><strong>{number(stats.embedded_chunks)}</strong></div><span className="summary-trend">جست‌وجوی معنایی</span></article>
      </div>

      <div className="documents-panel">
        <div className="panel-toolbar">
          <div><h2>کتابخانه‌ی دانش</h2><p>{query ? `${number(matchingDocuments.length)} نتیجه` : "اسناد بارگذاری‌شده در فضای کاری شما"}</p></div>
          <div className="table-actions">
            <label className="category-select-label"><span className="sr-only">دسته‌بندی سند جدید</span><select className="category-select" value={category} onChange={changeCategory}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="search-box"><Icon name="search" size={14} /><input type="search" placeholder="جست‌وجوی سند…" aria-label="جست‌وجوی سند" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
            <button className="icon-button" onClick={onRefresh} type="button" aria-label="به‌روزرسانی اسناد" title="به‌روزرسانی"><Icon name="refresh" size={16} /></button>
          </div>
        </div>

        {documents.length ? <DocumentTable documents={documents} query={query} onDelete={onDelete} /> : (
          <div className="empty-documents">
            <div className="empty-art"><span>▤</span><i>✦</i></div>
            <h3>کتابخانه‌ی دانش هنوز خالی است</h3>
            <p>فایل‌های PDF، Word یا متنی را اضافه کنید تا دستیار آن‌ها را برای بازیابی آماده کند.</p>
            <button className="primary-button" onClick={onUploadClick} type="button">افزودن اولین سند</button>
            <button className="text-button" disabled={importing} onClick={onImportSamples} type="button">{importing ? "در حال افزودن نمونه‌ها…" : "یا ورود اسناد نمونه‌ی آموزشی"}</button>
          </div>
        )}
      </div>

      <div className="upload-note"><span className="note-icon">ⓘ</span><p><strong>داده‌های نمایشی:</strong> اسناد نمونه برای نمایش آموزشی ساخته شده‌اند و سیاست واقعی یک سازمان نیستند. فایل‌های افزوده‌شده در پایگاه SQLite محلی ذخیره می‌شوند.</p></div>
    </section>
  );
}
