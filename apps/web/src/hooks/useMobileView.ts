import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export type MobileViewType = "editor" | "preview";

/**
 * 移动端视图管理 Hook
 * 在 768px 以下屏幕宽度时启用移动端模式
 */
export function useMobileView() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  const [activeView, setActiveView] = useState<MobileViewType>("editor");

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      // 切换到桌面模式时重置视图
      if (!mobile) {
        setActiveView("editor");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    isMobile,
    activeView,
    setActiveView,
    isEditor: activeView === "editor",
    isPreview: activeView === "preview",
  };
}
