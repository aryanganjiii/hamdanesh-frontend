import { useCallback, useEffect, useRef, useState } from "react";
import AboutDialog from "./components/common/AboutDialog.jsx";
import Toast from "./components/common/Toast.jsx";
import ChatPage from "./components/chat/ChatPage.jsx";
import DocumentsPage from "./components/documents/DocumentsPage.jsx";
import AppShell from "./components/layout/AppShell.jsx";
import { useChat } from "./hooks/useChat.js";
import { useWorkspace } from "./hooks/useWorkspace.js";

export default function App() {
  const { documents, stats, health, refresh, uploadFiles: uploadDocuments, deleteDocument, importSamples } = useWorkspace();
  const {
    messages,
    busy,
    conversations,
    activeConversationId,
    sendMessage,
    selectConversation,
    newConversation,
    deleteConversation,
  } = useChat();
  const fileInputRef = useRef(null);
  const toastTimerRef = useRef(null);
  const [page, setPage] = useState("chat");
  const [category, setCategory] = useState("عمومی");
  const [activeSources, setActiveSources] = useState([]);
  const [sourcePanelOpen, setSourcePanelOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [toast, setToast] = useState({ message: "", error: false });
  const [dragActive, setDragActive] = useState(false);

  const notify = useCallback((message, error = false) => {
    setToast({ message, error });
    window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast({ message: "", error: false }), 3600);
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimerRef.current), []);

  const openUpload = useCallback(() => {
    setPage("documents");
    window.setTimeout(() => fileInputRef.current?.click(), 0);
  }, []);

  const uploadFiles = useCallback(async (files) => {
    if (!files?.length) return;
    try {
      const outcomes = await uploadDocuments([...files], category);
      const added = outcomes.filter((item) => !item.duplicate);
      const warnings = added.filter((item) => item.warning);
      if (!added.length) notify("این سندها قبلاً به کتابخانه اضافه شده‌اند.");
      else if (warnings.length) notify(`${added.length} سند اضافه شد؛ برای بخشی از قطعه‌ها embedding آماده نشد و بازیابی واژگانی فعال است.`);
      else notify(`${added.length} سند به کتابخانه‌ی دانش اضافه شد.`);
      setPage("documents");
    } catch (error) {
      notify(error.message, true);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [category, notify, uploadDocuments]);

  const handleImportSamples = useCallback(async () => {
    setImporting(true);
    try {
      const result = await importSamples();
      const added = result.filter((item) => !item.duplicate).length;
      notify(added ? `${new Intl.NumberFormat("fa-IR").format(added)} سند نمونه‌ی آموزشی اضافه شد.` : "اسناد نمونه قبلاً اضافه شده‌اند.");
    } catch (error) {
      notify(error.message, true);
    } finally {
      setImporting(false);
    }
  }, [importSamples, notify]);

  const handleDelete = useCallback(async (document) => {
    if (!window.confirm(`سند «${document.title}» و بخش‌های دانشی آن حذف شوند؟`)) return;
    try {
      await deleteDocument(document.id);
      setActiveSources((sources) => sources.filter((source) => source.id !== document.id));
      notify(`«${document.title}» حذف شد.`);
    } catch (error) {
      notify(error.message, true);
    }
  }, [deleteDocument, notify]);

  const handleSend = useCallback(async (message) => {
    const result = await sendMessage(message);
    if (result) setActiveSources(result.sources || []);
  }, [sendMessage]);

  useEffect(() => {
    function hasFiles(event) {
      return Array.from(event.dataTransfer?.types || []).includes("Files");
    }
    function handleDragOver(event) {
      if (!hasFiles(event)) return;
      event.preventDefault();
      setDragActive(true);
    }
    function handleDrop(event) {
      if (!hasFiles(event)) return;
      event.preventDefault();
      setDragActive(false);
      uploadFiles(event.dataTransfer.files);
    }
    function clearDropState(event) {
      if (event.relatedTarget == null) setDragActive(false);
    }
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);
    window.addEventListener("dragleave", clearDropState);
    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
      window.removeEventListener("dragleave", clearDropState);
    };
  }, [uploadFiles]);

  function showSources(sources) {
    setActiveSources(sources);
    setSourcePanelOpen(true);
  }

  function startNewChat() {
    newConversation();
    setActiveSources([]);
    setSourcePanelOpen(false);
    setPage("chat");
  }

  function handleSelectConversation(conversationId) {
    selectConversation(conversationId);
    setActiveSources([]);
    setSourcePanelOpen(false);
    setPage("chat");
  }

  function handleDeleteConversation(conversation) {
    if (!window.confirm(`گفت‌وگوی «${conversation.title}» حذف شود؟`)) return;
    deleteConversation(conversation.id);
    if (conversation.id === activeConversationId) {
      setActiveSources([]);
      setSourcePanelOpen(false);
    }
  }

  return (
    <>
      <AppShell
        page={page}
        onPageChange={setPage}
        onUploadClick={openUpload}
        documents={documents}
        health={health}
        onAbout={() => setAboutOpen(true)}
        onNewChat={startNewChat}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        activeSources={activeSources}
        sourcePanelOpen={sourcePanelOpen}
        onCloseSources={() => setSourcePanelOpen(false)}
      >
        <ChatPage
          hidden={page !== "chat"}
          messages={messages}
          busy={busy}
          stats={stats}
          onSend={handleSend}
          onSourceClick={showSources}
        />
        <DocumentsPage
          hidden={page !== "documents"}
          documents={documents}
          stats={stats}
          onUploadClick={openUpload}
          onCategoryChange={setCategory}
          onDelete={handleDelete}
          onImportSamples={handleImportSamples}
          importing={importing}
          onRefresh={() => refresh().catch((error) => notify(error.message, true))}
        />
      </AppShell>

      <input
        ref={fileInputRef}
        className="sr-only"
        type="file"
        multiple
        accept=".pdf,.docx,.txt,.md,.csv,.json,.yaml,.yml,.log,.html,.htm"
        onChange={(event) => uploadFiles(event.target.files)}
      />
      <div className={`drop-overlay ${dragActive ? "visible" : ""}`} aria-hidden={!dragActive}>
        <div className="drop-message"><span>⇧</span><strong>فایل‌ها را اینجا رها کنید</strong><small>PDF، DOCX، TXT، MD، CSV و HTML</small></div>
      </div>
      <Toast message={toast.message} error={toast.error} />
      <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  );
}
