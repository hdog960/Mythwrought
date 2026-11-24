// S14 detached snow-side color transition, preserving the original M7
// materials and S10 interior palette. Not imported by game or save loader.
// No painted hardpan/scree, no extra biome reads, no per-cap RGB allocations.
import {createSnowS10MeshResidentPigment} from './snowy-s10-single-mesh-scratch-pigment.mjs';
const smooth=t=>t*t*(3-2*t);
const clamp=t=>Math.max(0,Math.min(1,t));
export function createSnowS14EdgePigment(seed,biomeAt){
 if(typeof biomeAt!=='function')throw Error('Original climate reader required');
 let region,edgeCaps=0,interiorCaps=0;
 const s10=createSnowS10MeshResidentPigment(seed,(x,z,s)=>{
  region=biomeAt(x,z,s);return region;
 });
 function colorAt(x,y,z,id,sourceSurface,observed,below,above,
   editedCap,editedSupport,caveCap,caveSupport){
  region=undefined;
  const rgb=s10.colorAt(x,y,z,id,sourceSurface,observed,below,above,
    editedCap,editedSupport,caveCap,caveSupport);
  if(!rgb)return undefined;
  // The old climate shoulder is not a new material permission. Fade
  // ONLY existing S10-admitted winter caps on the snow side. Leave original
  // deep snow and all nonwinter source geometry/pigment exactly untouched.
  const factor=1-smooth(clamp((region.weight-.48)/.34));
  if(factor===0){interiorCaps++;return rgb;}
  // Weathered winter palette: slightly muted cool grey, not Desert
  // ochre or green Plains recoloring. Keep all three channels bounded.
  const grey=id===272 ? .76 : id===276 ? .73 : .65;
  const r=grey,g=grey+.014,b=grey+.022;
  rgb[0]=Math.round((rgb[0]+(r-rgb[0])*factor*.65)*1e6)/1e6;
  rgb[1]=Math.round((rgb[1]+(g-rgb[1])*factor*.65)*1e6)/1e6;
  rgb[2]=Math.round((rgb[2]+(b-rgb[2])*factor*.65)*1e6)/1e6;
  edgeCaps++;return rgb;
 }
 return Object.freeze({colorAt,stats:()=>Object.freeze({...s10.stats(),edgeCaps,interiorCaps}),
   originalMaterialUvAndGeometryUnchanged:true,generatorUnregistered:true});
}
