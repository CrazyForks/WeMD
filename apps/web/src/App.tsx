import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header/Header';
import { HistoryPanel } from './components/History/HistoryPanel';
import { MarkdownEditor } from './components/Editor/MarkdownEditor';
import { MarkdownPreview } from './components/Preview/MarkdownPreview';
import { useElectronFile } from './hooks/useElectronFile';
import './styles/global.css';
import './App.css';

function App() {
  // Initialize Electron file operations
  useElectronFile();

  return (
    <div className="app">
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'premium-toast',
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            color: '#1a1a1a',
            boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.12)',
            borderRadius: '50px', // 胶囊形状
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 500,
            border: '1px solid rgba(0, 0, 0, 0.05)',
            maxWidth: '400px',
          },
          success: {
            iconTheme: {
              primary: '#07c160', // 微信绿
              secondary: '#fff',
            },
            duration: 2000,
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
            duration: 3000,
          },
        }}
      />
      <Header />
      <main className="app-main">
        <div className="history-pane">
          <HistoryPanel />
        </div>
        <div className="workspace">
          <div className="editor-pane">
            <MarkdownEditor />
          </div>
          <div className="preview-pane">
            <MarkdownPreview />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
