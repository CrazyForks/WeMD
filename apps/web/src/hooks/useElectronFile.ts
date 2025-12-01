import { useEffect } from 'react';
import { useEditorStore } from '../store/editorStore';
import toast from 'react-hot-toast';

// 类型定义
interface FileOperationResult {
    success: boolean;
    filePath?: string;
    content?: string;
    error?: string;
    canceled?: boolean;
}

declare global {
    interface Window {
        electron?: {
            isElectron: boolean;
            platform: string;
            file: {
                open: () => Promise<FileOperationResult>;
                save: (content: string) => Promise<FileOperationResult>;
                saveAs: (content: string) => Promise<FileOperationResult>;
                onOpened: (callback: (data: FileOperationResult) => void) => void;
                onSaveRequest: (callback: () => void) => void;
                onSaveAsRequest: (callback: () => void) => void;
                removeOpenedListener: (callback: (event: any, data: FileOperationResult) => void) => void;
                removeSaveRequestListener: (callback: () => void) => void;
                removeSaveAsRequestListener: (callback: () => void) => void;
            };
        };
    }
}

export function useElectronFile() {
    const isElectron = typeof window !== 'undefined' && window.electron?.isElectron;

    useEffect(() => {
        if (!isElectron || !window.electron) return;

        const electron = window.electron;
        const { setMarkdown } = useEditorStore.getState();

        // 定义事件处理函数
        const handleOpened = (result: FileOperationResult) => {
            if (result.success && result.content) {
                setMarkdown(result.content);
                toast.success(`已打开: ${result.filePath?.split('/').pop() || '文件'}`);
            } else if (result.error) {
                toast.error(`打开失败: ${result.error}`);
            }
        };

        const handleSaveRequest = async () => {
            const { markdown } = useEditorStore.getState();
            const result = await electron.file.save(markdown);
            if (result.success) {
                toast.success(`已保存: ${result.filePath?.split('/').pop() || '文件'}`);
            } else if (result.error) {
                toast.error(`保存失败: ${result.error}`);
            }
        };

        const handleSaveAsRequest = async () => {
            const { markdown } = useEditorStore.getState();
            const result = await electron.file.saveAs(markdown);
            if (result.success) {
                toast.success(`已保存: ${result.filePath?.split('/').pop() || '文件'}`);
            } else if (result.error) {
                toast.error(`保存失败: ${result.error}`);
            }
        };

        // 注册事件监听器
        electron.file.onOpened(handleOpened);
        electron.file.onSaveRequest(handleSaveRequest);
        electron.file.onSaveAsRequest(handleSaveAsRequest);

        // 清理函数：移除事件监听器
        return () => {
            // Note: ipcRenderer.on 的回调签名是 (event, data)
            // 但我们的 handleOpened 只接收 data
            // 所以这里需要特殊处理
            electron.file.removeOpenedListener(handleOpened as any);
            electron.file.removeSaveRequestListener(handleSaveRequest);
            electron.file.removeSaveAsRequestListener(handleSaveAsRequest);
        };
    }, [isElectron]); // 只依赖 isElectron

    return { isElectron };
}
