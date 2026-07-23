/**
 * 微信公众号复制主编排入口
 * 负责将 Markdown 转为微信兼容 HTML 并写入剪贴板
 */

import toast from "react-hot-toast";
import { processHtml, createMarkdownParser } from "@wemd/core";
import katexCss from "katex/dist/katex.min.css?raw";
import { convertLinksToFootnotes } from "../utils/linkFootnote";
import { getPublishingPreference } from "../store/publishingPreferences";
import {
  applyLightRootVars,
  resolveInlineStyleVariablesForCopy,
} from "./inlineStyleVarResolver";
import {
  materializeCounterPseudoContent,
  stripCounterPseudoRules,
} from "./wechatCounterCompat";
import { expandCSSVariables } from "./cssVariableExpander";
import {
  normalizeCopyContainer,
  stripCopyMetadata,
} from "./wechatCopyNormalizer";
import {
  renderHighRiskMathAsImages,
  stripHiddenMathMarkupForWechat,
} from "./wechatMathCompat";
import { renderMermaidBlocks } from "./wechatMermaidRenderer";
import { renderTableBlocks } from "./wechatTableRenderer";

// re-export 保持外部引用兼容
export { normalizeCopyContainer, stripCopyMetadata };

interface CopyToWechatOptions {
  showMacBar?: boolean;
}

const buildCopyCss = (themeCss: string) => {
  if (!themeCss) return katexCss;
  // 复制前展开 CSS 变量为具体值，消除微信清洗 var() 导致的样式丢失
  const expandedCss = expandCSSVariables(themeCss);
  return `${expandedCss}\n${katexCss}`;
};

const renderMacSignDotsToImages = (container: HTMLElement): void => {
  container.querySelectorAll<HTMLElement>(".mac-sign").forEach((macSign) => {
    const dots = Array.from(macSign.querySelectorAll<HTMLElement>(".mac-dot"));
    if (dots.length === 0) return;

    try {
      const scale = 2;
      const dotMetrics = dots.map((dot) => ({
        color: dot.style.backgroundColor,
        height: Number.parseFloat(dot.style.height),
        marginRight: Number.parseFloat(dot.style.marginRight) || 0,
        marginTop: Number.parseFloat(dot.style.marginTop) || 0,
        width: Number.parseFloat(dot.style.width),
      }));
      const width = dotMetrics.reduce(
        (total, dot) => total + dot.width + dot.marginRight,
        0,
      );
      const height =
        Number.parseFloat(macSign.style.height) ||
        Math.max(...dotMetrics.map((dot) => dot.marginTop + dot.height));
      if (!width || !height || dotMetrics.some((dot) => !dot.color)) return;

      const canvas = document.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;
      const context = canvas.getContext("2d");
      if (!context) return;

      context.scale(scale, scale);
      let offsetX = 0;
      dotMetrics.forEach((dot) => {
        context.beginPath();
        context.arc(
          offsetX + dot.width / 2,
          dot.marginTop + dot.height / 2,
          Math.min(dot.width, dot.height) / 2,
          0,
          Math.PI * 2,
        );
        context.fillStyle = dot.color;
        context.fill();
        offsetX += dot.width + dot.marginRight;
      });

      const image = document.createElement("img");
      image.src = canvas.toDataURL("image/png");
      image.alt = "";
      image.width = width;
      image.height = height;
      image.style.display = "block";
      image.style.width = `${width}px`;
      image.style.height = `${height}px`;

      macSign.removeAttribute("aria-hidden");
      macSign.replaceChildren(image);
    } catch (error) {
      console.warn("Mac Bar PNG 绘制失败，保留 HTML 圆点", error);
    }
  });
};

/**
 * 将 HTML 中的 checkbox 转换为 emoji
 * 微信公众号会过滤 <input> 标签，需要转为 emoji 替代
 */
const convertCheckboxesToEmoji = (html: string): string => {
  // 使用 &nbsp; 确保空格不被微信吞掉
  // 先替换选中的 checkbox（包含 checked 属性）
  let result = html.replace(/<input[^>]*checked[^>]*>/gi, "✅&nbsp;");
  // 再替换未选中的 checkbox
  result = result.replace(
    /<input[^>]*type=["']checkbox["'][^>]*>/gi,
    "⬜&nbsp;",
  );
  return result;
};

// ── 剪贴板写入策略 ─────────────────────────────────

const copyViaNativeExecCommand = (container: HTMLElement): boolean => {
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(container);
  selection?.removeAllRanges();
  selection?.addRange(range);
  try {
    return document.execCommand("copy");
  } finally {
    selection?.removeAllRanges();
  }
};

const getRenderedPlainText = (container: HTMLElement): string => {
  const innerText = container.innerText;
  if (typeof innerText === "string" && innerText.trim().length > 0) {
    return innerText;
  }
  return container.textContent || "";
};

const copyViaElectronClipboard = async (
  container: HTMLElement,
): Promise<{ success: boolean; error?: string } | null> => {
  const writeHTML = window.electron?.clipboard?.writeHTML;
  if (!writeHTML) return null;

  return writeHTML({
    html: container.innerHTML,
    text: getRenderedPlainText(container),
  });
};

const shouldPreferElectronClipboard = (): boolean => {
  const electron = window.electron;
  if (!electron?.isElectron) return false;

  // Windows 下优先使用与手动复制一致的选区链路，降低公众号样式丢失概率
  if (electron.platform === "win32") return false;
  if (electron.platform === "darwin" || electron.platform === "linux")
    return true;
  return false;
};

// ── 主编排流程 ──────────────────────────────────────

export async function copyToWechat(
  markdown: string,
  css: string,
  options: CopyToWechatOptions = {},
): Promise<void> {
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "760px";
  container.style.opacity = "0";
  container.style.pointerEvents = "none";
  container.style.zIndex = "-1";
  container.style.contain = "layout style paint";
  // 强制亮色模式，防止暗色 UI 下 execCommand("copy") 序列化出亮色文字
  container.style.colorScheme = "light";
  container.style.color = "#000000";
  applyLightRootVars(container);
  document.body.appendChild(container);

  try {
    const parser = createMarkdownParser({
      mathRenderer: "katex",
      showMacBar: options.showMacBar === true,
    });
    const rawHtml = parser.render(markdown);
    const themedCss = buildCopyCss(css);
    const sanitizedCss = stripCounterPseudoRules(themedCss);
    const sourceHtml = getPublishingPreference("linkToFootnote")
      ? convertLinksToFootnotes(rawHtml)
      : rawHtml;
    const materializedHtml = materializeCounterPseudoContent(
      sourceHtml,
      themedCss,
    );
    const styledHtml = processHtml(materializedHtml, sanitizedCss, true, true);
    const resolvedHtml = resolveInlineStyleVariablesForCopy(styledHtml);
    // 转换 checkbox 为 emoji，微信不支持 input 标签
    const finalHtml = convertCheckboxesToEmoji(resolvedHtml);

    container.innerHTML = finalHtml;
    const mathFallback = await renderHighRiskMathAsImages(container);
    stripHiddenMathMarkupForWechat(container);
    await renderMermaidBlocks(container);
    await renderTableBlocks(container, getPublishingPreference("tableWrap"));
    renderMacSignDotsToImages(container);
    normalizeCopyContainer(container);

    let copied = false;

    const preferElectronClipboard = shouldPreferElectronClipboard();

    if (!preferElectronClipboard) {
      copied = copyViaNativeExecCommand(container);
    }

    if (!copied && window.electron?.isElectron) {
      try {
        const electronResult = await copyViaElectronClipboard(container);
        if (electronResult) {
          copied = electronResult.success;
          if (!electronResult.success) {
            console.warn(
              "[WeMD] Electron clipboard bridge unavailable, fallback to browser copy chain",
              electronResult.error || "unknown error",
            );
          }
        }
      } catch (e) {
        console.error("Electron clipboard 写入失败，降级为浏览器复制链路", e);
      }
    }

    if (!copied && preferElectronClipboard) {
      copied = copyViaNativeExecCommand(container);
    }

    // 最后回退到 Clipboard API
    if (!copied && navigator.clipboard && window.ClipboardItem) {
      console.warn(
        "[WeMD] native execCommand copy unavailable, fallback to Clipboard API",
      );
      try {
        const blob = new Blob([container.innerHTML], { type: "text/html" });
        const textBlob = new Blob([getRenderedPlainText(container)], {
          type: "text/plain",
        });
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": blob,
            "text/plain": textBlob,
          }),
        ]);
        copied = true;
      } catch (e) {
        console.error("Clipboard API 失败，使用回退方案", e);
      }
    }

    if (!copied) {
      throw new Error("浏览器剪贴板写入失败");
    }

    toast.success(
      mathFallback.imageCount > 0
        ? "已复制，部分复杂公式已自动保真处理"
        : "已复制，可以直接粘贴至微信公众号",
      {
        duration: 3000,
      },
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("复制失败详情:", error);
    toast.error(`复制失败: ${errorMsg}`);
    throw error;
  } finally {
    document.body.removeChild(container);
  }
}
