/// <reference types="node" />

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const headerCss = readFileSync("src/components/Header/Header.css", "utf8");

describe("Header 窗口拖拽区", () => {
  it("隐藏标题栏使用弹性拖拽区，不依赖固定窗控宽度", () => {
    expect(headerCss).toMatch(/\.hidden-titlebar\s*\{[\s\S]*?display:\s*flex;/);
    expect(headerCss).toMatch(
      /\.hidden-titlebar\.is-active\s*\{\s*flex-basis:\s*36px;/,
    );
    expect(headerCss).toMatch(
      /\.hidden-titlebar-drag-region\s*\{[\s\S]*?flex:\s*1 1 auto;[\s\S]*?-webkit-app-region:\s*drag;/,
    );
  });

  it("Windows 窗控及按钮排除在拖拽区外", () => {
    expect(headerCss).toMatch(
      /\.window-controls-hidden\s*\{[\s\S]*?flex:\s*0 0 auto;[\s\S]*?-webkit-app-region:\s*no-drag;/,
    );
    expect(headerCss).toMatch(
      /\.window-controls-hidden \.win-btn\s*\{\s*-webkit-app-region:\s*no-drag;/,
    );
  });

  it("浮动工具栏排除在拖拽区外", () => {
    expect(headerCss).toMatch(
      /\.floating-toolbar\s*\{[\s\S]*?-webkit-app-region:\s*no-drag;[\s\S]*?\}/,
    );
  });
});
