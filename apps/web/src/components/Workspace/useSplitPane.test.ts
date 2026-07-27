import { renderHook, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getEditorWidthBounds, useSplitPane } from "./useSplitPane";

describe("getEditorWidthBounds", () => {
  it("宽窗口下编辑器上限为可用宽减去预览画布(402)", () => {
    const bounds = getEditorWidthBounds(1216);
    expect(bounds.availableWidth).toBe(1200);
    expect(bounds.min).toBe(340);
    expect(bounds.max).toBe(1200 - 402);
  });

  it("窗口过窄放不下时上限退化为编辑器下限,不再继续压缩", () => {
    const bounds = getEditorWidthBounds(700);
    expect(bounds.min).toBe(340);
    expect(bounds.max).toBe(340);
  });
});

describe("useSplitPane", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, String(value));
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
      clear: () => {
        store.clear();
      },
    });
  });

  afterEach(() => vi.unstubAllGlobals());

  // 容器未挂载时按 1200 的回退宽度计算:availableWidth=1184,max=782
  it("设定的编辑器像素宽度直接生效(不随比例换算)", () => {
    const { result } = renderHook(() => useSplitPane());
    act(() => result.current.setWidth(600));
    expect(result.current.editorWidth).toBe(600);
    expect(result.current.minWidth).toBe(340);
  });

  it("宽度超过上限时被夹回,保证预览至少 402px", () => {
    const { result } = renderHook(() => useSplitPane());
    act(() => result.current.setWidth(2000));
    expect(result.current.editorWidth).toBe(result.current.maxWidth);
    expect(result.current.editorWidth).toBe(782);
  });

  it("宽度低于下限时夹到最小编辑宽度", () => {
    const { result } = renderHook(() => useSplitPane());
    act(() => result.current.setWidth(100));
    expect(result.current.editorWidth).toBe(340);
  });

  it("编辑器像素宽度持久化到 localStorage", () => {
    const { result } = renderHook(() => useSplitPane());
    act(() => result.current.setWidth(560));
    expect(localStorage.getItem("wemd-editor-pane-width")).toBe("560");
  });
});
