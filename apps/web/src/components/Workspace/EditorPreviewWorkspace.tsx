import type { CSSProperties } from "react";
import { Loader2 } from "lucide-react";
import { MarkdownEditor } from "../Editor/MarkdownEditor";
import { MarkdownPreview } from "../Preview/MarkdownPreview";
import { ResizeHandle } from "./ResizeHandle";
import { useEditorPreviewScrollSync } from "./useEditorPreviewScrollSync";
import { useSplitPane } from "./useSplitPane";
import "./EditorPreviewWorkspace.css";

interface EditorPreviewWorkspaceProps {
  loading: boolean;
  mobileView?: "editor" | "preview";
}

const Loading = () => (
  <div className="workspace-loading">
    <Loader2 className="animate-spin" size={24} />
    <p>正在加载文章</p>
  </div>
);

export function EditorPreviewWorkspace({
  loading,
  mobileView,
}: EditorPreviewWorkspaceProps) {
  const { registerEditor, registerPreview } = useEditorPreviewScrollSync();
  const isMobileLayout = mobileView !== undefined;
  const {
    containerRef,
    editorWidth,
    minWidth,
    maxWidth,
    keyboardStep,
    keyboardStepLarge,
    isDragging,
    setDragging,
    setWidth,
    setWidthFromClientX,
    resetWidth,
  } = useSplitPane({ enabled: !isMobileLayout });
  const style = isMobileLayout
    ? undefined
    : ({
        "--editor-pane-width": `${editorWidth}px`,
      } as CSSProperties);

  return (
    <div
      ref={containerRef}
      className={`workspace ${isDragging ? "is-resizing" : ""}`}
      style={style}
      data-mobile-view={mobileView}
    >
      <div className="editor-pane">
        {loading ? (
          <Loading />
        ) : (
          <MarkdownEditor onScrollSyncReady={registerEditor} />
        )}
      </div>
      {!isMobileLayout && (
        <ResizeHandle
          width={editorWidth}
          minWidth={minWidth}
          maxWidth={maxWidth}
          step={keyboardStep}
          stepLarge={keyboardStepLarge}
          onWidthChange={setWidth}
          onPointerPosition={setWidthFromClientX}
          onReset={resetWidth}
          onDraggingChange={setDragging}
        />
      )}
      <div className="preview-pane">
        {loading ? (
          <Loading />
        ) : (
          <MarkdownPreview onScrollSyncReady={registerPreview} />
        )}
      </div>
    </div>
  );
}
