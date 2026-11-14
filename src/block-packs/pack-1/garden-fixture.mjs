// Pack 1 M3: isolated garden-prop placement, selection, and compatibility fixture.
// No seeded world, crop gameplay, inventory, or production save state is modified.
import {gardenDefinition,gardenDescriptor,gardenOccupies} from './garden-components.mjs';
const key=(x,y,z)=>[x,y,z].join(',');
const coordinate=(x,y,z)=>[x,y,z].every(Number.isInteger)&&
  y>=-3&&y<=19&&Math.abs(x)<=1000000&&Math.abs(z)<=1000000;
function intersection(origin,dir,min,max,reach){
  let enter=-Infinity,exit=Infinity,axis=-1,sign=0;
  for(let i=0;i<3;i++){
    if(Math.abs(dir[i])<1e-10){
      if(origin[i]<min[i]||origin[i]>max[i])return null;
      continue;
    }
    const a=(min[i]-origin[i])/dir[i],b=(max[i]-origin[i])/dir[i];
    const near=Math.min(a,b),far=Math.max(a,b);
    if(near>enter){enter=near;axis=i;sign=a<b?-1:1;}
    exit=Math.min(exit,far);
    if(enter>exit)return null;
  }
  if(exit<0||enter>reach)return null;
  const distance=Math.max(0,enter);
  const normal=[0,0,0];
  if(enter>=0&&axis>=0)normal[axis]=sign;
  return {distance,normal};
}
export function createGardenFixture(seed=179){
  if(!Number.isInteger(seed)||seed!==(seed|0))
    throw new RangeError('Invalid garden fixture seed');
  const cells=new Map();
  return Object.freeze({
    seed,
    get(x,y,z){return cells.get(key(x,y,z))?.id??0;},
    getShape(x,y,z){return cells.get(key(x,y,z))?.shape??null;},
    place(x,y,z,id,{rotation=0}={}){
      if(!coordinate(x,y,z))return {ok:false,reason:'invalid-coordinate'};
      if(!gardenDefinition(id))return {ok:false,reason:'unknown-candidate-id'};
      if(cells.has(key(x,y,z)))return {ok:false,reason:'occupied-cell'};
      const shape=gardenDescriptor(id,{rotation});
      cells.set(key(x,y,z),{id,shape});
      return {ok:true,id,cell:[x,y,z],rotation};
    },
    remove(x,y,z){
      if(!coordinate(x,y,z))return {ok:false,reason:'invalid-coordinate'};
      const cell=cells.get(key(x,y,z));
      if(!cell)return {ok:false,reason:'empty-cell'};
      cells.delete(key(x,y,z));
      return {ok:true,id:cell.id,cell:[x,y,z]};
    },
    probe(x,y,z,point){
      const found=cells.get(key(x,y,z));
      if(!found)return null;
      if(!gardenOccupies(found.id,point,{rotation:found.shape.rotation}))return null;
      return {id:found.id,cell:[x,y,z]};
    },
    raycast(origin,direction,reach=6){
      if(!Array.isArray(origin)||origin.length!==3||
         !Array.isArray(direction)||direction.length!==3||
         ![...origin,...direction,reach].every(Number.isFinite)||reach<=0||reach>64)
        throw new TypeError('Invalid garden fixture ray');
      const length=Math.hypot(...direction);
      if(length<1e-10)throw new RangeError('Zero ray direction');
      const dir=direction.map(v=>v/length);
      let best=null;
      for(const [position,entry] of cells){
        const pos=position.split(',').map(Number);
        for(const box of entry.shape.boxes){
          const near=box.slice(0,3).map((v,i)=>v+pos[i]);
          const far=box.slice(3).map((v,i)=>v+pos[i]);
          const hit=intersection(origin,dir,near,far,reach);
          if(hit&&(!best||hit.distance<best.distance-1e-9)){
            best={id:entry.id,cell:pos,distance:hit.distance,normal:hit.normal};
          }
        }
      }
      return best;
    },
    save(){
      const edits=[];
      for(const [cell,entry] of cells){
        if(entry.shape.orientationRequiresEngineSave)
          throw new Error('Rotated garden piece requires central engine orientation persistence');
        edits.push([...cell.split(',').map(Number),entry.id]);
      }
      edits.sort((a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2]);
      return {schema:1,seed,edits};
    },
    get size(){return cells.size;}
  });
}
export function restoreGardenFixture(payload){
  if(!payload||payload.schema!==1||!Number.isInteger(payload.seed)||
     payload.seed!==(payload.seed|0)||!Array.isArray(payload.edits)||
     payload.edits.length>300000)throw new TypeError('Invalid schema-1-shaped garden fixture save');
  const world=createGardenFixture(payload.seed);
  for(const row of payload.edits){
    if(!Array.isArray(row)||row.length!==4||!world.place(...row).ok)
      throw new TypeError('Invalid or duplicate garden edit');
  }
  return world;
}
