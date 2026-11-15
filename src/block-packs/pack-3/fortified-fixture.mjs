// Opt-in Pack 3 fortification cell fixture. Does not alter or imitate live saves.
import {pack3FortifiedById,pack3FortifiedShape} from './fortified-pieces.mjs';
export const FORTIFIED_FIXTURE_FORMAT='mythwrought-pack3-fortified-candidate-v1';
const cellOK=cell=>Array.isArray(cell)&&cell.length===3&&
  cell.every(Number.isSafeInteger)&&cell[1]>=-3&&cell[1]<=19;
const rotationOK=r=>Number.isInteger(r)&&r>=0&&r<=3;
const key=cell=>cell.join(',');
const sort=(a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2];
export function createPack3FortifiedFixture(seed=179){
  if(!Number.isInteger(seed)||seed!==(seed|0))throw new TypeError('Invalid preview seed');
  const placed=new Map();
  return Object.freeze({
    place(cell,id,rotation=0){
      if(!cellOK(cell)||!rotationOK(rotation)||!pack3FortifiedById(id,rotation)||
        placed.has(key(cell)))return false;
      placed.set(key(cell),Object.freeze({id,rotation}));return true;
    },
    remove(cell){return cellOK(cell)?placed.delete(key(cell)):false;},
    inspect(cell){return cellOK(cell)?placed.get(key(cell))??null:null;},
    shapeAt(x,y,z){
      const value=placed.get(key([x,y,z]));
      return value?pack3FortifiedShape(value.id,value.rotation):null;
    },
    snapshot(){
      const entries=[...placed].map(([loc,value])=>({cell:loc.split(',').map(Number),...value}));
      entries.sort((a,b)=>sort(a.cell,b.cell));
      return {format:FORTIFIED_FIXTURE_FORMAT,seed,
        // Deliberately NOT schema-1 save data: orientation and ID are together.
        parts:entries.map(({cell,id,rotation})=>({cell:[...cell],id,rotation}))};
    }
  });
}
export function restorePack3FortifiedFixture(payload){
  if(!payload||Object.hasOwn(payload,'schema')||payload.format!==FORTIFIED_FIXTURE_FORMAT||
    !Number.isInteger(payload.seed)||payload.seed!==(payload.seed|0)||
    !Array.isArray(payload.parts)||payload.parts.length>300000)
    throw new TypeError('Invalid fortified preview');
  const fixture=createPack3FortifiedFixture(payload.seed);
  for(const part of payload.parts){
    if(!part||!cellOK(part.cell)||!rotationOK(part.rotation)||
      !fixture.place(part.cell,part.id,part.rotation))
      throw new TypeError('Invalid or duplicate fortified preview piece');
  }
  return fixture;
}
