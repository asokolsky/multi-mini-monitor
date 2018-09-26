'use strict';

/**
 *  systeminformation Interfaces
 *  current as of systeminformation v3.45.6
 */
export interface ISIsystem {
    manufacturer: string;
    model: string;
    version: string;
    serial: string;
    uuid: string;
    sku: string;
}
export interface ISIos {
    platform: string; // 'linux', 
    distro: string; // 'LinuxMint', 
    release: string; // '19', 
    codename: string; // 'tara', 
    kernel: string; // '4.15.0-34-generic', 
    arch: string; // 'x64', 
    hostname: string; // 'latitude', 
    logofile: string; // 'mint'
}
export interface ISIcpu {
    manufacturer: string; // 'Intel®', 
    brand: string; // 'Core™ i7-5600U', 
    vendor: string; // 'GenuineIntel', 
    family: string; // '6', 
    model: string; // '61', 
    stepping: string; // '4',
    revision: string; // '', 
    voltage: string; // '', 
    speed: string; // '2.60', 
    speedmin: string; // '0.50', 
    speedmax: string; // '3.20',
    cores: number, // 4
    cache: number[]; // { l1d: 32768, l1i: 32768, l2: 262144, l3: 4194304 },
    flags: string; // '...' 
}
export interface ISInetIface {
    iface: string; // 'wlp2s0',
    ip4: string; // '192.168.1.216', 
    ip6: string; // 'fe80::ac10:3730:5abd:700d', 
    mac: string; // '18:5e:0f:31:0e:61', 
    internal: boolean; // false
}
export interface ISItime {
    current: number; // 1537738139158, 
    uptime: number; // 162844, 
    timezone: string; // 'GMT-0700', 
    timezoneName: string; // 'PDT'
}
export interface ISIcpuCurrentSpeed {
    min: number; // 2.08, 
    max: number; // 2.37, 
    avg: number; // 2.22, 
    cores: number[]; // [ 2.37, 2.08, 2.18, 2.26 ]
}
export interface ISIcurrentLoad {
    avgload: number; // 0.39, 
    currentload: number; // 24.057217165149545, 
    currentload_user: number; // 14.174252275682706, 
    currentload_system: number; // 9.882964889466841,
    currentload_nice: number; // 0, 
    currentload_idle: number; // 75.94278283485045, 
    currentload_irq: number; // 0, 
    raw_currentload: number; // 18500, 
    raw_currentload_user: number; // 10900, 
    raw_currentload_system: number; // 7600,
    raw_currentload_nice: number; // 0, 
    raw_currentload_idle: number; // 58400, 
    raw_currentload_irq: number; // 0,
    cpus: JSON[]; //  [Object], [Object], [Object], [Object] ]
}
export interface ISIbattery {
    hasbattery: boolean; // true, 
    cyclecount: number; // 0, 
    ischarging: boolean; // true, 
    maxcapacity: number; // 7200000, 
    currentcapacity: number; // 3714000,
    percent: number; // 66, 
    timeremaining: number; // -1, 
    acconnected: boolean; // true, 
    type: string; // 'Li-poly', 
    model: string; // 'DELL G95J55A', 
    manufacturer: string; // 'LGC-LGC3.6', 
    serial: string; // '39316'
}
export interface ISImem {
    total: number; // 16685002752, 
    free: number; // 7433994240, 
    used: number; // 9250525184, 
    active: number; // 3559079936, 
    available: number; // 12176764928,
    buffcache: number; // 5691928576, 
    swaptotal: number; // 2147479552, 
    swapused: number; // 0, 
    swapfree: number; // 2147479552
}
export interface ISIfsStats {
    rx: number; // 2899178496, 
    wx: number; // 220202770432, 
    tx: number; // 223101948928, 
    rx_sec: number; // 0, 
    wx_sec: number; // 8497.92531120332, 
    tx_sec: number; // 8497.92531120332, 
    ms: number; // 1928
}
export interface ISIdisksIO {
    rIO: number; // 306733, 
    wIO: number; // 48577, 
    tIO: number; // 355310, 
    rIO_sec: number; // 0, 
    wIO_sec: number; // 1.0368066355624677, 
    tIO_sec: number; // 1.0368066355624677, 
    ms: number; // 1929
}
/**
 * My Interfaces used for Main\Renderer IPC
 */
export interface IEndpointStatic {
    hostandport: string;
    version: string;
    system: ISIsystem;
    os: ISIos;
    cpu: ISIcpu; 
    net: ISInetIface[];
}

export interface IEndpointDynamic {
    hostandport: string;
    time: ISItime;
    cpuCurrentspeed: ISIcpuCurrentSpeed;
    currentLoad: ISIcurrentLoad;
    battery: ISIbattery;
    mem: ISImem; 
    fsStats: ISIfsStats;
    disksIO: ISIdisksIO;
}
