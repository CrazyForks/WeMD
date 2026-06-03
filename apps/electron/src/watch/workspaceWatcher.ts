import type { BrowserWindow } from "electron";
import * as fs from "fs";

let fileWatcher: fs.FSWatcher | null = null;
let watcherDebounceTimer: NodeJS.Timeout | null = null;

export function startWatching(
  dir: string,
  getWindow: () => BrowserWindow | null,
): void {
  if (fileWatcher) {
    fileWatcher.close();
    fileWatcher = null;
  }
  if (!dir || !fs.existsSync(dir)) return;

  try {
    fileWatcher = fs.watch(
      dir,
      { recursive: false },
      (_eventType, filename) => {
        if (!filename) return;
        if (filename.startsWith(".") || !filename.endsWith(".md")) return;

        if (watcherDebounceTimer) clearTimeout(watcherDebounceTimer);
        watcherDebounceTimer = setTimeout(() => {
          const mainWindow = getWindow();
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send("file:refresh");
          }
        }, 300);
      },
    );
  } catch (error) {
    console.error("Failed to watch directory:", error);
  }
}

export function stopWatching(): void {
  if (fileWatcher) {
    fileWatcher.close();
    fileWatcher = null;
  }
}
