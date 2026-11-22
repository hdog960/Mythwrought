// Opt-in D1 button-to-lamp preview. Observations are NOT authoritative energy receipts.
import {advanceButtonEdge} from './button-edge-v1.mjs';
import {createDevice,stepDevices} from './consumer-v1.mjs';
export const BUTTON_LAMP_PREVIEW_CONTRACT='resonance48-button-lamp-preview-v1';
const nat=n=>Number.isSafeInteger(n)&&n>=0;
const id=s=>typeof s==='string'&&/^[a-z0-9][a-z0-9_-]{0,63}$/.test(s);
export function stepButtonLampPreview(previous,{worldId,seed,tick,buttonId,lampId,anchor,pressed,observedGrant=0}={}){
 if(!id(worldId)||!id(buttonId)||!id(lampId)||buttonId===lampId||!nat(seed)||!nat(tick)||typeof pressed!=='boolean'||!nat(observedGrant)||observedGrant>1)throw Error('invalid preview input');
 if(previous!==null&&previous!==undefined){
  if(previous.contract!==BUTTON_LAMP_PREVIEW_CONTRACT||previous.worldId!==worldId||previous.seed!==seed||previous.buttonId!==buttonId||previous.lampId!==lampId||!nat(previous.tick)||tick!==previous.tick+1||previous.productionBound!==false||previous.activationAuthorized!==false||previous.authoritativeDelivery!==false||typeof previous.latched!=='boolean'||!previous.button||previous.button.worldId!==worldId||previous.button.deviceId!==buttonId||previous.button.tick!==previous.tick||previous.button.activationAuthorized!==false||previous.button.productionBound!==false||previous.button.authoritativeDelivery!==false)throw Error('invalid previous preview');
 }
 const device=createDevice({id:lampId,type:'lamp',seed,anchor,enabled:true});
 const button=advanceButtonEdge(previous?.button??null,{worldId,deviceId:buttonId,tick,pressed,powered:observedGrant===1});
 // A press observed with sufficient fixture grant toggles the desired lamp state.
 // Loss of observed power never fabricates a press; the latch persists while dark.
 const latched=button.observedPress?! (previous?.latched??false):(previous?.latched??false);
 const [lamp]=stepDevices([device],[{id:lampId,granted:observedGrant}],{seed,tick});
 const visible=latched&&lamp.mode==='running';
 return Object.freeze({contract:BUTTON_LAMP_PREVIEW_CONTRACT,worldId,seed,tick,buttonId,lampId,button,latched,visible,
  lamp:Object.freeze({id:lampId,mode:visible?'preview-lit':'preview-dark',observedGrant,requested:latched?1:0}),
  activationAuthorized:false,authoritativeDelivery:false,productionBound:false});
}
