async function request(path, options = {}) {
  const response = await fetch(path, options);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "ارتباط با سرور با خطا روبه‌رو شد.");
  }
  return payload;
}

export const assistantApi = {
  getHealth() {
    return request("/api/health");
  },

  getDocuments() {
    return request("/api/documents");
  },

  uploadDocument(file, category) {
    const form = new FormData();
    form.append("file", file);
    form.append("category", category);
    return request("/api/documents", { method: "POST", body: form });
  },

  deleteDocument(id) {
    return request(`/api/documents/${encodeURIComponent(id)}`, { method: "DELETE" });
  },

  importSamples() {
    return request("/api/samples/import", { method: "POST" });
  },

  sendMessage(message, history) {
    return request("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
    });
  },
};
