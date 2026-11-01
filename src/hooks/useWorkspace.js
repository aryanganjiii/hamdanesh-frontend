import { useCallback, useEffect, useState } from "react";
import { assistantApi } from "../api/client.js";

export function useWorkspace() {
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState({ documents: 0, chunks: 0, embedded_chunks: 0 });
  const [health, setHealth] = useState({ ai_enabled: false, provider_configured: false });

  const refresh = useCallback(async () => {
    const [library, status] = await Promise.all([assistantApi.getDocuments(), assistantApi.getHealth()]);
    setDocuments(library.documents || []);
    setStats(library.stats || status);
    setHealth(status);
  }, []);

  useEffect(() => {
    refresh().catch(() => {});
  }, [refresh]);

  const uploadFiles = useCallback(async (files, category) => {
    const outcomes = [];
    for (const file of files) {
      if (file.size > 12 * 1024 * 1024) {
        throw new Error(`حجم «${file.name}» از سقف ۱۲ مگابایت بیشتر است.`);
      }
      outcomes.push((await assistantApi.uploadDocument(file, category)).document);
      await refresh();
    }
    return outcomes;
  }, [refresh]);

  const deleteDocument = useCallback(async (id) => {
    await assistantApi.deleteDocument(id);
    await refresh();
  }, [refresh]);

  const importSamples = useCallback(async () => {
    const result = await assistantApi.importSamples();
    await refresh();
    return result.documents || [];
  }, [refresh]);

  return { documents, stats, health, refresh, uploadFiles, deleteDocument, importSamples };
}
