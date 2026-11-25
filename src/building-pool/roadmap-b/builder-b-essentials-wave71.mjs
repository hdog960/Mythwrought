// Builder B Wave71: Snowlark Double-Hall Winter Baths. Original fixed coordinates, inactive source-only candidate.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const ORIGINAL_ID='r1:bathhouse:snow:small:003';
export function buildSnowlarkDoubleHallBaths(){
 const b=sourcePlan('bathhouse','snow','small',3,"Snowlark Double-Hall Winter Baths",38,22,43);
 const halls=[["winter-double-bath-hall",6,4,29,23,14,"pack3:026","gable-x"],["rear-drying-hut",9,31,27,37,10,"pack3:025","gable-z"]],rings=[["western-covered-winter-bath",10,9,17,18,"z",13,"winter-double-bath-hall"],["eastern-covered-winter-bath",20,9,26,18,"z",23,"winter-double-bath-hall"],["open-snow-court",12,25,24,29,"x",26,"yard"]],benches=[["western-covered-winter-bath",11,12,12,15],["eastern-covered-winter-bath",21,12,22,15],["open-snow-court",15,28,18,28]],rooms=[["yard",2,2,35,40],["winter-double-bath-hall",6,4,29,23],["rear-drying-hut",9,31,27,37],["western-covered-winter-bath",10,9,17,18],["eastern-covered-winter-bath",20,9,26,18],["open-snow-court",12,25,24,29]],doors=[["yard","winter-double-bath-hall",18,4,0,1],["yard","winter-double-bath-hall",18,23,0,-1],["yard","rear-drying-hut",18,31,0,1],["yard","rear-drying-hut",18,37,0,-1],["winter-double-bath-hall","western-covered-winter-bath",13,9,0,1],["western-covered-winter-bath","winter-double-bath-hall",13,18,0,1],["winter-double-bath-hall","eastern-covered-winter-bath",23,9,0,1],["eastern-covered-winter-bath","winter-double-bath-hall",23,18,0,1],["yard","open-snow-court",12,26,1,0],["open-snow-court","yard",24,26,1,0],["outside","yard",18,40,0,-1]];
 const K=(x,z)=>x+','+z,roof=new Map(),root=new Set(),walls=new Set(),ringOwner=new Map(),benchXZ=new Set();
 const dirs={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 const roofHeight=(x,z,h)=>{const [,x0,z0,x1,z1,base,,profile]=h;const X=Math.min(x-x0,x1-x),Z=Math.min(z-z0,z1-z);return base+Math.floor((profile==='gable-x'?X:profile==='gable-z'?Z:profile==='shed-z'?(z-z0):Math.min(X,Z))/4);};
 for(let x=2;x<=35;x++)for(let z=2;z<=40;z++)b.put(x,0,z,'foundation','live:stone');
 for(const hall of halls){const[name,x0,z0,x1,z1,,asset,profile]=hall;for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  const k=K(x,z);if(roof.has(k))throw Error('Overlapping halls '+k);roof.set(k,{name,y:roofHeight(x,z,hall),asset,profile,edge:x===x0||x===x1||z===z0||z===z1});}}
 for(const[k,p]of roof){const[x,z]=k.split(',').map(Number);if(p.edge){walls.add(k);for(let y=1;y<p.y-1;y++)b.put(x,y,z,'wall','live:stone');}
  b.put(x,p.y-1,z,'support','live:stone');b.put(x,p.y,z,'roof',p.asset,p.profile==='gable-z'?'east':'north',{bathRoofWing:p.name,bathRoofProfile:p.profile,installedPhysicsPending:true});}
 for(const[name,x0,z0,x1,z1]of halls)for(const[x,z]of [[x0,z0],[x1,z1]]){root.add(K(x,z));b.support(x,z,roof.get(K(x,z)).y-1,'live:stone','bath-bearing-'+name);}
 for(const[name,x0,z0,x1,z1,axis,g,owner]of rings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  const k=K(x,z),p=roof.get(k);if(ringOwner.has(k)||b.clear(x,0,z)||walls.has(k)||(owner==='yard'?!!p:p?.name!==owner))throw Error('Invalid court coverage '+name+' '+k);
  ringOwner.set(k,name);const edge=x===x0||x===x1||z===z0||z===z1;
  const gate=axis==='z'?(z===z0||z===z1)&&(x===g||x===g+1):(x===x0||x===x1)&&(z===g||z===g+1);
  if(edge&&!gate)for(let y=1;y<=2;y++)b.put(x,y,z,'wall','live:stone','none',{dryBathRing:name});
 }
 for(const[name,x0,z0,x1,z1]of benches)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  const k=K(x,z);if(ringOwner.get(k)!==name||!b.clear(x,1,z)||!b.clear(x,2,z))throw Error('Bench blocked '+k);
  benchXZ.add(k);b.put(x,1,z,'furnishing','live:stone','none',{dryBathBench:name});}
 for(const room of rooms)b.room(...room);
 for(const[from,to,x,z]of doors){const k=K(x,z);if(root.has(k)||benchXZ.has(k)||b.clear(x,0,z))throw Error('Portal obstruction '+k);
  if(ringOwner.has(k)&&(!b.clear(x,1,z)||!b.clear(x,2,z)))throw Error('Portal cuts ring '+k);b.opening(x,z);b.portal(from,to,x,z);}
 for(const k of walls){const[x,z]=k.split(',').map(Number);
  if(root.has(k)||(x*7+z*3)%5!==0||[1,2,3,4,5,6].some(y=>b.clear(x,y,z)))continue;
  const face=Object.entries(dirs).find(([,v])=>!roof.has(K(x+v[0],z+v[1]))&&[2,3,4,5].every(y=>b.clear(x+v[0],y,z+v[1])));
  if(!face)continue;for(let y=2;y<=5;y++){b.cut(x,y,z);b.put(x,y,z,'window','pack4:030',face[0],{bathFramedPane:true,installedPhysicsPending:true});}}
 return b.finish("Two parallel covered dry winter baths inside one high stone hall, rear open transverse snow court and separate drying hut; genuinely walkable between the two interior precincts.",{originalBuilderBWave:71,workingWater:false,workingHeat:false,workingBathing:false,productionRegistered:false,schema1SaveWritten:false,installedPack3Pack4PhysicalTested:false,realM7PlayerTested:false});
}
