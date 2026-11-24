// Builder B Wave64: Briarbell Cloister Seed House — original fixed-coordinate source candidate.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const ORIGINAL_ID='r1:greenhouse:temperate:small:004';
export function buildBriarbellCloisterSeedHouse(){
 const b=sourcePlan('greenhouse','temperate','small',4,"Briarbell Cloister Seed House",31,17,35);
 const wings=[["north-reception",5,4,25,9,10,"pack3:026"],["south-sorting",5,20,25,25,9,"pack3:025"],["west-gallery",5,10,10,19,8,"pack3:023"],["east-gallery",20,10,25,19,11,"pack3:026"]];
 const roots=[["north-reception",5,4],["south-sorting",25,25],["west-gallery",5,14],["east-gallery",25,14]];
 const beds=[["cloister-seed-bed",13,12,16,15,false],["outer-ledger-bed",9,28,13,30,false],["north-sorting-table",9,6,11,7,true]];
 const rooms=[["north-reception",5,4,25,9],["south-sorting",5,20,25,25],["west-gallery",5,10,10,19],["east-gallery",20,10,25,19],["sky-court",11,10,19,19],["outside-workyard",5,26,25,32]];
 const doors=[["outside","north-reception",15,4,0,1],["north-reception","sky-court",15,9,0,1],["west-gallery","sky-court",10,17,1,0],["east-gallery","sky-court",20,17,-1,0],["south-sorting","sky-court",15,20,0,-1],["outside","west-gallery",5,17,1,0],["outside","east-gallery",25,17,-1,0],["south-sorting","outside-workyard",15,25,0,1],["outside","outside-workyard",20,32,0,1]];
 const K=(x,z)=>x+','+z,covered=new Map(),walls=new Set(),bedXZ=new Set(),rootXZ=new Set(roots.map(([,x,z])=>K(x,z)));
 const dirs={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 for(const[name,x0,z0,x1,z1,base,asset]of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  if(x>=11&&x<=19&&z>=10&&z<=19)continue;
  const k=K(x,z);if(covered.has(k))throw Error('Roof overlap '+k);
  const y=base+Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/3);covered.set(k,{name,y,asset});
 }
 for(let x=2;x<=28;x++)for(let z=2;z<=32;z++)b.put(x,0,z,'foundation','live:stone');
 for(const[k,p]of covered){const[x,z]=k.split(',').map(Number);
  if(Object.values(dirs).some(([dx,dz])=>!covered.has(K(x+dx,z+dz)))){walls.add(k);for(let y=1;y<p.y-1;y++)b.put(x,y,z,'wall','live:stone');}
  b.put(x,p.y-1,z,'support','live:stone');b.put(x,p.y,z,'roof',p.asset,'north',{originalWing:p.name,installedPhysicsPending:true});
 }
 for(const[name,x,z]of roots){const p=covered.get(K(x,z));if(p?.name!==name)throw Error('Missing roof root');b.support(x,z,p.y-1,'live:stone','original-bearing-'+name);}
 for(const[name,x0,z0,x1,z1,sheltered]of beds)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  const k=K(x,z);if(covered.has(k)!==sheltered||b.clear(x,0,z)||!b.clear(x,1,z)||!b.clear(x,2,z))throw Error('Dry bed conflict '+name+' '+k);
  bedXZ.add(k);b.put(x,1,z,'furnishing','live:stone','none',{originalDryBed:name,sheltered});
  if(x===x0||x===x1||z===z0||z===z1)b.put(x,2,z,'furnishing','live:stone','none',{originalDryRim:name});
 }
 for(const room of rooms)b.room(...room);
 for(const[from,to,x,z]of doors){const k=K(x,z);if(rootXZ.has(k)||bedXZ.has(k)||b.clear(x,0,z))throw Error('Door conflict '+k);b.opening(x,z);b.portal(from,to,x,z);}
 for(const k of walls){const[x,z]=k.split(',').map(Number);
  if(rootXZ.has(k)||(x*7+z*3)%5!==0||[1,2,3,4,5,6].some(y=>b.clear(x,y,z)))continue;
  const face=Object.entries(dirs).find(([,v])=>!covered.has(K(x+v[0],z+v[1]))&&[2,3,4,5].every(y=>b.clear(x+v[0],y,z+v[1])));
  if(!face)continue;for(let y=2;y<=5;y++){b.cut(x,y,z);b.put(x,y,z,'window','pack4:030',face[0],{originalFramedPane:true,installedPhysicsPending:true});}
 }
 return b.finish("Continuous ring of four stepped roof galleries around a genuinely open cloister, two exposed dry trays and a sheltered stone sorting table. No live cultivation.",{originalBuilderBWave:64,workingCrops:false,workingIrrigation:false,productionRegistered:false,schema1SaveWritten:false,installedPack3Pack4PhysicalTested:false,realM7PlayerTested:false});
}
