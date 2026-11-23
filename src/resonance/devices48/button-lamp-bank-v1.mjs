// Bounded, opt-in bank of independent D1 button/lamp previews. No runtime binding.
import {stepButtonLampPreview, BUTTON_LAMP_PREVIEW_CONTRACT} from './button-lamp-preview-v1.mjs';
export const BUTTON_LAMP_BANK_CONTRACT='resonance48-button-lamp-bank-v1';
const nat=n=>Number.isSafeInteger(n)&&n>=0;
const id=s=>typeof s==='string'&&/^[a-z0-9][a-z0-9_-]{0,63}$/.test(s);
export function stepButtonLampBank(previous,{worldId,seed,tick,entries}={}){
 if(!id(worldId)||!nat(seed)||!nat(tick)||!Array.isArray(entries)||entries.length<1||entries.length>8)throw Error('invalid bank input');
 const names=new Set(), lamps=new Set();
 for(const e of entries){
  if(!e||!id(e.buttonId)||!id(e.lampId)||e.buttonId===e.lampId||names.has(e.buttonId)||lamps.has(e.lampId)||
    typeof e.pressed!=='boolean'||!nat(e.observedGrant)||e.observedGrant>1)throw Error('invalid bank entry');
  names.add(e.buttonId);lamps.add(e.lampId);
 }
 if([...names].some(x=>lamps.has(x)))throw Error('device identity collision');
 const ordered=[...entries].sort((a,b)=>a.buttonId.localeCompare(b.buttonId,'en'));
 let old=new Map();
 if(previous!==null&&previous!==undefined){
  if(previous.contract!==BUTTON_LAMP_BANK_CONTRACT||previous.worldId!==worldId||previous.seed!==seed||
    !nat(previous.tick)||tick!==previous.tick+1||previous.activationAuthorized!==false||
    previous.authoritativeDelivery!==false||previous.productionBound!==false||
    !Array.isArray(previous.devices)||previous.devices.length!==ordered.length)throw Error('invalid previous bank');
  for(const device of previous.devices){
   if(!device||!id(device.buttonId)||old.has(device.buttonId)||device.contract!==BUTTON_LAMP_PREVIEW_CONTRACT||
     device.worldId!==worldId||device.seed!==seed||device.tick!==previous.tick||
     device.activationAuthorized!==false||device.authoritativeDelivery!==false||device.productionBound!==false)
    throw Error('invalid previous device');
   old.set(device.buttonId,device);
  }
  if(ordered.some(e=>!old.has(e.buttonId)||old.get(e.buttonId).lampId!==e.lampId))throw Error('bank roster changed');
 }
 const devices=ordered.map(e=>stepButtonLampPreview(old.get(e.buttonId)??null,{
  worldId,seed,tick,buttonId:e.buttonId,lampId:e.lampId,anchor:e.anchor,pressed:e.pressed,observedGrant:e.observedGrant
 }));
 const lit=devices.filter(d=>d.visible).length,requested=devices.reduce((n,d)=>n+d.lamp.requested,0);
 return Object.freeze({contract:BUTTON_LAMP_BANK_CONTRACT,worldId,seed,tick,devices:Object.freeze(devices),
  lit,requested,activationAuthorized:false,authoritativeDelivery:false,productionBound:false});
}
