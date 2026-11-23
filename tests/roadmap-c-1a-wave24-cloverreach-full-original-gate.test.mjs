// Roadmap C Builder 1A #647 Cloverreach: exact original 280-pool, full strict D4,
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
import {getRoadmapC1AInnWave24,ROADMAP_C_1A_WAVE24_INN_IDS} from '../src/building-pool/roadmap-1a/m3-inn-wave24-roadmap-c.mjs';
const historical=[...getM1Blueprints(),...getM1InnExemplars(),...getM2Originals(),...getM2HousingTranche(),...getM2HousingWave2(),...getM2HousingWave3(),...getM2HousingWave4(),...getM2HousingWave5(),...getM2HousingWave6(),...getM2HousingWave7(),...getM2HousingWave8(),...getM2HousingWave9(),...getHospitalityWave1(),...getHospitalityWave2(),...getHospitalityWave3(),...getHospitalityWave4(),...getHospitalityWave5(),...getHospitalityWave6(),...getHospitalityWave7(),...getHospitalityWave8(),...getHospitalityWave9(),...getRoadmapC1AHousesWave10(),...getRoadmapC1AInnWave11(),...getRoadmapC1AHousesWave12(),...getRoadmapC1AHousesWave13(),...getRoadmapC1AHousesWave14()],fresh=getRoadmapC1AHousesWave15(),pool=[...historical,...fresh];
const accepted=[...pool,...getRoadmapC1AHousesWave16(),...getRoadmapC1AHousesWave17(),...getRoadmapC1AHousesWave18(),...getRoadmapC1AInnWave19(),...getRoadmapC1AInnWave20(),...getRoadmapC1AInnWave21(),...getRoadmapC1ATavernWave22(),...getRoadmapC1AHousesWave23()];
const pending=getRoadmapC1AInnWave24(),all=[...accepted,...pending];
const key=a=>a.join(',');
const partitions=b=>new Set(b.placements.filter(p=>p.role==='partition'&&p.at[1]===1).map(p=>Math.floor(16*p.at[0]/b.footprint.width)+','+Math.floor(16*p.at[2]/b.footprint.depth)));
const silhouette=b=>{const {width:w,depth:d}=b.footprint,cuts=b.architecturalIdentity.exteriorNotches??[],out=new Set();
 for(let x=0;x<16;x++)for(let z=0;z<16;z++){const a=Math.min(w-1,Math.floor((x+.5)*w/16)),c=Math.min(d-1,Math.floor((z+.5)*d/16));
 if(cuts.every(n=>a<n[0]||a>n[2]||c<n[1]||c>n[3]))out.add(x+','+z);}return out;};
const iou=(a,b)=>{let hit=0;for(const k of a)if(b.has(k))hit++;return hit/(a.size+b.size-hit||1);};
test('Cloverreach original native compiler preserves 279 originals and introduces unused legal temperate large inn 005',()=>{
 assert.equal(accepted.length,279);
 assert.equal(pending.length,1);
 assert.deepEqual(ROADMAP_C_1A_WAVE24_INN_IDS,['r1:inn:temperate:large:005']);
 assert.equal(validateBlueprint(pending[0]),true);
 assert.deepEqual(validatePool(all).authored,280);
 assert.equal(new Set(all.map(b=>b.id)).size,280);
 assert.equal(new Set(all.map(structuralFingerprint)).size,280);
 assert.deepEqual(findMirroredOrRotatedDuplicates(all),[]);
 assert.ok(all.slice(0,279).every((v,i)=>v===accepted[i]));
});
test('Cloverreach original real concave source volumes, open portals, roof support and physical producer AABBs',()=>{
 const b=pending[0],vox=new Map(b.placements.map(p=>[key(p.at),p])),walk=new Set(b.walkable.map(key));
 assert.equal(b.rooms.length,14);assert.equal(b.portals.length,21);
 assert.equal(b.architecturalIdentity.exteriorNotches.length,3);assert.equal(b.architecturalIdentity.roofWings.length,14);
 const {width:w,height:h,depth:d}=b.footprint,cuts=b.architecturalIdentity.exteriorNotches;
 const active=(x,z)=>cuts.every(c=>x<c[0]||x>c[2]||z<c[1]||z>c[3]);
 let missing=0;
 for(let x=0;x<w;x++)for(let z=0;z<d;z++)if(!active(x,z)){missing++;
  for(let y=0;y<h;y++)assert.ok(!vox.has(key([x,y,z])),'cosmetic courtyard has occupied source '+[x,y,z]);
 }else assert.equal(vox.get(key([x,0,z]))?.role,'foundation');
 assert.equal(missing,b.architecturalIdentity.exteriorVoidFootprintCells);assert.equal(missing,1336,'all three desert terrace cutouts must be genuinely empty');
 const roof=b.placements.filter(p=>p.role==='roof');
 assert.ok(new Set(roof.map(p=>p.at[1])).size>=4);
 for(const r of roof)assert.ok(vox.has(key([r.at[0],r.at[1]-1,r.at[2]])),'unsupported source roof '+key(r.at));
 const q=[b.portals[0].at],seen=new Set([key(q[0])]);
 for(let i=0;i<q.length;i++){const [x,y,z]=q[i];for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
 const t=[x+dx,y,z+dz],s=key(t);if(walk.has(s)&&!seen.has(s)){seen.add(s);q.push(t);}}}
 assert.equal(seen.size,walk.size,'original source walk route disconnected');
 for(const r of b.rooms)assert.ok(b.walkable.some(v=>v.every((n,i)=>n>=r.min[i]&&n<r.max[i])),'room inaccessible '+r.id);
 for(const door of b.portals){const [x,y,z]=door.at;
 assert.ok(walk.has(key(door.at))&&!vox.has(key([x,y,z]))&&!vox.has(key([x,y+1,z])),'blocked source doorway');
 }
 assert.equal(b.footprintReservations.length,4);
 for(const reservation of b.footprintReservations)for(const foot of reservation.extraCells)
 assert.ok(!vox.has(key(foot))&&!walk.has(key(foot)),'bed foot intersects circulation');
 const physical=auditM1PhysicalSources(b);
 assert.deepEqual(physical.errors,[]);assert.deepEqual(physical.unresolved,[]);
 assert.deepEqual([physical.catalog.families,physical.catalog.numericVariants],[96,106]);
 assert.equal(physical.worldPlaced,false);assert.equal(physical.productionReady,false);
});
test('Cloverreach historical-279 material-agnostic partition and silhouette normalized uniqueness retains strict thresholds',()=>{
 const b=pending[0],P=partitions(b),S=silhouette(b),metrics=[];
 for(const other of accepted){
 const pi=iou(P,partitions(other)),si=iou(S,silhouette(other));
 metrics.push({id:other.id,partitionIoU:pi,outlineIoU:si});
 }
 console.log('CLOVERREACH_FULL_279_OUTLINE_TOP='+JSON.stringify([...metrics].sort((a,b)=>b.outlineIoU-a.outlineIoU).slice(0,10)));
 console.log('CLOVERREACH_FULL_279_PARTITION_TOP='+JSON.stringify([...metrics].sort((a,b)=>b.partitionIoU-a.partitionIoU).slice(0,10)));
 for(const m of metrics){
 assert.ok(m.partitionIoU<.88,'partition near-copy '+m.id+' '+m.partitionIoU);
 assert.ok(m.outlineIoU<.975,'outline near-copy '+m.id+' '+m.outlineIoU);
 }
});

// True material-independent eight-way D4 original source floor IoU; compare with all 279 source-accepted historical originals.
function floorFootprint(b,t=0){
 const pts=b.placements.filter(p=>p.role==='foundation').map(p=>[p.at[0],p.at[2]]);
 if(!pts.length)throw Error('source with no foundation '+b.id);
 const oriented=pts.map(([x,z])=>{let a=(t&1)?-x:x,bb=z;if(t&2)[a,bb]=[bb,a];if(t&4)bb=-bb;return [a,bb];});
 const xmin=Math.min(...oriented.map(p=>p[0])),zmin=Math.min(...oriented.map(p=>p[1]));
 return new Set(oriented.map(([x,z])=>(x-xmin)+','+(z-zmin)));
}
function maxOriginalD4FloorIoU(b,old){
 const base=floorFootprint(old);let max=0;
 for(let t=0;t<8;t++){const f=floorFootprint(b,t);let common=0;
  for(const k of f)if(base.has(k))common++;
  const iou=common/(f.size+base.size-common);if(iou>max)max=iou;
 }return max;
}
test('Cloverreach original physical foundation footprint strict D4 <.89 against ALL 279 historical originals',()=>{
 const b=pending[0];let max=0,closest='';const byId=new Set();
 for(const old of accepted){assert.ok(!byId.has(old.id));byId.add(old.id);
  const score=maxOriginalD4FloorIoU(b,old);
  if(score>max){max=score;closest=old.id;}
  assert.ok(score<.89,'eight-way D4 near-clone '+old.id+' overlap '+score);
 }
 assert.equal(accepted.length,279);assert.ok(!byId.has(b.id));
 console.log('CLOVERREACH_FULL_279_D4_MAX='+max+' closest='+closest);
});

test('Cloverreach original 64-cell open clovercourt, 1336 absent orchard columns and four reserved beds',()=>{
 const b=pending[0],map=new Map(b.placements.map(p=>[key(p.at),p])),walk=new Set(b.walkable.map(key));
 const {width:w,height:h,depth:d}=b.footprint;
 assert.deepEqual([w,h,d],[70,12,60]);
 const c=[33,35,40,42];assert.deepEqual(b.architecturalIdentity.outdoorCourtyard,c);
 let court=0;
 for(let x=c[0];x<=c[2];x++)for(let z=c[1];z<=c[3];z++){
  court++;
  assert.equal(map.get(key([x,0,z]))?.role,'foundation','skywell missing real source ground');
  assert.ok(walk.has(key([x,1,z])),'skywell not traversable');
  for(let y=1;y<h;y++)assert.ok(!map.has(key([x,y,z])),'skywell blocked '+key([x,y,z]));
 }
 assert.equal(court,64);
 let missing=0;
 for(let x=0;x<w;x++)for(let z=0;z<d;z++){
  if(b.architecturalIdentity.exteriorNotches.some(([a,b,c,d])=>x>=a&&x<=c&&z>=b&&z<=d)){
   missing++;
   for(let y=0;y<h;y++)assert.ok(!map.has(key([x,y,z])),'false cliff void '+key([x,y,z]));
  }
 }
 assert.equal(missing,1336);
 assert.equal(b.footprintReservations.length,4);
 for(const bed of b.footprintReservations)for(const foot of bed.extraCells){
  assert.ok(!map.has(key(foot))&&!walk.has(key(foot)),'bed foot intersects physical circulation');
  assert.ok(!map.has(key([foot[0],foot[1]+1,foot[2]])),'bed foot headroom blocked');
 }
 assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 assert.equal(b.architecturalIdentity.roofWeatherSealApproved,false);
});
