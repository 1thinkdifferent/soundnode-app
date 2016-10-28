"use strict";

const {
  app,
  BrowserWindow,
  ipcMain,
  ipcRenderer,
  globalShortcut
} = require('electron');
const windowStateKeeper = require('electron-window-state');

let mainWindow;

app.on('ready', () => {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1180,
    defaultHeight: 755
  });

  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 800,
    minHeight: 640,
    center: true,
    frame: false
  });

  mainWindow.loadURL(`file://${__dirname}/app/index.html`);

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.webContents.on('will-navigate', function (e, url) {
    if (url.indexOf('build/index.html#') < 0) {
      e.preventDefault();
    }
  });

  mainWindow.webContents.on('did-finish-load', function () {
    mainWindow.setTitle('Soundnode');
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindowState.manage(mainWindow);
  initializeMediaShortcuts();
});

app.on('activate', () => {
  mainWindow.show();
  mainWindow.focus();
});

/**
 * Receive maximize event and trigger command
 */
ipcMain.on('maximizeApp', () => {
  mainWindow.maximize();
});

/**
 * Receive minimize event and trigger command
 */
ipcMain.on('minimizeApp', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

/**
 * Receive hide event and trigger command
 */
ipcMain.on('hideApp', () => {
  mainWindow.hide();
});

/**
 * Receive close event and trigger command
 */
ipcMain.on('closeApp', () => {
  if (process.platform !== "darwin") {
    app.quit();
  } else {
    mainWindow.hide();
  }
});

function initializeMediaShortcuts() {
  globalShortcut.register('MediaPlayPause', () => {
    mainWindow.webContents.send('MediaPlayPause');
  });

  globalShortcut.register('MediaStop', () => {
    mainWindow.webContents.send('MediaStop');
  });

  globalShortcut.register('MediaPreviousTrack', () => {
    mainWindow.webContents.send('MediaPreviousTrack');
  });

  globalShortcut.register('MediaNextTrack', () => {
    mainWindow.webContents.send('MediaNextTrack');
  });
}