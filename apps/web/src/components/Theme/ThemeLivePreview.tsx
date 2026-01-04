import { useEffect, useMemo, useRef, memo } from "react";
import {
  createMarkdownParser,
  processHtml,
  convertCssToWeChatDarkMode,
} from "@wemd/core";
import { useUITheme } from "../../hooks/useUITheme";

// 主题预览用的示例 Markdown 内容
const PREVIEW_MARKDOWN = `# 一级标题示例

这是一段**加粗文本**、*斜体文本*、~~删除线文本~~、==高亮文本==和 [链接示例](https://github.com/tenngoxars/WeMD)。
正文段落通常需要设置行高和间距，以保证阅读体验。

---

## 二级标题

> 这是一个引用块示例，通常用于强调重要内容或摘录。

| 平台 | 特点 | 适用程度 |
| :--- | :--- | :--- |
| 微信 | 封闭但流量大 | ⭐⭐⭐⭐⭐ |
| 博客 | 自由但流量小 | ⭐⭐⭐ |

### 三级标题

这里演示脚注的使用：[WeChat Markdown](https://github.com/tenngoxars/WeMD "WeMD 是一款专为公众号设计的编辑器") 可以极大提升排版效率。

> [!TIP]
> 这是一个提示块示例。支持切换"默认彩色"或"跟随主题色"风格，让排版更统一。

- 无序列表
  - 嵌套的无序列表 A
  - 嵌套的无序列表 B


1. 有序列表
   1. 嵌套的有序列表 A
   2. 嵌套的有序列表 B


#### 四级标题

这里有 \`行内代码\` 样式，也可以用来表示 \`npm install wemd\` 等指令。

\`\`\`js
// 代码块示例
function hello() {
  const a = 1;
  const b = 2;
  console.log("Hello, Markdown!");
}
\`\`\`

![WeMD 示例图片：不仅支持常规排版，更可以深度定制每一个细节。](https://img.wemd.app/example.jpg)
`;

interface ThemeLivePreviewProps {
  /** 要预览的 CSS 样式代码 */
  css: string;
}

// 主题实时预览组件（使用 iframe 隔离样式）
export const ThemeLivePreview = memo(function ThemeLivePreview({
  css,
}: ThemeLivePreviewProps) {
  const parser = useMemo(() => createMarkdownParser(), []);
  const uiTheme = useUITheme((state) => state.theme);
  const isDarkMode = uiTheme === "dark";
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const shellDoc = useMemo(
    () => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style id="base-style">
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 0;
          font-size: 14px;
          line-height: 1.6;
          transition: background 0.2s, color 0.2s;
        }
        body:empty { display: none; }
      </style>
      <style id="theme-style"></style>
    </head>
    <body><div id="preview-root"></div></body>
    </html>
  `,
    [],
  );

  const finalCss = useMemo(
    () => (isDarkMode ? convertCssToWeChatDarkMode(css) : css),
    [css, isDarkMode],
  );
  const html = useMemo(() => {
    const rawHtml = parser.render(PREVIEW_MARKDOWN);
    return processHtml(rawHtml, finalCss, true);
  }, [parser, finalCss]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const updateContent = () => {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;

      const themeStyle = doc.getElementById("theme-style");
      const root = doc.getElementById("preview-root");

      if (themeStyle && root) {
        const scrollY = iframe.contentWindow?.scrollY || 0;

        doc.body.style.background = isDarkMode ? "#252526" : "#fff";
        doc.body.style.color = isDarkMode ? "#d4d4d4" : "#000";

        themeStyle.textContent = finalCss;
        root.innerHTML = html;

        iframe.contentWindow?.scrollTo(0, scrollY);
      }
    };

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (
      doc &&
      doc.readyState === "complete" &&
      doc.getElementById("preview-root")
    ) {
      updateContent();
    } else {
      iframe.onload = updateContent;
    }
  }, [html, finalCss, isDarkMode]);

  return (
    <div className="theme-live-preview">
      <div className="preview-header-mini">
        <span>实时预览</span>
      </div>
      <iframe
        ref={iframeRef}
        className="preview-iframe"
        srcDoc={shellDoc}
        title="主题预览"
        sandbox="allow-same-origin"
      />
    </div>
  );
});
