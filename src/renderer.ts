'use strict';
import {ipcRenderer} from 'electron';
import {IEndpointStatic, IEndpointDynamic} from './interfaces';

//const remote = require('remote');
//const dialog = remote.require('dialog'); 
//const dialog = require('electron').remote.dialog 

//document.write(process.versions.node);
console.log("renderer:", process.type);

ipcRenderer.on('endpoint-new', (event: any, arg: string) => {
    const row = document.getElementById("endpoints") as HTMLTableRowElement;
    const x = row.insertCell(-1);
    const endpoint:IEndpointStatic = JSON.parse(arg);
    x.id = endpoint.hostandport;
    x.innerHTML = endpoint.hostandport;
    //console.log('endpoint-new', endpoint);
})

ipcRenderer.on('endpoint-update', (event: any, arg: string) => {
    //console.log('endpoint-update', arg);
    const endpoint:IEndpointDynamic = JSON.parse(arg);
    const currentload = Math.round(endpoint.currentLoad.currentload);
    const cell = document.getElementById(endpoint.hostandport) as HTMLTableRowElement;
    if(cell == null) {
        console.log(`endpoint-update, cant find cell "${endpoint.hostandport}"`);  
        return;
    }
    cell.innerHTML = `${endpoint.hostandport}<br>cpu:${currentload}%`;
    //console.log('endpoint-update', endpoint);
    //console.log('endpoint-update currentload', currentload);
})
