// Isolated original-world engineering, never register or save this identity.
// Current combined Mountain V8, Snow P1, Enchanted and cave systems retained.
import {FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR} from '../manual-biomes/profile-world.mjs';
import {VoxelWorld,terrainHeight} from '../voxel.mjs';
import {WORLD_MAX_Y} from '../depth.mjs';
import {v6BiomeAt} from '../manual-biomes/v6-balanced-biomes.mjs';
import {planFrostboundColumn} from './s1-terrain.mjs';
export class FrostboundS1Candidate extends FourRegionWorld{
 constructor(seed,{maxCachedColumns=1024}={}){
  super(seed,fourRegionProfile(seed,M8_MOUNTAIN_GENERATOR),{maxCachedColumns});
  this._frostColumns=new Map();
 }
 _columnPlan(x,z){
  const key=x+','+z;
  if(this._frostColumns.has(key))return this._frostColumns.get(key);
  const original=super._columnPlan(x,z);
  const plan=planFrostboundColumn({x,z,seed:this.seed,region:v6BiomeAt(x,z,this.seed),
   original,oldTop:terrainHeight(x,z,this.seed),maxY:WORLD_MAX_Y,
   readRaw:(a,b,c)=>VoxelWorld.prototype.naturalAndLandmarkBlock.call(this,a,b,c),
   caveAt:(a,b,c)=>this.environmentCaves.get(a,b,c)});
  this._frostColumns.set(key,plan);
  if(this._frostColumns.size>this.maxCachedColumns)
   this._frostColumns.delete(this._frostColumns.keys().next().value);
  return plan;
 }
 save(){throw Error('Frostbound isolated candidate is not a registered durable generator');}
}
