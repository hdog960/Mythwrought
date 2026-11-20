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
import {getBuilderBHospitalityWave2,BUILDER_B_HOSPITALITY_WAVE2_IDS} from '../../../src/building-pool/roadmap-1a/builder-b-hospitality-wave2.mjs';
const historical=[...getM1Blueprints(),...getM1InnExemplars(),...getM2Originals(),...getM2HousingTranche(),...getM2HousingWave2(),...getM2HousingWave3(),...getM2HousingWave4(),...getM2HousingWave5(),...getM2HousingWave6(),...getM2HousingWave7(),...getM2HousingWave8(),...getM2HousingWave9(),...getHospitalityWave1(),...getHospitalityWave2(),...getHospitalityWave3(),...getHospitalityWave4(),...getHospitalityWave5(),...getHospitalityWave6(),...getHospitalityWave7(),...getHospitalityWave8(),...getHospitalityWave9(),...getRoadmapC1AHousesWave10(),...getRoadmapC1AInnWave11(),...getRoadmapC1AHousesWave12(),...getRoadmapC1AHousesWave13(),...getRoadmapC1AHousesWave14()],accepted=getRoadmapC1AHousesWave15(),first=getBuilderBHomesWave1(),prior=[...historical,...accepted,...first],fresh=getBuilderBHospitalityWave2(),pool=[...prior,...fresh];


const k=p=>p.join(',');
const occupied=b=>new Set(b.placements.map(p=>k(p.at)));
const P=b=>new Set(b.placements.filter(p=>p.role==='partition'&&p.at[1]===1)
 .map(p=>Math.floor(16*p.at[0]/b.footprint.width)+','+Math.floor(16*p.at[2]/b.footprint.depth)));
const S=b=>{const {width:w,depth:d}=b.footprint,cuts=b.architecturalIdentity.exteriorNotches??[],out=new Set();
 for(let x=0;x<16;x++)for(let z=0;z<16;z++){const a=Math.min(w-1,Math.floor((x+.5)*w/16)),c=Math.min(d-1,Math.floor((z+.5)*d/16));if(cuts.every(n=>a<n[0]||a>n[2]||c<n[1]||c>n[3]))out.add(x+','+z);}return out;};
const iou=(a,b)=>{let n=0;for(const x of a)if(b.has(x))n++;return n/(a.size+b.size-n||1);};
test('Builder B Whitecedar snow small tavern is original 275th source geometry without changing prior 274',()=>{
 assert.equal(prior.length,274);
 assert.deepEqual(fresh.map(b=>b.id),BUILDER_B_HOSPITALITY_WAVE2_IDS);
 assert.deepEqual(BUILDER_B_HOSPITALITY_WAVE2_IDS,['r1:tavern:snow:small:005']);
 assert.deepEqual([validatePool(pool).authored,validatePool(pool).remaining],[275,175]);
 assert.equal(new Set(pool.map(b=>b.id)).size,275);
 assert.equal(new Set(pool.map(structuralFingerprint)).size,275);
 assert.deepEqual(findMirroredOrRotatedDuplicates(pool),[]);
});
test('Source-backed real snow tavern rooms, overhead roofs, window mounts and guest access',()=>{
 const b=fresh[0],v=occupied(b);
 assert.equal(validateBlueprint(b),true);
 assert.equal(b.rooms.length,6);
 assert.equal(b.portals.length,7);
 assert.equal(b.footprintReservations.length,0);
 assert.equal(b.architecturalIdentity.exteriorNotches.length,3);
 assert.equal(b.architecturalIdentity.roofWings.length,6);
 assert.ok(b.walkable.length>500);
 for(const p of b.placements.filter(p=>p.role==='roof'))
  assert.ok(v.has(k([p.at[0],p.at[1]-1,p.at[2]])),'unsupported snow roof '+k(p.at));
 for(const p of b.portals){
  assert.ok(!v.has(k(p.at))&&!v.has(k([p.at[0],p.at[1]+1,p.at[2]])),'blocked guest portal');
 }
 for(const r of b.rooms)assert.ok(b.walkable.some(p=>p.every((n,i)=>n>=r.min[i]&&n<r.max[i])),r.id);
 const a=auditM1PhysicalSources(b);assert.deepEqual(a.errors,[]);assert.deepEqual(a.unresolved,[]);
 assert.equal(a.productionReady,false);assert.equal(a.worldPlaced,false);
});
test('Snow hospitality interior and silhouette obey unweakened original uniqueness requirements',()=>{
 const b=fresh[0],plan=P(b),outline=S(b);
 for(const old of prior){
  assert.ok(iou(plan,P(old))<.88,b.id+' interior near duplicate '+old.id);
  assert.ok(iou(outline,S(old))<.975,b.id+' outline near duplicate '+old.id);
 }
});
