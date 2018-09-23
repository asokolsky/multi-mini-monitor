'use strict';

import { app, BrowserWindow, Menu, dialog, clipboard} from 'electron';
import minimist = require("minimist");
import {Endpoint} from './endpoint';
const pjson = require('../package.json');

function trace2(prefix: string, msg: any) {  
  console.log(prefix, msg);
}
function trace(msg: any) {  
  console.log(msg);
}

/**
 *  Parse the command line
 */
//trace(process.argv);
const args = minimist(process.argv.slice(2), {
  alias: {
      h: 'help',
      v: 'version',
  },
  default: {
  }
});
//trace(args);
const strEndpoints = args._;

if(args.help) {
  console.log('Command line spec: host1:port1 [host2:port2]');
  process.exit(0);
} else if(strEndpoints.length == 0) {
  console.log('No endpoints specified.  Exiting.  Use --help to learn about command line spec.');
  process.exit(0);
}
//trace(`Args: ${strEndpoints}`);
//trace(`Args.length: ${strEndpoints.length}`);
//trace('Array of strings:');
//trace(strEndpoints);
/**
 * Global array for storing the endpoints - initiate connection
 */
const endpoints: Endpoint[] = new Array(strEndpoints.length);

for(let i = 0; i < strEndpoints.length; i++) {
  let endpoint = strEndpoints[i];
  //trace(endpoint);
  endpoints[i] = new Endpoint(endpoint);
}
console.log("index:", process.type);

/**
 * Start building GUI
 */
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
  win.webContents.openDevTools();
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

