// Builder B Wave70: Ambercrown Five-Court Dry Bath Complex. Original fixed coordinates, inactive source-only candidate.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const ORIGINAL_ID='r1:bathhouse:desert:large:003';
export function buildAmbercrownFiveBathCourt(){
 const b=sourcePlan('bathhouse','desert','large',3,"Ambercrown Five-Court Dry Bath Complex",68,29,62);
 const halls=[["north-grand-changing",20,5,47,16,15,"pack3:026","gable-z"],["west-covered-baths",5,14,18,40,12,"pack3:025","shed-z"],["east-covered-baths",50,13,62,44,17,"pack3:023","gable-x"],["south-rest-gallery",20,47,47,55,10,"pack3:025","hip"]],rings=[["west-inner-bath",8,20,15,33,"z",11,"west-covered-baths"],["east-inner-bath",53,21,59,35,"z",55,"east-covered-baths"],["central-grand-open-bath",24,22,41,34,"x",28,"yard"],["southwest-open-bath",21,38,30,44,"x",40,"yard"],["southeast-open-bath",36,38,45,44,"z",40,"yard"]],benches=[["west-inner-bath",9,24,10,28],["east-inner-bath",57,26,58,30],["central-grand-open-bath",29,23,35,25],["southwest-open-bath",24,39,26,39],["southeast-open-bath",37,40,38,42]],rooms=[["yard",2,2,65,59],["north-grand-changing",20,5,47,16],["west-covered-baths",5,14,18,40],["east-covered-baths",50,13,62,44],["south-rest-gallery",20,47,47,55],["west-inner-bath",8,20,15,33],["east-inner-bath",53,21,59,35],["central-grand-open-bath",24,22,41,34],["southwest-open-bath",21,38,30,44],["southeast-open-bath",36,38,45,44]],doors=[["yard","north-grand-changing",33,5,0,1],["yard","north-grand-changing",33,16,0,-1],["yard","west-covered-baths",18,26,-1,0],["yard","west-covered-baths",11,40,0,-1],["yard","east-covered-baths",50,28,1,0],["yard","east-covered-baths",55,44,0,-1],["yard","south-rest-gallery",33,47,0,1],["yard","south-rest-gallery",33,55,0,-1],["west-covered-baths","west-inner-bath",11,20,0,1],["west-inner-bath","west-covered-baths",11,33,0,1],["east-covered-baths","east-inner-bath",55,21,0,1],["east-inner-bath","east-covered-baths",55,35,0,1],["yard","central-grand-open-bath",24,28,1,0],["central-grand-open-bath","yard",41,28,1,0],["yard","southwest-open-bath",21,40,1,0],["southwest-open-bath","yard",30,40,1,0],["yard","southeast-open-bath",40,38,0,1],["southeast-open-bath","yard",40,44,0,1],["outside","yard",33,59,0,-1]];
 const K=(x,z)=>x+','+z,roof=new Map(),root=new Set(),walls=new Set(),ringOwner=new Map(),benchXZ=new Set();
 const dirs={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 const roofHeight=(x,z,h)=>{const [,x0,z0,x1,z1,base,,profile]=h;const X=Math.min(x-x0,x1-x),Z=Math.min(z-z0,z1-z);return base+Math.floor((profile==='gable-x'?X:profile==='gable-z'?Z:profile==='shed-z'?(z-z0):Math.min(X,Z))/4);};
 for(let x=2;x<=65;x++)for(let z=2;z<=59;z++)b.put(x,0,z,'foundation','live:stone');
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
 return b.finish("Monumental desert dry bath compound: two enclosed long baths and three independent outdoor courts, four distinct roof profiles, protected stone bench islands, grand changing and resting galleries.",{originalBuilderBWave:70,workingWater:false,workingHeat:false,workingBathing:false,productionRegistered:false,schema1SaveWritten:false,installedPack3Pack4PhysicalTested:false,realM7PlayerTested:false});
}
