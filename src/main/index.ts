import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

// Configure logging for auto-updater
log.transports.file.level = 'info'
autoUpdater.logger = log

autoUpdater.autoDownload = false

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
    
    // Check for updates after window is shown
    setTimeout(() => {
      autoUpdater.checkForUpdates()
    }, 3000)
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Auto-updater events
autoUpdater.on('checking-for-update', () => {
  log.info('Checking for updates...')
  if (mainWindow) {
    mainWindow.webContents.send('update-message', 'Checking for updates...')
  }
})

autoUpdater.on('update-available', (info) => {
  log.info('Update available:', info)
  
  // Ask user if they want to download
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Available',
    message: `Version ${info.version} is available. Do you want to download it now?`,
    buttons: ['Yes', 'No']
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.downloadUpdate()
    }
  })
})

autoUpdater.on('update-not-available', (info) => {
  log.info('Update not available:', info)
  if (mainWindow) {
    mainWindow.webContents.send('update-message', 'You have the latest version')
  }
})

autoUpdater.on('error', (err) => {
  log.error('Update error:', err)
})

autoUpdater.on('download-progress', (progressObj) => {
  let logMessage = `Download speed: ${progressObj.bytesPerSecond}`
  logMessage += ` - Downloaded ${progressObj.percent}%`
  log.info(logMessage)
  
  if (mainWindow) {
    mainWindow.webContents.send('update-progress', progressObj.percent)
  }
})

autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded:', info)
  
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Ready',
    message: 'Update downloaded. Restart now to install?',
    buttons: ['Restart', 'Later']
  }).then((result) => {
    if (result.response === 0) {
      setImmediate(() => {
        autoUpdater.quitAndInstall()
      })
    }
  })
})