import Sidebar from "./Sidebar.jsx";
import TopBar from "./TopBar.jsx";
import SourcePanel from "../chat/SourcePanel.jsx";

export default function AppShell({
  page,
  onPageChange,
  onUploadClick,
  documents,
  health,
  onAbout,
  onNewChat,
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  children,
  activeSources,
  sourcePanelOpen,
  onCloseSources,
}) {
  return (
    <div className="app-shell">
      <Sidebar
        page={page}
        onPageChange={onPageChange}
        onUploadClick={onUploadClick}
        documents={documents}
        health={health}
        onAbout={onAbout}
        onNewChat={onNewChat}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={onSelectConversation}
        onDeleteConversation={onDeleteConversation}
      />
      <main className="main-area">
        <TopBar page={page} onNewChat={onNewChat} />
        {children}
      </main>
      <SourcePanel sources={activeSources} open={sourcePanelOpen} onClose={onCloseSources} />
    </div>
  );
}
