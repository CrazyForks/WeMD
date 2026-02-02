export interface StyleOption<T = string> {
  label: string;
  value: T;
  desc?: string;
}

export const fontFamilyOptions: StyleOption[] = [
  {
    label: "无衬线",
    value:
      "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    desc: "现代简洁",
  },
  {
    label: "衬线",
    value:
      "Optima-Regular, Optima, '宋体', 'Songti SC', 'Noto Serif SC', SimSun, STSong, 'Times New Roman', serif",
    desc: "优雅传统",
  },
  {
    label: "等宽",
    value: "Menlo, Monaco, Consolas, 'Courier New', monospace",
    desc: "技术文档",
  },
];

export const fontSizeOptions: StyleOption[] = [
  { label: "14px", value: "14px", desc: "紧凑" },
  { label: "15px", value: "15px", desc: "稍小" },
  { label: "16px", value: "16px", desc: "推荐" },
  { label: "17px", value: "17px", desc: "稍大" },
  { label: "18px", value: "18px", desc: "舒适" },
];

export const primaryColorOptions: StyleOption[] = [
  { label: "翡翠绿", value: "#07C160", desc: "微信绿" },
  { label: "活力橘", value: "#FA5151", desc: "热情活力" },
  { label: "天空蓝", value: "#55C9EA", desc: "清爽自由" },
  { label: "樱花粉", value: "#FF85C0", desc: "浪漫柔和" },
  { label: "薄荷绿", value: "#13C2C2", desc: "清新自然" },
  { label: "琥珀黄", value: "#FAAD14", desc: "明亮温暖" },
  { label: "极客蓝", value: "#1890FF", desc: "科技感" },
  { label: "酱紫", value: "#722ED1", desc: "高贵典雅" },
];

export const lineHeightOptions: StyleOption[] = [
  { label: "1.5", value: "1.5", desc: "紧凑" },
  { label: "1.6", value: "1.6", desc: "适中" },
  { label: "1.7", value: "1.7", desc: "推荐" },
  { label: "1.8", value: "1.8", desc: "舒适" },
  { label: "2.0", value: "2.0", desc: "宽松" },
];

export const headingSizePresets = {
  h1: { min: 20, max: 32, default: 24 },
  h2: { min: 18, max: 28, default: 20 },
  h3: { min: 16, max: 24, default: 18 },
  h4: { min: 14, max: 20, default: 16 },
};

export const marginPresets = {
  min: 0,
  max: 60,
  step: 4,
};

export interface StylePresetOption {
  id: string;
  label: string;
}

export const headingStylePresets: StylePresetOption[] = [
  { id: "simple", label: "简约" },
  { id: "left-border", label: "左侧竖线" },
  { id: "bottom-border", label: "底部下划线" },
  { id: "double-line", label: "双线装饰" },
  { id: "boxed", label: "背景块" },
  { id: "bottom-highlight", label: "底部高亮" },
  { id: "pill", label: "高亮胶囊" },
  { id: "bracket", label: "括号装饰" },
];

export const boldStyleOptions = [
  { id: "none", label: "基础加粗" },
  { id: "color", label: "随主题色" },
  { id: "highlighter", label: "荧光笔" },
  { id: "highlighter-bottom", label: "底部涂抹" },
  { id: "underline", label: "下划线" },
  { id: "dot", label: "着重号" },
];

export const quoteStylePresets: StylePresetOption[] = [
  { id: "left-border", label: "经典竖线" },
  { id: "top-bottom-border", label: "上下双线" },
  { id: "quotation-marks", label: "大引号" },
  { id: "boxed", label: "极简边框" },
  { id: "center-accent", label: "中心强调" },
  { id: "corner-frame", label: "直角边框" },
];

export const ulStyleOptions: StyleOption[] = [
  { label: "实心圆点", value: "disc" },
  { label: "空心圆点", value: "circle" },
  { label: "实心正方形", value: "square" },
  { label: "无", value: "none" },
];

export const olStyleOptions: StyleOption[] = [
  { label: "数字 (1, 2, 3)", value: "decimal" },
  { label: "字母 (a, b, c)", value: "lower-alpha" },
  { label: "罗马数字 (i, ii, iii)", value: "lower-roman" },
  { label: "中文数字", value: "cjk-ideographic" },
];

export const inlineCodeStyleOptions = [
  { id: "simple", label: "基础" },
  { id: "rounded", label: "圆角" },
  { id: "github", label: "GitHub 风格" },
  { id: "color-text", label: "着色文字" },
];

export const codeBlockThemeOptions = [
  { id: "github", label: "GitHub Light" },
  { id: "monokai", label: "Monokai" },
  { id: "vscode", label: "Atom One Dark" },
  { id: "night-owl", label: "Night Owl" },
  { id: "dracula", label: "Dracula" },
  { id: "solarized-dark", label: "Solarized Dark" },
  { id: "solarized-light", label: "Solarized Light" },
  { id: "xcode", label: "Xcode" },
  { id: "atom-one-light", label: "Atom One Light" },
];

export type StyleCategory =
  | "global"
  | "heading"
  | "paragraph"
  | "quote"
  | "list"
  | "code"
  | "image"
  | "table";

export interface CategoryConfig {
  id: StyleCategory;
  label: string;
  icon: string;
  description: string;
}

export const styleCategories: CategoryConfig[] = [
  { id: "global", label: "全局", icon: "🎨", description: "字体、主色调" },
  { id: "heading", label: "标题", icon: "H", description: "H1-H4 样式" },
  { id: "paragraph", label: "正文", icon: "¶", description: "段落样式" },
  { id: "quote", label: "引用", icon: "❝", description: "引用块样式" },
  { id: "list", label: "列表", icon: "☰", description: "列表样式" },
  { id: "code", label: "代码", icon: "</>", description: "代码块样式" },
  { id: "image", label: "图片", icon: "🖼", description: "图片样式" },
  { id: "table", label: "表格", icon: "田", description: "表格样式" },
];
