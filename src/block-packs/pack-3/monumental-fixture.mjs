// Pack 3 M5 opt-in physical candidate placement/removal, independent of game.
// Production schema-1 saves and persistent rotation codec are NEVER touched.
import {pack3MonumentalById,pack3MonumentalShape} from './monumental-pieces.mjs';
export const MONUMENTAL_FIXTURE_FORMAT='mythwrought-pack3-monumental-preview-v1';
const validCell=c=>Array.isArray(c)&&c.length===3&&c.every(Number.isSafeInteger)&&
  c[1]>=-3&&c[1]<=19;
const validRotation=r=>Number.isInteger(r)&&r>=0&&r<=3;
const key=c=>c.join(',');
const order=(a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2];
export function createPack3MonumentalFixture(seed=179){
  if(!Number.isInteger(seed)||seed!==(seed|0))throw new TypeError('Invalid preview seed');
  const cells=new Map();
  return Object.freeze({
    place(cell,id,rotation=0){
      if(!validCell(cell)||!validRotation(rotation)||
        !pack3MonumentalById(id,rotation)||cells.has(key(cell)))return false;
      cells.set(key(cell),Object.freeze({id,rotation}));return true;
    },
    remove(cell){return validCell(cell)?cells.delete(key(cell)):false;},
    inspect(cell){return validCell(cell)?cells.get(key(cell))??null:null;},
    shapeAt(x,y,z){
      const val=cells.get(key([x,y,z]));
      return val?pack3MonumentalShape(val.id,val.rotation):null;
    },
    snapshot(){
      const parts=[...cells].map(([k,v])=>({cell:k.split(',').map(Number),
        id:v.id,rotation:v.rotation})).sort((a,b)=>order(a.cell,b.cell));
      return {format:MONUMENTAL_FIXTURE_FORMAT,seed,parts};
    }
  });
}
export function restorePack3MonumentalFixture(payload){
  if(!payload||Object.hasOwn(payload,'schema')||payload.format!==MONUMENTAL_FIXTURE_FORMAT||
    !Number.isInteger(payload.seed)||payload.seed!==(payload.seed|0)||
    !Array.isArray(payload.parts)||payload.parts.length>300000)
    throw new TypeError('Unsupported Pack 3 preview snapshot');
  const fixture=createPack3MonumentalFixture(payload.seed);
  for(const p of payload.parts){
    if(!p||!validCell(p.cell)||!validRotation(p.rotation)||
      !fixture.place(p.cell,p.id,p.rotation))
      throw new TypeError('Invalid/duplicate Pack 3 monumental candidate edit');
  }
  return fixture;
}
