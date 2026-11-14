// Pack 3 opt-in geometry interaction/save PROPOSAL fixture. Not production.
// Explicitly separate from the current schema-1 VoxelWorld restore path: it
// rejects candidate IDs 113–115 and has no orientation-state reader yet.
import {pack3GeometryById,pack3GeometryShape} from './roof-geometry.mjs';
const FORMAT='mythwrought-pack3-oriented-preview-v1';
const validCell=c=>Array.isArray(c)&&c.length===3&&c.every(Number.isSafeInteger)&&
  c[1]>=-3&&c[1]<=19;
const key=c=>c.join(',');
const cellsort=(a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2];
function normalized(seed){
  if(!Number.isSafeInteger(seed)||seed!==(seed|0))throw new TypeError('Invalid preview seed');
  return seed;
}
export function createPack3RoofGeometryFixture(seed=179){
  normalized(seed);
  const placed=new Map();
  return Object.freeze({
    place(cell,id,rotation=0){
      if(!validCell(cell)||!pack3GeometryById(id,rotation)||placed.has(key(cell)))
        return false;
      placed.set(key(cell),Object.freeze({id,rotation}));
      return true;
    },
    remove(cell){return validCell(cell)?placed.delete(key(cell)):false;},
    inspect(cell){return validCell(cell)?placed.get(key(cell))??null:null;},
    // Compatible with the unmerged :00 getShape(x,y,z) signature.
    shapeAt(x,y,z){
      const value=placed.get(key([x,y,z]));
      return value?pack3GeometryShape(value.id,value.rotation):null;
    },
    snapshot(){
      const rows=[...placed].map(([loc,{id,rotation}])=>({
        cell:loc.split(',').map(Number),id,rotation
      })).sort((a,b)=>cellsort(a.cell,b.cell));
      return Object.freeze({
        format:FORMAT,schema:1,seed,
        edits:rows.map(({cell,id})=>[...cell,id]),
        // Candidate-only additive rotation sidecar; NOT readable by live game.
        orientations:rows.map(({cell,rotation})=>[...cell,rotation])
      });
    }
  });
}
export function restorePack3RoofGeometryFixture(value){
  if(!value||value.format!==FORMAT||value.schema!==1||!Number.isInteger(value.seed)||
    value.seed!==(value.seed|0)||!Array.isArray(value.edits)||
    !Array.isArray(value.orientations)||value.edits.length!==value.orientations.length||
    value.edits.length>300000)throw new TypeError('Invalid oriented roofing preview');
  const result=createPack3RoofGeometryFixture(value.seed);
  for(let i=0;i<value.edits.length;i++){
    const edit=value.edits[i],angle=value.orientations[i];
    if(!Array.isArray(edit)||edit.length!==4||!Array.isArray(angle)||
      angle.length!==4||!validCell(edit.slice(0,3))||
      !validCell(angle.slice(0,3))||
      edit.slice(0,3).some((n,j)=>n!==angle[j])||
      !Number.isInteger(angle[3])||angle[3]<0||angle[3]>3||
      !result.place(edit.slice(0,3),edit[3],angle[3]))
      throw new TypeError('Invalid candidate roof cell, ID or orientation');
  }
  return result;
}
