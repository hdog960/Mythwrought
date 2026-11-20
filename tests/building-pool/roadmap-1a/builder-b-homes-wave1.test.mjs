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

import {getBuilderBHomesWave1,BUILDER_B_HOMES_WAVE1_IDS} from '../../../src/building-pool/roadmap-1a/builder-b-homes-wave1.mjs';
const historical=[...getM1Blueprints(),...getM1InnExemplars(),...getM2Originals(),...getM2HousingTranche(),...getM2HousingWave2(),...getM2HousingWave3(),...getM2HousingWave4(),...getM2HousingWave5(),...getM2HousingWave6(),...getM2HousingWave7(),...getM2HousingWave8(),...getM2HousingWave9(),...getHospitalityWave1(),...getHospitalityWave2(),...getHospitalityWave3(),...getHospitalityWave4(),...getHospitalityWave5(),...getHospitalityWave6(),...getHospitalityWave7(),...getHospitalityWave8(),...getHospitalityWave9(),...getRoadmapC1AHousesWave10(),...getRoadmapC1AInnWave11(),...getRoadmapC1AHousesWave12(),...getRoadmapC1AHousesWave13(),...getRoadmapC1AHousesWave14()],accepted=getRoadmapC1AHousesWave15(),prior=[...historical,...accepted],fresh=getBuilderBHomesWave1(),pool=[...prior,...fresh];

const key=p=>p.join(',');
const filled=b=>new Set(b.placements.map(p=>key(p.at)));
const silhouette=b=>{const {width:w,depth:d}=b.footprint,cuts=b.architecturalIdentity.exteriorNotches??[],out=new Set();
 for(let x=0;x<16;x++)for(let z=0;z<16;z++){const a=Math.min(w-1,Math.floor((x+.5)*w/16)),c=Math.min(d-1,Math.floor((z+.5)*d/16));
  if(cuts.every(n=>a<n[0]||a>n[2]||c<n[1]||c>n[3]))out.add(x+','+z);
 }return out;};
const partitions=b=>new Set(b.placements.filter(p=>p.role==='partition'&&p.at[1]===1)
 .map(p=>Math.floor(16*p.at[0]/b.footprint.width)+','+Math.floor(16*p.at[2]/b.footprint.depth)));
const iou=(a,b)=>{let n=0;for(const v of a)if(b.has(v))n++;return n/(a.size+b.size-n||1);};
test('Builder B first three unique originals expand source-accepted 271 roster without historical changes',()=>{
 assert.equal(prior.length,271);assert.equal(fresh.length,3);
 assert.deepEqual(fresh.map(x=>x.id),BUILDER_B_HOMES_WAVE1_IDS);
 assert.deepEqual(BUILDER_B_HOMES_WAVE1_IDS,[
  'r1:house:desert:medium:020','r1:house:snow:small:020','r1:house:enchanted-forest:medium:020']);
 const inventory=validatePool(pool);assert.deepEqual([inventory.authored,inventory.target,inventory.remaining],[274,450,176]);
 assert.equal(new Set(pool.map(x=>x.id)).size,274);
 assert.equal(new Set(pool.map(structuralFingerprint)).size,274);
 assert.deepEqual(findMirroredOrRotatedDuplicates(pool),[]);
 assert.ok(prior.every(x=>x.worldPlacement===false&&!x.liveIntegration));
});
test('Three literal regional plans have connected interior geometry, real voids, supported roofs and physical evidence',()=>{
 const intendedRooms=[4,6,7];
 for(let n=0;n<fresh.length;n++){
  const b=fresh[n],vox=filled(b),cuts=b.architecturalIdentity.exteriorNotches;
  assert.equal(validateBlueprint(b),true);
  assert.equal(b.rooms.length,intendedRooms[n]);
  assert.ok(cuts.length>=2);
  for(const [x0,z0,x1,z1] of cuts)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
   assert.ok(!b.placements.some(p=>p.at[0]===x&&p.at[2]===z),b.id+' phantom filled court');
  for(const p of b.placements.filter(p=>p.role==='roof'))
   assert.ok(vox.has(key([p.at[0],p.at[1]-1,p.at[2]])),b.id+' unsupported source roof');
  for(const door of b.portals){
   assert.ok(b.walkable.some(x=>key(x)===key(door.at)),b.id+' portal not walkable');
   assert.ok(!vox.has(key(door.at))&&!vox.has(key([door.at[0],door.at[1]+1,door.at[2]])),b.id+' blocked door');
  }
  for(const room of b.rooms)
   assert.ok(b.walkable.some(p=>p.every((v,i)=>v>=room.min[i]&&v<room.max[i])),b.id+' inaccessible room '+room.id);
  assert.equal(b.footprintReservations.length,1);
  const audit=auditM1PhysicalSources(b);
  assert.deepEqual(audit.errors,[]);
  assert.deepEqual(audit.unresolved,[]);
  assert.equal(audit.worldPlaced,false);
 }
});
test('Material-invariant original layouts satisfy strict residential distinctness gates',()=>{
 for(let i=0;i<fresh.length;i++){
  const b=fresh[i],p=partitions(b),s=silhouette(b);
  for(const old of [...prior,...fresh.slice(0,i)]){
   assert.ok(iou(p,partitions(old))<.88,b.id+' partition near-duplicate '+old.id);
   assert.ok(iou(s,silhouette(old))<.975,b.id+' silhouette near-duplicate '+old.id);
  }
 }
});
