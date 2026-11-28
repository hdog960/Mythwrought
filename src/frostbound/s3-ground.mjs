// S3 isolated physical ground detail using existing registered shapes only.
import {FrostboundForest} from './s2-forest.mjs';
import {terrainHeight} from '../voxel.mjs';
import {v6BiomeAt} from '../manual-biomes/v6-balanced-biomes.mjs';
const surfaceDetails=Object.freeze({powder:271,drift:273,crust:274,iceSpikes:281,frostTurf:283,crystalSeams:306});
export const GROUND_FAMILIES=Object.freeze({...surfaceDetails,pineStump:370});
const ids=Object.values(surfaceDetails),winter=new Set([272,276,279]);
// Keep the original detail pockets. The stump has its own quieter pocket,
// separate from the forest center and every pass-through scenery anchor.
const pockets=[[3,3],[3,12],[12,3],[12,12],[12,8,GROUND_FAMILIES.pineStump]];
const key=(x,y,z)=>`${x},${y},${z}`;
function roll(x,z,seed,salt){let h=Math.imul(x^salt,0x7feb352d)^Math.imul(z^seed,0x846ca68b);h=Math.imul(h^(h>>>16),0x45d9f3b);return ((h^(h>>>16))>>>0)/4294967296;}
export class FrostboundS3Candidate extends FrostboundForest{
 constructor(seed,options){super(seed,options);this._groundDetails=new Map();}
 _groundSource(x,y,z){return super.naturalAndLandmarkBlock(x,y,z);}
 _groundDetailChoice(x,z,id){return id;}
 groundDetails(cx,cz){
  const k=`${cx},${cz}`;if(this._groundDetails.has(k))return this._groundDetails.get(k);
  const cells=new Map();
  for(const [dx,dz,stump] of pockets){
   const x=cx*16+dx,z=cz*16+dz,r=v6BiomeAt(x,z,this.seed);
   if(r?.name!=='snow'||r.weight<(stump ? .8 : .72)||roll(x,z,this.seed,719)>=(stump ? .24 : .48))continue;
   const p=this._columnPlan(x,z),floor=p.size?Math.max(...p.keys()):terrainHeight(x,z,this.seed),y=floor+1;
   if(y>17||!winter.has(this._groundSource(x,floor,z))||!this._groundSource(x,floor-1,z))continue;
   if([floor-1,floor,y,y+1].some(b=>this.environmentCaves.get(x,b,z)!==undefined))continue;
   if(this._groundSource(x,y,z)||this._groundSource(x,y+1,z))continue;
   // Keep existing steep terrain and exposed protected holes clear.
   if([[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>!this._groundSource(x+a,floor-1,z+b)||this.environmentCaves.get(x+a,floor-1,z+b)!==undefined))continue;
   const id=stump??this._groundDetailChoice(x,z,ids[Math.floor(roll(x,z,this.seed,733)*ids.length)]);cells.set(key(x,y,z),id);
  }
  this._groundDetails.set(k,cells);if(this._groundDetails.size>64)this._groundDetails.delete(this._groundDetails.keys().next().value);return cells;
 }
 naturalAndLandmarkBlock(x,y,z){
  const prior=this._groundSource(x,y,z);if(prior||!this._groundDetails||y<3||y>17||![x,y,z].every(Number.isSafeInteger))return prior;
  return this.groundDetails(Math.floor(x/16),Math.floor(z/16)).get(key(x,y,z))??0;
 }
}
