// SP2 candidate: deterministic protected-column terraces. Independent research
// identity; never rebind SP1 or an existing generation/save profile.
import {VoxelWorld,BLOCK} from '../voxel.mjs';
import {ShatteredPeaksResearchWorld} from './shattered-peaks-basal.mjs';
import {MOUNTAIN_V8_MATERIAL as M} from './mountain-v8-materials.mjs';
import {createUpperNaturalRegistry} from '../world-height-natural-contract.mjs';
import {physicalCellY,physicalSectionBounds,UPPER_SECTION_COUNT} from '../world-height.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
export const SP2_GENERATOR='mythwrought-upper-shattered-peaks-research-v2';
export const SP2_SOURCE_VERSION='sp2-protected-terrace-v1';
export const SP2_SLOPE=12,SP2_HALO=20,SP2_TILE_LIMIT=64;
const side=16+2*SP2_HALO;
const valid=(x,z)=>Number.isSafeInteger(x)&&Number.isSafeInteger(z)&&Math.abs(x)<=2147482944&&Math.abs(z)<=2147482944;
// Chebyshev distance transform: exact to the finite halo, independent of
// tile traversal/order. A column one cell from a veto stays at its old cap.
// At radius 20 the bound exceeds every admitted peak, so outside the halo
// cannot affect the result. No protected column is ever filled.
export function protectedDistance(mask,width){
 if(!(mask instanceof Uint8Array)||!Number.isSafeInteger(width)||width<1||mask.length!==width*width||width>128)throw TypeError('Invalid protected field');
 const d=new Uint16Array(mask.length);
 for(let i=0;i<mask.length;i++)d[i]=mask[i]?32767:0;
 for(let z=0;z<width;z++)for(let x=0;x<width;x++){
  const i=z*width+x;let n=d[i];
  if(x)n=Math.min(n,d[i-1]+1);
  if(z){n=Math.min(n,d[i-width]+1);if(x)n=Math.min(n,d[i-width-1]+1);if(x+1<width)n=Math.min(n,d[i-width+1]+1);}
  d[i]=n;
 }
 for(let z=width-1;z>=0;z--)for(let x=width-1;x>=0;x--){
  const i=z*width+x;let n=d[i];
  if(x+1<width)n=Math.min(n,d[i+1]+1);
  if(z+1<width){n=Math.min(n,d[i+width]+1);if(x)n=Math.min(n,d[i+width-1]+1);if(x+1<width)n=Math.min(n,d[i+width+1]+1);}
  d[i]=n;
 }
 return d;
}
export class ShatteredPeaksTerraceWorld extends VoxelWorld{
 #baseline;#provider;#tiles=new Map();#profile;
 constructor(seed){
  if(!Number.isInteger(seed)||seed!==(seed|0))throw TypeError('Invalid signed seed');
  super(seed);
  this.#baseline=new ShatteredPeaksResearchWorld(seed);
  this.#profile=Object.freeze({kind:'mythwrought-upper-source-profile',version:1,seed,generator:SP2_GENERATOR,sourceVersion:this.terraceSourceVersion});
  const registry=createUpperNaturalRegistry();
  registry.register(SP2_GENERATOR,this.#profile.sourceVersion,({seed,generator,sourceVersion})=>({
   seed,generator,sourceVersion,revision:()=>0,
   get:(x,y,z)=>this.#upperCell(x,y,z),
   occupied:key=>this.#occupied(key)
  }));
  this.#provider=registry.open(this.#profile);
 }
 get terraceSourceVersion(){return SP2_SOURCE_VERSION;}
 _shapeSummit(rawTop){return rawTop;}
 get generationProfile(){return this.#profile;}
 get hasNaturalNonCubeShapes(){return true;}
 get cachedTerraceTiles(){return this.#tiles.size;}
 get upperNaturalRevision(){return this.#provider.revision();}
 upperNaturalOccupied(key){return this.#provider.occupied(key);}
 originalNatural(x,y,z){return this.#baseline.originalNatural(x,y,z);}
 originalAdmission(x,z){return this.#baseline.basalColumn(x,z);}
 #tile(cx,cz){
  const key=cx+','+cz;
  if(this.#tiles.has(key)){
   const row=this.#tiles.get(key);this.#tiles.delete(key);this.#tiles.set(key,row);return row;
  }
  const mask=new Uint8Array(side*side),base=new Uint8Array(side*side),peak=new Uint16Array(side*side);
  const ox=cx*16-SP2_HALO,oz=cz*16-SP2_HALO;
  for(let z=0;z<side;z++)for(let x=0;x<side;x++){
   const a=this.originalAdmission(ox+x,oz+z),i=z*side+x;
   if(a){mask[i]=1;base[i]=a.cap;peak[i]=a.topY;}
  }
  const distances=protectedDistance(mask,side);
  const caps=new Uint8Array(256),tops=new Uint16Array(256),rawTops=new Uint16Array(256),clearance=new Uint16Array(256);
  let max=0;
  for(let z=0;z<16;z++)for(let x=0;x<16;x++){
   const i=(z+SP2_HALO)*side+x+SP2_HALO,k=z*16+x;
   if(!mask[i])continue;
   caps[k]=base[i];rawTops[k]=peak[i];clearance[k]=Math.min(SP2_HALO+1,distances[i]);
   tops[k]=Math.min(this._shapeSummit(peak[i]),base[i]+Math.max(0,distances[i]-1)*SP2_SLOPE);
   max=Math.max(max,tops[k]);
  }
  const row={caps,tops,rawTops,clearance,max};this.#tiles.set(key,row);
  if(this.#tiles.size>SP2_TILE_LIMIT)this.#tiles.delete(this.#tiles.keys().next().value);
  return row;
 }
 terraceColumn(x,z){
  if(!valid(x,z)||v6BiomeAt(x,z,this.seed)?.name!=='mountain')return null;
  const cx=Math.floor(x/16),cz=Math.floor(z/16),t=this.#tile(cx,cz),i=(z-cz*16)*16+x-cx*16;
  if(!t.rawTops[i])return null;
  return Object.freeze({cap:t.caps[i],topY:t.tops[i],rawTopY:t.rawTops[i],clearance:t.clearance[i]});
 }
 #upperCell(x,y,z){
  const p=this.terraceColumn(x,z);
  if(!p||y>p.topY||y<20)return BLOCK.AIR;
  return this.#fill(p,y);
 }
 #fill(p,y){
  if(y===p.topY)return y>=140?M.snow:y>=80?M.scree:M['alpine-grass'];
  if(y>=p.topY-2)return p.topY>=80?M.stone:M.dirt;
  return Math.floor(y/9)%5===0?M.gneiss:M.stone;
 }
 #occupied(key){
  const match=/^sky:(-?\d+),(-?\d+),(\d+)$/.exec(key);
  if(!match)return false;
  const cx=Number(match[1]),cz=Number(match[2]),s=Number(match[3]);
  if(!valid(cx*16,cz*16)||!valid(cx*16+15,cz*16+15)||s<0||s>=UPPER_SECTION_COUNT)return false;
  // No expensive source work on a definitely nonmountain tile: all 16x16
  // positions are checked if the corner classifications are not conclusive.
  return this.#tile(cx,cz).max>=physicalSectionBounds({kind:'upper',section:s}).minY;
 }
 naturalAndLandmarkBlock(x,y,z){
  if(!valid(x,z)||!physicalCellY(y))return BLOCK.AIR;
  if(y>=20)return this.#provider.get(x,y,z);
  if(y>=3){
   const p=this.terraceColumn(x,z);
   if(p&&y>p.cap&&y<=p.topY)return this.#fill(p,y);
  }
  return this.originalNatural(x,y,z);
 }
 save(){throw Error('SP2 research requires a separately approved distinct save profile');}
}
