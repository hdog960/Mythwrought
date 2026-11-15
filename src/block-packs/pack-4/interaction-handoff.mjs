// Mythwrought Pack 4 — CANDIDATE-ONLY adapter to reviewed shared PR #106.
// Shared reference: voxel-shape-interactions.mjs @ 2054e00ead30736726d53d5aed8a1f9dc4e080a0.
// Emits exactly its {boxes} format (<=32) for future manual integration.
// No shared engine import, registration, save writes, or world placement.
import {pack4Shape,pack4State} from './fixture.mjs';

export const PACK4_SHARED_AABB_LIMIT=32;

function validateIdRotation(id,rotation){
  // Both values are strictly checked by the Pack 4 source fixture.
  pack4State(id,rotation);
}
export function pack4ShapeHandoff(id,rotation=0,purpose='collision'){
  validateIdRotation(id,rotation);
  if(purpose!=='collision'&&purpose!=='selection')
    throw new RangeError('Unknown candidate shape handoff purpose');
  const shape=pack4Shape(id,rotation);
  const original=shape[purpose];
  if(original.length<1||original.length>PACK4_SHARED_AABB_LIMIT)
    throw new RangeError('Pack 4 shape does not meet shared 32-box descriptor budget');
  const boxes=Object.freeze(original.map(b=>Object.freeze([...b])));
  if(!boxes.every(b=>b.length===6&&b.every(Number.isFinite)&&
    b.slice(0,3).every((v,i)=>v>=0&&v<b[i+3])&&
    b.slice(3).every(v=>v<=1)))
    throw new RangeError('Pack 4 shape contains invalid occupancy bounds');
  return Object.freeze({
    id,rotation,purpose,boxes,units:'voxel',
    orientation:'quarter-turn-y',
    occupancy:'union-of-axis-aligned-boxes',
    candidateOnly:true,placeable:false
  });
}

// Matches staged :00 sidecar's {cell,blockId,turns}, not Pack 4's fixture
// {cell,id,rotation}. This is a pure conversion function, not persistence.
export function pack4SidecarHandoff(cell,id,rotation=0){
  validateIdRotation(id,rotation);
  if(!Array.isArray(cell)||cell.length!==3||
     !cell.every(Number.isSafeInteger))
    throw new TypeError('Invalid Pack 4 candidate cell for sidecar');
  return Object.freeze({
    cell:Object.freeze([...cell]),blockId:id,turns:rotation
  });
}

export function pack4ReviewSidecar(entries){
  if(!Array.isArray(entries)||entries.length>4096)
    throw new TypeError('Invalid Pack 4 candidate sidecar entry list');
  const used=new Set(),out=[];
  for(const e of entries){
    // A missing/undefined rotation must never silently become the default
    // north-facing state during fixture-to-sidecar recovery.
    if(!e||typeof e!=='object'||Array.isArray(e)||
       !Object.hasOwn(e,'cell')||!Object.hasOwn(e,'id')||
       !Object.hasOwn(e,'rotation')||e.rotation===undefined)
      throw new TypeError('Incomplete Pack 4 candidate sidecar entry');
    const state=pack4SidecarHandoff(e.cell,e.id,e.rotation);
    const key=state.cell.join(',');
    if(used.has(key))throw new TypeError('Duplicate sidecar cell');
    used.add(key);out.push(state);
  }
  out.sort((a,b)=>a.cell[0]-b.cell[0]||a.cell[1]-b.cell[1]||a.cell[2]-b.cell[2]);
  return Object.freeze(out);
}

// Pack 4 fixture snapshots are test-only; never change production saves.
export function pack4FixtureToSidecarSnapshot(snapshot){
 if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot)||
   snapshot.fixture!=='mythwrought.pack4.fixture'||snapshot.schemaVersion!==1||
   !Array.isArray(snapshot.cells))
  throw TypeError('Invalid Pack 4 fixture snapshot');
 return pack4ReviewSidecar(snapshot.cells);
}
// Reverse is a fixture test input only; support cells must still exist on replay.
export function pack4SidecarToFixtureSnapshot(entries){
 if(!Array.isArray(entries)||entries.length>4096)
  throw TypeError('Invalid orientation sidecar snapshot');
 const used=new Set(),cells=[];
 for(const entry of entries){
  if(!entry||typeof entry!=='object'||Array.isArray(entry)||
     !Object.hasOwn(entry,'cell')||!Object.hasOwn(entry,'blockId')||
     !Object.hasOwn(entry,'turns'))
   throw TypeError('Malformed sidecar entry');
  const state=pack4SidecarHandoff(entry.cell,entry.blockId,entry.turns);
  const key=state.cell.join(',');
  if(used.has(key))throw TypeError('Duplicate Pack 4 orientation cell');
  used.add(key);
  cells.push({cell:[...state.cell],id:state.blockId,rotation:state.turns});
 }
 cells.sort((a,b)=>a.cell.join(',').localeCompare(b.cell.join(',')));
 return Object.freeze({fixture:'mythwrought.pack4.fixture',schemaVersion:1,
  cells:Object.freeze(cells.map(c=>Object.freeze({
   cell:Object.freeze(c.cell),id:c.id,rotation:c.rotation
  })))});
}
