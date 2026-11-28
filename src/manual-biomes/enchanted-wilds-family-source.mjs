// Biome-only natural content on the released shared height contract.
import {FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR} from './profile-world.mjs';
import {BLOCK} from '../voxel.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {physicalRegionAt,PHYSICAL_MAX_Y,LEGACY_GENERATION_MAX_Y} from '../world-height.mjs';
import {createUpperNaturalRegistry} from '../world-height-natural-contract.mjs';
import {buildWildsFamily,WILDS_FAMILIES,WILDS_RADIUS} from './enchanted-wilds-families.mjs';
import {wildsGroundCells} from './enchanted-wilds-ground.mjs';
import {planWildsLandmark} from './enchanted-wilds-landmarks.mjs';
import {ENVIRONMENT_GROUND as G} from '../environment-ground.mjs';
const GRID=32,MAX_SITES=128,MAX_CHUNKS=64;
export const WILDS_UPPER_GENERATOR='mythwrought-upper-enchanted-wilds-e3-e4-research';
export const WILDS_SOURCE_VERSION='wilds-physical-families-5';
export const WILDS_REGIONS=Object.freeze(['Ancientwood','Moonveil Groves','Sporewilds','Starlight Glades','Whispering Ruinwood']);
const weights=[[0,0,2,2,3,4,5,9],[0,1,1,3,4,5,6],[0,5,5,6,7,8,9],[0,1,3,4,5,6],[0,2,3,3,4,7,8]];
const hash=(a,b,c,d=0)=>{let n=Math.imul(a,0x7feb352d)^Math.imul(b,0x846ca68b)^Math.imul(c,0x9e3779b1)^Math.imul(d,0x85ebca6b);n=Math.imul(n^(n>>>16),0x45d9f3b);return (n^(n>>>16))>>>0;};
export function wildsRegionAt(x,z,seed){
 if(v6BiomeAt(x,z,seed)?.name!=='enchanted')return null;
 // Continuous low-frequency bands: no tiny checkerboard subregions.
 const a=Math.sin(x/86+seed*.013)+Math.sin(z/97-seed*.009);
 const b=Math.cos(x/113+z/83+seed*.007);
 const i=a>1.05?0:a<-.95?2:b>.52?1:b<-.52?4:3;
 return i;
}
const bounded=(m,k,v,n)=>{m.set(k,v);if(m.size>n)m.delete(m.keys().next().value);return v;};
export function createWildsFamilySource(ground){
 if(!ground.experimentalEnchantedWilds||ground.generationProfile.generator!==M8_MOUNTAIN_GENERATOR)throw Error('Private current Wilds ground required');
 const seed=ground.seed,sites=new Map(),chunks=new Map();
 const site=(tx,tz)=>{
   const k=tx+','+tz;if(sites.has(k))return sites.get(k);
   let plan=null;
   for(let i=0;i<8;i++){
     const x=tx*GRID+8+hash(tx,tz,seed,101+i*11)%16,z=tz*GRID+8+hash(tx,tz,seed,103+i*11)%16;
     if(Math.abs(x)>1e7-WILDS_RADIUS||Math.abs(z)>1e7-WILDS_RADIUS)continue;
     const region=v6BiomeAt(x,z,seed);if(region?.name!=='enchanted'||region.weight<.82)continue;
     const r=wildsRegionAt(x,z,seed);
     // Glades deliberately keep fewer tall forms.
     if(r===3&&hash(tx,tz,seed,913)%3===0)break;
     const list=weights[r],id=list[hash(tx,tz,seed,107+i*11)%list.length];
     const column=ground._columnPlan(x,z);if(!column.size)continue;
     const floor=Math.max(...column.keys());
     const p=buildWildsFamily(id,x,floor,z,seed,hash(tx,tz,seed,109+i*11)%4);if(!p)continue;
     // Full physical feet and every crown column must remain source-safe.
     if(p.footprint.some(([a,c])=>{const col=ground._columnPlan(a,c);return !col.size||Math.max(...col.keys())!==floor||ground.get(a,floor,c)!==col.get(floor)||ground.get(a,floor-1,c)===BLOCK.AIR;}))continue;
     const seen=new Set();let clear=true;
     for(const [a,b,c] of p.cells){
       const k=a+','+c;
       if(!seen.has(k)){seen.add(k);if(v6BiomeAt(a,c,seed)?.name!=='enchanted'){clear=false;break;}}
       if(b<=LEGACY_GENERATION_MAX_Y&&ground.get(a,b,c)!==BLOCK.AIR){clear=false;break;}
     }
     if(clear){plan=p;break;}
   }
   return bounded(sites,k,plan,MAX_SITES);
 };
 function chunk(cx,cz){
   const k=cx+','+cz;if(chunks.has(k))return chunks.get(k);
   const rows=new Map(),occupied=new Set(),plans=[];
   const x0=cx*16,z0=cz*16;
   for(let tx=Math.floor((x0-WILDS_RADIUS)/GRID);tx<=Math.floor((x0+15+WILDS_RADIUS)/GRID);tx++)
     for(let tz=Math.floor((z0-WILDS_RADIUS)/GRID);tz<=Math.floor((z0+15+WILDS_RADIUS)/GRID);tz++){
       const p=site(tx,tz);if(!p)continue;let owns=false;
       for(const [x,y,z,id] of p.cells){
         if(x<x0||x>x0+15||z<z0||z>z0+15)continue;
         const k=[x,y,z].join(',');if(rows.has(k))throw Error('Wilds source ownership overlap');
         rows.set(k,id);owns=true;
         if(y>LEGACY_GENERATION_MAX_Y)occupied.add(physicalRegionAt(x,y,z).key);
       }
       if(owns)plans.push(p);
     }
   const landmark=planWildsLandmark(ground,cx,cz,rows,wildsRegionAt),landmarkRows=new Map(),reserved=new Set();
   if(landmark){
     for(const [x,y,z,id] of landmark.cells){const k=[x,y,z].join(',');landmarkRows.set(k,id);reserved.add(k);if(y>LEGACY_GENERATION_MAX_Y)occupied.add(physicalRegionAt(x,y,z).key);}
     for(const p of landmark.approach)reserved.add(p.join(','));
   }
   const blocked=new Map(rows);for(const k of reserved)blocked.set(k,1);
   const flora=wildsGroundCells(ground,cx,cz,blocked,wildsRegionAt);
   return bounded(chunks,k,{rows,flora,occupied,plans,landmark,landmarkRows,reserved},MAX_CHUNKS);
 }
 const get=(x,y,z)=>{
   if(![x,y,z].every(Number.isSafeInteger)||y<1||y>75||Math.abs(x)>1e7||Math.abs(z)>1e7||v6BiomeAt(x,z,seed)?.name!=='enchanted')return BLOCK.AIR;
   const c=chunk(Math.floor(x/16),Math.floor(z/16)),k=[x,y,z].join(',');
   return c.rows.get(k)??c.landmarkRows.get(k)??c.flora.get(k)??BLOCK.AIR;
 };
 const occupied=k=>{
   const m=/^sky:(-?\d+),(-?\d+),(?:[0-9]|1[0-4])$/.exec(k);
   return !!m&&Math.abs(+m[1])<=625001&&Math.abs(+m[2])<=625001&&chunk(+m[1],+m[2]).occupied.has(k);
 };
 return Object.freeze({seed,generator:WILDS_UPPER_GENERATOR,sourceVersion:WILDS_SOURCE_VERSION,get,occupied,revision:()=>0,
   entries:(cx,cz)=>[...chunk(cx,cz).rows].sort(([a],[b])=>a.localeCompare(b)),plans:(cx,cz)=>[...chunk(cx,cz).plans],
   landmark:(cx,cz)=>chunk(cx,cz).landmark,
   reserved:(x,y,z)=>chunk(Math.floor(x/16),Math.floor(z/16)).reserved.has([x,y,z].join(',')),
   floraEntries:(cx,cz)=>[...chunk(cx,cz).flora].sort(([a],[b])=>a.localeCompare(b)),
   stats:()=>({sites:sites.size,chunks:chunks.size})});
}
// Actual native VoxelWorld edit, ray, collision and mesh authority. Explicit
// research object only: historical M8 identity is not allowed to save this.
export class WildsFamilyResearchWorld extends FourRegionWorld{
 constructor(seed){
   super(seed,fourRegionProfile(seed,M8_MOUNTAIN_GENERATOR),{experimentalEnchantedWilds:true});
   const ground=new FourRegionWorld(seed,fourRegionProfile(seed,M8_MOUNTAIN_GENERATOR),{experimentalEnchantedWilds:true});
   const source=createWildsFamilySource(ground),registry=createUpperNaturalRegistry();
   registry.register(WILDS_UPPER_GENERATOR,WILDS_SOURCE_VERSION,()=>source);
   const upper=registry.open({kind:'mythwrought-upper-source-profile',version:1,seed,generator:WILDS_UPPER_GENERATOR,sourceVersion:WILDS_SOURCE_VERSION});
   Object.defineProperties(this,{wildsSource:{value:source},wildsUpper:{value:upper}});
 }
 naturalAndLandmarkBlock(x,y,z){
   const base=super.naturalAndLandmarkBlock(x,y,z);
   // E6: restore living green ground in broad, coherent patches rather than
   // purple peat everywhere. Only the actual natural cap is recolored with
   // an existing full-cube material. Historical generators remain untouched.
   if(this.wildsSource&&(base===G.woodlandLoam||base===G.woodlandPeat)&&y>=0&&y<=LEGACY_GENERATION_MAX_Y){
     const r=wildsRegionAt(x,z,this.seed),patch=Math.sin(x/13+this.seed*.01)+Math.cos(z/17-this.seed*.015);
     if(r!==null&&patch>[.05,-.35,.45,-.65,.1][r]){const col=this._columnPlan(x,z);if(col.size&&Math.max(...col.keys())===y&&col.get(y)===base)return G.woodlandMoss;}
   }
   if(base!==BLOCK.AIR||!this.wildsSource||y<1||y>PHYSICAL_MAX_Y)return base;
   return y>LEGACY_GENERATION_MAX_Y?this.wildsUpper.get(x,y,z):this.wildsSource.get(x,y,z);
 }
 upperNaturalOccupied(key){return this.wildsUpper.occupied(key);}
 get upperNaturalRevision(){return this.wildsUpper.revision();}
}
