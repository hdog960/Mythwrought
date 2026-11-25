// Reference host for future explicitly versioned source profiles. Not public
// production registration. Natural source is reconstructed before edits.
import {VoxelWorld} from './voxel.mjs';
export class VersionedUpperWorld extends VoxelWorld{
 #source;
 constructor(registry,profile){super(profile?.seed);this.#source=registry.open(profile);}
 get upperSourceProfile(){return this.#source.profile;}
 upperNaturalOccupied(key){return this.#source.occupied(key);}
 get upperNaturalRevision(){return this.#source.revision();}
 naturalAndLandmarkBlock(x,y,z){return y>=20?this.#source.get(x,y,z):super.naturalAndLandmarkBlock(x,y,z);}
 portable(){return {profile:this.upperSourceProfile,world:this.save()};}
 static restorePortable(registry,payload){
  if(!payload||Object.keys(payload).sort().join(',')!=='profile,world')throw Error('Invalid upper portable envelope');
  const w=new VersionedUpperWorld(registry,payload.profile),data=payload.world;
  if(!data||data.schema!==1||data.seed!==w.seed||!Array.isArray(data.edits)||data.edits.length>300000||
     Object.keys(data).some(k=>!['schema','seed','edits','rotations'].includes(k)))throw Error('Invalid upper world save');
  const rotations=new Map();
  if(data.rotations!==undefined){
   if(!Array.isArray(data.rotations)||data.rotations.length>300000)throw Error('Invalid upper rotation rows');
   for(const row of data.rotations){
    if(!Array.isArray(row)||row.length!==4||!row.every(Number.isSafeInteger)||row[3]<1||row[3]>3)throw Error('Invalid upper rotation');
    const k=row.slice(0,3).join(',');if(rotations.has(k))throw Error('Duplicate upper rotation');rotations.set(k,row[3]);
   }
  }
  const seen=new Set();
  for(const row of data.edits){
   if(!Array.isArray(row)||row.length!==4||!row.every(Number.isSafeInteger))throw Error('Invalid upper edit row');
   const k=row.slice(0,3).join(',');
   if(seen.has(k)||!w.set(...row,rotations.get(k)??0)||!w.edits.has(k))throw Error('Invalid or noncanonical upper edit');
   seen.add(k);rotations.delete(k);
  }
  if(rotations.size)throw Error('Orphan upper rotations');
  return w;
 }
}
