// Pack 1 isolated partial-volume build and cell-target fixture.
// This is NOT the production world/raycast/save engine. No global side effects.
import {stoneShapeDefinition,stoneShapeDescriptor,stoneShapeOccupies} from './stone-shapes.mjs';
const MIN_Y=-3,MAX_Y=19;
const key=(x,y,z)=>[x,y,z].join(',');
const valid=(x,y,z)=>[x,y,z].every(Number.isInteger)&&y>=MIN_Y&&y<=MAX_Y&&
  Math.abs(x)<=1000000&&Math.abs(z)<=1000000;
function checkRecord(id,options){
  const asset=stoneShapeDefinition(id);
  if(!asset)return null;
  return {id,descriptor:stoneShapeDescriptor(id,options)};
}
export function createStoneShapeFixture(seed=179){
  if(!Number.isInteger(seed)||seed!==(seed|0))throw new RangeError('Invalid fixture seed');
  const cells=new Map();
  return Object.freeze({
    seed,
    get(x,y,z){return cells.get(key(x,y,z))?.id??0;},
    shapeAt(x,y,z){return cells.get(key(x,y,z))?.descriptor??null;},
    // Shape-aware :00 adapter getShape(x,y,z): returns null or {boxes}.
    getShape(x,y,z){return cells.get(key(x,y,z))?.descriptor??null;},
    place(x,y,z,id,options={}){
      if(!valid(x,y,z))return {ok:false,reason:'out-of-bounds'};
      const record=checkRecord(id,options);
      if(!record)return {ok:false,reason:'unknown-candidate'};
      if(cells.has(key(x,y,z)))return {ok:false,reason:'occupied-cell'};
      cells.set(key(x,y,z),record);
      return {ok:true,id,cell:[x,y,z],rotation:record.descriptor.rotation,variant:record.descriptor.variant};
    },
    remove(x,y,z){
      if(!valid(x,y,z))return {ok:false,reason:'out-of-bounds'};
      const record=cells.get(key(x,y,z));
      if(!record)return {ok:false,reason:'empty-cell'};
      cells.delete(key(x,y,z));
      return {ok:true,id:record.id,cell:[x,y,z]};
    },
    // Local voxel occupancy probe to validate partial collision/targetable shape.
    // Actual raycast remains exclusively owned by generic :00.
    pick(x,y,z,local){
      const record=cells.get(key(x,y,z));
      if(!record)return null;
      if(!stoneShapeOccupies(record.id,local,
         {rotation:record.descriptor.rotation,variant:record.descriptor.variant}))return null;
      return Object.freeze({id:record.id,cell:Object.freeze([x,y,z]),
        shape:record.descriptor.kind});
    },
    save(){
      const edits=[];
      for(const [position,record] of cells){
        if(record.descriptor.orientationRequiresEngineSave)
          throw new Error('Cannot serialize oriented stone shape before :00 engine state support');
        edits.push([...position.split(',').map(Number),record.id]);
      }
      edits.sort((a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2]);
      return {schema:1,seed,edits};
    },
    get size(){return cells.size;}
  });
}
export function restoreStoneShapeFixture(payload){
  if(!payload||payload.schema!==1||!Number.isInteger(payload.seed)||
    payload.seed!==(payload.seed|0)||!Array.isArray(payload.edits)||
    payload.edits.length>300000)throw new TypeError('Invalid fixture save payload');
  const world=createStoneShapeFixture(payload.seed);
  for(const row of payload.edits){
    if(!Array.isArray(row)||row.length!==4||!world.place(...row).ok)
      throw new TypeError('Invalid or duplicate fixture cell');
  }
  return world;
}
