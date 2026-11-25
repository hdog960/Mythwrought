// Builder B Wave67: Ochrestep Crosswind Dry Bathhouse; fixed original source geometry, not runtime.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const ORIGINAL_ID='r1:bathhouse:desert:medium:002';
export function buildOchrestepCrosswindBathhouse(){
 const b=sourcePlan('bathhouse','desert','medium',2,"Ochrestep Crosswind Dry Bathhouse",49,23,45);
 const halls=[["north-changing",14,4,34,12,12,"pack3:026"],["west-wash-gallery",4,13,14,33,10,"pack3:025"],["east-drying-gallery",34,13,44,30,11,"pack3:023"],["south-rest-hall",16,34,32,39,9,"pack3:025"]],rings=[["central-crosswind-bath",19,16,29,24,"x",20],["southwest-dry-bath",6,35,12,41,"x",38],["southeast-dry-bath",36,33,44,41,"z",40]],benches=[["central-crosswind-bath",22,17,26,18],["southwest-dry-bath",8,36,10,37],["southeast-dry-bath",37,36,38,38]],rooms=[["north-changing",14,4,34,12],["west-wash-gallery",4,13,14,33],["east-drying-gallery",34,13,44,30],["south-rest-hall",16,34,32,39],["central-crosswind-bath",19,16,29,24],["southwest-dry-bath",6,35,12,41],["southeast-dry-bath",36,33,44,41],["open-crosswind-yard",15,13,33,33]],doors=[["outside","north-changing",24,4,0,1],["north-changing","open-crosswind-yard",24,12,0,1],["outside","west-wash-gallery",4,20,1,0],["west-wash-gallery","open-crosswind-yard",14,20,1,0],["outside","east-drying-gallery",44,20,-1,0],["east-drying-gallery","open-crosswind-yard",34,20,-1,0],["open-crosswind-yard","central-crosswind-bath",19,20,1,0],["central-crosswind-bath","open-crosswind-yard",29,20,1,0],["open-crosswind-yard","south-rest-hall",24,34,0,1],["outside","south-rest-hall",24,39,0,1],["outside","southwest-dry-bath",6,38,1,0],["southwest-dry-bath","south-rest-hall",12,38,1,0],["outside","southeast-dry-bath",40,33,0,1],["southeast-dry-bath","south-rest-hall",40,41,0,1]];
 const K=(x,z)=>x+','+z,roof=new Map(),root=new Set(),walls=new Set(),ringsXZ=new Set(),benchXZ=new Set();
 const dirs={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 for(let x=2;x<=46;x++)for(let z=2;z<=42;z++)b.put(x,0,z,'foundation','live:stone');
 for(const[name,x0,z0,x1,z1,base,asset]of halls)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  const k=K(x,z);if(roof.has(k))throw Error('Overlapping halls');roof.set(k,{name,y:base+Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/3),asset});}
 for(const[k,p]of roof){const[x,z]=k.split(',').map(Number);if(Object.values(dirs).some(([dx,dz])=>!roof.has(K(x+dx,z+dz)))){
  walls.add(k);for(let y=1;y<p.y-1;y++)b.put(x,y,z,'wall','live:stone');}
  b.put(x,p.y-1,z,'support','live:stone');b.put(x,p.y,z,'roof',p.asset,'north',{bathRoofWing:p.name,installedPhysicsPending:true});}
 for(const[name,x0,z0,x1,z1]of halls)for(const[x,z]of [[x0,z0],[x1,z1]]){root.add(K(x,z));b.support(x,z,roof.get(K(x,z)).y-1,'live:stone','bath-bearing-'+name);}
 for(const[name,x0,z0,x1,z1,axis,g]of rings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  const k=K(x,z);if(roof.has(k)||b.clear(x,0,z))throw Error('Bath court not fully sky-open and founded '+k);
  ringsXZ.add(k);const edge=x===x0||x===x1||z===z0||z===z1;
  const gate=axis==='z'?(z===z0||z===z1)&&(x===g||x===g+1):(x===x0||x===x1)&&(z===g||z===g+1);
  if(edge&&!gate)for(let y=1;y<=2;y++)b.put(x,y,z,'wall','live:stone','none',{dryBathRing:name});
 }
 for(const[name,x0,z0,x1,z1]of benches)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  const k=K(x,z);if(!ringsXZ.has(k)||!b.clear(x,1,z)||!b.clear(x,2,z))throw Error('Bench blocked '+k);
  benchXZ.add(k);b.put(x,1,z,'furnishing','live:stone','none',{dryBathBench:name});
 }
 for(const room of rooms)b.room(...room);
 for(const[from,to,x,z]of doors){const k=K(x,z);
  if(root.has(k)||benchXZ.has(k)||b.clear(x,0,z))throw Error('Portal obstruction '+k);
  if(ringsXZ.has(k)&&(!b.clear(x,1,z)||!b.clear(x,2,z)))throw Error('Portal cuts actual ring '+k);
  b.opening(x,z);b.portal(from,to,x,z);}
 for(const k of walls){const[x,z]=k.split(',').map(Number);
  if(root.has(k)||(x*7+z*3)%5!==0||[1,2,3,4,5,6].some(y=>b.clear(x,y,z)))continue;
  const face=Object.entries(dirs).find(([,v])=>!roof.has(K(x+v[0],z+v[1]))&&[2,3,4,5].every(y=>b.clear(x+v[0],y,z+v[1])));
  if(!face)continue;for(let y=2;y<=5;y++){b.cut(x,y,z);b.put(x,y,z,'window','pack4:030',face[0],{bathFramedPane:true,installedPhysicsPending:true});}
 }
 return b.finish("Crosswind central walk-through eleven-by-nine dry bath with two off-axis smaller courts, four separated roofed service halls, side benches and open connected yard; no water or heat.",{originalBuilderBWave:67,workingWater:false,workingHeat:false,workingBathing:false,productionRegistered:false,schema1SaveWritten:false,installedPack3Pack4PhysicalTested:false,realM7PlayerTested:false});
}
