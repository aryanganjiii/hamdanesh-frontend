import { useEffect, useRef } from "react";

export default function AboutDialog({ open, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={dialogRef} className="about-dialog" onClose={onClose}>
      <button className="icon-button dialog-close" onClick={onClose} type="button" aria-label="بستن">×</button>
      <div className="about-mark">✦</div>
      <span className="eyebrow">پروژه‌ی دانشگاهی</span>
      <h2>هم‌دانش</h2>
      <p>سامانه‌ی هوشمند مدیریت دانش و دستیار سازمانی مبتنی بر بازیابی افزوده (RAG) و مدل‌های زبانی بزرگ.</p>
      <div className="about-meta"><span>مدل پاسخ</span><strong>AvalAI · GPT-5.4-mini</strong></div>
      <div className="about-meta"><span>روش بازیابی</span><strong>برداری + واژگانی</strong></div>
      <div className="about-meta"><span>ذخیره‌سازی</span><strong>SQLite محلی</strong></div>
      <small className="about-footnote">برای استفاده‌ی سازمانی، احراز هویت و سطح دسترسی اسناد باید متناسب با نیاز سازمان افزوده شود.</small>
    </dialog>
  );
}
