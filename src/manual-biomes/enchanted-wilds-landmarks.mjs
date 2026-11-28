// E7 first six physical wilderness landmarks. Chunk-owned, original materials,
// no terrain cutting, no settlements, loot, quests or shared engine changes.
import {BLOCK} from '../voxel.mjs';
import {ENVIRONMENT_GROUND as G} from '../environment-ground.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
export const WILDS_LANDMARKS=Object.freeze(['Runestone Circle','Spirit Lantern Grove','Moonblossom Shrine','Fallen Sacred Arch','Enchanted Mushroom Ring','Whispering Stone','Crystal Root Formation','Moonwell','Druid Sanctuary','Forgotten Rune Gate','Hollow Tree Sanctuary','Fungal Stone Shrine']);
const hash=(x,z,s)=>{let n=Math.imul(x,0x7feb352d)^Math.imul(z,0x846ca68b)^s;n=Math.imul(n^(n>>>16),0x45d9f3b);return(n^(n>>>16))>>>0;};
const key=(x,y,z)=>[x,y,z].join(',');
const soil=new Set([G.woodlandLoam,G.woodlandPeat,G.woodlandMoss,BLOCK.GRASS,BLOCK.DIRT]);
export function buildWildsLandmark(id,x,floor,z,turn=0){
 if(!WILDS_LANDMARKS[id]||![x,floor,z,turn].every(Number.isSafeInteger)||turn<0||turn>3)throw Error('Invalid landmark');
 const rows=new Map(),foot=new Map(),reserved=new Map();
 const rotate=(a,c)=>[[a,c],[-c,a],[-a,-c],[c,-a]][turn];
 const put=(a,b,c,mat)=>{
   if(Math.abs(a)>4||Math.abs(c)>4||b<1||b>7)throw Error('Landmark outside bounded footprint');
   const [u,v]=rotate(a,c),p=[x+u,floor+b,z+v];
   rows.set(key(...p),[...p,mat]);if(b===1)foot.set(u+','+v,[x+u,z+v]);
 };
 // A two-wide, three-high approach and central walking area remain empty.
 for(let a=-1;a<=0;a++)for(let c=-4;c<=1;c++)for(let b=1;b<=3;b++){
   const [u,v]=rotate(a,c),p=[x+u,floor+b,z+v];reserved.set(key(...p),p);
 }
 const pillar=(a,c,h,mat=G.slate)=>{for(let b=1;b<=h;b++)put(a,b,c,mat);};
 const stone=G.slate,ivory=G.gneiss,bark=G.aetherBark,crystal=BLOCK.CRYSTAL;
 if(id===0){for(const [a,c] of [[-3,-2],[3,-2],[-3,2],[3,2],[0,4]]){pillar(a,c,3);put(a,4,c,crystal);}}
 if(id===1){for(const [a,c] of [[-3,-2],[3,-2],[-3,3],[3,3]]){pillar(a,c,3,bark);put(a,4,c,crystal);put(a,5,c,G.moonLeaves);}}
 if(id===2){for(const a of [-3,3]){pillar(a,2,4,ivory);put(a,5,2,crystal);}for(let a=-2;a<=2;a++)put(a,4,2,stone);for(let a=-2;a<=2;a++)put(a,1,3,ivory);put(0,2,3,crystal);}
 if(id===3){pillar(-3,2,4);pillar(3,2,2);for(let a=-2;a<=-1;a++)put(a,4,2,stone);put(-1,5,2,ivory);put(2,1,3,stone);put(1,1,3,ivory);}
 if(id===4){for(const [a,c] of [[-3,-2],[3,-2],[-3,2],[3,2],[0,3]]){pillar(a,c,2,ivory);put(a,3,c,G.aetherLeaves);for(const [da,dc] of [[1,0],[-1,0],[0,1],[0,-1]])put(a+da,3,c+dc,G.aetherLeaves);put(a,4,c,G.moonLeaves);}}
 if(id===5){for(let b=1;b<=5;b++){put(2,b,2,stone);if(b<5)put(3,b,2,stone);}put(2,6,2,crystal);put(3,3,3,crystal);put(2,1,3,ivory);put(1,1,3,ivory);}
 if(id===6){for(const a of [-3,3]){pillar(a,2,2,bark);put(a,3,2,bark);put(a-Math.sign(a),3,2,bark);put(a-Math.sign(a),4,2,crystal);put(a,1,3,stone);put(a,2,3,crystal);}pillar(3,-2,2,bark);put(3,3,-2,crystal);}
 if(id===7){for(let a=-3;a<=3;a++)for(let c=2;c<=4;c++){if(Math.abs(a)===3||c===4)put(a,1,c,ivory);else if(c===3&&a%2===0)put(a,1,c,G.moonLeaves);}for(const a of [-3,3]){put(a,2,3,stone);put(a,3,3,crystal);}put(0,1,2,ivory);}
 if(id===8){for(const [a,c] of [[-3,-2],[3,-2],[-3,3],[3,3]]){pillar(a,c,3,bark);put(a,4,c,ivory);}for(let a=-3;a<=3;a++)put(a,4,3,bark);for(let a=-2;a<=2;a++)put(a,5,3,G.moonLeaves);put(0,6,3,crystal);}
 if(id===9){for(const a of [-3,3]){pillar(a,0,6);for(let b=2;b<=5;b+=2)put(a-Math.sign(a),b,0,crystal);}for(let a=-2;a<=2;a++)put(a,6,0,ivory);put(0,7,0,crystal);}
 if(id===10){for(const a of [-3,3])for(let c=1;c<=3;c++)pillar(a,c,5,bark);for(let a=-2;a<=2;a++)for(let c=1;c<=3;c++)put(a,5,c,bark);for(let a=-3;a<=3;a++)for(let c=1;c<=3;c++)if(Math.abs(a)<3||c===2)put(a,6,c,G.moonLeaves);put(0,7,2,crystal);}
 if(id===11){for(const a of [-3,3]){pillar(a,2,2,ivory);for(let da=-1;da<=1;da++)for(let dc=-1;dc<=1;dc++)put(a+da,3,2+dc,G.aetherLeaves);put(a,4,2,G.moonLeaves);}for(let a=-2;a<=2;a++)put(a,1,4,stone);put(0,2,4,crystal);}
 for(const k of reserved.keys())if(rows.has(k))throw Error('Landmark obstructs designated approach');
 return Object.freeze({id,name:WILDS_LANDMARKS[id],origin:Object.freeze([x,floor,z]),turn,cells:Object.freeze([...rows.values()].map(Object.freeze)),footprint:Object.freeze([...foot.values()].map(Object.freeze)),approach:Object.freeze([...reserved.values()].map(Object.freeze))});
}
export function planWildsLandmark(ground,cx,cz,treeRows,regionAt){
 const roll=hash(cx,cz,ground.seed+84017);
 const x0=cx*16,z0=cz*16;
 const caveAt=(x,y,z)=>ground.environmentCaves.get(x,y,z)!==undefined;
 for(let i=0;i<6;i++){
  const r=hash(cx*7+i,cz*11-i,roll|0),x=x0+5+r%6,z=z0+5+(r>>>5)%6;
  const region=regionAt(x,z,ground.seed);
  if(region===null||v6BiomeAt(x,z,ground.seed)?.weight<.90)continue;
  // Ruinwood/glades are the landmark-rich regions, other groves quieter.
  if(roll% (region===4||region===3?4:10)!==0)return null;
  const col=ground._columnPlan(x,z);if(!col.size)continue;
  const floor=Math.max(...col.keys());if(floor<0||floor>18)continue;
  // Common structures retain their majority share; uncommon structures
  // have their own six IDs and a deterministic one-in-three proposal.
  const id=(r>>>18)%3===0?6+(r>>>10)%6:(r>>>10)%6;
  const p=buildWildsLandmark(id,x,floor,z,(r>>>22)%4);
  const support=(a,c)=>{const q=ground._columnPlan(a,c);return q.size&&Math.max(...q.keys())===floor&&soil.has(q.get(floor))&&ground.get(a,floor,c)===q.get(floor)&&ground.get(a,floor-1,c)!==BLOCK.AIR&&v6BiomeAt(a,c,ground.seed)?.name==='enchanted'&&!caveAt(a,floor,c)&&!caveAt(a,floor-1,c);};
  if(!p.footprint.every(([a,c])=>support(a,c)))continue;
  if(!p.approach.filter(([,b])=>b===floor+1).every(([a,,c])=>support(a,c)))continue;
  if([...p.cells,...p.approach].some(([a,b,c])=>a<x0||a>=x0+16||c<z0||c>=z0+16||v6BiomeAt(a,c,ground.seed)?.name!=='enchanted'||treeRows.has(key(a,b,c))||caveAt(a,b,c)||ground.get(a,b,c)!==BLOCK.AIR))continue;
  return p;
 }
 return null;
}
