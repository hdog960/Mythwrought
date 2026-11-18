// Opt-in B-family break/removal fixture; no production world or save mutations.
import {FOREST_CANDIDATES,createForestCandidate} from './forest-phase1-candidates.mjs';
export const FOREST_FIXTURE_VERSION='nonblock-forest-fixture-v1';
const finite3=v=>Array.isArray(v)&&v.length===3&&v.every(n=>typeof n==='number'&&Number.isFinite(n));
function rayBox(origin,direction,box,reach){
 let near=0,far=reach;
 for(let i=0;i<3;i++){
  if(Math.abs(direction[i])<1e-12){if(origin[i]<box.min[i]||origin[i]>box.max[i])return null;continue;}
  let a=(box.min[i]-origin[i])/direction[i],b=(box.max[i]-origin[i])/direction[i];
  if(a>b)[a,b]=[b,a];
  near=Math.max(near,a);far=Math.min(far,b);
  if(far<near)return null;
 }
 return near;
}
export function makeForestBreakFixture(specs,initialSidecar={version:FOREST_FIXTURE_VERSION,removed:[]}){
 if(!Array.isArray(specs)||!initialSidecar||initialSidecar.version!==FOREST_FIXTURE_VERSION||!Array.isArray(initialSidecar.removed)||initialSidecar.removed.some(k=>typeof k!=='string'))throw new TypeError('invalid fixture or sidecar');
 const objects=new Map();
 for(const spec of specs){
  if(!spec||!FOREST_CANDIDATES.includes(spec.sceneId)||!Array.isArray(spec.anchor)||spec.anchor.length!==3)throw new TypeError('invalid forest specification');
  const obj=createForestCandidate(spec.sceneId,spec.seed,...spec.anchor);
  if(objects.has(obj.instanceKey))throw new Error('duplicate forest identity');
  objects.set(obj.instanceKey,obj);
 }
 const removed=new Set(initialSidecar.removed);
 return Object.freeze({
  visible:()=>[...objects.values()].filter(o=>!removed.has(o.instanceKey)),
  pickRay:(origin,direction,reach=5)=>{
   if(!finite3(origin)||!finite3(direction)||!Number.isFinite(reach)||reach<=0)throw new TypeError('invalid ray');
   const mag=Math.hypot(...direction);if(mag<1e-12)throw new TypeError('zero direction');
   const unit=direction.map(v=>v/mag);
   const hits=[...objects.values()].filter(o=>!removed.has(o.instanceKey)).map(o=>({object:o,distance:rayBox(origin,unit,o.selectionAabb,reach)})).filter(h=>h.distance!==null);
   hits.sort((a,b)=>a.distance-b.distance||a.object.instanceKey.localeCompare(b.object.instanceKey));
   return hits[0]??null;
  },
  breakByKey:key=>{if(!objects.has(key)||removed.has(key))return false;removed.add(key);return true;},
  tombstoneSidecar:()=>Object.freeze({version:FOREST_FIXTURE_VERSION,removed:Object.freeze([...removed].sort())})
 });
}
