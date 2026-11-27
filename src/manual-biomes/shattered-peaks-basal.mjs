// SP1 isolated physical research host. Never attach to production profile/storage.
// Private pristine M8 source supplies terrain and original owner vetoes.
// A distinct research identity cannot be serialized through historical saves.
import {VoxelWorld,BLOCK,baseBlock,terrainHeight} from '../voxel.mjs';
import {FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR} from './profile-world.mjs';
import {MOUNTAIN_V8_MATERIAL as M,mountainV8Material} from './mountain-v8-materials.mjs';
import {planShatteredPeakColumn,createShatteredPeakRegistry,shatteredPeakResearchProfile} from './shattered-peaks-sp1.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {physicalCellY} from '../world-height.mjs';
const isTerrain=id=>mountainV8Material(id)?.terrain===true;
const support=id=>isTerrain(id)||[BLOCK.STONE,BLOCK.DIRT,BLOCK.GRASS].includes(id);
const coord=(x,z)=>Number.isSafeInteger(x)&&Number.isSafeInteger(z)&&Math.abs(x)<=2147483000&&Math.abs(z)<=2147483000;
export class ShatteredPeaksResearchWorld extends VoxelWorld{
 #original;#upper;#basalTiles=new Map();#profile;
 constructor(seed){
  if(!Number.isInteger(seed)||seed!==(seed|0))throw TypeError('Invalid signed seed');
  super(seed);
  this.#profile=shatteredPeakResearchProfile(seed);
  this.#original=new FourRegionWorld(seed,fourRegionProfile(seed,M8_MOUNTAIN_GENERATOR));
  const registry=createShatteredPeakRegistry(p=>this.basalColumn(p.x,p.z)!==null);
  this.#upper=registry.open(this.#profile);
 }
 get generationProfile(){return this.#profile;}
 get hasNaturalNonCubeShapes(){return true;}
 get upperNaturalRevision(){return this.#upper.revision();}
 upperNaturalOccupied(key){return this.#upper.occupied(key);}
 // Public research diagnostics return immutable values, never the private world.
 originalNatural(x,y,z){return this.#original.naturalAndLandmarkBlock(x,y,z);}
 #survey(x,z){
  const proposal=planShatteredPeakColumn(x,z,this.seed);
  if(!proposal)return null;
  const old=this.#original,legacyTop=terrainHeight(x,z,this.seed);
  if(!Number.isInteger(legacyTop)||legacyTop<2||legacyTop>17)return null;
  const capPlan=old._columnPlan(x,z);
  if(!capPlan.size)return null;
  const cap=Math.max(...capPlan.keys());
  if(cap<legacyTop||cap>17||!isTerrain(capPlan.get(cap)))return null;
  // Protect authored AIR, cave cells and foreign owners in the actual basal
  // envelope, including three supporting layers. Never consult mutable edits.
  for(let y=legacyTop-3;y<=19;y++){
   if(old.environmentCaves.get(x,y,z)!==undefined)return null;
   const raw=VoxelWorld.prototype.naturalAndLandmarkBlock.call(old,x,y,z);
   if(raw!==baseBlock(x,y,z,this.seed))return null;
   const id=old.naturalAndLandmarkBlock(x,y,z);
   if(y<=cap?!support(id):id!==BLOCK.AIR)return null;
  }
  return Object.freeze({cap,topY:proposal.topY,bridgeFrom:cap+1,bridgeTo:19});
 }
 basalColumn(x,z){
  if(!coord(x,z))return null;
  if(v6BiomeAt(x,z,this.seed)?.name!=='mountain')return null;
  const cx=Math.floor(x/16),cz=Math.floor(z/16),key=cx+','+cz;
  let tile=this.#basalTiles.get(key);
  if(!tile){tile=new Map();this.#basalTiles.set(key,tile);
   if(this.#basalTiles.size>64)this.#basalTiles.delete(this.#basalTiles.keys().next().value);}
  const slot=(z-cz*16)*16+x-cx*16;
  if(!tile.has(slot))tile.set(slot,this.#survey(x,z));
  return tile.get(slot);
 }
 naturalAndLandmarkBlock(x,y,z){
  if(!coord(x,z)||!physicalCellY(y))return BLOCK.AIR;
  if(y>=20)return this.#upper.get(x,y,z);
  // Keep every existing cell; only add to the verified empty bridge volume.
  if(y>=3){
   const p=this.basalColumn(x,z);
   if(p&&y>=p.bridgeFrom&&y<=p.bridgeTo)return M.stone;
  }
  return this.originalNatural(x,y,z);
 }
 // Explicit research-only host: no ordinary persistence or historical profile.
 save(){throw Error('Shattered Peaks research requires an approved distinct save profile');}
}
