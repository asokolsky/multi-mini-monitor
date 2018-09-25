'use strict';
import minimist = require("minimist");
const pjson = require('../package.json');
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
//debug(args);
const strEndpoints = args._;

if(args.help) {
  console.log('Command line spec: host1:port1 [host2:port2]');
  process.exit(0);
}
if(strEndpoints.length == 0) {
  console.log('No endpoints specified.  Exiting.  Use --help to learn about command line spec.');
  process.exit(0);
}

/**
 *  start building GUI
 */
import { app, BrowserWindow, Menu, dialog, clipboard, ipcMain} from 'electron';
import {Endpoint} from './endpoint';

//debug(`Args: ${strEndpoints}`);
//debug(`Args.length: ${strEndpoints.length}`);
//debug('Array of strings:');
//debug(strEndpoints);
/**
 * Global array for storing the endpoints - initiate connection
 */
const g_endpoints: Endpoint[] = new Array(strEndpoints.length);
for(let i = 0; i < g_endpoints.length; i++) {
  let endpoint = strEndpoints[i];
  //trace(endpoint);
  // the following will initiate network comunication with endpoints
  g_endpoints[i] = new Endpoint(endpoint);
}

/** Global variable - golder of the GUI instance */
let win: BrowserWindow;

/** called every so often, like once every 1000ms */
function onInterval() {
  for(let i = 0; i < g_endpoints.length; i++) {
    g_endpoints[i].onInterval();
  }
}

console.log("index:", process.type);

/**
 * Start building GUI
 */
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

  setInterval(onInterval, 2000);
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
 * handle asynchronous and synchronous messages sent from a renderer
 */
ipcMain.on('asynchronous-message', (event: any, arg: any) => {
  console.log('asynchronous-message', arg) // prints "ping"
  event.sender.send('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', (event: any, arg: any) => {
  console.log('synchronous-message', arg) // prints "ping"
  event.returnValue = 'pong'
})

/** Export for use by Endpoint */
export function onEndpointNew(msg: String) { 
  win.webContents.send('endpoint-new', msg);
};

/** Export for use by Endpoint */
export function onEndpointUpdate(msg: String) { 
  win.webContents.send('endpoint-update', msg);
};
