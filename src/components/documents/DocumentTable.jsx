import Icon from "../common/Icon.jsx";

function formatDate(value) {
  try {
    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", { dateStyle: "medium", timeZone: "Asia/Tehran" }).format(new Date(value));
  } catch {
    return "—";
  }
}

function formatBytes(value) {
  const size = Number(value || 0);
  if (size < 1024) return `${new Intl.NumberFormat("fa-IR").format(size)} بایت`;
  if (size < 1024 * 1024) return `${new Intl.NumberFormat("fa-IR").format(Math.round(size / 1024))} کیلوبایت`;
  return `${new Intl.NumberFormat("fa-IR").format((size / (1024 * 1024)).toFixed(1))} مگابایت`;
}

export default function DocumentTable({ documents, query, onDelete }) {
  const visibleDocuments = documents.filter((document) =>
    `${document.title} ${document.filename} ${document.category}`.toLocaleLowerCase("fa").includes(query.trim().toLocaleLowerCase("fa")),
  );

  if (!visibleDocuments.length && query) {
    return <div className="no-search-results">سندی با این عبارت پیدا نشد.</div>;
  }

  return (
    <div className="document-table-wrap">
      <table className="document-table">
        <thead><tr><th>نام سند</th><th>دسته‌بندی</th><th>بخش‌ها</th><th>افزوده‌شده</th><th><span className="sr-only">عملیات</span></th></tr></thead>
        <tbody>
          {visibleDocuments.map((document) => (
            <tr key={document.id}>
              <td><div className="doc-name-cell"><span className="file-type-icon">{document.filename.toLowerCase().endsWith(".pdf") ? "▧" : document.filename.toLowerCase().endsWith(".docx") ? "▤" : "≡"}</span><span className="doc-name-info"><strong>{document.title}</strong><small>{document.filename} · {formatBytes(document.byte_size)}</small></span></div></td>
              <td><span className="category-pill">{document.category}</span></td>
              <td><span className="chunk-pill">{new Intl.NumberFormat("fa-IR").format(document.chunk_count)} بخش</span></td>
              <td>{formatDate(document.created_at)}</td>
              <td><button className="doc-action" title="حذف سند" aria-label={`حذف ${document.title}`} type="button" onClick={() => onDelete(document)}>⋯</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
