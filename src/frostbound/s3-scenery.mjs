// Frostbound-only natural scenery research; no new block or shared registry IDs.
import {FrostboundS3Candidate} from './s3-ground.mjs';
import {v6BiomeAt} from '../manual-biomes/v6-balanced-biomes.mjs';
import {terrainHeight,worldKey} from '../voxel.mjs';
import {biome130Block} from '../biome130-registry.mjs';
import {createCandidateScene,describeCandidateObject,candidateVertices} from '../nonblock/candidate-scene.mjs';
import {FROST_BERRY_SCENE,registerFrostBerryCandidate} from './frost-berries.mjs';
const inheritedScenery={fern:'nonblock:d:frost-fern',grass:'nonblock:d:snowgrass',flower:'nonblock:d:alpine-wildflower',juniper:'nonblock:d:dwarf-juniper',pebbles:'nonblock:e:pebble-scatter',button:'scene48:button-mushroom',frostcap:'scene48:cavecap',toadstools:'scene48:clustered-toadstools',shrub:'scene48:woodland-shrub'};
export const SNOW_SCENERY=Object.freeze({...inheritedScenery,frostBerry:FROST_BERRY_SCENE});
const kinds=Object.values(inheritedScenery),winter=new Set([272,276,279]);
const emptyStorage={getItem:()=>null};
function hash(x,z,seed,salt){let h=Math.imul(x^salt,0x7feb352d)^Math.imul(z^seed,0x846ca68b);h=Math.imul(h^(h>>>16),0x45d9f3b);return (h^(h>>>16))>>>0;}
// Distinct bounded positions from the existing physical S3 pockets and center tree.
// Scenery is pass-through and removable through the existing scene interface.
export function snowSceneryChunk(world,cx,cz){
 const result=[];
 for(const [dx,dz,berry] of [[3,8],[8,3],[8,12],[12,6,true]]){
  if(result.length===3)break;
  const x=cx*16+dx,z=cz*16+dz,region=v6BiomeAt(x,z,world.seed);
  if(region?.name!=='snow'||region.weight<(berry ? .8 : .72)||Math.abs(x)>=9999||Math.abs(z)>=9999)continue;
  const h=hash(x,z,world.seed,1847);if(h%100>=(berry ? 40 : 76))continue;
  const column=world._columnPlan(x,z),floor=column.size?Math.max(...column.keys()):terrainHeight(x,z,world.seed),y=floor+1;
  if(y<3||y>17||!winter.has(world.naturalAndLandmarkBlock(x,floor,z))||!world.naturalAndLandmarkBlock(x,floor-1,z))continue;
  if([floor-1,floor,y,y+1].some(b=>world.environmentCaves.get(x,b,z)!==undefined))continue;
  const support=biome130Block(world.naturalAndLandmarkBlock(x,floor,z));
  if(!support.boxes.some(b=>b[0]===0&&b[2]===0&&b[3]===1&&b[4]===1&&b[5]===1))continue;
  const sceneId=berry?FROST_BERRY_SCENE:kinds[(h>>>8)%kinds.length],variant=(h>>>20)%4,anchor=[x,y,z],placement={sceneId,anchor,variant};
  if(berry)registerFrostBerryCandidate();
  const object=describeCandidateObject(world.seed,placement);
  // Require actual source triangle contact with snow and keep each mesh inside
  // its own anchor column (no neighboring geometry or side-by-side overlap).
  if(object.min[1]<y-1e-5||object.min[1]>y+1e-5||object.min[0]<x||object.max[0]>x+1||object.min[2]<z||object.max[2]>z+1||object.max[1]>y+1||object.colliders.length)continue;
  const natural=(...p)=>world.naturalAndLandmarkBlock(...p)!==0;
  if(createCandidateScene(world.seed,'frostbound-scenery-research',[placement],{storage:emptyStorage,blockAt:natural,voxelPick:()=>null}).visible().length!==1)continue;
  result.push(Object.freeze({...placement,anchor:Object.freeze(anchor)}));
 }
 return Object.freeze(result);
}
export class FrostboundSceneryCandidate extends FrostboundS3Candidate{
 constructor(seed,options){super(seed,options);this._snowScenery=new Map();}
 sceneryChunk(cx,cz){const k=`${cx},${cz}`;if(!this._snowScenery.has(k)){this._snowScenery.set(k,snowSceneryChunk(this,cx,cz));if(this._snowScenery.size>64)this._snowScenery.delete(this._snowScenery.keys().next().value);}return this._snowScenery.get(k);}
 sceneryLayout(cx,cz){const layout=[];for(let x=cx-1;x<=cx+1;x++)for(let z=cz-1;z<=cz+1;z++)layout.push(...this.sceneryChunk(x,z));return layout;}
 // Existing scene renderer consumes these objects; storage is deliberately
 // supplied by the test, never aliased to an existing world profile.
 sceneryScene(cx,cz,{storage=emptyStorage,occupied=()=>false,voxelPick=()=>null}={}){return createCandidateScene(this.seed,'frostbound-scenery-research',this.sceneryLayout(cx,cz),{storage,blockAt:(...p)=>this.get(...p)!==0||occupied(...p),editedAt:(...p)=>this.edits.has(worldKey(...p))||occupied(...p),voxelPick});}
 sceneryVertices(cx,cz){return candidateVertices(this.sceneryScene(cx,cz).visible());}
}
