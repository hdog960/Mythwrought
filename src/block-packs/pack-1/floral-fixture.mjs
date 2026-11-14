// Isolated Pack 1 flower/mushroom fixture, not the live :00 generic voxel engine.
// One removable candidate ID per cell, exact local selection boxes, schema-1-shaped
// canonical saves ONLY; rotation never silently serializes to old [x,y,z,id].
import {floralDefinition,floralDescriptor,floralOccupies} from './floral-forms.mjs';
const cellKey=(x,y,z)=>x+','+y+','+z;
const coord=(x,y,z)=>[x,y,z].every(Number.isInteger)&&y>=-3&&y<=19&&
  Math.abs(x)<=1000000&&Math.abs(z)<=1000000;
function hitBox(origin,dir,b,xyz,limit){
  let entry=-Infinity,exit=Infinity,axis=-1,sign=0;
  for(let i=0;i<3;i++){
    const lo=xyz[i]+b[i],hi=xyz[i]+b[i+3];
    if(Math.abs(dir[i])<1e-12){
      if(origin[i]<lo||origin[i]>hi)return null;
      continue;
    }
    const a=(lo-origin[i])/dir[i],c=(hi-origin[i])/dir[i];
    const near=Math.min(a,c),far=Math.max(a,c);
    if(near>entry){entry=near;axis=i;sign=a<c?-1:1;}
    exit=Math.min(exit,far);
    if(entry>exit)return null;
  }
  if(exit<0||entry>limit)return null;
  const normal=[0,0,0];if(entry>=0&&axis>=0)normal[axis]=sign;
  return {distance:Math.max(0,entry),normal};
}
export function createFloralFixture(seed=179){
  if(!Number.isInteger(seed)||seed!==(seed|0))throw new RangeError('Invalid seed');
  const cells=new Map();
  return Object.freeze({
    seed,
    get(x,y,z){return cells.get(cellKey(x,y,z))?.id??0;},
    getShape(x,y,z){return cells.get(cellKey(x,y,z))?.shape??null;},
    place(x,y,z,id,{rotation=0}={}){
      if(!coord(x,y,z))return {ok:false,reason:'invalid-coordinate'};
      if(!floralDefinition(id))return {ok:false,reason:'unknown-id'};
      if(cells.has(cellKey(x,y,z)))return {ok:false,reason:'occupied'};
      const shape=floralDescriptor(id,{rotation});
      cells.set(cellKey(x,y,z),{id,shape});
      return {ok:true,id,cell:[x,y,z],rotation};
    },
    remove(x,y,z){
      if(!coord(x,y,z))return {ok:false,reason:'invalid-coordinate'};
      const hit=cells.get(cellKey(x,y,z));
      if(!hit)return {ok:false,reason:'empty'};
      cells.delete(cellKey(x,y,z));
      return {ok:true,id:hit.id,cell:[x,y,z]};
    },
    probe(x,y,z,point,mode='selection'){
      const hit=cells.get(cellKey(x,y,z));if(!hit)return null;
      if(!floralOccupies(hit.id,point,{rotation:hit.shape.rotation,mode}))return null;
      return {id:hit.id,cell:[x,y,z],mode};
    },
    raycast(origin,direction,reach=6){
      if(!Array.isArray(origin)||origin.length!==3||!Array.isArray(direction)||
         direction.length!==3||![...origin,...direction,reach].every(Number.isFinite)||
         reach<=0||reach>64)throw new TypeError('Invalid ray');
      const length=Math.hypot(...direction);
      if(length<1e-12)throw new RangeError('Zero direction');
      const dir=direction.map(v=>v/length);
      let closest=null;
      for(const [key,record] of cells){
        const xyz=key.split(',').map(Number);
        for(const box of record.shape.selection.boxes){
          const hit=hitBox(origin,dir,box,xyz,reach);
          if(hit&&(!closest||hit.distance<closest.distance-1e-9))
            closest={id:record.id,cell:xyz,distance:hit.distance,normal:hit.normal};
        }
      }
      return closest;
    },
    save(){
      const edits=[];
      for(const [key,v] of cells){
        if(v.shape.orientationRequiresEngineSave)
          throw new Error('Rotated flower/mushroom needs central orientation persistence');
        edits.push([...key.split(',').map(Number),v.id]);
      }
      edits.sort((a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2]);
      return {schema:1,seed,edits};
    },
    get size(){return cells.size;}
  });
}
export function restoreFloralFixture(payload){
  if(!payload||payload.schema!==1||!Number.isInteger(payload.seed)||
     payload.seed!==(payload.seed|0)||!Array.isArray(payload.edits)||
     payload.edits.length>300000)throw new TypeError('Invalid floral fixture payload');
  const fixture=createFloralFixture(payload.seed);
  for(const row of payload.edits){
    if(!Array.isArray(row)||row.length!==4||!fixture.place(...row).ok)
      throw new TypeError('Invalid or duplicate floral fixture edit');
  }
  return fixture;
}
