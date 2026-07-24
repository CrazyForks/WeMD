import { FolderOpen } from "lucide-react";
import { useFileSystem } from "../../hooks/useFileSystem";
import { useUITheme } from "../../hooks/useUITheme";
import { resolveAppAssetPath } from "../../utils/assetPath";
import "./Welcome.css";

export function Welcome() {
  const { selectWorkspace } = useFileSystem();
  const theme = useUITheme((state) => state.theme);
  const logoSrc = resolveAppAssetPath(
    theme === "dark" ? "favicon-light.svg" : "favicon-dark.svg",
  );

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <img src={logoSrc} alt="WeMD Logo" className="welcome-logo" />
        <h1>欢迎使用 WeMD</h1>
        <p>请选择一个文件夹作为工作区以开始写作</p>
        <button className="btn-primary" onClick={selectWorkspace}>
          <FolderOpen size={20} />
          选择工作区文件夹
        </button>
      </div>
    </div>
  );
}
