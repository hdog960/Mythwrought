// Deterministic physical Enchanted Wilds towers. The current Mountain/Snow
// source is private and immutable. No stored natural tree rows or chosen seed.
import {BLOCK} from '../voxel.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {planWildsTowerPrototype} from './enchanted-wilds-upper-world.mjs';
import {skyIslandSectionForY,skyIslandMeshKey} from '../floating-islands/sky-runtime-adapter.mjs';
const GRID=24,RADIUS=4,MAX_SITES=128,MAX_CHUNKS=64,MAX_COORD=1e7;
const key=(x,z)=>x+','+z;
const hash=(x,z,seed,salt)=>{
 let n=Math.imul(x,0x7feb352d)^Math.imul(z,0x846ca68b)^Math.imul(seed,0x9e3779b1)^Math.imul(salt,0x85ebca6b);
 n=Math.imul(n^(n>>>16),0x45d9f3b);return (n^(n>>>16))>>>0;
};
const bounded=(m,k,v,cap)=>{m.set(k,v);if(m.size>cap)m.delete(m.keys().next().value);return v;};
export function createWildsNaturalTowerSource(ground){
 if(!ground||!Number.isInteger(ground.seed)||!ground.experimentalEnchantedWilds||typeof ground._columnPlan!=='function')throw Error('Explicit private current Wilds ground required');
 const seed=ground.seed,sites=new Map(),chunks=new Map();
 function planSite(tx,tz){
   const k=key(tx,tz);if(sites.has(k))return sites.get(k);
   // Four deterministic options inside a 12x12 inner tile. Adjacent tiles'
   // stems are at least 13 blocks apart; radius-four crowns cannot overlap.
   let plan=null;
   for(let i=0;i<4;i++){
     const x=tx*GRID+6+hash(tx,tz,seed,101+i*11)%12;
     const z=tz*GRID+6+hash(tx,tz,seed,103+i*11)%12;
     if(Math.abs(x)>MAX_COORD-RADIUS||Math.abs(z)>MAX_COORD-RADIUS)continue;
     const region=v6BiomeAt(x,z,seed);
     if(region?.name!=='enchanted'||region.weight<.82)continue;
     const height=22+hash(tx,tz,seed,107+i*11)%15;
     plan=planWildsTowerPrototype(ground,x,z,{height});
     if(plan)break;
   }
   return bounded(sites,k,plan,MAX_SITES);
 }
 function chunk(cx,cz){
   if(![cx,cz].every(Number.isSafeInteger)||Math.abs(cx)>625001||Math.abs(cz)>625001)throw Error('Invalid natural tower chunk');
   const k=key(cx,cz);if(chunks.has(k))return chunks.get(k);
   const x0=cx*16,z0=cz*16,voxels=new Map(),sections=new Set(),origins=[];
   for(let tx=Math.floor((x0-RADIUS)/GRID);tx<=Math.floor((x0+15+RADIUS)/GRID);tx++)
    for(let tz=Math.floor((z0-RADIUS)/GRID);tz<=Math.floor((z0+15+RADIUS)/GRID);tz++){
     const p=planSite(tx,tz);if(!p)continue;
     let owns=false;
     for(const [x,y,z,id] of p.cells){
       if(x<x0||x>x0+15||z<z0||z>z0+15)continue;
       const at=[x,y,z].join(',');if(voxels.has(at))throw Error('Natural tower ownership overlap');
       voxels.set(at,id);owns=true;
       const s=skyIslandSectionForY(y);if(s!==null)sections.add(s);
     }
     if(owns)origins.push(p.origin);
   }
   return bounded(chunks,k,{voxels,sections:[...sections].sort((a,b)=>a-b),origins},MAX_CHUNKS);
 }
 return Object.freeze({seed,
   get(x,y,z){
     if(![x,y,z].every(Number.isSafeInteger)||y<1||y>57||Math.abs(x)>MAX_COORD||Math.abs(z)>MAX_COORD)return BLOCK.AIR;
     if(v6BiomeAt(x,z,seed)?.name!=='enchanted')return BLOCK.AIR;
     return chunk(Math.floor(x/16),Math.floor(z/16)).voxels.get([x,y,z].join(','))??BLOCK.AIR;
   },
   // Authenticated occupancy metadata; empty body regions are still admitted
   // separately by the existing flight/renderer host.
   sections(cx,cz){return chunk(cx,cz).sections.map(section=>({cx,cz,section,key:skyIslandMeshKey(cx,cz,section)}));},
   entries(cx,cz){return [...chunk(cx,cz).voxels].sort(([a],[b])=>a.localeCompare(b));},
   origins(cx,cz){return chunk(cx,cz).origins.map(p=>[...p]);},
   stats:()=>Object.freeze({siteCache:sites.size,chunkCache:chunks.size}),
   clear(){sites.clear();chunks.clear();}
 });
}
