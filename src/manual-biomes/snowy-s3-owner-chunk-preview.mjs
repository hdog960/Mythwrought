// DETACHED S3 physical chunk preview: deterministic GLOBAL tree owner.
// Each tree is certified against its STEM chunk, not a consumer's chunk
// neighbor set. Adjacent chunk requests therefore get the exact same admit/
// reject decision for a tree crossing their shared 16x16 boundary.
// Does not register an original M7 generator, create an edit or write a mesh.
import {snowS3SitesForChunk} from './snowy-s3-sites-detached.mjs';
import {reviewSnowS3PlayerApprovedChunk} from './snowy-s3-player-approved-chunk.mjs';

const WORLD_MAX_Y=19, SIZE=16, LIMIT=640;
const key=(x,y,z)=>x+','+y+','+z;
const fail=reason=>Object.freeze({kind:'detached-S3-canonical-owner-chunk-preview',safe:false,reason});
const integer=n=>Number.isSafeInteger(n);

/** Caller supplies the actual original M7 readers. Local synthetic worlds
 *  validate deterministic mechanics only, NOT authentic generation acceptance.
 */
export function previewSnowS3CanonicalOwnerChunk(world,cx,cz,deps={}){
  if(!world||!integer(world.seed)||!integer(cx)||!integer(cz)||
    Math.abs(cx)>100000||Math.abs(cz)>100000||
    world.generationProfile?.generator!=='mythwrought-five-surface-regions-v7'||
    !(world.edits instanceof Map)||typeof world.get!=='function'||
    typeof world.save!=='function'||
    typeof world.environmentCaves?.get!=='function')
    return fail('missing-original-M7-world-contract');
  let before;
  try{before=JSON.stringify(world.save())}catch{return fail('missing-schema-1-save-source')}
  const sites=snowS3SitesForChunk(world.seed,cx,cz);
  if(sites.length>24)return fail('source-site-budget-exceeded');
  const owners=new Map(),cells=new Map(),accepted=[],rejected=[];
  const minX=cx*SIZE,minZ=cz*SIZE;
  for(const site of sites){
    const ocx=Math.floor(site.x/SIZE),ocz=Math.floor(site.z/SIZE);
    const ownerId=ocx+','+ocz;
    let owner=owners.get(ownerId);
    if(!owner){
      try{owner=reviewSnowS3PlayerApprovedChunk(world,ocx,ocz,deps)}
      catch{return fail('owner-source-review-threw')}
      if(!owner.safe)return fail('owner-source-review-failed:'+owner.reason);
      owners.set(ownerId,owner);
    }
    const tree=owner.admitted.find(t=>t.key===site.key);
    if(!tree){
      rejected.push(Object.freeze({key:site.key,ownerChunk:ownerId,
        reason:owner.rejected.find(r=>r.key===site.key)?.reason??'owner-rejected-or-no-snow-provenance'}));
      continue;
    }
    if(tree.x!==site.x||tree.z!==site.z||
      !Array.isArray(tree.cells)||!Object.isFrozen(tree.cells))
      return fail('owner-physical-certificate-mismatch');
    accepted.push(Object.freeze({key:site.key,ownerChunk:ownerId}));
    for(const row of tree.cells){
      if(!Array.isArray(row)||row.length!==4||!Object.isFrozen(row)||
        !row.every(integer)||row[1]<0||row[1]>WORLD_MAX_Y||
        ![4,406,407].includes(row[3]))return fail('invalid-original-tree-cell');
      const [x,y,z,block]=row;
      if(x<minX||x>=minX+SIZE||z<minZ||z>=minZ+SIZE)continue;
      const k=key(x,y,z);
      if(cells.has(k))return fail('overlapping-physical-tree-cells');
      if(world.get(x,y,z)!==0||world.edits.has(k)||
        world.environmentCaves.get(x,y,z)!==undefined)
        return fail('original-voxel-protection-changed-after-owner-review');
      cells.set(k,Object.freeze([x,y,z,block]));
      if(cells.size>LIMIT)return fail('physical-chunk-cell-budget-exceeded');
    }
  }
  try{if(JSON.stringify(world.save())!==before)
    return fail('original-schema-1-world-mutated-during-owner-review');}
  catch{return fail('original-schema-1-save-failed-after-owner-review')}
  return Object.freeze({kind:'detached-S3-canonical-owner-chunk-preview',safe:true,
    cx,cz,sourceSites:sites.length,ownerReviews:owners.size,
    physicalCells:cells.size,
    cells:Object.freeze([...cells.values()].sort((a,b)=>
      a[0]-b[0]||a[1]-b[1]||a[2]-b[2])),
    accepted:Object.freeze(accepted),rejected:Object.freeze(rejected),
    sourceWorldUnchanged:true,notLiveM7:true,
    multiOwnerWholeWorldPlayerPathAccepted:false});
}
