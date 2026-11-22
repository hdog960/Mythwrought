// DETACHED Snowy S3 collision/selection certificate. No world or save writes.
// Uses the original engine's registered full-cube shape interaction code.
// This is a geometric proof for proposed source-vetted physical voxel cells,
// NOT actual gameplay/player-body collision or live M7 mesh acceptance.
import {FULL_CUBE,canPlaceShape,raycastShapes} from '../voxel-shape-interactions.mjs';

const LEGACY_WOOD=4;
const STYLES=new Set(['compact-fir','layered-spruce','highland-pine','windswept-alpine']);
const SNOW_NEEDLES=new Set([406,407]);
const MAX_TOP=19;
const key=(x,y,z)=>`${x},${y},${z}`;
const integer=n=>Number.isSafeInteger(n);

export function reviewSnowS3CandidateSelection(candidate){
  if(candidate?.kind!=='detached-s3-physically-checked-proposal'||
    !STYLES.has(candidate.style)||typeof candidate.key!=='string'||
    !integer(candidate.x)||!integer(candidate.z)||
    !integer(candidate.floor)||candidate.floor<2||candidate.floor>13||
    !integer(candidate.voxelCount)||candidate.voxelCount<16||candidate.voxelCount>119||
    !Array.isArray(candidate.cells)||candidate.cells.length!==candidate.voxelCount||
    !Object.isFrozen(candidate.cells))return null;
  const blocks=new Map();let wood=0,needles=0,minY=Infinity,maxY=-Infinity;
  for(const row of candidate.cells){
    if(!Array.isArray(row)||!Object.isFrozen(row)||row.length!==4||
      !row.every(integer))return null;
    const [x,y,z,id]=row,k=key(x,y,z);
    if(y<=candidate.floor||y>MAX_TOP||
      Math.abs(x-candidate.x)>3||Math.abs(z-candidate.z)>3||
      id!==LEGACY_WOOD&&!SNOW_NEEDLES.has(id)||blocks.has(k))return null;
    blocks.set(k,id);
    if(id===LEGACY_WOOD)wood++;else needles++;
    minY=Math.min(minY,y);maxY=Math.max(maxY,y);
  }
  if(wood<4||needles<8)return null;
  const stem=Array.from({length:maxY-candidate.floor},(_,i)=>candidate.floor+i+1)
    .filter(y=>blocks.get(key(candidate.x,y,candidate.z))===LEGACY_WOOD);
  if(stem.length!==wood || stem.length<4 ||
    stem.some((y,i)=>y!==candidate.floor+1+i))return null;
  const shape=(x,y,z)=>blocks.has(key(x,y,z))?FULL_CUBE:null;
  const nearTrunk=[candidate.x,candidate.floor+1,candidate.z];
  // The original ray enters at the only unbranched trunk elevation.
  const ray=raycastShapes([candidate.x+.5,candidate.floor+1.5,candidate.z-2],
    [0,0,1],shape,5);
  if(!ray||ray.cell.some((v,i)=>v!==nearTrunk[i])||
    canPlaceShape(FULL_CUBE,nearTrunk,shape)||
    !canPlaceShape(FULL_CUBE,[candidate.x,candidate.floor+1,candidate.z+5],shape))
    return null;
  // Mine just the first trunk cell in an isolated ephemeral preview and
  // verify engine selection/collision responds. The source world is untouched.
  blocks.delete(key(...nearTrunk));
  const afterRay=raycastShapes([candidate.x+.5,candidate.floor+1.5,candidate.z-2],
    [0,0,1],shape,5);
  if(afterRay!==null||!canPlaceShape(FULL_CUBE,nearTrunk,shape))return null;
  return Object.freeze({kind:'detached-original-shape-s3-collision-certificate',
    key:candidate.key,style:candidate.style,voxelCount:candidate.voxelCount,
    wood,needles,minY,maxY,topClearance:MAX_TOP-maxY,
    trunkRayDistance:ray.distance,firstTrunkRemovable:true,
    sourceWorldMutated:false});
}
