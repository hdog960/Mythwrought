// A genuine current FourRegionWorld natural source, not a fixed manifest
// overlay. Explicit test-only class; NEVER exposed to save/profile/UI code.
import {FourRegionWorld,fourRegionProfile,ENCHANTED_P2_GENERATOR} from './profile-world.mjs';
import {VoxelWorld,BLOCK,chunkCoord,worldKey} from '../voxel.mjs';
import {environmentalTreesForChunk} from './environment-v7.mjs';
import {createSnowS17SitePlanner,snowS17ColumnPlan} from './snowy-s17-fresh-source.mjs';
export class ExperimentalSnowS17World extends FourRegionWorld{
 #needleChunks=new Map();
 #site;
 #raw;
 #cave;
 constructor(seed){
  super(seed,fourRegionProfile(seed,ENCHANTED_P2_GENERATOR));
  if(this.edits.size)throw Error('Snow experiment requires a fresh world');
  this.#raw=(x,y,z)=>VoxelWorld.prototype.naturalAndLandmarkBlock.call(this,x,y,z);
  this.#cave=(x,y,z)=>this.environmentCaves.get(x,y,z);
  this.#site=createSnowS17SitePlanner(seed,this.#raw,this.#cave);
 }
 get experimentalSnowS17(){return true;}
 _columnPlan(x,z){
  const key=x+','+z;
  if(this._biomeColumns.has(key))return this._biomeColumns.get(key);
  const original=super._columnPlan(x,z);
  const next=snowS17ColumnPlan(original,x,z,this.seed,this.#raw,this.#cave);
  this._biomeColumns.set(key,next);
  return next;
 }
 _environmentTreeAt(x,y,z){
  const cx=chunkCoord(x),cz=chunkCoord(z),key=cx+','+cz;
  let cells=this._environmentTreeChunks.get(key);
  if(!cells){
   const needles=new Set();
   cells=environmentalTreesForChunk(cx,cz,this.seed,
    (a,c)=>this._columnPlan(a,c),
    (a,b,c)=>this._columnPlan(a,c).get(b)??this._environmentBaseline(a,b,c),
    {experimentalEnchantedTrees:true,candidateSiteBiomeCache:this._environmentCandidateSiteBiomes,
     snowTreeAtSite:this.#site,snowNeedles:needles});
   this._environmentTreeChunks.set(key,cells);this.#needleChunks.set(key,needles);
   if(this._environmentTreeChunks.size>64){
    const first=this._environmentTreeChunks.keys().next().value;
    this._environmentTreeChunks.delete(first);this.#needleChunks.delete(first);
   }
  }
  return cells.get(worldKey(x,y,z))??BLOCK.AIR;
 }
 snowS17NaturalNeedleAt(x,y,z){
  const k=worldKey(x,y,z);
  if(this.edits.has(k)||this.#cave(x,y,z)!==undefined||
    this.naturalAndLandmarkBlock(x,y,z)!==407)return undefined;
  return this.#needleChunks.get(chunkCoord(x)+','+chunkCoord(z))?.has(k)?407:undefined;
 }
 get snowS17CacheSizes(){return Object.freeze({trees:this._environmentTreeChunks.size,needles:this.#needleChunks.size,columns:this._biomeColumns.size});}
 save(){throw Error('Unregistered experimental Snow world cannot save');}
}
