'use strict';

import axios from 'axios';
import { onEndpointNew, onEndpointUpdate } from './index';
import {ISIsystem, ISIos, ISIcpu, ISInetIface, ISItime, ISIcpuCurrentSpeed, ISIcurrentLoad, ISIbattery, 
  ISImem, ISIfsStats, ISIdisksIO, EndpointStatic, EndpointDynamic} from './interfaces';
const debug = require('debug')('mmm:endpoint');

/**
 * This is a abstraction of an endpoint, running systeminformation REST service.
 * The instances of this class belong to MAIN process.
 */
export class Endpoint {
  /** looks like 'duo:3000' */
  hostandport: string;
  /** Something like 'http://192.168.1.1:4000/api/systeminformation/' */
  m_urlBase: string;
  /** that of remote systeminformation, e.g. '3.4.5'  */
  m_version: string = null;

  /**  counter of HTTP GETs we sent to endpoint  */
  m_iRequests = 0;
  /**  counter of responses to our HTTP GETs we processed  */
  m_iResponses = 0;

  /** Start communicating */
  constructor(hostandport: string) {  
    console.log(`Endpoint(${hostandport})`);
    this.hostandport = hostandport;
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
        let r = new EndpointStatic();
        r.hostandport = hostandport;
        this.m_version = r.version = response.data.version;
        r.system = response.data.system;
        //r.bios = response.data.bios;
        //r.baseboard = response.data.baseboard;
        r.os = response.data.os;
        //r.m_versions = response.data.versions;
        r.cpu = response.data.cpu;
        //r.m_gcontrollers = response.data.graphics.controllers;
        //r.m_gdisplays = response.data.graphics.displays;
        r.net = response.data.net;
        r.memLayout = response.data.memLayout;
        r.diskLayout = response.data.diskLayout;
        onEndpointNew(JSON.stringify(r));
      })
      .catch(error => {
        this.m_iResponses++;
        console.log(`Cant connect to ${this.hostandport} errno: ${error.errno}`);
      });
    return;
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
        users[]
        networkConnections[]
        console.log('temp', response.data.temp);
        console.log('mem', response.data.mem);
        console.log('battery', response.data.battery);
        console.log('fsStats', response.data.fsStats);
        console.log('disksIO', response.data.disksIO);*/
        const r = new EndpointDynamic();
        r.hostandport = this.hostandport;
        r.time = response.data.time;
        r.cpuCurrentspeed = response.data.cpuCurrentspeed;
        r.currentLoad = response.data.currentLoad;
        r.temp = response.data.temp;
        r.mem = response.data.mem;
        r.battery = response.data.battery;
        r.fsStats = response.data.fsStats;
        r.disksIO = response.data.disksIO;
        onEndpointUpdate(JSON.stringify(r));
      })
      .catch(error => {
        this.m_iResponses++;
        console.log(`Failed to get update from ${this.hostandport}, errno: ${error.errno}`);
      });
    return;
  }
}
