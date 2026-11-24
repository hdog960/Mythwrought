// Experimental fresh-world Snow generation. No registered generator or
// loader path; only the deliberately UNSAVABLE subclass imports this.
import {proposeSnowS12Conifer} from './snowy-s12-natural-conifer-prototypes.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {terrainHeight,BLOCK} from '../voxel.mjs';
import {WORLD_MAX_Y} from '../depth.mjs';
const WINTER=new Set([272,276,279]);
const key=(x,y,z)=>x+','+y+','+z;
function roll(x,z,seed){
 let n=Math.imul(x,0x7feb352d)^Math.imul(z,0x846ca68b)^(seed|0);
 n=Math.imul(n^(n>>>16),0x45d9f3b);return ((n^(n>>>16))>>>0)/4294967296;
}
const center=(tx,tz,seed)=>[tx*8+2+Math.floor(roll(tx,tz,seed+51)*4),
 tz*8+2+Math.floor(roll(tx,tz,seed+89)*4)];
export function createSnowS17SitePlanner(seed,rawLegacy,caveAt){
 if(typeof rawLegacy!=='function'||typeof caveAt!=='function')throw Error('Original source readers required');
 return ({tx,tz,x,z,floor,root,readColumn,readCell})=>{
  if(!WINTER.has(root)||caveAt(x,floor,z)!==undefined||
    caveAt(x,floor-1,z)!==undefined||readCell(x,floor-1,z)===BLOCK.AIR)return null;
  const styleRoll=roll(tx,tz,seed+211),wind=roll(tx,tz,seed+337)<.5?-1:1;
  const style=styleRoll<.25?'compact-fir':styleRoll<.50?'layered-spruce':
    styleRoll<.78?'highland-pine':'windswept-alpine';
  // Retain original canonical density/site roll. Deterministic conservative
  // overlap veto: a potential earlier nearby Snow site owns the 7x7 envelope.
  // No recursion or order-dependent chunk cache; a veto can reduce density.
  for(let a=tx-1;a<=tx+1;a++)for(let b=tz-1;b<=tz+1;b++){
   if(a>tx||a===tx&&b>=tz||roll(a,b,seed)>=.52)continue;
   const [nx,nz]=center(a,b,seed);
   if(Math.abs(nx-x)>6||Math.abs(nz-z)>6)continue;
   const climate=v6BiomeAt(nx,nz,seed);
   if(climate?.name==='snow'&&climate.weight>=.65)return null;
  }
  for(const name of new Set([style,'compact-fir'])){
   const tree=proposeSnowS12Conifer(name,x,floor,z,{wind});
   if(!tree||tree.cells.some(c=>c[1]>WORLD_MAX_Y))continue;
   const columns=new Map();
   let valid=true;
   for(const [a,b,c,id] of tree.cells){
    if(readCell(a,b,c)!==BLOCK.AIR||rawLegacy(a,b,c)!==BLOCK.AIR||
       caveAt(a,b,c)!==undefined){valid=false;break;}
    const k=a+','+c;
    if(!columns.has(k)){
     const climate=v6BiomeAt(a,c,seed);
     if(climate?.name!=='snow'||climate.weight<.65){valid=false;break;}
     // Genuine local walking headroom: no candidate needle at or below the
     // two body voxels immediately above any neighboring source surface.
     let highest=-Infinity;
     for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){
      const plan=readColumn(a+dx,c+dz);
      const top=plan.size?Math.max(...plan.keys()):terrainHeight(a+dx,c+dz,seed);
      highest=Math.max(highest,top);
     }
     columns.set(k,highest);
    }
    if(id!==BLOCK.WOOD&&b<=columns.get(k)+2){valid=false;break;}
   }
   if(valid)return tree.cells;
  }
  return null;
 };
}
// Actual mineable surface-cap feathering, not RGB only. Only empty original
// plans with intact raw grass/subsoil and no cave or landmark above qualify.
// Existing authored shoulders (258,401, woodland moss) never change.
export function snowS17ColumnPlan(original,x,z,seed,rawLegacy,caveAt){
 const climate=v6BiomeAt(x,z,seed);
 if(climate?.name!=='snow')return original;
 const old=terrainHeight(x,z,seed);
 if(original.size===0){
  if(climate.weight<.40||rawLegacy(x,old,z)!==BLOCK.GRASS||
     ![BLOCK.DIRT,BLOCK.STONE].includes(rawLegacy(x,old-1,z))||
     caveAt(x,old,z)!==undefined||caveAt(x,old-1,z)!==undefined)return original;
  for(let y=old+1;y<=WORLD_MAX_Y;y++)
   if(rawLegacy(x,y,z)!==BLOCK.AIR||caveAt(x,y,z)!==undefined)return original;
  const patch=.5+.5*Math.sin(x*.083+z*.061+Math.sin(z*.043)*1.4+(seed%223)*.19);
  const coverage=Math.max(0,Math.min(1,(climate.weight-.40)/.25));
  if(patch>coverage)return original;
  return new Map([[old,climate.weight<.65?279:272]]);
 }
 // Taper only one pre-existing authored raised winter shelf at weak snow
 // weights. Never remove a legacy voxel; retained cap stays physical.
 const top=Math.max(...original.keys()),cap=original.get(top);
 if(climate.weight>=.82||top<=old||!WINTER.has(cap)||
    !original.has(top-1)||!original.has(top-2)||
    rawLegacy(x,top,z)!==BLOCK.AIR||
    caveAt(x,top,z)!==undefined||caveAt(x,top-1,z)!==undefined||
    caveAt(x,top-2,z)!==undefined)return original;
 const support=original.get(top-2);
 if(support===BLOCK.AIR||![272,276,278,279,BLOCK.STONE,BLOCK.DIRT].includes(support))return original;
 // Lowering a shelf whose target is an original grass cap is safe only
 // when that raw cell is ordinary topsoil; never remove protected geometry.
 const raw=rawLegacy(x,top-1,z);
 if(top-1===old?raw!==BLOCK.GRASS:raw!==BLOCK.AIR)return original;
 const next=new Map(original);next.delete(top);next.set(top-1,cap);
 return next;
}
