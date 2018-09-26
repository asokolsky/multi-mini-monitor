'use strict';

import axios from 'axios';
import { onEndpointNew, onEndpointUpdate } from './index';

/**
 * This is a abstraction of an endpoint, running systeminformation REST service.
 * The instances of this class belong to MAIN process.
 */
export class Endpoint {
  /** looks like 'duo:3000' */
  m_hostandport: String;
  /** Something like 'http://192.168.1.1:4000/api/systeminformation/' */
  m_urlBase: String;

  /**  counter of HTTP GETs we sent to endpoint  */
  m_iRequests = 0;
  /**  counter of responses to our HTTP GETs we processed  */
  m_iResponses = 0;

  /** begin static data */
  m_version: String = null; // 3.45.5 - that of systeminformation
  m_system: JSON; // { manufacturer: '', model: 'Computer', version: '', serial: '-', uuid: '-', sku: '-' }
  //m_bios: JSON; // { vendor: '', version: '', releaseDate: '', revision: '' }
  //m_baseboard: JSON; // { manufacturer: '', model: '', version: '', serial: '-', assetTag: '-' }
  m_os: JSON; // { platform: 'linux', distro: 'LinuxMint', release: '19', codename: 'tara', kernel: '4.15.0-34-generic', arch: 'x64', 
    // hostname: 'latitude', logofile: 'mint' }
  //m_versions: JSON; // { kernel: '4.15.0-34-generic', openssl: '1.1.0g', node: '8.10.0', v8: '6.2.414.50', npm: '3.5.2',
    // yarn: '', pm2: '', gulp: '2.0.1', grunt: '', git: '2.17.1', tsc: '3.0.3', mysql: '', redis: '', mongodb: '', nginx: '', php: '' }
  m_cpu: JSON; // { manufacturer: 'Intel®', brand: 'Core™ i7-5600U', vendor: 'GenuineIntel', family: '6', model: '61', stepping: '4',
    // revision: '', voltage: '', speed: '2.60', speedmin: '0.50', speedmax: '3.20',
    // cores: 4,
    // cache: { l1d: 32768, l1i: 32768, l2: 262144, l3: 4194304 },
    // flags: '...' 
  //}
  //m_gcontrollers: JSON[]; // [{vendor: 'Intel Corporation', model: 'HD Graphics 5500 ', bus: '', vram: 256, vramDynamic: false } ]
  //m_gdisplays: JSON[]; // [{connection: 'eDP-1', main: true, builtin: true, model: '', 
    // resolutionx: 1920, resolutiony: 1080, sizex: 309, sizey: 174, pixeldepth: 24 }]
  m_net: JSON[]; // [{iface: 'lo', ip4: '127.0.0.1', ip6: '::1', mac: '', internal: true },
    // {iface: 'wlp2s0', ip4: '192.168.1.216', ip6: 'fe80::ac10:3730:5abd:700d', mac: '18:5e:0f:31:0e:61', internal: false }]
  //m_memLayout: JSON[]; //
  //m_diskLayout: JSON[];

  /** begin dynamic data */
  m_time: JSON = null; // { current: 1537738139158, uptime: 162844, timezone: 'GMT-0700', timezoneName: 'PDT' }
  m_cpuCurrentspeed: JSON = null; // { min: 2.08, max: 2.37, avg: 2.22, cores: [ 2.37, 2.08, 2.18, 2.26 ]}
  m_currentLoad: JSON = null; // { avgload: 0.39, 
    // currentload: 24.057217165149545, currentload_user: 14.174252275682706, currentload_system: 9.882964889466841,
    //   currentload_nice: 0, currentload_idle: 75.94278283485045, currentload_irq: 0, 
    // raw_currentload: 18500, raw_currentload_user: 10900, raw_currentload_system: 7600,
    //   raw_currentload_nice: 0, raw_currentload_idle: 58400, raw_currentload_irq: 0,
    // cpus: [ [Object], [Object], [Object], [Object] ] }
  m_battery: JSON = null; // { hasbattery: true, cyclecount: 0, ischarging: true, maxcapacity: 7200000, currentcapacity: 3714000,
    // percent: 66, timeremaining: -1, acconnected: true, type: 'Li-poly', model: 'DELL G95J55A', manufacturer: 'LGC-LGC3.6', serial: '39316' },
  m_mem: JSON = null; // { total: 16685002752, free: 7433994240, used: 9250525184, active: 3559079936, available: 12176764928,
    //  buffcache: 5691928576, swaptotal: 2147479552, swapused: 0, swapfree: 2147479552 }
  m_fsStats: JSON = null; // { rx: 2899178496, wx: 220202770432, tx: 223101948928, rx_sec: 0, wx_sec: 8497.92531120332, tx_sec: 8497.92531120332, ms: 1928 }
  m_disksIO: JSON = null; // { rIO: 306733, wIO: 48577, tIO: 355310, rIO_sec: 0, wIO_sec: 1.0368066355624677, tIO_sec: 1.0368066355624677, ms: 1929 }

  /** Start communicating */
  constructor(hostandport: string) {  
    console.log(`Endpoint(${hostandport})`);
    this.m_hostandport = hostandport;
    this.m_urlBase = 'http://' + hostandport + '/api/systeminformation/';

    // start querying the endpoint...
    this.m_iRequests++;
    axios.get(this.m_urlBase + 'getStaticData')
      .then(response => {
        this.m_iResponses++;
        console.log(`Response from ${hostandport}`);
        /*console.log('version', response.data.version);
        console.log('system', response.data.system);
        console.log('bios', response.data.bios);
        console.log('baseboard', response.data.baseboard);
        console.log('os', response.data.os);
        console.log('versions', response.data.versions);
        console.log('cpu', response.data.cpu);
        console.log('graphics.controllers', response.data.graphics.controllers);
        console.log('graphics.displays', response.data.graphics.displays);
        console.log('net', response.data.net);
        console.log('memLayout', response.data.memLayout);
        console.log('diskLayout', response.data.diskLayout);*/
        this.m_version = response.data.version;
        this.m_system = response.data.system;
        //this.m_bios = response.data.bios;
        //this.m_baseboard = response.data.baseboard;
        this.m_os = response.data.os;
        //this.m_versions = response.data.versions;
        this.m_cpu = response.data.cpu;
        //this.m_gcontrollers = response.data.graphics.controllers;
        //this.m_gdisplays = response.data.graphics.displays;
        this.m_net = response.data.net;
        //this.m_memLayout = response.data.memLayout;
        //this.m_diskLayout = response.data.diskLayout;
        onEndpointNew(this.serializeStaticData());
      })
      .catch(error => {
        this.m_iResponses++;
        console.log(`Cant connect to ${this.m_hostandport} errno: ${error.errno}`);
      });
    return;
  }

  /** Static data were just received.  Serialize it. */
  serializeStaticData() : String {
    return "{"
      + '"hostandport":' + JSON.stringify(this.m_hostandport) + ','
      + '"system":' + JSON.stringify(this.m_system) + ','
      + '"os":' + JSON.stringify(this.m_os) + ','
      + '"cpu":' + JSON.stringify(this.m_cpu) + ','
      + '"net":' + JSON.stringify(this.m_net) //+ ','
      + "}";
  }
  /** Save a short update into the sink */
  serializeUpdate() : String {
    return '{'
      + '"hostandport":' + JSON.stringify(this.m_hostandport) + ','
      + '"cpuCurrentspeed":' + JSON.stringify(this.m_cpuCurrentspeed)  + ','
      + '"currentLoad":' + JSON.stringify(this.m_currentLoad)
      + '}';
  }

  /** called periodically from the main module, updates dynamic data from this endpoint */
  onInterval() {
    if(this.m_version == null) {
      // we never got response to getStaticData yet
      //console.log(`onInterval ${this.m_hostandport} - waiting for static data`);
      return;
    }
    if(this.m_iRequests != this.m_iResponses) {
      // we are still waiting for the respose
      //console.log(`onInterval ${this.m_hostandport} - response pending`);
      return;
    }
    //console.log(`onInterval ${this.m_hostandport}`);
    // issue an update request to the endpoint
    this.m_iRequests++;
    axios.get(this.m_urlBase + 'getDynamicData')
      .then(response => {
        this.m_iResponses++;
        //console.log(`Update from ${this.m_hostandport}`);
        //console.log(response.data);
        /*console.log('time', response.data.time);
        console.log('cpuCurrentspeed', response.data.cpuCurrentspeed);
        console.log('currentLoad', response.data.currentLoad);
        console.log('battery', response.data.battery);
        console.log('mem', response.data.mem);
        console.log('fsStats', response.data.fsStats);
        console.log('disksIO', response.data.disksIO);*/
        this.m_time = response.data.time;
        this.m_cpuCurrentspeed = response.data.cpuCurrentspeed;
        this.m_currentLoad = response.data.currentLoad;
        this.m_battery = response.data.battery;
        this.m_mem = response.data.mem;
        this.m_fsStats = response.data.fsStats;
        this.m_disksIO = response.data.disksIO;
        onEndpointUpdate(this.serializeUpdate());
      })
      .catch(error => {
        this.m_iResponses++;
        console.log(`Failed to get update from ${this.m_hostandport}, errno: ${error.errno}`);
      });
    return;
  }
}
