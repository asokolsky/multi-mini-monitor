const { app, BrowserWindow, Menu} = require('electron');
const minimist = require('minimist');

const menuTemplate = [
  {
  label: 'File',
  submenu: [
    {
      label: 'Exit',
      accelerator: 'CmdOrCtrl+Q',
      click () { 
        app.quit() 
      }
    }
  ]
  }, 
  {
  label: 'Help',
  submenu: [{
    label: 'About',
    accelerator: 'F1',
    click () { 
      app.quit() 
    }
  }]
  }
];

let win;

// index.html file path - This should be from the webpack build path
//const appUrl = `file://${__dirname}/build/index.html`;

/**
 * Create Electron Browser window instance
 * @return {BrowserWindow} win
 */
function createElectronShell() {
  // Initializes the new browser window
  win = new BrowserWindow({ 
    show: false, 
    backgroundColor: '#FFF', 
    width: 800, height: 600 
  });
  // Load the html file into the browser window
  //win.loadURL(appUrl);
  win.loadFile('index.html')
  // Release the variable reference when the window is closed
  win.on('closed', () => { 
    win = null 
  });
  // Opens the chrome devtool
  //win.webContents.openDevTools();
  win.once('ready-to-show', () => {
    win.show();
  });
}

/**
 * Create the BrowserWindow instance and open the the main application
 * window when Electron's app module emits the ready event.
 */
app.on('ready', () => {
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
  createElectronShell();
});

/** 
 * The app module should exit when all the windows are closed.
 * The app.quit method should be explicitely called except on Mac machine
 */
app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') 
    app.quit();
});

/**
 * Re-activate the main window when the application in bringing forward to
 * the foreground. On mac machine the instance should be created each time
 * when the application activate event emits
 */
app.on('activate', () => {
  if(win == null) 
    createElectronShell();
});

/**
 *  Parse the command line
 */
console.log(process.argv);
let args = minimist(process.argv.slice(2), {
  alias: {
      h: 'help',
      v: 'version',
  },
  default: {
  }
});
console.log(`Args: ${args}`);
console.log(`Args.length: ${args.length}`);
args = args._;
console.log(`Args: ${args}`);
console.log(`Args.length: ${args.length}`);
for(let i = 0; i < args.length; i++) {
  let arg = args[i];
  console.log(arg);
}
console.log(args);
