'use strict';

import { app, BrowserWindow, Menu, dialog, clipboard} from "electron";
import minimist = require("minimist");
const pjson = require('../package.json');
let win: BrowserWindow;

const strFullVersion = `${pjson.name}\r\n\
${pjson.description}\r\n\
Version ${pjson.version}\r\n\
${pjson.author}\r\n\r\n\
Platform ${process.platform}\r\n\
Electron ${process.versions.electron}\r\n\
Chromium ${process.versions.chrome}\r\n\
Node ${process.versions.node}\r\n\
V8 ${process.versions.v8}`;

function trace(msg: any) {
  
  console.log(msg);
}

const menuTemplate = [
  {
  label: 'File',
  submenu: [
    {
      label: 'Exit',
      role: 'quit',
      accelerator: 'CmdOrCtrl+Q',
      //click () { 
      //  app.quit() 
      //}
    }
  ]
  }, 
  {
  label: 'Help',
  submenu: [{
    label: 'About',
    accelerator: 'F1',
    click () { 
      dialog.showMessageBox(
        win, 
        {type: 'info', title: 'About', message: strFullVersion, buttons: ['Copy', 'OK']},
        (response, checkboxChecked) => {
          if(response === 0) {
            clipboard.writeText(strFullVersion);
          }
        }
      )
    }
  }]
  }
];

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
  win.loadFile('index.html');
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
//trace(process.argv);
let args = minimist(process.argv.slice(2), {
  alias: {
      h: 'help',
      v: 'version',
  },
  default: {
  }
});
trace(`Args: ${args}`);
trace(`Args.length: ${args.length}`);
let endpoints = args._;
trace(`Args: ${endpoints}`);
trace(`Args.length: ${endpoints.length}`);
for(let i = 0; i < endpoints.length; i++) {
  let endpoint = endpoints[i];
  trace(endpoint);
}
trace(endpoints);

