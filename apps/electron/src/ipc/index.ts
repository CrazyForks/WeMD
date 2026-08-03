import type { BrowserWindow } from "electron";
import { registerClipboardHandlers } from "./clipboardHandlers";
import { registerFileHandlers } from "./fileHandlers";
import { registerFolderHandlers } from "./folderHandlers";
import { registerShellHandlers } from "./shellHandlers";
import { registerThemeHandlers } from "./themeHandlers";
import { registerUpdateHandlers } from "./updateHandlers";
import { registerWindowHandlers } from "./windowHandlers";
import { registerWorkspaceHandlers } from "./workspaceHandlers";

export function registerIpcHandlers(
  getWindow: () => BrowserWindow | null,
): void {
  registerWindowHandlers(getWindow);
  registerWorkspaceHandlers(getWindow);
  registerFileHandlers();
  registerFolderHandlers();
  registerThemeHandlers();
  registerShellHandlers();
  registerClipboardHandlers();
  registerUpdateHandlers();
}
