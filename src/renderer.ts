'use strict';
import {ipcRenderer} from 'electron';
import {EndpointStatic, EndpointDynamic} from './interfaces';

//const remote = require('remote');
//const dialog = remote.require('dialog'); 
//const dialog = require('electron').remote.dialog 

//document.write(process.versions.node);
console.log("renderer:", process.type);

ipcRenderer.on('endpoint-new', (event: any, arg: string) => {
    const row = document.getElementById("endpoints") as HTMLTableRowElement;
    const x = row.insertCell(-1);
    const endpoint:EndpointStatic = JSON.parse(arg);
    const tttext = `${endpoint.cpu.manufacturer} ${endpoint.cpu.brand} ${endpoint.cpu.speed}<br>` + 
        `${endpoint.os.distro} ${endpoint.os.release} ${endpoint.os.arch}<br>`;
    x.innerHTML = `<div class="tooltip"><h1>${endpoint.os.hostname}</h1>` + 
        `<p id="${endpoint.hostandport}"></p><span class="tooltiptext">${tttext}</span></div>`;
    //console.log('endpoint-new', endpoint);
})

ipcRenderer.on('endpoint-update', (event: any, arg: string) => {
    //console.log('endpoint-update', arg);
    const endpoint:EndpointDynamic = JSON.parse(arg);
    const p = document.getElementById(endpoint.hostandport) as HTMLElement;
    if(p == null) {
        console.log(`endpoint-update, cant find HTML element "${endpoint.hostandport}"`);  
        return;
    }
    const currentload = Math.round(endpoint.currentLoad.currentload);
    const temp = 40; // endpoint.
    const mem = Math.round(endpoint.mem.used / endpoint.mem.total * 100);
    p.innerHTML = `CPU: ${currentload}%<br>Temp: ${temp}C<br>Mem: ${mem}%`;
    //console.log('endpoint-update', endpoint);
    //console.log('endpoint-update currentload', currentload);
})
