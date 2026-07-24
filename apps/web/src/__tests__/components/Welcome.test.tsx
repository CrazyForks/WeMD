import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Welcome } from "../../components/Welcome/Welcome";
import { useFileSystem } from "../../hooks/useFileSystem";
import { useUITheme } from "../../hooks/useUITheme";

vi.mock("../../hooks/useFileSystem");
vi.mock("../../hooks/useUITheme");

describe("Welcome", () => {
  const selectWorkspace = vi.fn();
  let theme = "default";

  beforeEach(() => {
    vi.clearAllMocks();
    theme = "default";
    vi.mocked(useFileSystem).mockReturnValue({
      selectWorkspace,
    } as unknown as ReturnType<typeof useFileSystem>);
    vi.mocked(useUITheme).mockImplementation((selector) =>
      selector({ theme } as ReturnType<typeof useUITheme.getState>),
    );
  });

  it("根据界面主题使用清晰可见的 Logo", () => {
    const { rerender } = render(<Welcome />);
    expect(screen.getByRole("img", { name: "WeMD Logo" })).toHaveAttribute(
      "src",
      "/favicon-dark.svg",
    );

    theme = "dark";
    rerender(<Welcome />);
    expect(screen.getByRole("img", { name: "WeMD Logo" })).toHaveAttribute(
      "src",
      "/favicon-light.svg",
    );
  });

  it("点击主操作时选择工作区", () => {
    render(<Welcome />);

    fireEvent.click(screen.getByRole("button", { name: "选择工作区文件夹" }));

    expect(selectWorkspace).toHaveBeenCalledOnce();
  });
});
