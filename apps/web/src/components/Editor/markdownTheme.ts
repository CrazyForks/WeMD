// 优雅的 Markdown 编辑器主题
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

export const wechatMarkdownHighlighting = syntaxHighlighting(
    HighlightStyle.define([
        // 标题层次
        {
            tag: t.heading1,
            fontWeight: '700',
            fontSize: '1.75em',
            color: '#1a202c',
        },
        {
            tag: t.heading2,
            fontWeight: '700',
            fontSize: '1.5em',
            color: '#2d3748',
        },
        {
            tag: t.heading3,
            fontWeight: '600',
            fontSize: '1.25em',
            color: '#4a5568',
        },
        {
            tag: t.heading4,
            fontWeight: '600',
            fontSize: '1.1em',
            color: '#4a5568',
        },
        {
            tag: t.heading5,
            fontWeight: '600',
            color: '#718096',
        },
        {
            tag: t.heading6,
            fontWeight: '600',
            color: '#718096',
        },

        // 强调样式
        {
            tag: t.emphasis,
            fontStyle: 'italic',
            color: '#2d3748',
        },
        {
            tag: t.strong,
            fontWeight: '700',
            color: '#1a202c',
        },
        {
            tag: t.strikethrough,
            textDecoration: 'line-through',
            color: '#a0aec0',
        },

        // 链接
        {
            tag: t.link,
            color: '#07c160',
            fontWeight: '500',
        },
        {
            tag: t.url,
            color: '#38b2ac',
        },

        // 行内代码 - 不设置 backgroundColor，让 CSS 控制，避免遮挡选中效果
        {
            tag: t.monospace,
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
            color: '#e53e3e',
            padding: '2px 5px',
            borderRadius: '3px',
            fontSize: '0.9em',
        },

        // 其他
        {
            tag: t.meta,
            color: '#a0aec0',
        },
        {
            tag: t.comment,
            color: '#a0aec0',
            fontStyle: 'italic',
        },
    ])
);
