// Pack 1 / Milestone 4 — isolated physical foliage placement and ray-target fixture.
// This is a pure proof harness, not a replacement for automated :00 shape systems.
// It never writes production saves or places foliage into the generated world.
import {foliageDefinition,foliageDescriptor,foliageOccupies} from './physical-foliage.mjs';
const cellKey=(x,y,z)=>[x,y,z].join(',');
const validPos=(x,y,z)=>[x,y,z].every(Number.isInteger)&&y>=-3&&y<=19&&
  Math.abs(x)<=1000000&&Math.abs(z)<=1000000;
function rayBox(origin,dir,min,max,maxRange){
  let enter=-Infinity,exit=Infinity,axis=-1,sign=0;
  for(let i=0;i<3;i++){
    if(Math.abs(dir[i])<1e-12){
      if(origin[i]<min[i]||origin[i]>max[i])return null;
      continue;
    }
    const a=(min[i]-origin[i])/dir[i],b=(max[i]-origin[i])/dir[i];
    const near=Math.min(a,b),far=Math.max(a,b);
    if(near>enter){enter=near;axis=i;sign=a<b?-1:1;}
    exit=Math.min(exit,far);
    if(enter>exit)return null;
  }
  if(exit<0||enter>maxRange)return null;
  const normal=[0,0,0];
  if(enter>=0&&axis>=0)normal[axis]=sign;
  return {distance:Math.max(0,enter),normal};
}
export function createFoliageFixture(seed=179){
  if(!Number.isInteger(seed)||seed!==(seed|0))throw new RangeError('Invalid fixture seed');
  const placed=new Map();
  return Object.freeze({
    seed,
    get(x,y,z){return placed.get(cellKey(x,y,z))?.id??0;},
    getShape(x,y,z){return placed.get(cellKey(x,y,z))?.shape??null;},
    place(x,y,z,id,{rotation=0,wallMount=false}={}){
      if(!validPos(x,y,z))return {ok:false,reason:'invalid-cell'};
      const definition=foliageDefinition(id);
      if(!definition)return {ok:false,reason:'unknown-foliage-id'};
      if(placed.has(cellKey(x,y,z)))return {ok:false,reason:'occupied-cell'};
      if(definition.attachment==='vertical-face'&&!wallMount)
        return {ok:false,reason:'mount-surface-required'};
      const shape=foliageDescriptor(id,{rotation});
      placed.set(cellKey(x,y,z),{id,shape,mount:definition.attachment==='vertical-face'});
      return {ok:true,id,cell:[x,y,z],rotation,wallMount};
    },
    remove(x,y,z){
      if(!validPos(x,y,z))return {ok:false,reason:'invalid-cell'};
      const record=placed.get(cellKey(x,y,z));
      if(!record)return {ok:false,reason:'empty-cell'};
      placed.delete(cellKey(x,y,z));
      return {ok:true,id:record.id,cell:[x,y,z]};
    },
    probe(x,y,z,point,mode='selection'){
      const record=placed.get(cellKey(x,y,z));
      if(!record)return null;
      return foliageOccupies(record.id,point,{rotation:record.shape.rotation,mode})?
        {id:record.id,cell:[x,y,z],mode}:null;
    },
    raycast(origin,direction,reach=6){
      if(!Array.isArray(origin)||origin.length!==3||!Array.isArray(direction)||
         direction.length!==3||![...origin,...direction,reach].every(Number.isFinite)||
         reach<=0||reach>64)throw new TypeError('Invalid foliage ray');
      const norm=Math.hypot(...direction);
      if(norm<1e-12)throw new RangeError('Zero direction');
      const dir=direction.map(v=>v/norm);
      let best=null;
      for(const [loc,record] of placed){
        const xyz=loc.split(',').map(Number);
        for(const b of record.shape.selection.boxes){
          const near=b.slice(0,3).map((v,i)=>v+xyz[i]);
          const far=b.slice(3).map((v,i)=>v+xyz[i]);
          const hit=rayBox(origin,dir,near,far,reach);
          if(hit&&(!best||hit.distance<best.distance-1e-9))
            best={id:record.id,cell:xyz,distance:hit.distance,normal:hit.normal};
        }
      }
      return best;
    },
    save(){
      const edits=[];
      for(const [loc,record] of placed){
        if(record.shape.orientationRequiresEngineSave)
          throw new Error('Rotated foliage requires :00 orientation persistence');
        // Mount surface is a fixture-only precondition; no extra state keys in save.
        edits.push([...loc.split(',').map(Number),record.id]);
      }
      edits.sort((a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2]);
      return {schema:1,seed,edits};
    },
    get size(){return placed.size;}
  });
}
export function restoreFoliageFixture(payload,{mountForVines=false}={}){
  if(!payload||payload.schema!==1||!Number.isInteger(payload.seed)||
     payload.seed!==(payload.seed|0)||!Array.isArray(payload.edits)||
     payload.edits.length>300000)throw new TypeError('Invalid foliage fixture schema');
  const result=createFoliageFixture(payload.seed);
  for(const row of payload.edits){
    if(!Array.isArray(row)||row.length!==4)throw new TypeError('Invalid foliage edit');
    if(!result.place(...row,{wallMount:mountForVines}).ok)
      throw new TypeError('Invalid or duplicate foliage edit or missing mount');
  }
  return result;
}
