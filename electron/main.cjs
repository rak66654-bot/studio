const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const http = require('http');

let mainWindow = null;
const PORT = process.env.PORT || 3000;

function startLocalServer() {
  try {
    // Attempt to start the compiled bundled express server
    const serverPath = path.join(__dirname, '../dist/server.cjs');
    require(serverPath);
    console.log('[Electron] Server backend running from:', serverPath);
  } catch (err) {
    console.warn('[Electron] Backend server load info:', err.message);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 1024,
    minHeight: 700,
    title: 'HAMA PRO EDITING - Video & Equalizer Studio',
    backgroundColor: '#020617',
    icon: path.join(__dirname, '../public/favicon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
    autoHideMenuBar: true,
  });

  const appUrl = `http://localhost:${PORT}`;

  // Poll until local server is up, then load URL
  let attempts = 0;
  const pollServer = () => {
    attempts++;
    http
      .get(appUrl, () => {
        mainWindow.loadURL(appUrl);
      })
      .on('error', () => {
        if (attempts < 30) {
          setTimeout(pollServer, 300);
        } else {
          // Fallback to static dist if server didn't respond
          mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
        }
      });
  };

  pollServer();

  // Open external links (e.g. Vercel, Google AI Studio) in standard system browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  startLocalServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
