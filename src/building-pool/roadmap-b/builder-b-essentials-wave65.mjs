// Builder B Wave65: Dunelace Stepped Sunhouse — original fixed-coordinate source candidate.
import {sourcePlan} from '../roadmap-1b/m2-community-structures.mjs';
export const ORIGINAL_ID='r1:greenhouse:desert:small:003';
export function buildDunelaceSteppedSunhouse(){
 const b=sourcePlan('greenhouse','desert','small',3,"Dunelace Stepped Sunhouse",35,19,37);
 const wings=[["tapered-north-entry",13,5,20,9,9,"pack3:023"],["upper-seed-hall",9,10,24,14,11,"pack3:025"],["wide-sun-hall",5,15,28,25,13,"pack3:026"],["southern-drying-hall",9,26,24,30,10,"pack3:023"]];
 const roots=[["tapered-north-entry",13,5],["upper-seed-hall",9,10],["wide-sun-hall",5,15],["southern-drying-hall",24,30]];
 const beds=[["west-dry-seed-bed",8,18,11,21,true],["east-dry-seed-bed",22,18,25,21,true],["sunwell-stone-rack",15,18,18,20,false],["outer-drying-table",12,32,16,33,false]];
 const rooms=[["tapered-north-entry",13,5,20,9],["upper-seed-hall",9,10,24,14],["west-seed-hall",5,15,13,25],["east-seed-hall",20,15,28,25],["sky-court",14,17,19,22],["southern-drying-hall",9,26,24,30],["outer-yard",9,31,24,34]];
 const doors=[["outside","tapered-north-entry",16,5,0,1],["tapered-north-entry","upper-seed-hall",16,9,0,1],["upper-seed-hall","west-seed-hall",11,14,0,1],["upper-seed-hall","east-seed-hall",22,14,0,1],["west-seed-hall","sky-court",13,22,1,0],["east-seed-hall","sky-court",20,22,-1,0],["outside","west-seed-hall",5,23,1,0],["outside","east-seed-hall",28,23,-1,0],["west-seed-hall","southern-drying-hall",11,25,0,1],["east-seed-hall","southern-drying-hall",22,25,0,1],["southern-drying-hall","outer-yard",19,30,0,1],["outside","outer-yard",19,34,0,-1]];
 const K=(x,z)=>x+','+z,covered=new Map(),walls=new Set(),bedXZ=new Set(),rootXZ=new Set(roots.map(([,x,z])=>K(x,z)));
 const dirs={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
 for(const[name,x0,z0,x1,z1,base,asset]of wings)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  if(x>=14&&x<=19&&z>=17&&z<=22)continue;
  const k=K(x,z);if(covered.has(k))throw Error('Roof overlap '+k);
  const y=base+Math.floor(Math.min(x-x0,x1-x,z-z0,z1-z)/3);covered.set(k,{name,y,asset});
 }
 for(let x=2;x<=32;x++)for(let z=2;z<=34;z++)b.put(x,0,z,'foundation','live:stone');
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
 return b.finish("Stepped desert silhouette with four staggered roof bands, central sunwell, two sheltered beds and two exposed drying stations. No water or climate simulation.",{originalBuilderBWave:65,workingCrops:false,workingIrrigation:false,productionRegistered:false,schema1SaveWritten:false,installedPack3Pack4PhysicalTested:false,realM7PlayerTested:false});
}
