import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "../../components/common/Modal";

describe("Modal", () => {
  it("提供统一的标题、说明与对话框语义", () => {
    render(
      <Modal
        open
        onClose={() => {}}
        title="存储模式"
        description="选择文章保存位置"
      >
        <div>弹窗内容</div>
      </Modal>,
    );

    const dialog = screen.getByRole("dialog", { name: "存储模式" });
    expect(dialog).toHaveAccessibleDescription("选择文章保存位置");
    expect(screen.getByText("弹窗内容")).toBeInTheDocument();
  });

  it("支持关闭按钮、遮罩和 Escape 关闭", () => {
    const onClose = vi.fn();
    const { container } = render(
      <Modal open onClose={onClose} title="文章主题">
        <button>内部操作</button>
      </Modal>,
    );

    fireEvent.click(screen.getByRole("button", { name: "关闭" }));
    fireEvent.click(container.querySelector(".modal-overlay") as HTMLElement);
    fireEvent.keyDown(window, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it("关闭时不渲染", () => {
    render(
      <Modal open={false} onClose={() => {}} title="图床">
        <div>弹窗内容</div>
      </Modal>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
