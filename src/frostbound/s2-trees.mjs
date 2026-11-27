// Physical tree proposals. No production registration or historical profile mutation.
import {PHYSICAL_MAX_Y,physicalRegionAt} from '../world-height.mjs';
import {v6BiomeAt} from '../manual-biomes/v6-balanced-biomes.mjs';
import {createUpperNaturalRegistry} from '../world-height-natural-contract.mjs';
export const FAMILIES=Object.freeze({snowpine:[8,16],frostspire:[16,30],silverbirch:[10,20],glacierFir:[18,32],winterwillow:[12,22],frostfather:[35,60],blackfrost:[5,14]});
const key=(x,y,z)=>`${x},${y},${z}`;
const dirs=[[1,0],[-1,0],[0,1],[0,-1]];
const hash=(x,z,seed)=>((Math.imul(x^seed,73856093)^Math.imul(z+seed,19349663))>>>0)/4294967296;
export function treeCells(family,x,floor,z,height,seed){
 const range=FAMILIES[family];if(!range||![x,floor,z,height,seed].every(Number.isSafeInteger)||height<range[0]||height>range[1]||floor+height>PHYSICAL_MAX_Y)throw Error('Invalid Frostbound tree');
 const cells=new Map();const put=(dx,dy,dz,id)=>{if(dy<1||dy>height)return;const k=key(x+dx,floor+dy,z+dz);if(!cells.has(k)||id===4)cells.set(k,id);};
 for(let y=1;y<=height;y++)put(0,y,0,4);
 const conifer=family==='snowpine'||family==='frostspire'||family==='glacierFir'||family==='frostfather';
 if(conifer){
  const radius=family==='frostspire'?2:family==='snowpine'?3:family==='glacierFir'?4:5;
  const start=Math.max(4,Math.floor(height*.36));const step=family==='frostfather'?4:3;
  for(let y=start;y<height;y+=step){const r=Math.max(1,Math.ceil(radius*(height-y)/(height-start)));
   for(let dx=-r;dx<=r;dx++)for(let dz=-r;dz<=r;dz++)if(Math.abs(dx)+Math.abs(dz)<=r+1){put(dx,y,dz,406);if(Math.abs(dx)+Math.abs(dz)<r)put(dx,y+1,dz,407);}
  }
  put(0,height,0,407);
 }else{
  const bare=family==='blackfrost',willow=family==='winterwillow',radius=bare?3:willow?4:3;
  for(let i=0;i<4;i++){const [dx,dz]=dirs[i];const y=Math.max(3,height-3-(i%2));const length=radius-(hash(x+i,z,seed)<.35?1:0);
   for(let j=1;j<=length;j++){put(dx*j,y,dz*j,4);if(j===length)put(dx*j,y+1,dz*j,4);}
   if(!bare){for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){put(dx*length+a,y+2,dz*length+b,407);put(dx*length+a,y+1,dz*length+b,406);}
    if(willow)for(let d=1;d<=3;d++)put(dx*length,y-d,dz*length,406);
   }
  }
  if(!bare){for(const [dx,dz] of dirs)put(dx,height,dz,407);}
 }
 return Object.freeze([...cells].map(([k,id])=>Object.freeze([...k.split(',').map(Number),id])));
}
// An explicit finite set of research sites, checked against exact combined world.
// Natural source is independent of player edits; no collision with existing cells.
export function admitTree(world,family,x,floor,z,height){
 const seed=world.seed;if(![272,276,279].includes(world.naturalAndLandmarkBlock(x,floor,z))||world.environmentCaves?.get(x,floor,z)!==undefined||!world.naturalAndLandmarkBlock(x,floor-1,z)||world.environmentCaves?.get(x,floor-1,z)!==undefined)return null;
 const cells=treeCells(family,x,floor,z,height,seed),columns=new Set();
 for(const [a,b,c] of cells){const k=`${a},${c}`;if(!columns.has(k)){const region=v6BiomeAt(a,c,seed);if(region?.name!=='snow'||region.weight<.65)return null;columns.add(k);}
  if(world.naturalAndLandmarkBlock(a,b,c)!==0||world.environmentCaves?.get(a,b,c)!==undefined)return null;
 }
 return cells;
}
export function createTreeSource(seed,trees){
 const cells=new Map(),owners=new Set();for(const tree of trees)for(const [x,y,z,id] of tree){const k=key(x,y,z);if(cells.has(k))throw Error('Overlapping Frostbound trees');cells.set(k,id);if(y>=20)owners.add(physicalRegionAt(x,y,z).key);}
 const registry=createUpperNaturalRegistry(),generator='mythwrought-upper-frostbound-research',sourceVersion='s2-tree-fixture-v1';
 registry.register(generator,sourceVersion,p=>({...p,get:(x,y,z)=>cells.get(key(x,y,z))??0,occupied:k=>owners.has(k),revision:()=>0}));
 const upper=registry.open({kind:'mythwrought-upper-source-profile',version:1,seed,generator,sourceVersion});
 return Object.freeze({upper,get:(x,y,z)=>y>=20?upper.get(x,y,z):cells.get(key(x,y,z))??0,owners:Object.freeze([...owners].sort())});
}
