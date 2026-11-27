import {FrostboundS1Candidate} from './s1-candidate.mjs';
import {FourRegionWorld} from '../manual-biomes/profile-world.mjs';
import {VoxelWorld,terrainHeight,worldKey} from '../voxel.mjs';
import {WORLD_MAX_Y} from '../depth.mjs';
import {v6BiomeAt} from '../manual-biomes/v6-balanced-biomes.mjs';
import {LIVE_DISTRICT_SIZE} from '../live-voxel-world.mjs';
import {featherSnowShelf,winterGroveMaterial} from './s1-refinement.mjs';
export class FrostboundS1Refined extends FrostboundS1Candidate{
 constructor(seed,options){super(seed,options);this._refinedColumns=new Map();this._winterGroves=new Map();}
 _columnPlan(x,z){
  const key=x+','+z;if(this._refinedColumns.has(key))return this._refinedColumns.get(key);
  const plan=super._columnPlan(x,z),region=v6BiomeAt(x,z,this.seed);
  const raw=(a,b,c)=>VoxelWorld.prototype.naturalAndLandmarkBlock.call(this,a,b,c);
  const refined=featherSnowShelf({x,z,region,plan,oldTop:terrainHeight(x,z,this.seed),maxY:WORLD_MAX_Y,
   readRaw:raw,caveAt:(a,b,c)=>this.environmentCaves.get(a,b,c),neighborTop:(a,c)=>{
    const r=v6BiomeAt(a,c,this.seed);if(r?.name!=='snow'||r.weight<.65)return null;
    const p=FourRegionWorld.prototype._columnPlan.call(this,a,c);
    // Only taper toward an original missing shelf; ordinary hills retain relief.
    return p.size?null:terrainHeight(a,c,this.seed);
   }});
  this._refinedColumns.set(key,refined);
  if(this._refinedColumns.size>this.maxCachedColumns)this._refinedColumns.delete(this._refinedColumns.keys().next().value);
  return refined;
 }
 _environmentBaseline(x,y,z,block){
  const id=super._environmentBaseline(x,y,z,block);
  if(id!==7||this.environmentCaves.get(x,y,z)!==undefined)return id;
  const region=v6BiomeAt(x,z,this.seed);if(region?.name!=='snow'||region.weight<.48)return id;
  const dk=Math.floor(x/LIVE_DISTRICT_SIZE)+','+Math.floor(z/LIVE_DISTRICT_SIZE);
  let row=this._winterGroves.get(dk);
  if(!row){
   const district=this.liveDistrictCache.get(dk);if(!district)return id;
   const leaves=new Set(),protectedCells=new Set();
   for(const t of district.trees??[])for(const [a,b,c,m] of t.cells)if(m===7)leaves.add(worldKey(a,b,c));
   for(const t of [district.twinwood,district.canopyGate,district.archwood,district.fallenGiant,district.court,district.rotunda])
    for(const [a,b,c] of t?.cells??[])protectedCells.add(worldKey(a,b,c));
   row={leaves,protectedCells};this._winterGroves.set(dk,row);
   if(this._winterGroves.size>48)this._winterGroves.delete(this._winterGroves.keys().next().value);
  }
  const k=worldKey(x,y,z);return winterGroveMaterial(id,region,row.leaves.has(k),row.protectedCells.has(k));
 }
}
