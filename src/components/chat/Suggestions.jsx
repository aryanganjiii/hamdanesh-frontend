const suggestions = [
  { icon: "◷", tone: "lavender", title: "مرخصی و منابع انسانی", detail: "مراحل و ضوابط درخواست را بپرسید", prompt: "شرایط و مراحل درخواست مرخصی چیست؟" },
  { icon: "⌁", tone: "mint", title: "امنیت اطلاعات", detail: "راهنمای اقدام در موقعیت‌های حساس", prompt: "اگر ایمیل مشکوک دریافت کردم چه کاری انجام بدهم؟" },
  { icon: "▧", tone: "sand", title: "فرایندهای سازمانی", detail: "جریان کارها و مسئولیت‌ها", prompt: "برای ثبت درخواست خرید چه مراحلی لازم است؟" },
];

export default function Suggestions({ onSelect }) {
  return (
    <div className="suggestions">
      {suggestions.map((item) => (
        <button className="suggestion-card" key={item.title} onClick={() => onSelect(item.prompt)} type="button">
          <span className={`suggestion-icon ${item.tone}`}>{item.icon}</span>
          <span><strong>{item.title}</strong><small>{item.detail}</small></span>
          <span className="suggestion-arrow" aria-hidden="true">←</span>
        </button>
      ))}
    </div>
  );
}
