import { ElectronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'
const api = {}

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

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', new ElectronAPI())
    contextBridge.exposeInMainWorld('api', api)
    

    contextBridge.exposeInMainWorld('electronAPI', {
      onUpdateMessage: (callback: (message: string) => void) => {
        ipcRenderer.on('update-message', (_, message) => callback(message))
      },
      onUpdateProgress: (callback: (progress: number) => void) => {
        ipcRenderer.on('update-progress', (_, progress) => callback(progress))
      }
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = new ElectronAPI()
  // @ts-ignore (define in dts)
  window.api = api
  
  // @ts-ignore
  window.electronAPI = {
    onUpdateMessage: (callback) => {
      ipcRenderer.on('update-message', (_, message) => callback(message))
    },
    onUpdateProgress: (callback) => {
      ipcRenderer.on('update-progress', (_, progress) => callback(progress))
    }
  }
}