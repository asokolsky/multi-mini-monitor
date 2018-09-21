'use strict';

import { URL } from 'url';
import axios from 'axios';

/**
 * This is a abstraction of an endpoint 
 * running systeminformation REST service
 */
export class Endpoint {
  /** Something like 'http://192.168.1.1:4000/api/systeminformation/' */
  m_urlBase: URL;
  /** begin statis data */
  m_version: string = null;
  m_system: JSON;
  m_bios: JSON;
  m_baseboard: JSON;
  m_os: JSON;
  m_versions: JSON;
  m_cpu: JSON;
  m_gcontrollers: JSON[];
  m_gdisplays: JSON[];
  m_net: JSON[];
  m_memLayout: JSON[];
  m_diskLayout: JSON[];
  /** begin dynamic data */

  constructor(hostandport: string) {  
    console.log(`Endpoint(${hostandport})`);
    this.m_urlBase = new URL('http://' + hostandport + '/api/systeminformation/');

    // start querying the endpoint...
    axios.get(this.m_urlBase.toString() + 'getStaticData')
      .then(response => {
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
        this.m_bios = response.data.bios;
        this.m_baseboard = response.data.baseboard;
        this.m_os = response.data.os;
        this.m_versions = response.data.versions;
        this.m_cpu = response.data.cpu;
        this.m_gcontrollers = response.data.graphics.controllers;
        this.m_gdisplays = response.data.graphics.displays;
        this.m_net = response.data.net;
        this.m_memLayout = response.data.memLayout;
        this.m_diskLayout = response.data.diskLayout;
      })
      .catch(error => {
        console.log('Cant connect to ', hostandport ,' errno: ', error.errno);
      });
  }
}
