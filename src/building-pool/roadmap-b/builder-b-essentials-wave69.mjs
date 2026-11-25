// Builder B Wave69: Wrenmere Three-Court Bath Lodge. Original fixed coordinates, inactive source-only candidate.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const ORIGINAL_ID='r1:bathhouse:temperate:medium:003';
export function buildWrenmereThreeCourtBaths(){
 const b=sourcePlan('bathhouse','temperate','medium',3,"Wrenmere Three-Court Bath Lodge",52,24,48);
 const halls=[["northwest-changing",5,4,21,15,10,"pack3:023","hip"],["east-long-bath-hall",33,8,46,31,14,"pack3:026","gable-x"],["south-rest-hall",16,34,35,42,11,"pack3:025","gable-z"]],rings=[["covered-east-bath",36,14,43,24,"z",39,"east-long-bath-hall"],["western-open-bath",8,22,18,32,"x",26,"yard"],["central-open-bath",23,17,30,29,"z",26,"yard"]],benches=[["covered-east-bath",37,18,38,20],["western-open-bath",11,23,15,24],["central-open-bath",24,21,25,24]],rooms=[["yard",2,2,49,45],["northwest-changing",5,4,21,15],["east-long-bath-hall",33,8,46,31],["south-rest-hall",16,34,35,42],["covered-east-bath",36,14,43,24],["western-open-bath",8,22,18,32],["central-open-bath",23,17,30,29]],doors=[["yard","northwest-changing",13,4,0,1],["yard","northwest-changing",13,15,0,-1],["yard","east-long-bath-hall",33,19,1,0],["yard","east-long-bath-hall",39,31,0,-1],["yard","south-rest-hall",25,34,0,1],["yard","south-rest-hall",25,42,0,-1],["east-long-bath-hall","covered-east-bath",39,14,0,1],["covered-east-bath","east-long-bath-hall",39,24,0,1],["yard","western-open-bath",8,26,1,0],["western-open-bath","yard",18,26,1,0],["yard","central-open-bath",26,17,0,1],["central-open-bath","yard",26,29,0,1],["outside","yard",25,45,0,-1]];
 const K=(x,z)=>x+','+z,roof=new Map(),root=new Set(),walls=new Set(),ringOwner=new Map(),benchXZ=new Set();
 const dirs={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 const roofHeight=(x,z,h)=>{const [,x0,z0,x1,z1,base,,profile]=h;const X=Math.min(x-x0,x1-x),Z=Math.min(z-z0,z1-z);return base+Math.floor((profile==='gable-x'?X:profile==='gable-z'?Z:profile==='shed-z'?(z-z0):Math.min(X,Z))/4);};
 for(let x=2;x<=49;x++)for(let z=2;z<=45;z++)b.put(x,0,z,'foundation','live:stone');
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
 return b.finish("Long eastern enclosed bath gallery, two differently oriented open dry courts, separated northwest changing lodge and broad southern rest hall, with continuous independent outdoor connections.",{originalBuilderBWave:69,workingWater:false,workingHeat:false,workingBathing:false,productionRegistered:false,schema1SaveWritten:false,installedPack3Pack4PhysicalTested:false,realM7PlayerTested:false});
}
