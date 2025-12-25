import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "../../components/Header/Header";
import { useWindowControls } from "../../hooks/useWindowControls";
import { useUITheme } from "../../hooks/useUITheme";
import { useEditorStore } from "../../store/editorStore";

// Mock hooks
vi.mock("../../hooks/useWindowControls");
vi.mock("../../hooks/useUITheme");
vi.mock("../../store/editorStore");

// Mock components that might cause issues in JSDOM or aren't focus of test
vi.mock("../../components/Theme/ThemePanel", () => ({
  ThemePanel: ({ open }: { open: boolean }) =>
    open ? <div data-testid="theme-panel">Theme Panel</div> : null,
}));
vi.mock("../../components/StorageModeSelector/StorageModeSelector", () => ({
  StorageModeSelector: () => (
    <div data-testid="storage-selector">Storage Selector</div>
  ),
}));
vi.mock("../../components/Settings/ImageHostSettings", () => ({
  ImageHostSettings: () => (
    <div data-testid="image-host-settings">Image Host Settings</div>
  ),
}));

describe("Header", () => {
  // Default mocks
  const mockCopyToWechat = vi.fn();
  const mockSetTheme = vi.fn();
  const mockMinimize = vi.fn();
  const mockMaximize = vi.fn();
  const mockClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("wemd-header-autohide");
    }

    // Setup default hook returns
    vi.mocked(useEditorStore).mockReturnValue({
      copyToWechat: mockCopyToWechat,
    });

    vi.mocked(useUITheme).mockImplementation(
      (selector: (state: any) => any) => {
        const state = { theme: "light", setTheme: mockSetTheme };
        return selector(state);
      },
    );

    vi.mocked(useWindowControls).mockReturnValue({
      isElectron: false,
      isWindows: false,
      isMac: true,
      platform: "web",
      minimize: mockMinimize,
      maximize: mockMaximize,
      close: mockClose,
    });
  });

  it("renders logo and core elements", () => {
    render(<Header />);

    expect(screen.getByText("WeMD")).toBeInTheDocument();
    expect(screen.getByText("公众号 Markdown 排版编辑器")).toBeInTheDocument();
    expect(screen.getByText("复制到公众号")).toBeInTheDocument();
  });

  it("toggles theme interaction", () => {
    render(<Header />);

    const themeBtn = screen.getByTitle("切换到暗色模式");
    fireEvent.click(themeBtn);
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("calls copyToWechat action", () => {
    render(<Header />);

    fireEvent.click(screen.getByText("复制到公众号"));
    expect(mockCopyToWechat).toHaveBeenCalled();
  });

  it("does not render window controls on Web/Mac", () => {
    vi.mocked(useWindowControls).mockReturnValue({
      isElectron: false,
      isWindows: false,
      isMac: true,
      platform: "web",
      minimize: mockMinimize,
      maximize: mockMaximize,
      close: mockClose,
    });

    render(<Header />);

    expect(screen.queryByLabelText("最小化")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("关闭")).not.toBeInTheDocument();
  });

  it("renders window controls on Windows Electron", () => {
    vi.mocked(useWindowControls).mockReturnValue({
      isElectron: true,
      isWindows: true,
      isMac: false,
      platform: "win32",
      minimize: mockMinimize,
      maximize: mockMaximize,
      close: mockClose,
    });

    render(<Header />);

    expect(screen.getByLabelText("最小化")).toBeInTheDocument();
    expect(screen.getByLabelText("最大化")).toBeInTheDocument();
    expect(screen.getByLabelText("关闭")).toBeInTheDocument();

    // Test interactions
    fireEvent.click(screen.getByLabelText("关闭"));
    expect(mockClose).toHaveBeenCalled();
  });

  it("toggles header visibility (hide/show)", () => {
    render(<Header />);

    // 点击隐藏标题栏按钮
    const hideBtn = screen.getByLabelText("隐藏标题栏");
    fireEvent.click(hideBtn);

    // 隐藏后应显示浮动工具栏中的"显示标题栏"按钮
    expect(screen.getByLabelText("显示标题栏")).toBeInTheDocument();

    // 点击显示按钮
    fireEvent.click(screen.getByLabelText("显示标题栏"));

    // 标题栏恢复后，隐藏按钮重新出现
    expect(screen.getByLabelText("隐藏标题栏")).toBeInTheDocument();
  });

  it("shows floating toolbar buttons when header is hidden", () => {
    render(<Header />);

    // 隐藏标题栏
    fireEvent.click(screen.getByLabelText("隐藏标题栏"));

    // 验证浮动工具栏包含关键功能按钮
    expect(screen.getByLabelText("显示标题栏")).toBeInTheDocument();
    expect(screen.getByLabelText("主题管理")).toBeInTheDocument();
    expect(screen.getByLabelText("图床设置")).toBeInTheDocument();
    expect(screen.getByLabelText("复制到公众号")).toBeInTheDocument();
  });

  it("persists header visibility to localStorage", () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    render(<Header />);

    // 隐藏标题栏
    fireEvent.click(screen.getByLabelText("隐藏标题栏"));

    // 验证 localStorage 被更新
    expect(setItemSpy).toHaveBeenCalledWith("wemd-header-autohide", "true");

    setItemSpy.mockRestore();
  });
});
