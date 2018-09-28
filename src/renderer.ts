'use strict';
import {ipcRenderer} from 'electron';
import {ISImemLayout, EndpointStatic, EndpointDynamic} from './interfaces';
const debug = require('debug')('mmm:renderer');

//const remote = require('remote');
//const dialog = remote.require('dialog'); 
//const dialog = require('electron').remote.dialog 

//document.write(process.versions.node);
debug("renderer:", process.type);

function getTotalGB(mem: ISImemLayout[]) : number {
  let tot = 0;
  for(let i = 0; i < mem.length; i++) {
    tot += mem[i].size;
  }
  return tot/1073741824; //  JEDEC memory standards use gigabyte as 1073741824bytes (2^30 bytes)
}

ipcRenderer.on('endpoint-new', (event: any, arg: string) => {
    const row = document.getElementById("endpoints") as HTMLTableRowElement;
    const x = row.insertCell(-1);
    const endpoint:EndpointStatic = JSON.parse(arg);
    const totalMemory = getTotalGB(endpoint.memLayout);
    let tttext = `${endpoint.cpu.manufacturer} ${endpoint.cpu.brand} ${endpoint.cpu.speed}GHz<br>` +    // CPU
        `${totalMemory}GB ${endpoint.memLayout[0].type} ${endpoint.memLayout[0].formFactor}<br>`;       // RAM
    for(let i = 0; i < endpoint.diskLayout.length; i++) {                                               // HD
        tttext += `disk${i}: ${endpoint.diskLayout[i].name}<br>`;        
    }
    tttext += `${endpoint.os.distro} ${endpoint.os.release} ${endpoint.os.arch}<br>`;                   // OS
    x.innerHTML = `<div class="tooltip"><h1>${endpoint.os.hostname}</h1>` + 
        `<p id="${endpoint.hostandport}"></p><span class="tooltiptext">${tttext}</span></div>`;
    //console.log('endpoint-new', endpoint);
    debug('endpoint-new', endpoint);
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
    const temp = endpoint.temp.max;
    const mem = Math.round(endpoint.mem.used / endpoint.mem.total * 100);
    p.innerHTML = `CPU: ${currentload}%<br>Temp: ${temp}°C<br>Mem: ${mem}%`;
    //console.log('endpoint-update', endpoint);
    debug('endpoint-update', endpoint);
})
