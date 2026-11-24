// CI-ONLY Builder 1A #656 Galehewn, all 288 accepted originals plus new mountain inn.
// Exact immutable candidate SOURCE c0b06cc8b40cfbbbe055cbd68c2ca2ba9da3c76d; all original producer/uniqueness checks preserved.
// No edits to original compiler, old tests, runtime, shared CI, saves, or settlements.
// Roadmap C Builder 1A #652 Riverglass: exact original 284-pool, full strict D4,
// physically real Manual Pack1–5 source-producer test, additive CI-ONLY.
// No original files, production, saves, schema, settlements, or historical checks altered.
import test from 'node:test';import assert from 'node:assert/strict';
import {getM1Blueprints} from '../src/building-pool/roadmap-1a/legacy-buildings.mjs';
import {getM1InnExemplars} from '../src/building-pool/roadmap-1a/m1-inn-exemplars.mjs';
import {getM2Originals} from '../src/building-pool/roadmap-1a/m2-originals.mjs';
import {getM2HousingTranche} from '../src/building-pool/roadmap-1a/m2-housing-tranche.mjs';
import {getM2HousingWave2} from '../src/building-pool/roadmap-1a/m2-housing-wave2.mjs';
import {getM2HousingWave3} from '../src/building-pool/roadmap-1a/m2-housing-wave3.mjs';
import {getM2HousingWave4} from '../src/building-pool/roadmap-1a/m2-housing-wave4.mjs';
import {getM2HousingWave5} from '../src/building-pool/roadmap-1a/m2-housing-wave5.mjs';
import {getM2HousingWave6} from '../src/building-pool/roadmap-1a/m2-housing-wave6.mjs';
import {getM2HousingWave7} from '../src/building-pool/roadmap-1a/m2-housing-wave7.mjs';
import {getM2HousingWave8} from '../src/building-pool/roadmap-1a/m2-housing-wave8.mjs';
import {getM2HousingWave9} from '../src/building-pool/roadmap-1a/m2-housing-wave9.mjs';
import {getHospitalityWave1} from '../src/building-pool/roadmap-1a/m3-hospitality-wave1.mjs';
import {getHospitalityWave2} from '../src/building-pool/roadmap-1a/m3-hospitality-wave2.mjs';
import {getHospitalityWave3} from '../src/building-pool/roadmap-1a/m3-hospitality-wave3.mjs';
import {getHospitalityWave4} from '../src/building-pool/roadmap-1a/m3-hospitality-wave4.mjs';
import {getHospitalityWave5} from '../src/building-pool/roadmap-1a/m3-hospitality-wave5.mjs';
import {getHospitalityWave6} from '../src/building-pool/roadmap-1a/m3-hospitality-wave6.mjs';
import {getHospitalityWave7} from '../src/building-pool/roadmap-1a/m3-hospitality-wave7.mjs';
import {getHospitalityWave8} from '../src/building-pool/roadmap-1a/m3-hospitality-wave8.mjs';
import {getHospitalityWave9} from '../src/building-pool/roadmap-1a/m3-hospitality-wave9.mjs';
import {getRoadmapC1AHousesWave10,ROADMAP_C_1A_WAVE10_IDS} from '../src/building-pool/roadmap-1a/m2-housing-wave10-roadmap-c.mjs';
import {validateBlueprint,validatePool,structuralFingerprint} from '../src/building-pool/roadmap-1a/legacy-schema.mjs';
import {findMirroredOrRotatedDuplicates} from '../src/building-pool/roadmap-1a/legacy-uniqueness.mjs';
import {auditM1PhysicalSources} from '../src/building-pool/roadmap-1a/m1-physical-sources.mjs';
import {getRoadmapC1AInnWave11,ROADMAP_C_1A_WAVE11_IDS} from '../src/building-pool/roadmap-1a/m3-inn-wave11-roadmap-c.mjs';
import {getRoadmapC1AHousesWave12,ROADMAP_C_1A_WAVE12_IDS} from '../src/building-pool/roadmap-1a/m2-housing-wave12-roadmap-c.mjs';
import {getRoadmapC1AHousesWave13,ROADMAP_C_1A_WAVE13_IDS} from '../src/building-pool/roadmap-1a/m2-housing-wave13-roadmap-c.mjs';
import {getRoadmapC1AHousesWave14,ROADMAP_C_1A_WAVE14_IDS} from '../src/building-pool/roadmap-1a/m2-housing-wave14-roadmap-c.mjs';
import {getRoadmapC1AHousesWave15,ROADMAP_C_1A_WAVE15_IDS} from '../src/building-pool/roadmap-1a/m2-housing-wave15-roadmap-c.mjs';

import {getRoadmapC1AHousesWave16,ROADMAP_C_1A_WAVE16_IDS} from '../src/building-pool/roadmap-1a/m2-housing-wave16-roadmap-c.mjs';
import {getRoadmapC1AHousesWave17} from '../src/building-pool/roadmap-1a/m2-housing-wave17-roadmap-c.mjs';
import {getRoadmapC1AHousesWave18} from '../src/building-pool/roadmap-1a/m2-housing-wave18-roadmap-c.mjs';
import {getRoadmapC1AInnWave19} from '../src/building-pool/roadmap-1a/m3-inn-wave19-roadmap-c.mjs';
import {getRoadmapC1AInnWave20} from '../src/building-pool/roadmap-1a/m3-inn-wave20-roadmap-c.mjs';
import {getRoadmapC1AInnWave21} from '../src/building-pool/roadmap-1a/m3-inn-wave21-roadmap-c.mjs';
import {getRoadmapC1ATavernWave22} from '../src/building-pool/roadmap-1a/m3-tavern-wave22-roadmap-c.mjs';
import {getRoadmapC1AHousesWave23} from '../src/building-pool/roadmap-1a/m2-housing-wave23-roadmap-c.mjs';
import {getRoadmapC1AInnWave24} from '../src/building-pool/roadmap-1a/m3-inn-wave24-roadmap-c.mjs';
import {getRoadmapC1AHousesWave25} from '../src/building-pool/roadmap-1a/m2-housing-wave25-roadmap-c.mjs';
import {getRoadmapC1AHousesWave26} from '../src/building-pool/roadmap-1a/m2-housing-wave26-roadmap-c.mjs';
import {getRoadmapC1AHousesWave27} from '../src/building-pool/roadmap-1a/m2-housing-wave27-roadmap-c.mjs';
import {getRoadmapC1AHousesWave28} from '../src/building-pool/roadmap-1a/m2-housing-wave28-roadmap-c.mjs';
import {getRoadmapC1AHousesWave29,ROADMAP_C_1A_WAVE29_HOUSE_IDS} from '../src/building-pool/roadmap-1a/m2-housing-wave29-roadmap-c.mjs';
import {getRoadmapC1AInnWave33,ROADMAP_C_1A_WAVE33_INN_IDS} from '../src/building-pool/roadmap-1a/m3-inn-wave33-roadmap-c.mjs';
import {getRoadmapC1AInnWave32} from '../src/building-pool/roadmap-1a/m3-inn-wave32-roadmap-c.mjs';
import {getRoadmapC1AInnWave31} from '../src/building-pool/roadmap-1a/m3-inn-wave31-roadmap-c.mjs';
import {getRoadmapC1ATavernsWave30} from '../src/building-pool/roadmap-1a/m3-tavern-wave30-roadmap-c.mjs';
const historical=[...getM1Blueprints(),...getM1InnExemplars(),...getM2Originals(),...getM2HousingTranche(),...getM2HousingWave2(),...getM2HousingWave3(),...getM2HousingWave4(),...getM2HousingWave5(),...getM2HousingWave6(),...getM2HousingWave7(),...getM2HousingWave8(),...getM2HousingWave9(),...getHospitalityWave1(),...getHospitalityWave2(),...getHospitalityWave3(),...getHospitalityWave4(),...getHospitalityWave5(),...getHospitalityWave6(),...getHospitalityWave7(),...getHospitalityWave8(),...getHospitalityWave9(),...getRoadmapC1AHousesWave10(),...getRoadmapC1AInnWave11(),...getRoadmapC1AHousesWave12(),...getRoadmapC1AHousesWave13(),...getRoadmapC1AHousesWave14()],fresh=getRoadmapC1AHousesWave15(),pool=[...historical,...fresh];
const accepted=[...pool,...getRoadmapC1AHousesWave16(),...getRoadmapC1AHousesWave17(),...getRoadmapC1AHousesWave18(),...getRoadmapC1AInnWave19(),...getRoadmapC1AInnWave20(),...getRoadmapC1AInnWave21(),...getRoadmapC1ATavernWave22(),...getRoadmapC1AHousesWave23(),...getRoadmapC1AInnWave24(),...getRoadmapC1AHousesWave25(),...getRoadmapC1AHousesWave26(),...getRoadmapC1AHousesWave27(),...getRoadmapC1AHousesWave28(),...getRoadmapC1AHousesWave29(),...getRoadmapC1ATavernsWave30(),...getRoadmapC1AInnWave31(),...getRoadmapC1AInnWave32()];
const pending=getRoadmapC1AInnWave33(),all=[...accepted,...pending];

const key=v=>v.join(',');
const b=pending[0],vox=new Map(b.placements.map(p=>[key(p.at),p]));
const walks=new Set(b.walkable.map(key)),roomMap=new Map(b.rooms.map(r=>[r.id,r]));
const contains=(r,x,z)=>x>=r.min[0]&&x<r.max[0]&&z>=r.min[2]&&z<r.max[2];
const cuts=b.architecturalIdentity.exteriorNotches;
const absent=(x,z)=>cuts.some(([a,t,c,d])=>x>=a&&x<=c&&z>=t&&z<=d);
const directions=[[1,0],[-1,0],[0,1],[0,-1]];
const rotPoints=(pts,t)=>{const o=pts.map(([x,z])=>{let a=t&1?-x:x,q=z;if(t&2)[a,q]=[q,a];if(t&4)q=-q;return [a,q];});
 let minX=Infinity,minZ=Infinity;for(const [x,z] of o){if(x<minX)minX=x;if(z<minZ)minZ=z;}
 return new Set(o.map(([x,z])=>(x-minX)+','+(z-minZ)));};
const foundation=b=>b.placements.filter(p=>p.role==='foundation').map(p=>[p.at[0],p.at[2]]);
const I=(a,b)=>{let c=0;for(const x of a)if(b.has(x))c++;return c/(a.size+b.size-c||1);};
const silhouette=b=>{const w=b.footprint.width,d=b.footprint.depth,cuts=b.architecturalIdentity.exteriorNotches??[],o=new Set();
 for(let x=0;x<16;x++)for(let z=0;z<16;z++){const a=Math.min(w-1,Math.floor((x+.5)*w/16)),q=Math.min(d-1,Math.floor((z+.5)*d/16));
 if(cuts.every(n=>a<n[0]||a>n[2]||q<n[1]||q>n[3]))o.add(x+','+z);}return o;};
const partitions=b=>new Set(b.placements.filter(p=>p.role==='partition'&&p.at[1]===1).map(p=>Math.floor(16*p.at[0]/b.footprint.width)+','+Math.floor(16*p.at[2]/b.footprint.depth)));

test('#656 native original compiler and entire immutable 288-history quota, fingerprint and D4 checks',()=>{
 assert.equal(accepted.length,288);assert.equal(pending.length,1);assert.equal(all.length,289);
 assert.deepEqual(ROADMAP_C_1A_WAVE33_INN_IDS,['r1:inn:mountain:large:004']);
 assert.equal(b.id,'r1:inn:mountain:large:004');
 assert.equal(validateBlueprint(b),true);assert.equal(validatePool(all).authored,289);
 assert.equal(new Set(all.map(x=>x.id)).size,289);
 assert.equal(new Set(all.map(structuralFingerprint)).size,289);
 assert.deepEqual(findMirroredOrRotatedDuplicates(all),[]);
 assert.deepEqual([b.footprint.width,b.footprint.height,b.footprint.depth],[86,12,72]);
 assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
});

test('#656 original 19 named rooms and all 30 physical two-high wall portal crossings',()=>{
 assert.equal(b.rooms.length,19);assert.equal(b.portals.length,30);
 assert.equal(vox.size,b.placements.length);assert.equal(b.placements.length,26769);
 for(const p of b.portals){
  const [x,y,z]=p.at;assert.equal(y,1);
  assert.ok(walks.has(key(p.at))&&!vox.has(key([x,1,z]))&&!vox.has(key([x,2,z])),'blocked door '+JSON.stringify(p));
  const from=roomMap.get(p.from),to=roomMap.get(p.to);
  assert.ok(to&&((p.from==='outside')||from));
  const opposite=directions.some(([dx,dz])=>{
   const a=[x-dx,z-dz],c=[x+dx,z+dz];
   const af=p.from==='outside'?(a[0]===8&&a[1]===0&&walks.has(key([8,1,0]))):(contains(from,...a)&&walks.has(key([a[0],1,a[1]])));
   const cf=contains(to,...c)&&walks.has(key([c[0],1,c[1]]));
   const ar=p.from!=='outside'&&contains(from,...c)&&walks.has(key([c[0],1,c[1]]));
   const cr=p.from!=='outside'&&contains(to,...a)&&walks.has(key([a[0],1,a[1]]));
   return (af&&cf)||(ar&&cr);
  });assert.ok(opposite,'source door is not opposite its named rooms '+JSON.stringify(p));
 }
 const queue=[b.portals[0].at],seen=new Set([key(queue[0])]);
 for(let i=0;i<queue.length;i++){const [x,y,z]=queue[i];for(const [dx,dz] of directions){
  const nxt=[x+dx,y,z+dz],k=key(nxt);if(walks.has(k)&&!seen.has(k)){seen.add(k);queue.push(nxt);}}}
 assert.equal(seen.size,walks.size,'nonconnected original-source circulation');
 assert.equal(walks.size,3995,'original 19-room full circulation count changed');
 for(const room of b.rooms)assert.ok(b.walkable.some(([x,y,z])=>contains(room,x,z)),'unreachable named room '+room.id);
});

test('#656 physically absent opposing ravines, roof-open sky court, eighteen supported roof structures and four reserved Pack5 beds',()=>{
 assert.deepEqual(cuts,[[0,23,20,43],[64,29,85,49],[34,0,53,10]]);
 assert.equal(b.architecturalIdentity.exteriorVoidFootprintCells,1123);
 let missing=0;
 for(let x=0;x<b.footprint.width;x++)for(let z=0;z<b.footprint.depth;z++){
  if(absent(x,z)){missing++;for(let y=0;y<12;y++)assert.ok(!vox.has(key([x,y,z])),'false missing ravine column '+key([x,y,z]));}
  else assert.equal(vox.get(key([x,0,z]))?.role,'foundation');
 }
 assert.equal(missing,1123);assert.deepEqual(b.architecturalIdentity.outdoorCourtyard,[49,35,57,41]);
 let sky=0;for(let x=49;x<=57;x++)for(let z=35;z<=41;z++){
  sky++;assert.equal(vox.get(key([x,0,z]))?.role,'foundation');
  assert.ok(walks.has(key([x,1,z])));
  for(let y=1;y<12;y++)assert.ok(!vox.has(key([x,y,z])),'blocked skywell '+key([x,y,z]));
 }
 assert.equal(sky,63);
 const roof=b.placements.filter(p=>p.role==='roof');
 assert.equal(b.architecturalIdentity.roofWings.length,18);
 assert.ok(new Set(roof.map(p=>p.at[1])).size>=4);
 for(const p of roof){assert.ok(vox.has(key([p.at[0],p.at[1]-1,p.at[2]])),'floating roof '+key(p.at));}
 for(const wing of b.architecturalIdentity.roofWings){const [x,z,x1,z1]=wing.rect;
  const n=roof.filter(p=>p.at[0]>=x&&p.at[0]<=x1&&p.at[2]>=z&&p.at[2]<=z1).length;
  assert.ok(n>=100,'unbacked roof wing '+wing.name+' '+n);
 }
 assert.equal(b.footprintReservations.length,4);
 for(const reservation of b.footprintReservations)for(const foot of reservation.extraCells){
  assert.ok(!vox.has(key(foot))&&!walks.has(key(foot))&&!vox.has(key([foot[0],foot[1]+1,foot[2]])),'blocked two-cell bed '+key(foot));}
});

test('#656 forty-one original exterior Pack4 glazed apertures and true producer physical audit',()=>{
 const glasses=b.placements.filter(p=>p.role==='window');
 assert.equal(glasses.length,41);
 const yaw={north:[0,-1],south:[0,1],east:[1,0],west:[-1,0]};
 let notchViews=0;
 for(const p of glasses){const [x,y,z]=p.at,[dx,dz]=yaw[p.orientation]??[];
  assert.ok(Number.isInteger(dx)&&Number.isInteger(dz));assert.equal(y,2);assert.equal(p.asset,'pack4:030');
  const ox=x+dx,oz=z+dz,ix=x-dx,iz=z-dz;
  assert.ok(walks.has(key([ix,1,iz])),'window interior is not walkable '+key(p.at));
  assert.ok(absent(ox,oz)||ox===0||ox===b.footprint.width-1||oz===0||oz===b.footprint.depth-1,'window faces internal wall '+key(p.at));
  assert.ok(!vox.has(key([ox,2,oz]))&&!vox.has(key([ox,3,oz])),'fake outside view '+key(p.at));
  if(absent(ox,oz))notchViews++;
 }
 assert.equal(notchViews,17);
 const physical=auditM1PhysicalSources(b);
 assert.deepEqual(physical.errors,[]);assert.deepEqual(physical.unresolved,[]);
 assert.deepEqual([physical.catalog.families,physical.catalog.numericVariants],[96,106]);
 assert.equal(physical.worldPlaced,false);assert.equal(physical.productionReady,false);
});

test('#656 genuine all-288 original floor foundations retain unchanged strict D4 <.89, silhouette <.975, partitions <.88',()=>{
 const A=Array.from({length:8},(_,t)=>rotPoints(foundation(b),t)),S=silhouette(b),P=partitions(b);
 let largest={iou:0,id:''},outMax={iou:0,id:''},partMax={iou:0,id:''};
 for(const old of accepted){
  const B=rotPoints(foundation(old),0);
  let high=0;for(const x of A)high=Math.max(high,I(x,B));
  if(high>largest.iou)largest={iou:high,id:old.id};
  assert.ok(high<.89,'true original 8-way floor D4 near-copy '+old.id+' '+high);
  const si=I(S,silhouette(old)),pi=I(P,partitions(old));
  if(si>outMax.iou)outMax={iou:si,id:old.id};
  if(pi>partMax.iou)partMax={iou:pi,id:old.id};
  assert.ok(si<.975,'source outline near-copy '+old.id+' '+si);
  assert.ok(pi<.88,'source partition near-copy '+old.id+' '+pi);
 }
 console.log('GALEHEWN_288_D4_MAX '+JSON.stringify(largest));
 console.log('GALEHEWN_288_SILHOUETTE_MAX '+JSON.stringify(outMax));
 console.log('GALEHEWN_288_PARTITION_MAX '+JSON.stringify(partMax));
});
