// Wilds E5: original registered nonblock sources, original placement/pick/
// removal owner. No new IDs, geometry aliases, global scenery or engine changes.
import {BLOCK,worldKey,raycast} from '../voxel.mjs';
import {ENVIRONMENT_GROUND as G} from '../environment-ground.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {candidateFamilies} from '../nonblock/candidate-families.mjs';
import {createCandidateScene,describeCandidateObject} from '../nonblock/candidate-scene.mjs';
export const WILDS_SCENERY_FAMILIES=Object.freeze([
 'spore-pod','enchanted-flower','lantern-mushroom','ringed-morel','starpetal',
 'inkcap-cluster','velvet-cup','forest-leaf-litter','woodland-horsetail','moss-cushion',
 'woodland-shrub','bracken-fern','exposed-root','fallen-branch','forest-moss-mat',
 'forest-lichen-patch','clustered-toadstools','short-fern'
].map(n=>'scene48:'+n));
for(const id of WILDS_SCENERY_FAMILIES){
 const f=candidateFamilies.get(id);
 if(!f||f.wall||f.attachment&&f.attachment!=='ground')throw Error('Invalid Wilds ground scenery '+id);
}
// Ordinary woodland sapling deliberately excluded: not a signature tree.
const regionWeights=[
 [9,10,11,12,13,14,15,17,1,4],
 [1,4,8,9,11,14,15,17,2],
 [0,2,3,5,6,16,14,15],
 [1,4,8,9,10,11,17,0],
 [7,9,12,13,14,15,16,4]
];
const soil=new Set([G.woodlandLoam,G.woodlandPeat,G.woodlandMoss,BLOCK.GRASS,BLOCK.DIRT]);
const hash=(x,z,s)=>{let n=Math.imul(x,0x7feb352d)^Math.imul(z,0x846ca68b)^s;n=Math.imul(n^(n>>>16),0x45d9f3b);return(n^(n>>>16))>>>0;};
const emptyStorage=Object.freeze({getItem:()=>null});
const emptyPick=()=>null;
export const WILDS_SCENERY_WORLD_ID='mythwrought-upper-enchanted-wilds-e5-scenery-research-v1';
export function planWildsScenery(world,cx,cz,regionAt){
 if(!world?.wildsSource||!Number.isSafeInteger(cx)||!Number.isSafeInteger(cz)||typeof regionAt!=='function')throw Error('Explicit Wilds research source required');
 const get=(...p)=>world.naturalAndLandmarkBlock(...p);
 const plans=[];
 // 3 slots per owner, 27 maximum across the original 3x3 scene window.
 // Each slot is stable independently of player position, edits and removal.
 for(let a=cx-1;a<=cx+1;a++)for(let b=cz-1;b<=cz+1;b++)for(let i=0;i<3;i++){
  const roll=hash(a*5+i,b*7-i,world.seed+723911);
  const x=a*16+2+(i&1)*8+roll%4,z=b*16+2+(i>>1)*8+(roll>>>5)%4;
  if(Math.abs(x)>=9998||Math.abs(z)>=9998||v6BiomeAt(x,z,world.seed)?.weight<.82)continue;
  const r=regionAt(x,z,world.seed);if(r===null)continue;
  const col=world._columnPlan(x,z);if(!col.size)continue;
  const floor=Math.max(...col.keys()),id=col.get(floor);
  if(floor<0||floor>=18||!soil.has(id)||get(x,floor,z)!==id||get(x,floor-1,z)===BLOCK.AIR)continue;
  const list=regionWeights[r],sceneId=WILDS_SCENERY_FAMILIES[list[(roll>>>10)%list.length]];
  const placement={sceneId,anchor:[x,floor+1,z],variant:(roll>>>22)%4,orientation:0};
  const object=describeCandidateObject(world.seed,placement);
  // Confine each source mesh to its disjoint reserved horizontal 4x4 slot.
  const sx=a*16+1+(i&1)*8,sz=b*16+1+(i>>1)*8;
  if(object.min[0]<sx||object.max[0]>sx+6||object.min[2]<sz||object.max[2]>sz+6||object.max[1]>20)continue;
  // Keep original scene objects out of physical landmark walking approaches.
  let reserved=false;
  for(let a=Math.floor(object.min[0]+1e-6);a<Math.ceil(object.max[0]-1e-6);a++)for(let b=Math.floor(object.min[1]+1e-6);b<Math.ceil(object.max[1]-1e-6);b++)for(let c=Math.floor(object.min[2]+1e-6);c<Math.ceil(object.max[2]-1e-6);c++)if(world.wildsSource.reserved?.(a,b,c))reserved=true;
  if(reserved)continue;
  // Original candidate owner checks exact mesh volume/supports, including
  // physical E5 floor voxels and tall trees. No placement on a cave roof.
  if(!createCandidateScene(world.seed,WILDS_SCENERY_WORLD_ID,[placement],{
   storage:emptyStorage,blockAt:(...p)=>get(...p)!==BLOCK.AIR,voxelPick:emptyPick
  }).visible().length)continue;
  plans.push(placement);
 }
 return plans;
}
export function openWildsScenery(world,cx,cz,regionAt,{storage,occupied=()=>false,residentAt=()=>true}={}){
 const layout=planWildsScenery(world,cx,cz,regionAt);
 return createCandidateScene(world.seed,WILDS_SCENERY_WORLD_ID,layout,{
   storage,blockAt:(x,y,z)=>world.get(x,y,z)!==BLOCK.AIR||occupied(x,y,z),
   editedAt:(x,y,z)=>world.edits.has(worldKey(x,y,z))||occupied(x,y,z),
   residentAt,voxelPick:(o,d,m)=>raycast(world,o,d,m)
 });
}
