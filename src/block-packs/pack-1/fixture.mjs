// Isolated pack-only physical interaction/save fixture; never touches generated world.
// Mimics existing schema-1 [x,y,z,id] deltas. NOT the production registry.
import {masonryDefinition} from './core-masonry.mjs';
const key=(x,y,z)=>x+','+y+','+z;
function coordinate(x,y,z) {
  return [x,y,z].every(Number.isInteger) && y>=-3 && y<=19 &&
         Math.abs(x)<=1_000_000 && Math.abs(z)<=1_000_000;
}
function boxHit(origin,dir,min,max,maxReach){
  let near=0,far=maxReach,axis=-1,sign=0;
  for(let i=0;i<3;i++){
    if(Math.abs(dir[i])<1e-12){
      if(origin[i]<min[i]||origin[i]>max[i])return null;
      continue;
    }
    const a=(min[i]-origin[i])/dir[i],b=(max[i]-origin[i])/dir[i];
    const entry=Math.min(a,b),exit=Math.max(a,b);
    if(entry>near){near=entry;axis=i;sign=a<b?-1:1;}
    far=Math.min(far,exit);
    if(near>far)return null;
  }
  return near<=maxReach?{distance:near,axis,sign}:null;
}
export function createMasonryFixture(seed=179) {
  if(!Number.isInteger(seed)||seed!==(seed|0))throw new RangeError('Invalid seed');
  const cells=new Map();
  return Object.freeze({
    seed,
    get(x,y,z) {return cells.get(key(x,y,z))??0;},
    place(x,y,z,id) {
      if(!coordinate(x,y,z))return {ok:false,reason:'invalid-coordinate'};
      if(!masonryDefinition(id))return {ok:false,reason:'unregistered-candidate'};
      if(cells.has(key(x,y,z)))return {ok:false,reason:'occupied'};
      cells.set(key(x,y,z),id);
      return {ok:true,cell:[x,y,z],id};
    },
    remove(x,y,z){
      if(!coordinate(x,y,z)||!cells.has(key(x,y,z)))
        return {ok:false,reason:'empty'};
      const id=cells.get(key(x,y,z));
      cells.delete(key(x,y,z));
      return {ok:true,cell:[x,y,z],id};
    },
    raycast(origin,direction,reach=6){
      if(!Array.isArray(origin)||!Array.isArray(direction)||
         origin.length!==3||direction.length!==3||
         ![...origin,...direction,reach].every(Number.isFinite)||reach<=0)
        throw new TypeError('Invalid ray');
      const length=Math.hypot(...direction);
      if(length<1e-9)throw new RangeError('Zero ray direction');
      const dir=direction.map(n=>n/length);
      let closest=null;
      for(const [name,id] of cells) {
        const cell=name.split(',').map(Number);
        const def=masonryDefinition(id);
        for(const b of def.selection.boxes){
          const min=[cell[0]+b[0],cell[1]+b[1],cell[2]+b[2]];
          const max=[cell[0]+b[3],cell[1]+b[4],cell[2]+b[5]];
          const hit=boxHit(origin,dir,min,max,reach);
          if(hit&&(!closest||hit.distance<closest.distance)){
            const face=hit.axis<0?null:[
              [hit.sign,0,0],[0,hit.sign,0],[0,0,hit.sign]
            ][hit.axis];
            closest={cell,id,distance:hit.distance,normal:face};
          }
        }
      }
      return closest;
    },
    // Copy format, not the live engine implementation. Production VoxelWorld
    // currently rejects IDs > 8, so only this isolated fixture can restore them.
    save(){
      const edits=[...cells].map(([k,id])=>[...k.split(',').map(Number),id]);
      edits.sort((a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2]);
      return {schema:1,seed,edits};
    },
    get size(){return cells.size;}
  });
}
export function restoreMasonryFixture(save){
  if(!save||save.schema!==1||!Number.isInteger(save.seed)||
     !Array.isArray(save.edits)||save.edits.length>300000)
    throw new TypeError('Invalid fixture save');
  const fixture=createMasonryFixture(save.seed);
  for(const row of save.edits){
    if(!Array.isArray(row)||row.length!==4||
       !fixture.place(...row).ok)throw new TypeError('Invalid/duplicate fixture edit');
  }
  return fixture;
}
