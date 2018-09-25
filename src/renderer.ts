'use strict';
import {ipcRenderer} from 'electron';

 //const remote = require('remote');
//const dialog = remote.require('dialog'); 
//const dialog = require('electron').remote.dialog 

//document.write(process.versions.node);
console.log("renderer:", process.type);


ipcRenderer.on('endpoint-new', (event: any, arg: String) => {
    console.log('endpoint-new', arg);
})
ipcRenderer.on('endpoint-update', (event: any, arg: String) => {
    console.log('endpoint-update', arg);
})

