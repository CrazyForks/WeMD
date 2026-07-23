/// <reference types="node" />

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const previewCss = readFileSync(
  "src/components/Preview/MarkdownPreview.css",
  "utf8",
);

describe("MarkdownPreview responsive layout", () => {
  it("桌面预览保持固定的公众号画布宽度", () => {
    expect(previewCss).toMatch(
      /\.preview-content\s*\{[\s\S]*?box-sizing:\s*border-box;[\s\S]*?width:\s*402px;/,
    );
  });

  it("仅移动布局使用容器宽度", () => {
    expect(previewCss).toMatch(
      /@media\s*\(max-width:\s*768px\)[\s\S]*?\.app\[data-layout-mode=["']mobile["']\]\s+\.preview-content\s*\{[\s\S]*?width:\s*100%;/,
    );
  });
});
