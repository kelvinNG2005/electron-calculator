import { contextBridge, ipcRenderer } from 'electron'

const api = {}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {})
    contextBridge.exposeInMainWorld('api', api)
    
    // This is the actual exposure of electronAPI
    contextBridge.exposeInMainWorld('electronAPI', {
      onUpdateMessage: (callback) => {
        ipcRenderer.on('update-message', (_, message) => {
          callback(message)
        })
      },
      onUpdateProgress: (callback) => {
        ipcRenderer.on('update-progress', (_, progress) => {
          callback(progress)
        })
      }
    })
    
  } catch (error) {
    console.error('Preload error:', error)
  }
} else {
  // @ts-ignore
  window.electron = {} 
  // @ts-ignore
  window.api = api
  // @ts-ignore
  window.electronAPI = {
    onUpdateMessage: (callback) => {
      ipcRenderer.on('update-message', (_, message) => {
        callback(message)
      })
    },
    onUpdateProgress: (callback) => {
      ipcRenderer.on('update-progress', (_, progress) => {
        callback(progress)
      })
    }
  }
}