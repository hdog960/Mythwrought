// Isolated manual placement/removal/save fixture for Pack 3. NOT the game engine.
// Explicit preview format and NO schema-1 marker: a candidate snapshot
// must never resemble a player save, even after future registry expansion.
import {pack3RoofById,pack3ShapeForId} from './roofing-materials.mjs';
export const ROOF_MATERIAL_FIXTURE_FORMAT='mythwrought-pack3-roof-material-preview-v1';
const coordinate=(cell)=>Array.isArray(cell)&&cell.length===3&&
  cell.every(Number.isSafeInteger)&&cell[1]>=-3&&cell[1]<=19;
const key=cell=>cell.join(',');
const compare=(a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2];
export function createPack3Fixture(seed=179){
  if(!Number.isInteger(seed)||seed!==(seed|0))throw new TypeError('Bad fixture seed');
  const cells=new Map();
  return Object.freeze({
    place(cell,id){
      if(!coordinate(cell)||!pack3RoofById(id)||cells.has(key(cell)))return false;
      cells.set(key(cell),id);return true;
    },
    remove(cell){
      if(!coordinate(cell))return false;
      return cells.delete(key(cell));
    },
    get(cell){return coordinate(cell)?cells.get(key(cell))??0:null;},
    // Adapter for future :00 raycastShapes and canPlaceShape getShape callback.
    shapeAt(x,y,z){
      return pack3ShapeForId(cells.get(key([x,y,z])))??null;
    },
    snapshot(){
      const edits=[...cells].map(([k,id])=>[...k.split(',').map(Number),id]);
      edits.sort(compare);
      return {format:ROOF_MATERIAL_FIXTURE_FORMAT,seed,edits};
    }
  });
}
export function restorePack3Fixture(payload){
  if(!payload||payload.format!==ROOF_MATERIAL_FIXTURE_FORMAT||
    Object.hasOwn(payload,'schema')||!Number.isInteger(payload.seed)||
    payload.seed!==(payload.seed|0)||!Array.isArray(payload.edits)||
    payload.edits.length>300000)throw new TypeError('Invalid candidate fixture');
  const fixture=createPack3Fixture(payload.seed);
  for(const row of payload.edits){
    if(!Array.isArray(row)||row.length!==4||
      !fixture.place(row.slice(0,3),row[3]))throw new TypeError('Invalid or duplicate fixture edit');
  }
  return fixture;
}
