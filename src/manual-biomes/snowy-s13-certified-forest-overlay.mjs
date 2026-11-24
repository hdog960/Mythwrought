// Detached S13 exact certified owner union. No original-world setters.
import {previewSnowS3CanonicalOwnerChunk} from './snowy-s3-owner-chunk-preview.mjs';
import {reviewSnowS3PlayerApprovedChunk} from './snowy-s3-player-approved-chunk.mjs';
const key=(x,y,z)=>[x,y,z].join(',');
export const S13_WINDOW=Object.freeze([[-2,32],[-1,32],[0,32],[-2,33],[-1,33],[0,33]].map(Object.freeze));
export function createSnowS13CertifiedForest(world,deps){
 const before=JSON.stringify(world.save()),owners=new Map(),trees=new Map(),slices=new Map();
 for(const [cx,cz] of S13_WINDOW){
  const p=previewSnowS3CanonicalOwnerChunk(world,cx,cz,deps);
  if(!p.safe)throw Error('Original consumer admission: '+p.reason);
  for(const a of p.accepted){
   if(!owners.has(a.ownerChunk)){
    const [x,z]=a.ownerChunk.split(',').map(Number);
    const review=reviewSnowS3PlayerApprovedChunk(world,x,z,deps);
    if(!review.safe)throw Error('Original owner admission: '+review.reason);
    owners.set(a.ownerChunk,review);
   }
   const t=owners.get(a.ownerChunk).admitted.find(t=>t.key===a.key);
   if(!t)throw Error('Missing original owner tree');
   const previous=trees.get(t.key);
   if(previous&&JSON.stringify(previous.cells)!==JSON.stringify(t.cells))
    throw Error('Inconsistent original owner certificate');
   trees.set(t.key,t);
  }
  slices.set(key(cx,0,cz),p.cells);
 }
 const rows=[],map=new Map();
 for(const t of [...trees.values()].sort((a,b)=>a.key.localeCompare(b.key))){
  for(const c of t.cells){
   const [x,y,z,id]=c,k=key(x,y,z);
   if(map.has(k)||world.get(x,y,z)!==0||deps.legacyNatural(x,y,z)!==0||
    world.edits.has(k)||world.environmentCaves.get(x,y,z)!==undefined)
    throw Error('Original source overlap or protection veto '+k);
   const climate=deps.biomeAt(x,z,world.seed);
   if(climate?.name!=='snow'||climate.weight<.65||climate.weight>1)
    throw Error('Original climate footprint changed '+k);
   if(![4,406,407].includes(id))throw Error('Unexpected original voxel ID');
   map.set(k,id);rows.push(Object.freeze([...c]));
  }
 }
 for(const [cx,cz] of S13_WINDOW){
  const expected=rows.filter(([x,,z])=>Math.floor(x/16)===cx&&Math.floor(z/16)===cz)
   .sort((a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2]);
  if(JSON.stringify(expected)!==JSON.stringify(slices.get(key(cx,0,cz))))
   throw Error('Original canonical consumer slice not exactly full owner union');
 }
 if(JSON.stringify(world.save())!==before)throw Error('Original schema-1 changed');
 const manifest=Object.freeze({seed:world.seed,profile:world.generationProfile.generator,
  cells:Object.freeze(rows),trees:Object.freeze([...trees.values()].map(t=>Object.freeze({
   key:t.key,x:t.x,z:t.z,floor:t.floor,style:t.style,cells:t.cells.length})))});
 const overlay=Object.create(world);
 Object.defineProperties(overlay,{get:{value:(x,y,z)=>map.get(key(x,y,z))??world.get(x,y,z)},
  save:{value:()=>world.save()},set:{value:()=>{throw Error('Detached forest is read-only')}}});
 return Object.freeze({manifest,overlay});
}
