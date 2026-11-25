// Builder B Wave68: Alderbrook Covered-and-Open Baths. Original fixed coordinates, inactive source-only candidate.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const ORIGINAL_ID='r1:bathhouse:temperate:small:004';
export function buildAlderbrookCoveredAndOpenBaths(){
 const b=sourcePlan('bathhouse','temperate','small',4,"Alderbrook Covered-and-Open Baths",40,19,38);
 const halls=[["north-changing",5,4,18,13,9,"pack3:025","gable-x"],["covered-west-bath",4,17,19,31,11,"pack3:026","hip"],["east-towel-room",24,5,34,11,8,"pack3:023","shed-z"],["south-rest-lodge",22,29,35,33,7,"pack3:025","gable-z"]],rings=[["covered-alder-bath",7,20,16,28,"z",11,"covered-west-bath"],["open-brook-bath",25,15,34,25,"x",19,"yard"]],benches=[["covered-alder-bath",8,23,9,25],["open-brook-bath",28,16,30,17]],rooms=[["yard",2,2,37,35],["north-changing",5,4,18,13],["covered-west-bath",4,17,19,31],["east-towel-room",24,5,34,11],["south-rest-lodge",22,29,35,33],["covered-alder-bath",7,20,16,28],["open-brook-bath",25,15,34,25]],doors=[["yard","north-changing",11,4,0,1],["yard","north-changing",11,13,0,-1],["yard","covered-west-bath",4,24,1,0],["yard","covered-west-bath",11,17,0,1],["yard","covered-west-bath",11,31,0,-1],["yard","east-towel-room",29,11,0,-1],["yard","south-rest-lodge",29,29,0,1],["covered-west-bath","covered-alder-bath",11,20,0,1],["covered-alder-bath","covered-west-bath",11,28,0,1],["yard","open-brook-bath",25,19,1,0],["open-brook-bath","yard",34,19,1,0],["outside","yard",19,35,0,-1]];
 const K=(x,z)=>x+','+z,roof=new Map(),root=new Set(),walls=new Set(),ringOwner=new Map(),benchXZ=new Set();
 const dirs={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 const roofHeight=(x,z,h)=>{const [,x0,z0,x1,z1,base,,profile]=h;const X=Math.min(x-x0,x1-x),Z=Math.min(z-z0,z1-z);return base+Math.floor((profile==='gable-x'?X:profile==='gable-z'?Z:profile==='shed-z'?(z-z0):Math.min(X,Z))/4);};
 for(let x=2;x<=37;x++)for(let z=2;z<=35;z++)b.put(x,0,z,'foundation','live:stone');
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
 return b.finish("A closed stone bath hall and separate open garden bath linked by real yard paths, offset changing and towel rooms, and a low southern rest lodge.",{originalBuilderBWave:68,workingWater:false,workingHeat:false,workingBathing:false,productionRegistered:false,schema1SaveWritten:false,installedPack3Pack4PhysicalTested:false,realM7PlayerTested:false});
}
