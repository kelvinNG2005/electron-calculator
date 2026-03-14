import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    electronAPI: {
      onUpdateMessage: (callback: (message: string) => void) => void
      onUpdateProgress: (callback: (progress: number) => void) => void
    }
  }
}