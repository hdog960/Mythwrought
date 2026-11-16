// Mythwrought Creative Roadmap 9 M4 — DETACHED edit transaction planner.
// NO game imports, world writes, persistence or runtime registration.
import {validateRegisteredPlaceables} from './adapter-contract.mjs';
import {stablePlaceableKey} from './inventory-model.mjs';

export const BUILD_ABI = 'mythwrought.creative.build-plan.v1';
export const MAX_BATCH_EDITS = 24;
export const MAX_SHAPE_CELLS = 16;
export const MAX_WORLD_CELLS = 512;
export const MAX_REFRESH_CHUNKS = 48;
const DEFAULT_BOUNDS = Object.freeze({minX:-16,maxX:15,minY:0,maxY:23,minZ:-16,maxZ:15});
const INT = n => Number.isSafeInteger(n);
const xyz = p => p && INT(p.x) && INT(p.y) && INT(p.z);
const key = p => `${p.x},${p.y},${p.z}`;
const frozenVec = p => Object.freeze({x:p.x,y:p.y,z:p.z});
const frozenPlan = entry => Object.freeze({...entry,at:frozenVec(entry.at),cells:Object.freeze(entry.cells.map(frozenVec))});
function fail(reason,state,atStep=0) {return Object.freeze({ok:false,reason,atStep,state});}
function within(p,bounds) {return p.x>=bounds.minX&&p.x<=bounds.maxX&&p.y>=bounds.minY&&p.y<=bounds.maxY&&p.z>=bounds.minZ&&p.z<=bounds.maxZ;}
function boundsValid(b) {return b && ['minX','maxX','minY','maxY','minZ','maxZ'].every(k=>INT(b[k])) && b.minX<=b.maxX && b.minY>=0 && b.minY<=b.maxY && b.minZ<=b.maxZ;}
function connected(offsets) {
 const found=new Set([`${offsets[0].dx},${offsets[0].dy},${offsets[0].dz}`]);
 const candidates=[offsets[0]], all=new Map(offsets.map(o=>[`${o.dx},${o.dy},${o.dz}`,o]));
 while(candidates.length){const o=candidates.pop();for(const [dx,dy,dz] of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){
  const v=all.get(`${o.dx+dx},${o.dy+dy},${o.dz+dz}`);if(v&&!found.has(`${v.dx},${v.dy},${v.dz}`)){found.add(`${v.dx},${v.dy},${v.dz}`);candidates.push(v);}
 }}return found.size===offsets.length;
}
// Fail closed on malformed physical-family footprints. Do NOT infer geometry
// from rendered art or from IDs. Actual producer geometry must be audited later.
export function validateBuildShape(placeable) {
 const rules=placeable?.placementRules;
 if(!rules||!['block','object'].includes(placeable.kind))throw TypeError('Invalid physical-family metadata');
 if(typeof rules.requiresSupport!=='boolean')throw TypeError('Explicit support rule required');
 const footprint=placeable.kind==='block'?[{dx:0,dy:0,dz:0}]:rules.footprint;
 if(!Array.isArray(footprint)||!footprint.length||footprint.length>MAX_SHAPE_CELLS)
  throw RangeError('Missing or oversized physical shape');
 if(placeable.kind==='object'&&footprint.length<2)throw TypeError('Object needs an authored multi-cell shape');
 const occupied=new Set();
 for(const p of footprint){
  if(!p||!['dx','dy','dz'].every(k=>INT(p[k])&&Math.abs(p[k])<=4) || p.dy<0)
   throw TypeError('Invalid physical shape offset');
  const v=`${p.dx},${p.dy},${p.dz}`;if(occupied.has(v))throw TypeError('Duplicate physical shape cell');occupied.add(v);
 }
 if(!occupied.has('0,0,0'))throw TypeError('Shape anchor must be present');
 if(!connected(footprint))throw TypeError('Disconnected physical shape');
 return Object.freeze(footprint.map(p=>Object.freeze({dx:p.dx,dy:p.dy,dz:p.dz})));
}
export function rotateBuildShape(footprint,rotation=0) {
 if(!INT(rotation)||rotation<0||rotation>3)throw RangeError('Invalid 90-degree rotation');
 return Object.freeze(footprint.map(p=>{
  const {dx,dy,dz}=p;
  const x=rotation===0?dx:rotation===1?-dz:rotation===2?-dx:dz;
  const z=rotation===0?dz:rotation===1?dx:rotation===2?-dz:-dx;
  return Object.freeze({dx:x===0?0:x,dy,dz:z===0?0:z});
 }));
}
export function createBuildState({bounds=DEFAULT_BOUNDS,chunkSize=8,maxBatch=MAX_BATCH_EDITS}={}) {
 if(!boundsValid(bounds)||!INT(chunkSize)||chunkSize<2||chunkSize>64||!INT(maxBatch)||maxBatch<1||maxBatch>MAX_BATCH_EDITS)
  throw RangeError('Invalid bounded creative build-world configuration');
 return Object.freeze({abi:BUILD_ABI,revision:0,bounds:Object.freeze({...bounds}),chunkSize,maxBatch,placements:Object.freeze([])});
}
function occupiedIndex(placements){const m=new Map();for(const p of placements)for(const cell of p.cells)m.set(key(cell),p);return m;}
function regionKey(p,size){return `${Math.floor(p.x/size)},${Math.floor(p.z/size)}`;}
export function planRefreshChunks(cells,chunkSize=8){
 if(!INT(chunkSize)||chunkSize<2)throw RangeError('Bad chunk size');
 const chunks=new Set();
 for(const p of cells){if(!xyz(p))throw TypeError('Invalid edited cell');
  const x=Math.floor(p.x/chunkSize),z=Math.floor(p.z/chunkSize),lx=((p.x%chunkSize)+chunkSize)%chunkSize,lz=((p.z%chunkSize)+chunkSize)%chunkSize;
  const xs=[x],zs=[z];if(lx===0)xs.push(x-1);if(lx===chunkSize-1)xs.push(x+1);if(lz===0)zs.push(z-1);if(lz===chunkSize-1)zs.push(z+1);
  for(const xx of xs)for(const zz of zs)chunks.add(`${xx},${zz}`);
 }
 return Object.freeze([...chunks].sort((a,b)=>{const [ax,az]=a.split(',').map(Number),[bx,bz]=b.split(',').map(Number);return ax-bx||az-bz;}));
}
function allowed(ports,method,payload){try{return ports[method](payload)===true;}catch{return false;}}
// `ports` are read-only detached diagnostics. Each is mandatory and must
// return true explicitly; a permissive mock is NEVER a production authority.
export function planBuildBatch(state,actions,{catalog,ports}={}) {
 if(state?.abi!==BUILD_ABI||!Array.isArray(state.placements))throw TypeError('Invalid build state');
 if(!Array.isArray(actions)||actions.length<1||actions.length>state.maxBatch)return fail('batch-limit',state);
 if(!ports||['isRegionReady','canEdit','canOccupy','canSupport'].some(n=>typeof ports[n]!=='function'))
  return fail('adapter-contract-missing',state);
 let registry;try{registry=validateRegisteredPlaceables(catalog);}catch{return fail('invalid-registry-snapshot',state);}
 const lookup=new Map(registry.map(item=>[stablePlaceableKey(item.id),item]));
 let placements=[...state.placements], index=occupiedIndex(placements);
 const before=[],touched=[],changes=[];
 for(let i=0;i<actions.length;i++){
  const a=actions[i];if(!a||!xyz(a.at)||!['place','remove'].includes(a.type))return fail('invalid-action',state,i);
  if(!within(a.at,state.bounds))return fail('outside-bounds',state,i);
  if(a.type==='place'){
   const item=lookup.get(stablePlaceableKey(a.id));if(!item)return fail('unregistered-placeable',state,i);
   let shape;try{shape=rotateBuildShape(validateBuildShape(item),a.rotation??0);}catch{return fail('invalid-shape',state,i);}
   const cells=shape.map(o=>({x:a.at.x+o.dx,y:a.at.y+o.dy,z:a.at.z+o.dz}));
   if(cells.some(p=>!within(p,state.bounds)))return fail('outside-bounds',state,i);
   if(cells.some(p=>index.has(key(p))))return fail('occupied',state,i);
   if(cells.some(p=>!allowed(ports,'isRegionReady',{cell:p,region:regionKey(p,state.chunkSize)})))return fail('unloaded-region',state,i);
   if(cells.some(p=>!allowed(ports,'canEdit',{type:'place',cell:p,item})))return fail('edit-denied',state,i);
   if(cells.some(p=>!allowed(ports,'canOccupy',{cell:p,item,cells})))return fail('collision-denied',state,i);
   if(item.placementRules.requiresSupport){
    const bottom=Math.min(...cells.map(p=>p.y));
    const feet=cells.filter(p=>p.y===bottom);
    if(feet.some(p=>{
      const below={x:p.x,y:p.y-1,z:p.z};
      return p.y>state.bounds.minY&&!index.has(key(below)) || !allowed(ports,'canSupport',{cell:p,below,item,grounded:p.y===state.bounds.minY||index.has(key(below))});
    }))return fail('unsupported',state,i);
   }
   const entry=frozenPlan({id:item.id,kind:item.kind,at:a.at,rotation:a.rotation??0,cells});
   placements.push(entry);for(const p of entry.cells)index.set(key(p),entry);
   before.push(Object.freeze({type:'remove',at:frozenVec(a.at)}));
   touched.push(...entry.cells);changes.push(Object.freeze({type:'place',id:item.id,cells:entry.cells.length}));
  }else{
   const found=index.get(key(a.at));if(!found)return fail('nothing-to-remove',state,i);
   for(const cell of found.cells){
    if(!allowed(ports,'isRegionReady',{cell,region:regionKey(cell,state.chunkSize)}))return fail('unloaded-region',state,i);
    if(!allowed(ports,'canEdit',{type:'remove',cell,item:found}))return fail('edit-denied',state,i);
   }
   placements=placements.filter(p=>p!==found);for(const cell of found.cells)index.delete(key(cell));
   // Validate the remaining placement supports BEFORE committing the staged edit.
   // Any object/block newly losing an anchoring foot fails closed atomically.
   for(const remaining of placements){
    const original=lookup.get(stablePlaceableKey(remaining.id));
    if(!original?.placementRules?.requiresSupport)continue;
    const minY=Math.min(...remaining.cells.map(p=>p.y));
    const feet=remaining.cells.filter(p=>p.y===minY);
    if(feet.some(p=>{
     const below={x:p.x,y:p.y-1,z:p.z};
     return p.y>state.bounds.minY&&!index.has(key(below)) ||
       !allowed(ports,'canSupport',{cell:p,below,item:original,grounded:p.y===state.bounds.minY||index.has(key(below))});
    }))return fail('would-destabilize',state,i);
   }
   before.push(Object.freeze({type:'place',id:found.id,at:frozenVec(found.at),rotation:found.rotation}));
   touched.push(...found.cells);changes.push(Object.freeze({type:'remove',id:found.id,cells:found.cells.length}));
  }
  if(index.size>MAX_WORLD_CELLS)return fail('world-cell-limit',state,i);
 }
 const refresh=planRefreshChunks(touched,state.chunkSize);
 if(refresh.length>MAX_REFRESH_CHUNKS)return fail('refresh-budget',state);
 const revision=state.revision+1;
 const next=Object.freeze({...state,revision,placements:Object.freeze(placements)});
 const undoCandidate=Object.freeze({sourceRevision:state.revision,expectedRevision:revision,
  inverseActions:Object.freeze(before.reverse())});
 const transaction=Object.freeze({abi:BUILD_ABI,revision,changeCount:changes.length,
  changes:Object.freeze(changes),touchCount:new Set(touched.map(key)).size,refreshChunks:refresh,undoCandidate,
  source:'detached-only',worldCommitted:false,persisted:false});
 return Object.freeze({ok:true,state:next,transaction});
}
