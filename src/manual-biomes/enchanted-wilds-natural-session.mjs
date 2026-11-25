// E2C current-production natural session. Distinct research identity and
// single-record durable research storage. Never registers a game generator.
import {FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR} from './profile-world.mjs';
import {createWildsUpperResearchWorld,WILDS_PHYSICAL_MIN_Y,WILDS_PHYSICAL_MAX_Y} from './enchanted-wilds-upper-world.mjs';
import {createWildsNaturalTowerSource} from './enchanted-wilds-natural-towers.mjs';
import {skyIslandMeshKey,skyIslandSectionForY} from '../floating-islands/sky-runtime-adapter.mjs';
import {saveFingerprint} from '../persistence.mjs';
const FORMAT='mythwrought-wilds-natural-e2c-research-1';
const SOURCE='mountain-snow-a0487e34-wilds-e2c-natural-1';
const fail=s=>{throw Error('Wilds natural session: '+s);};
const integer=Number.isSafeInteger;
const exact=(o,keys)=>o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).sort().join(',')===keys.slice().sort().join(',');
export function createWildsNaturalSession(seed){
 if(!integer(seed)||seed!==(seed|0))fail('invalid seed');
 const ground=new FourRegionWorld(seed,fourRegionProfile(seed,M8_MOUNTAIN_GENERATOR),{experimentalEnchantedWilds:true});
 const source=createWildsNaturalTowerSource(ground);
 const host=createWildsUpperResearchWorld(ground,[],{naturalSource:source});
 const exportBytes=()=>JSON.stringify({format:FORMAT,source:SOURCE,seed,bounds:[WILDS_PHYSICAL_MIN_Y,WILDS_PHYSICAL_MAX_Y],edits:host.editRows()});
 function visibleUpper(position,radius=2){
   if(!position||![position.x,position.feet,position.z].every(Number.isFinite)||!integer(radius)||radius<0||radius>2)fail('invalid bounded visible query');
   const cx=Math.floor(position.x/16),cz=Math.floor(position.z/16),rows=new Map();
   for(let x=cx-radius;x<=cx+radius;x++)for(let z=cz-radius;z<=cz+radius;z++)
     for(const row of source.sections(x,z))rows.set(row.key,row);
   for(const [x,y,z,id] of host.editRows()){
     const a=Math.floor(x/16),b=Math.floor(z/16),s=skyIslandSectionForY(y);
     if(s===null||id===0||Math.max(Math.abs(a-cx),Math.abs(b-cz))>radius)continue;
     const key=skyIslandMeshKey(a,b,s);rows.set(key,{cx:a,cz:b,section:s,key});
   }
   return [...rows.values()].sort((a,b)=>(a.cx-cx)**2+(a.cz-cz)**2-(b.cx-cx)**2-(b.cz-cz)**2||
     Math.abs(27+16*a.section-position.feet)-Math.abs(27+16*b.section-position.feet)||a.cx-b.cx||a.cz-b.cz||a.section-b.section).slice(0,256);
 }
 return Object.freeze({seed,host,source,exportBytes,visibleUpper});
}
export function restoreWildsNaturalSession(raw){
 if(typeof raw!=='string'||raw.length>500000)fail('invalid bounded research bytes');
 let p;try{p=JSON.parse(raw);}catch(_){fail('invalid JSON');}
 if(!exact(p,['format','source','seed','bounds','edits'])||p.format!==FORMAT||p.source!==SOURCE||
   JSON.stringify(p.bounds)!==JSON.stringify([WILDS_PHYSICAL_MIN_Y,WILDS_PHYSICAL_MAX_Y])||!Array.isArray(p.edits)||p.edits.length>4096)
   fail('wrong source identity or bounds');
 const s=createWildsNaturalSession(p.seed),seen=new Set();
 for(const row of p.edits){
   if(!Array.isArray(row)||row.length!==4||!row.every(integer))fail('invalid edit row');
   const [x,y,z,id]=row,key=[x,y,z].join(',');
   if(seen.has(key)||s.host.naturalAt(x,y,z)===id||!s.host.setPhysical(x,y,z,id))fail('duplicate, redundant or invalid edit');
   seen.add(key);
 }
 if(s.exportBytes()!==raw)fail('noncanonical bytes');
 return s;
}
const slot=seed=>{
 if(!integer(seed)||seed!==(seed|0))fail('invalid slot seed');
 return 'mythwrought-research-wilds-e2c:'+seed;
};
function decode(raw,seed){
 let p;try{p=JSON.parse(raw);}catch(_){fail('corrupt research slot');}
 if(!exact(p,['version','checksum','raw'])||p.version!==1||typeof p.raw!=='string'||saveFingerprint(p.raw)!==p.checksum)fail('corrupt research slot');
 const session=restoreWildsNaturalSession(p.raw);
 if(session.seed!==seed)fail('wrong slot seed');
 return session;
}
export function openWildsResearchSlot(storage,seed){
 const raw=storage.getItem(slot(seed));
 return raw===null?null:Object.freeze({session:decode(raw,seed),expectedRecord:raw});
}
// One atomic storage record (native localStorage setItem atomic on failure).
// Caller must own the research slot. Byte lease detects a stale prior open;
// not a cross-tab transaction lock or release-world admission.
export function saveWildsResearchSlot(storage,session,expectedRecord=null){
 const k=slot(session.seed),raw=session.exportBytes();
 if(storage.getItem(k)!==expectedRecord)fail('stale research slot');
 if(expectedRecord!==null)decode(expectedRecord,session.seed);
 if(restoreWildsNaturalSession(raw).seed!==session.seed)fail('invalid session');
 const record=JSON.stringify({version:1,checksum:saveFingerprint(raw),raw});
 storage.setItem(k,record);
 if(storage.getItem(k)!==record)fail('research slot verification failed');
 return Object.freeze({expectedRecord:record});
}
