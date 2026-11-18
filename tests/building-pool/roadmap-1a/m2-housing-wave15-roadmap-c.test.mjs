// Roadmap C 1A original house Wave10: all 265 historical sources preserved; real geometry and physical audit.
import test from 'node:test';import assert from 'node:assert/strict';
import {getM1Blueprints} from '../../../src/building-pool/roadmap-1a/legacy-buildings.mjs';
import {getM1InnExemplars} from '../../../src/building-pool/roadmap-1a/m1-inn-exemplars.mjs';
import {getM2Originals} from '../../../src/building-pool/roadmap-1a/m2-originals.mjs';
import {getM2HousingTranche} from '../../../src/building-pool/roadmap-1a/m2-housing-tranche.mjs';
import {getM2HousingWave2} from '../../../src/building-pool/roadmap-1a/m2-housing-wave2.mjs';
import {getM2HousingWave3} from '../../../src/building-pool/roadmap-1a/m2-housing-wave3.mjs';
import {getM2HousingWave4} from '../../../src/building-pool/roadmap-1a/m2-housing-wave4.mjs';
import {getM2HousingWave5} from '../../../src/building-pool/roadmap-1a/m2-housing-wave5.mjs';
import {getM2HousingWave6} from '../../../src/building-pool/roadmap-1a/m2-housing-wave6.mjs';
import {getM2HousingWave7} from '../../../src/building-pool/roadmap-1a/m2-housing-wave7.mjs';
import {getM2HousingWave8} from '../../../src/building-pool/roadmap-1a/m2-housing-wave8.mjs';
import {getM2HousingWave9} from '../../../src/building-pool/roadmap-1a/m2-housing-wave9.mjs';
import {getHospitalityWave1} from '../../../src/building-pool/roadmap-1a/m3-hospitality-wave1.mjs';
import {getHospitalityWave2} from '../../../src/building-pool/roadmap-1a/m3-hospitality-wave2.mjs';
import {getHospitalityWave3} from '../../../src/building-pool/roadmap-1a/m3-hospitality-wave3.mjs';
import {getHospitalityWave4} from '../../../src/building-pool/roadmap-1a/m3-hospitality-wave4.mjs';
import {getHospitalityWave5} from '../../../src/building-pool/roadmap-1a/m3-hospitality-wave5.mjs';
import {getHospitalityWave6} from '../../../src/building-pool/roadmap-1a/m3-hospitality-wave6.mjs';
import {getHospitalityWave7} from '../../../src/building-pool/roadmap-1a/m3-hospitality-wave7.mjs';
import {getHospitalityWave8} from '../../../src/building-pool/roadmap-1a/m3-hospitality-wave8.mjs';
import {getHospitalityWave9} from '../../../src/building-pool/roadmap-1a/m3-hospitality-wave9.mjs';
import {getRoadmapC1AHousesWave10,ROADMAP_C_1A_WAVE10_IDS} from '../../../src/building-pool/roadmap-1a/m2-housing-wave10-roadmap-c.mjs';
import {validateBlueprint,validatePool,structuralFingerprint} from '../../../src/building-pool/roadmap-1a/legacy-schema.mjs';
import {findMirroredOrRotatedDuplicates} from '../../../src/building-pool/roadmap-1a/legacy-uniqueness.mjs';
import {auditM1PhysicalSources} from '../../../src/building-pool/roadmap-1a/m1-physical-sources.mjs';
import {getRoadmapC1AInnWave11,ROADMAP_C_1A_WAVE11_IDS} from '../../../src/building-pool/roadmap-1a/m3-inn-wave11-roadmap-c.mjs';
import {getRoadmapC1AHousesWave12,ROADMAP_C_1A_WAVE12_IDS} from '../../../src/building-pool/roadmap-1a/m2-housing-wave12-roadmap-c.mjs';
import {getRoadmapC1AHousesWave13,ROADMAP_C_1A_WAVE13_IDS} from '../../../src/building-pool/roadmap-1a/m2-housing-wave13-roadmap-c.mjs';
import {getRoadmapC1AHousesWave14,ROADMAP_C_1A_WAVE14_IDS} from '../../../src/building-pool/roadmap-1a/m2-housing-wave14-roadmap-c.mjs';
import {getRoadmapC1AHousesWave15,ROADMAP_C_1A_WAVE15_IDS} from '../../../src/building-pool/roadmap-1a/m2-housing-wave15-roadmap-c.mjs';
const historical=[...getM1Blueprints(),...getM1InnExemplars(),...getM2Originals(),...getM2HousingTranche(),...getM2HousingWave2(),...getM2HousingWave3(),...getM2HousingWave4(),...getM2HousingWave5(),...getM2HousingWave6(),...getM2HousingWave7(),...getM2HousingWave8(),...getM2HousingWave9(),...getHospitalityWave1(),...getHospitalityWave2(),...getHospitalityWave3(),...getHospitalityWave4(),...getHospitalityWave5(),...getHospitalityWave6(),...getHospitalityWave7(),...getHospitalityWave8(),...getHospitalityWave9(),...getRoadmapC1AHousesWave10(),...getRoadmapC1AInnWave11(),...getRoadmapC1AHousesWave12(),...getRoadmapC1AHousesWave13(),...getRoadmapC1AHousesWave14()],fresh=getRoadmapC1AHousesWave15(),pool=[...historical,...fresh];
const k=a=>a.join(',');
const partitions=b=>new Set(b.placements.filter(p=>p.role==='partition'&&p.at[1]===1).map(p=>Math.floor(16*p.at[0]/b.footprint.width)+','+Math.floor(16*p.at[2]/b.footprint.depth)));
const silhouette=b=>{const {width:w,depth:d}=b.footprint,cuts=b.architecturalIdentity.exteriorNotches??[],out=new Set();
 for(let x=0;x<16;x++)for(let z=0;z<16;z++){const a=Math.min(w-1,Math.floor((x+.5)*w/16)),c=Math.min(d-1,Math.floor((z+.5)*d/16));
  if(cuts.every(n=>a<n[0]||a>n[2]||c<n[1]||c>n[3]))out.add(x+','+z);
 }return out;};
const iou=(a,b)=>{let common=0;for(const x of a)if(b.has(x))common++;return common/(a.size+b.size-common||1);};



test('Amberlily introduces original 271st 1A house while preserving all 270 previous immutable source records',()=>{
 assert.equal(historical.length,270);assert.equal(fresh.length,1);
 assert.deepEqual(fresh.map(b=>b.id),ROADMAP_C_1A_WAVE15_IDS);
 assert.deepEqual(ROADMAP_C_1A_WAVE15_IDS,['r1:house:enchanted-forest:large:017']);
 assert.equal(new Set(pool.map(b=>b.id)).size,271);
 assert.equal(new Set(pool.map(structuralFingerprint)).size,271);
 const census=validatePool(pool);assert.deepEqual([census.authored,census.target,census.remaining],[271,450,179]);
 assert.deepEqual(findMirroredOrRotatedDuplicates(pool),[]);
 assert.ok(historical.every(b=>b.worldPlacement===false&&!b.liveIntegration));
});
test('new desert medium six-room courtyard plan retains physically unique normalized partitions and silhouette',()=>{
 const b=fresh[0],P=partitions(b),S=silhouette(b);let maxP=0,maxS=0;
 for(const old of historical){
   const pi=iou(P,partitions(old)),si=iou(S,silhouette(old));maxP=Math.max(maxP,pi);maxS=Math.max(maxS,si);
   assert.ok(pi<.88,'prior architectural partition near clone '+old.id+' '+pi);
   assert.ok(si<.975,'prior silhouette near clone '+old.id+' '+si);
 }
 assert.ok(maxP<.88&&maxS<.975);
});
test('Amberlily real 7-room U-court, 3 missing foundations, 7 source-supported roof wings, open two-high portals, Pack5 full bed reserves',()=>{
 const b=fresh[0];assert.equal(validateBlueprint(b),true);
 assert.deepEqual([b.category,b.biome,b.size,b.index],['house','enchanted-forest','large',17]);
 assert.equal(b.rooms.length,7);assert.equal(b.portals.length,9);
 assert.equal(b.architecturalIdentity.exteriorNotches.length,3);
 assert.equal(b.architecturalIdentity.roofWings.length,7);
 const {width:w,height:h,depth:d}=b.footprint,cuts=b.architecturalIdentity.exteriorNotches;
 const inside=(x,z)=>cuts.every(c=>x<c[0]||x>c[2]||z<c[1]||z>c[3]);
 const vox=new Map(b.placements.map(x=>[k(x.at),x])),walk=new Set(b.walkable.map(k));
 assert.equal(vox.size,b.placements.length);assert.ok(b.placements.length>10000);
 let missing=0;
 for(let x=0;x<w;x++)for(let z=0;z<d;z++){
  if(!inside(x,z)){missing++;for(let y=0;y<h;y++)assert.ok(!vox.has(k([x,y,z])),'cosmetic courtyard fake');}
  else assert.equal(vox.get(k([x,0,z]))?.role,'foundation','actual source bearing missing');
 }
 assert.ok(missing>200);assert.equal(missing,b.architecturalIdentity.exteriorVoidFootprintCells);
 const start=b.portals[0].at,Q=[start],seen=new Set([k(start)]);
 for(let i=0;i<Q.length;i++){let [x,y,z]=Q[i];for(let [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){
  let p=[x+dx,y,z+dz],s=k(p);if(walk.has(s)&&!seen.has(s)){seen.add(s);Q.push(p);}
 }}
 assert.equal(seen.size,walk.size,'original source room-circulation disconnected');
 for(const room of b.rooms)assert.ok(b.walkable.some(p=>p.every((v,i)=>v>=room.min[i]&&v<room.max[i])),room.id+' unwalkable');
 for(const door of b.portals){const [x,y,z]=door.at;assert.ok(walk.has(k(door.at))&&!vox.has(k([x,y,z]))&&!vox.has(k([x,y+1,z])),'blocked portal');}
 const roof=b.placements.filter(x=>x.role==='roof');assert.ok(new Set(roof.map(x=>x.at[1])).size>=4);
 for(const x of roof)assert.ok(vox.has(k([x.at[0],x.at[1]-1,x.at[2]])),'physically unsupported roof ridge');
 assert.equal(b.footprintReservations.length,2);
 for(const bed of b.footprintReservations){assert.equal(bed.asset,'pack5:082');assert.equal(bed.approval,'unresolved');
  for(const p of bed.extraCells)assert.ok(inside(p[0],p[2])&&!vox.has(k(p))&&!walk.has(k(p)),'two-cell bed-foot clearance violated');
 }
 const physical=auditM1PhysicalSources(b);assert.deepEqual(physical.errors,[]);assert.deepEqual(physical.unresolved,[]);
 assert.deepEqual([physical.catalog.families,physical.catalog.numericVariants],[96,106]);
 assert.equal(physical.roofTiles,physical.roofBackingCells);assert.equal(physical.bedHeads,physical.bedFeet);
 assert.equal(physical.worldPlaced,false);assert.equal(physical.productionReady,false);assert.equal(physical.physicalIPhoneTested,false);
});
