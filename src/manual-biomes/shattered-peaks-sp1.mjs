// SP1 research only. Not mounted by any production generator.
// Immutable natural admission must prove the lower physical connection and owner vetoes.
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {MOUNTAIN_V8_MATERIAL as M} from './mountain-v8-materials.mjs';
import {createUpperNaturalRegistry} from '../world-height-natural-contract.mjs';
import {physicalSectionBounds,UPPER_SECTION_COUNT} from '../world-height.mjs';
export const SP_GENERATOR='mythwrought-upper-shattered-peaks-research-v1';
export const SP_SOURCE_VERSION='sp1-ridge-field-v1';
const clamp=t=>Math.max(0,Math.min(1,t));
const smooth=t=>{t=clamp(t);return t*t*(3-2*t);};
function hash(x,z,seed,salt){
 let h=Math.imul(x,0x7feb352d)^Math.imul(z,0x846ca68b)^Math.imul(seed,0x9e3779b1)^salt;
 h=Math.imul(h^(h>>>16),0x45d9f3b);return ((h^(h>>>16))>>>0)/4294967296;
}
function noise(x,z,seed,salt){
 const a=Math.floor(x),b=Math.floor(z),u=smooth(x-a),v=smooth(z-b);
 const l=hash(a,b,seed,salt)*(1-u)+hash(a+1,b,seed,salt)*u;
 const q=hash(a,b+1,seed,salt)*(1-u)+hash(a+1,b+1,seed,salt)*u;
 return l*(1-v)+q*v;
}
const valid=(x,z)=>Number.isSafeInteger(x)&&Number.isSafeInteger(z)&&Math.abs(x)<=2147483000&&Math.abs(z)<=2147483000;
export function planShatteredPeakColumn(x,z,seed){
 if(!valid(x,z)||seed!==(seed|0))return null;
 const region=v6BiomeAt(x,z,seed);
 if(region?.name!=='mountain'||region.weight<.82)return null;
 // Conservative core taper: V6 warp can move boundaries by 72 blocks.
 // No tall field can reach a neighboring biome, even at maximal warp.
 const distance=Math.max(Math.abs(x-region.center[0]),Math.abs(z-region.center[1]));
 const taper=smooth((180-distance)/120)*smooth((region.weight-.82)/.14);
 const broad=noise(x/110,z/110,seed,401);
 const ridge=1-Math.abs(2*noise(x/76,z/76,seed,503)-1);
 const detail=noise(x/28,z/28,seed,607);
 const peak=Math.round(19+taper*(28+100*broad+68*ridge*ridge+20*detail));
 if(peak<20)return null;
 return Object.freeze({x,z,topY:Math.min(240,peak),bridgeY:19,biome:'mountain'});
}
// Admission is immutable source policy, NOT live edits or a permissive default.
// A future composed profile must prove Y19 and lower connection before admitting.
// Cache only 64 compact height tiles; no dense vertical volume.
export function createShatteredPeakRegistry(admitColumn){
 if(typeof admitColumn!=='function')throw TypeError('Immutable basal and protected-owner admission required');
 const registry=createUpperNaturalRegistry();
 registry.register(SP_GENERATOR,SP_SOURCE_VERSION,({seed,generator,sourceVersion})=>{
  const tiles=new Map();
  function tile(cx,cz){
   const key=cx+','+cz;
   if(tiles.has(key)){const t=tiles.get(key);tiles.delete(key);tiles.set(key,t);return t;}
   const heights=new Uint16Array(256);let max=0;
   for(let dz=0;dz<16;dz++)for(let dx=0;dx<16;dx++){
    const x=cx*16+dx,z=cz*16+dz,p=planShatteredPeakColumn(x,z,seed);
    if(p&&admitColumn(p,seed)===true){heights[dz*16+dx]=p.topY;max=Math.max(max,p.topY);}
   }
   const result={heights,max};tiles.set(key,result);
   if(tiles.size>64)tiles.delete(tiles.keys().next().value);
   return result;
  }
  return {seed,generator,sourceVersion,revision:()=>0,
   get(x,y,z){
    if(!valid(x,z)||!Number.isInteger(y)||y<20||y>256)return 0;
    const cx=Math.floor(x/16),cz=Math.floor(z/16),t=tile(cx,cz);
    const top=t.heights[(z-cz*16)*16+x-cx*16];
    if(y>top)return 0;
    if(y===top)return top>=140?M.snow:top>=80?M.scree:M['alpine-grass'];
    if(y>=top-2)return top>=80?M.stone:M.dirt;
    return Math.floor(y/9)%5===0?M.gneiss:M.stone;
   },
   occupied(key){
    const match=/^sky:(-?\d+),(-?\d+),(\d+)$/.exec(key);
    if(!match)return false;
    const cx=Number(match[1]),cz=Number(match[2]),section=Number(match[3]);
    if(!Number.isSafeInteger(section)||section<0||section>=UPPER_SECTION_COUNT||
       !valid(cx*16,cz*16)||!valid(cx*16+15,cz*16+15))return false;
    return tile(cx,cz).max>=physicalSectionBounds({kind:'upper',section}).minY;
   }
  };
 });
 return registry;
}
export function shatteredPeakResearchProfile(seed){
 if(seed!==(seed|0))throw TypeError('Invalid signed seed');
 return Object.freeze({kind:'mythwrought-upper-source-profile',version:1,seed,generator:SP_GENERATOR,sourceVersion:SP_SOURCE_VERSION});
}
