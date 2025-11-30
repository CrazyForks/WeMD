import { useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { ThemePanel } from '../Theme/ThemePanel';
import { SettingsPanel } from '../Settings/SettingsPanel';
import './Header.css';

export function Header() {
    const { copyToWechat } = useEditorStore();
    const [showThemePanel, setShowThemePanel] = useState(false);
    const [showSettingsPanel, setShowSettingsPanel] = useState(false);

    return (
        <>
            <header className="app-header">
                <div className="header-left">
                    <div className="logo">
                        <svg width="40" height="40" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <path d="M40 20 H160 C171 20 180 29 180 40 V140 C180 151 171 160 160 160 H140 L140 185 L110 160 H40 C29 160 20 151 20 140 V40 C20 29 29 20 40 20 Z" fill="#1A1A1A" />
                            <rect x="50" y="50" width="100" height="12" rx="6" fill="#07C160" />
                            <path d="M60 85 L60 130 H80 L80 110 L100 130 L120 110 L120 130 H140 L140 85 L120 85 L100 105 L80 85 Z" fill="#FFFFFF" />
                        </svg>
                        <div className="logo-info">
                            <span className="logo-text">WeMD</span>
                            <span className="logo-subtitle">公众号 Markdown 排版编辑器</span>
                        </div>
                    </div>
                </div>

                <div className="header-right">
                    <button className="btn-icon" onClick={() => setShowSettingsPanel(true)} aria-label="设置">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9.5A2.5 2.5 0 1 0 12 14.5 2.5 2.5 0 1 0 12 9.5M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.33 1.82l-.02.08a2 2 0 01-3.3 0l-.02-.08a1.65 1.65 0 0 0-.33-1.82 1.65 1.65 0 0 0-1-.6 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 0-1.82-.33l.08.02a2 2 0 0 1 0-3.3l.08-.02a1.65 1.65 0 0 0 1.82-.33 1.65 1.65 0 0 0 .6-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-.6 1.65 1.65 0 0 0 .33-1.82l.02-.08a2 2 0 0 1 3.3 0l.02.08a1.65 1.65 0 0 0 .33 1.82 1.65 1.65 0 0 0 1 .6 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 .6 1 1.65 1.65 0 0 0 1.82.33l.08-.02a2 2 0 0 1 0 3.3l-.08.02a1.65 1.65 0 0 0-1.82.33 1.65 1.65 0 0 0-.6 1Z" />
                        </svg>
                    </button>
                    <button className="btn-secondary" onClick={() => setShowThemePanel(true)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                        <span>主题管理</span>
                    </button>
                    <button className="btn-primary" onClick={copyToWechat}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>复制到微信</span>
                    </button>
                </div>
            </header>

            <ThemePanel open={showThemePanel} onClose={() => setShowThemePanel(false)} />
            <SettingsPanel open={showSettingsPanel} onClose={() => setShowSettingsPanel(false)} />
        </>
    );
}
