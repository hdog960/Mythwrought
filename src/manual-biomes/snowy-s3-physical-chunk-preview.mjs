// SNOWY S3 DETACHED PHYSICAL VOXEL PREVIEW ONLY.
// It never modifies FourRegionWorld, its M7 generator, saved world, or chunks.
// For an explicitly versioned FUTURE world only, this produces the exact
// physical original S3 cells clipped into one original 16x16 game chunk.
// Placement eligibility is delegated to the source-provenance reviewer.
import {reviewSnowS3WorldChunk} from './snowy-s3-world-review.mjs';

const CHUNK_SIZE=16;
const MAX_CELLS=640; // fail closed instead of silently clipping heavy trees
const MAX_TREE_CELLS=119;
const allowed=new Set([4,406,407]);
const key=(x,y,z)=>x+','+y+','+z;

export function previewSnowS3PhysicalChunk(world,cx,cz,deps){
  if(!world||typeof deps?.proposedSnowTree!=='function'||
     !(world.edits instanceof Map)||typeof world.get!=='function'||
     typeof world.environmentCaves?.get!=='function')return null;
  // Throws for invalid or unusually large chunk requests; keep that strict.
  const survey=reviewSnowS3WorldChunk(world,cx,cz,deps);
  const cells=new Map(),owners=new Map();
  const minX=cx*CHUNK_SIZE,minZ=cz*CHUNK_SIZE;
  for(const candidate of survey.proposals){
    // Consume the precise immutable voxels ALREADY validated by original
    // source readers. Regenerating after validation creates a TOCTOU hole
    // if the caller's tree factory or source dependency is non-deterministic.
    // Never replace validated geometry with a second unreviewed shape.
    if(!Array.isArray(candidate.cells)||
       candidate.cells.length!==candidate.voxelCount||
       candidate.cells.length>MAX_TREE_CELLS)return null;
    owners.set(candidate.key,0);
    const seenTree=new Set();
    for(const row of candidate.cells){
      if(!Array.isArray(row)||row.length!==4||
         !row.every(Number.isSafeInteger))return null;
      const [x,y,z,id]=row,k=key(x,y,z);
      if(!allowed.has(id)||seenTree.has(k))return null;
      seenTree.add(k);
      if(x<minX||x>=minX+CHUNK_SIZE||z<minZ||z>=minZ+CHUNK_SIZE)
        continue;
      if(cells.has(k)||world.get(x,y,z)!==0||
         world.edits.has(k)||world.environmentCaves.get(x,y,z)!==undefined)
        return null;
      cells.set(k,Object.freeze([x,y,z,id]));
      owners.set(candidate.key,owners.get(candidate.key)+1);
      if(cells.size>MAX_CELLS)return null;
    }
  }
  // Sorted by physical absolute cell coordinates; deterministic regardless
  // of reviewer return order, native Map insertion or chunk construction.
  const rows=Object.freeze([...cells.values()].sort((a,b)=>
    a[0]-b[0]||a[1]-b[1]||a[2]-b[2]));
  return Object.freeze({cx,cz,checked:survey.checked,
    sourceTrees:survey.proposals.length,physicalCells:rows.length,
    cells:rows,partialOwnerCounts:Object.freeze([...owners.entries()]
      .sort(([a],[b])=>a.localeCompare(b)).map(([k,count])=>
        Object.freeze([k,count]))),
    status:'detached-only-no-live-M7-mesh'});
}
