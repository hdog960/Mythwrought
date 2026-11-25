// Builder B Wave66: Elmwater Twin Walk-Through Dry Baths; fixed original source geometry, not runtime.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const ORIGINAL_ID='r1:bathhouse:temperate:small:003';
export function buildElmwaterTwinDryBaths(){
 const b=sourcePlan('bathhouse','temperate','small',3,"Elmwater Twin Walk-Through Dry Baths",32,18,34);
 const halls=[["changing-hall",5,4,25,12,9,"pack3:025"],["west-towel-porch",4,13,11,15,7,"pack3:023"],["east-rest-porch",21,13,28,15,8,"pack3:026"]],rings=[["west-dry-bath",5,18,13,26,"z",9],["east-dry-bath",18,18,26,26,"z",22]],benches=[["west-dry-bath",6,21,7,23],["east-dry-bath",24,21,25,23]],rooms=[["changing-hall",5,4,25,12],["west-towel-porch",4,13,11,15],["east-rest-porch",21,13,28,15],["west-dry-bath",5,18,13,26],["east-dry-bath",18,18,26,26],["southern-yard",3,27,28,31]],doors=[["outside","changing-hall",15,4,0,1],["changing-hall","west-towel-porch",8,12,0,1],["changing-hall","east-rest-porch",23,12,0,1],["west-towel-porch","west-dry-bath",9,18,0,1],["east-rest-porch","east-dry-bath",22,18,0,1],["west-dry-bath","southern-yard",9,26,0,1],["east-dry-bath","southern-yard",22,26,0,1],["outside","southern-yard",15,31,0,-1]];
 const K=(x,z)=>x+','+z,roof=new Map(),root=new Set(),walls=new Set(),ringsXZ=new Set(),benchXZ=new Set();
 const dirs={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 for(let x=2;x<=29;x++)for(let z=2;z<=31;z++)b.put(x,0,z,'foundation','live:stone');
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
 return b.finish("Twin separate nine-by-nine walk-through dry stone bath courts, flanking covered towel and rest porches, changing hall and southern open yard; no water or heat.",{originalBuilderBWave:66,workingWater:false,workingHeat:false,workingBathing:false,productionRegistered:false,schema1SaveWritten:false,installedPack3Pack4PhysicalTested:false,realM7PlayerTested:false});
}
