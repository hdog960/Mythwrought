// Opt-in M4 isolated placement, rotation, targeting and removal fixture.
// This is NOT the real VoxelWorld, player inventory or schema-1 save system.
import {pack3OrnamentalById,pack3OrnamentalShape} from './ornamental-pieces.mjs';
export const ORNAMENTAL_FIXTURE_FORMAT='mythwrought-pack3-ornamental-preview-v1';
const validCell=c=>Array.isArray(c)&&c.length===3&&c.every(Number.isSafeInteger)&&
  c[1]>=-3&&c[1]<=19;
const validTurn=r=>Number.isInteger(r)&&r>=0&&r<4;
const key=cell=>cell.join(',');
const compare=(a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2];
export function createPack3OrnamentalFixture(seed=179){
  if(!Number.isInteger(seed)||seed!==(seed|0))throw new TypeError('Invalid candidate seed');
  const cells=new Map();
  return Object.freeze({
    place(cell,id,rotation=0){
      if(!validCell(cell)||!validTurn(rotation)||
        !pack3OrnamentalById(id,rotation)||cells.has(key(cell)))return false;
      cells.set(key(cell),Object.freeze({id,rotation}));
      return true;
    },
    remove(cell){return validCell(cell)?cells.delete(key(cell)):false;},
    inspect(cell){return validCell(cell)?cells.get(key(cell))??null:null;},
    shapeAt(x,y,z){
      const asset=cells.get(key([x,y,z]));
      return asset?pack3OrnamentalShape(asset.id,asset.rotation):null;
    },
    snapshot(){
      const parts=[...cells].map(([loc,{id,rotation}])=>({
        cell:loc.split(',').map(Number),id,rotation
      })).sort((a,b)=>compare(a.cell,b.cell));
      // Explicit format marker prevents treating this as a production save.
      return {format:ORNAMENTAL_FIXTURE_FORMAT,seed,parts};
    }
  });
}
export function restorePack3OrnamentalFixture(payload){
  if(!payload||payload.format!==ORNAMENTAL_FIXTURE_FORMAT||
    !Number.isInteger(payload.seed)||payload.seed!==(payload.seed|0)||
    !Array.isArray(payload.parts)||payload.parts.length>300000)
    throw new TypeError('Invalid ornamental fixture payload');
  const f=createPack3OrnamentalFixture(payload.seed);
  for(const item of payload.parts){
    if(!item||!validCell(item.cell)||!validTurn(item.rotation)||
      !f.place(item.cell,item.id,item.rotation))
      throw new TypeError('Invalid, duplicate or out-of-band ornamental edit');
  }
  return f;
}
