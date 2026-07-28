/// <reference types="node" />

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const headerCss = readFileSync("src/components/Header/Header.css", "utf8");

describe("Header 窗口拖拽区", () => {
  it("顶栏隐藏时的拖拽条声明为可拖拽，并撑开窗控所需高度", () => {
    expect(headerCss).toMatch(
      /\.titlebar-drag-strip\s*\{[\s\S]*?-webkit-app-region:\s*drag;/,
    );
    expect(headerCss).toMatch(
      /\.titlebar-drag-strip\.is-active\s*\{\s*flex-basis:\s*36px;/,
    );
  });

  it("浮动工具栏排除在拖拽区外，避免按钮被吞掉点击", () => {
    expect(headerCss).toMatch(
      /\.floating-toolbar\s*\{[\s\S]*?-webkit-app-region:\s*no-drag;[\s\S]*?\}/,
    );
  });
});
