const { app, BrowserWindow } = require('electron');

let win;

// index.html file path - This should be from the webpack build path
const appUrl = `file://${__dirname}/build/index.html`;

/**
 * Create Electron Browser window instance
 * @return {BrowserWindow} win
 */
function createElectronShell() {
  // Initializes the new browser window
  win = new BrowserWindow({ width: 800, height: 600 });
  // Load the html file into the browser window
  win.loadURL(appUrl);
  // Release the variable reference when the window is closed
  win.on('closed', () => { 
    win = null 
  });
  // Opens the chrome devtool
  win.webContents.openDevTools();
}

/**
 * Create the BrowserWindow instance and open the the main application
 * window when Electron's app module emits the ready event.
 */
app.on('ready', createElectronShell);

/** 
 * The app module should exit when all the windows are closed.
 * The app.quit method should be explicitely called except on Mac machine
 */
app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') app.quit();
});

/**
 * Re-activate the main window when the application in bringing forward to
 * the foreground. On mac machine the instance should be created each time
 * when the application activate event emits
 */
app.on('activate', () => {
  if(win== null) createElectronShell();
});

