// Provisional water style, host shader and texture ownership unchanged.
export const WATER_MATERIAL=Object.freeze({id:'water',pass:'transparent',
  color:Object.freeze([0.12,0.43,0.68]),alpha:0.65,emissive:0,
  depthTest:true,depthWrite:false,cull:false,blend:'straight-alpha'});
