// Explicit portable RESEARCH session, deliberately not an accepted game profile.
import {FourRegionWorld,fourRegionProfile,ENCHANTED_P2_GENERATOR} from './profile-world.mjs';
import {createWildsUpperResearchWorld,planWildsTowerPrototype,WILDS_PHYSICAL_MIN_Y,WILDS_PHYSICAL_MAX_Y} from './enchanted-wilds-upper-world.mjs';
import {verifySkyIslandFlightSpace} from '../floating-islands/sky-runtime-adapter.mjs';
export const WILDS_SESSION_FORMAT='mythwrought-enchanted-wilds-e2-research-1';
const SOURCE='e2a-86e99b4444aeba5b6adbf492e051368274b16a7f-e2b';
const fail=s=>{throw Error('Wilds research session: '+s);};
const int=Number.isSafeInteger;
const exactKeys=(obj,keys)=>!!obj&&typeof obj==='object'&&!Array.isArray(obj)&&Object.keys(obj).sort().join(',')===keys.slice().sort().join(',');
const compare=(a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2];
export function createWildsE2Session(seed,sites=[]){
 if(!int(seed)||seed!==(seed|0)||!Array.isArray(sites)||sites.length>8)fail('invalid seed or tower sites');
 const specs=sites.map(row=>{
   if(!Array.isArray(row)||row.length!==3||!row.every(int)||Math.abs(row[0])>1e7||Math.abs(row[1])>1e7||row[2]<22||row[2]>36)fail('invalid tower source site');
   return [...row];
 }).sort(compare);
 const ground=new FourRegionWorld(seed,fourRegionProfile(seed,ENCHANTED_P2_GENERATOR),{experimentalEnchantedWilds:true});
 const plans=specs.map(([x,z,height])=>{
   const plan=planWildsTowerPrototype(ground,x,z,{height});
   if(!plan)fail('source refused grounded tower site');
   return plan;
 });
 const host=createWildsUpperResearchWorld(ground,plans);
 // Serialize only seed, deterministic natural-site specs and explicit edits.
 // Ground is private; the original save API remains fail-closed.
 const exportBytes=()=>JSON.stringify({format:WILDS_SESSION_FORMAT,source:SOURCE,seed,
   bounds:[WILDS_PHYSICAL_MIN_Y,WILDS_PHYSICAL_MAX_Y],sites:specs,edits:host.editRows()});
 const flightReady=(position,{isNativeRegionReady,isUpperResident}={})=>{
   if(!position||![position.x,position.feet,position.z].every(Number.isFinite)||
      typeof isNativeRegionReady!=='function'||typeof isUpperResident!=='function')fail('actual renderer readiness callbacks required');
   if(position.feet<WILDS_PHYSICAL_MIN_Y||position.feet+1.78>WILDS_PHYSICAL_MAX_Y+1)
     return Object.freeze({ready:false,reason:'Body outside physical world'});
   if(position.feet<20&&!isNativeRegionReady(position))return Object.freeze({ready:false,reason:'Native surface or depth not resident'});
   // Original Island Dev flight policy is stricter at the absolute ceiling.
   return verifySkyIslandFlightSpace(position,{
     isSkySectionLoaded:r=>isUpperResident(r,host.regionRevision(r.key)),
     isBodyClear:p=>!host.collides(p.x,p.feet,p.z)});
 };
 return Object.freeze({host,exportBytes,flightReady,siteSpecs:Object.freeze(specs.map(r=>Object.freeze([...r])))});
}
export function restoreWildsE2Session(raw){
 if(typeof raw!=='string'||raw.length>500000)fail('invalid bounded portable bytes');
 let payload;try{payload=JSON.parse(raw);}catch(_){fail('malformed JSON');}
 if(!exactKeys(payload,['format','source','seed','bounds','sites','edits'])||payload.format!==WILDS_SESSION_FORMAT||payload.source!==SOURCE||
   JSON.stringify(payload.bounds)!==JSON.stringify([WILDS_PHYSICAL_MIN_Y,WILDS_PHYSICAL_MAX_Y])||
   !Array.isArray(payload.edits)||payload.edits.length>4096)fail('wrong source identity or bounds');
 const session=createWildsE2Session(payload.seed,payload.sites);
 const seen=new Set();
 for(const row of payload.edits){
   if(!Array.isArray(row)||row.length!==4||!row.every(int))fail('invalid edit row');
   const [x,y,z,id]=row,k=[x,y,z].join(',');
   if(seen.has(k)||session.host.naturalAt(x,y,z)===id||!session.host.setPhysical(x,y,z,id))fail('duplicate, redundant or invalid physical edit');
   seen.add(k);
 }
 // Refuse noncanonical payload, including unordered edits or sites.
 if(session.exportBytes()!==raw)fail('noncanonical research bytes');
 return session;
}
