// Frostbound-only natural scenery research; no new block or shared registry IDs.
import {FrostboundS3Candidate} from './s3-ground.mjs';
import {v6BiomeAt} from '../manual-biomes/v6-balanced-biomes.mjs';
import {terrainHeight,worldKey} from '../voxel.mjs';
import {biome130Block} from '../biome130-registry.mjs';
import {createCandidateScene,describeCandidateObject,candidateVertices} from '../nonblock/candidate-scene.mjs';
import {FROST_BERRY_SCENE,registerFrostBerryCandidate} from './frost-berries.mjs';
import {FROST_ROOT_SCENE,FROST_BRANCH_SCENE,FROST_LOG_SCENE,registerFrostForestDebris} from './forest-debris.mjs';
const inheritedScenery={fern:'nonblock:d:frost-fern',grass:'nonblock:d:snowgrass',flower:'nonblock:d:alpine-wildflower',juniper:'nonblock:d:dwarf-juniper',pebbles:'nonblock:e:pebble-scatter',button:'scene48:button-mushroom',frostcap:'scene48:cavecap',toadstools:'scene48:clustered-toadstools',shrub:'scene48:woodland-shrub'};
export const SNOW_SCENERY=Object.freeze({...inheritedScenery,frostBerry:FROST_BERRY_SCENE,exposedRoot:FROST_ROOT_SCENE,fallenBranch:FROST_BRANCH_SCENE,fallenLog:FROST_LOG_SCENE});
const kinds=Object.values(inheritedScenery),winter=new Set([272,276,279]);
const emptyStorage={getItem:()=>null};
const scenerySlots=[
 [3,8],[8,3],[8,12],
 [12,6,FROST_BERRY_SCENE,.8,40],
 [6,12,FROST_ROOT_SCENE,.8,30],
 [11,10,FROST_BRANCH_SCENE,.8,30],
 [5,5,FROST_LOG_SCENE,.8,30],
];
function hash(x,z,seed,salt){let h=Math.imul(x^salt,0x7feb352d)^Math.imul(z^seed,0x846ca68b);h=Math.imul(h^(h>>>16),0x45d9f3b);return (h^(h>>>16))>>>0;}
function snowContact(world,x,y,z){
 const id=world.naturalAndLandmarkBlock(x,y-1,z);
 return winter.has(id)&&world.naturalAndLandmarkBlock(x,y-2,z)!==0&&
  [y-2,y-1,y,y+1].every(height=>world.environmentCaves.get(x,height,z)===undefined)&&
  biome130Block(id).boxes.some(b=>b[0]===0&&b[2]===0&&b[3]===1&&b[4]===1&&b[5]===1);
}
// Distinct bounded positions from the existing physical S3 pockets and center tree.
// The centered log rests across three snow caps and uses the scene collision interface.
export function snowSceneryChunk(world,cx,cz){
 // Sidecar identities must resolve even in chunks with no local witnesses.
 registerFrostBerryCandidate();
 registerFrostForestDebris();
 const result=[];
 for(const [dx,dz,family,minWeight=.72,rate=76] of scenerySlots){
  if(result.length===3)break;
  const x=cx*16+dx,z=cz*16+dz,region=v6BiomeAt(x,z,world.seed);
  if(region?.name!=='snow'||region.weight<minWeight||Math.abs(x)>=9999||Math.abs(z)>=9999)continue;
  const h=hash(x,z,world.seed,1847);if(h%100>=rate)continue;
  const column=world._columnPlan(x,z),floor=column.size?Math.max(...column.keys()):terrainHeight(x,z,world.seed),y=floor+1;
  if(y<3||y>17||!snowContact(world,x,y,z))continue;
  const sceneId=family??kinds[(h>>>8)%kinds.length],variant=(h>>>20)%4,anchor=[x,y,z],placement={sceneId,anchor,variant};
  const object=describeCandidateObject(world.seed,placement);
  const log=family===FROST_LOG_SCENE,dxLog=log&&variant%2===0?1:0,dzLog=log&&variant%2===1?1:0;
  // Require triangle contact with snow and keep the geometry inside each reserved pocket.
  if(Math.abs(object.min[1]-y)>1e-5||object.max[1]>y+1||object.min[0]<x-dxLog||object.max[0]>x+1+dxLog||object.min[2]<z-dzLog||object.max[2]>z+1+dzLog)continue;
  if(log&&[-1,1].some(side=>!snowContact(world,x+side*dxLog,y,z+side*dzLog)))continue;
  if(Boolean(object.colliders.length)!==log)continue;
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
