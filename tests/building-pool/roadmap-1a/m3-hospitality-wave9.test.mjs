// 1A Wave9: original physical sources; all 260 earlier complete 3D designs byte-exact protected.
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
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
import {HOSPITALITY_WAVE9_IDS} from '../../../src/building-pool/roadmap-1a/m3-hospitality-wave9.mjs';
import {validateBlueprint,validatePool,structuralFingerprint} from '../../../src/building-pool/roadmap-1a/legacy-schema.mjs';
import {findMirroredOrRotatedDuplicates} from '../../../src/building-pool/roadmap-1a/legacy-uniqueness.mjs';
import {auditM1PhysicalSources} from '../../../src/building-pool/roadmap-1a/m1-physical-sources.mjs';
const prior=[...getM1Blueprints(),...getM1InnExemplars(),...getM2Originals(),...getM2HousingTranche(),...getM2HousingWave2(),...getM2HousingWave3(),...getM2HousingWave4(),...getM2HousingWave5(),...getM2HousingWave6(),...getM2HousingWave7(),...getM2HousingWave8(),...getM2HousingWave9(),...getHospitalityWave1(),...getHospitalityWave2(),...getHospitalityWave3(),...getHospitalityWave4(),...getHospitalityWave5(),...getHospitalityWave6(),...getHospitalityWave7(),...getHospitalityWave8()],wave=getHospitalityWave9(),pool=[...prior,...wave];
const baseline=JSON.parse(readFileSync(new URL('./m3-hospitality-baseline260.json',import.meta.url),'utf8'));
const key=p=>p.join(',');
function fnv(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619)>>>0;return h.toString(16).padStart(8,'0');}
function plan(b){return new Set(b.placements.filter(p=>p.role==='partition'&&p.at[1]===1).map(p=>Math.floor(16*p.at[0]/b.footprint.width)+','+Math.floor(16*p.at[2]/b.footprint.depth)));}
function silhouette(b){let {width:w,depth:d}=b.footprint,cuts=b.architecturalIdentity.exteriorNotches??[],a=new Set();for(let x=0;x<16;x++)for(let z=0;z<16;z++){let X=Math.min(w-1,Math.floor((x+.5)*w/16)),Z=Math.min(d-1,Math.floor((z+.5)*d/16));if(cuts.every(c=>X<c[0]||X>c[2]||Z<c[1]||Z>c[3]))a.add(x+','+z);}return a;}
function iou(a,b){let n=0;for(let x of a)if(b.has(x))n++;return n/(a.size+b.size-n||1);}
test('all 260 accepted prior original complete 3D objects retain exact length and FNV fingerprint',()=>{
 assert.equal(prior.length,260);assert.equal(baseline.count,260);
 assert.deepEqual(prior.map(b=>{let s=JSON.stringify(b);return {id:b.id,chars:s.length,fnv:fnv(s)};}),baseline.records);
});
test('five Wave9 original E-comb, forward fork and C-courtyard designs create 265 distinct sources',()=>{
 assert.deepEqual(wave.map(b=>b.id),HOSPITALITY_WAVE9_IDS);
 assert.equal(wave.length,5);assert.equal(wave.filter(b=>b.category==='tavern').length,3);assert.equal(wave.filter(b=>b.category==='inn').length,2);
 assert.equal(wave.reduce((n,b)=>n+b.placements.length,0),89104);
 assert.equal(wave.reduce((n,b)=>n+b.architecturalIdentity.exteriorVoidFootprintCells,0),3804);
 assert.equal(wave.reduce((n,b)=>n+b.rooms.length,0),34);assert.equal(wave.reduce((n,b)=>n+b.footprintReservations.length,0),9);
 assert.deepEqual(pool.reduce((o,b)=>(o[b.category]=(o[b.category]??0)+1,o),{}),{house:150,tavern:64,inn:51});
 assert.equal(validatePool(pool).authored,265);assert.equal(validatePool(pool).remaining,185);
 assert.equal(new Set(pool.map(b=>b.id)).size,265);
 assert.equal(new Set(pool.map(structuralFingerprint)).size,265);
 assert.deepEqual(findMirroredOrRotatedDuplicates(pool),[]);
 assert.ok(pool.every(b=>b.status==='candidate'&&!b.liveIntegration&&!b.worldPlacement));
});
test('Wave9 strictly unique normalized 16x16 source partition IoU <0.88 and exterior outline IoU <0.975',()=>{
 const plans=pool.map(plan),shapes=pool.map(silhouette);
 for(let j=prior.length;j<pool.length;j++)for(let i=0;i<j;i++){
 assert.ok(iou(plans[i],plans[j])<.88,'partition IoU '+pool[i].id+' / '+pool[j].id);
 assert.ok(iou(shapes[i],shapes[j])<.975,'silhouette IoU '+pool[i].id+' / '+pool[j].id);
 }
 assert.equal(new Set(wave.map(b=>b.architecturalIdentity.plan)).size,5);
 assert.ok(wave.every(b=>!b.architecturalIdentity.plan.includes('staggered-s')));
});
for(const b of wave)test('actual original physical exterior, rooms, roof and Pack1–5 producer source AABB: '+b.id,()=>{
 assert.equal(validateBlueprint(b),true);
 const {width:w,height:h,depth:d}=b.footprint,cuts=b.architecturalIdentity.exteriorNotches,occ=new Map(b.placements.map(p=>[key(p.at),p])),walk=new Set(b.walkable.map(key));
 assert.equal(occ.size,b.placements.length);assert.equal(b.portals.length,b.rooms.length);
 const active=(x,z)=>cuts.every(c=>x<c[0]||x>c[2]||z<c[1]||z>c[3]);
 let voids=0;
 for(let x=0;x<w;x++)for(let z=0;z<d;z++){if(!active(x,z)){voids++;for(let y=0;y<h;y++)assert.ok(!occ.has(key([x,y,z])),'fake courtyard');}else assert.equal(occ.get(key([x,0,z]))?.role,'foundation','missing footing');}
 assert.equal(voids,b.architecturalIdentity.exteriorVoidFootprintCells);
 assert.equal(b.architecturalIdentity.exteriorOutline,'genuine-concave-perimeter');
 const roof=b.placements.filter(p=>p.role==='roof'),wings=b.architecturalIdentity.roofWings;
 assert.ok(wings.length>=5&&new Set(wings.map(w=>w.style)).size>=3);
 assert.deepEqual([...new Set(wings.map(w=>w.raise))].sort(),[0,1,2]);
 assert.ok(new Set(roof.map(p=>p.at[1])).size>=3);
 for(const p of roof){assert.ok(occ.has(key([p.at[0],p.at[1]-1,p.at[2]])),'unbacked roof');assert.equal(p.weatherSealApproved,false);}
 for(const w of wings){const [x0,z0,x1,z1]=w.rect;assert.ok(roof.some(p=>p.at[0]>=x0&&p.at[0]<=x1&&p.at[2]>=z0&&p.at[2]<=z1),w.name+' missing');}
 for(const p of b.portals){const [x,y,z]=p.at;assert.ok(walk.has(key(p.at))&&!occ.has(key([x,y,z]))&&!occ.has(key([x,y+1,z])),'door throat blocked');}
 assert.equal(b.footprintReservations.length,b.category==='inn'?3:1);
 for(const r of b.footprintReservations){assert.equal(r.asset,'pack5:082');assert.equal(r.approval,'unresolved');for(const c of r.extraCells)assert.ok(active(c[0],c[2])&&!occ.has(key(c))&&!walk.has(key(c)),'bed foot occupied');}
 for(const role of ['foundation','wall','partition','roof','support','door','window','furnishing'])assert.ok(b.placements.some(p=>p.role===role),'missing '+role);
 const audit=auditM1PhysicalSources(b);
 assert.equal(audit.catalog.families,96);assert.equal(audit.catalog.numericVariants,106);
 assert.deepEqual(audit.errors,[]);assert.deepEqual(audit.unresolved,[]);
 assert.equal(audit.roofTiles,audit.roofBackingCells);assert.equal(audit.bedHeads,audit.bedFeet);
 assert.equal(audit.productionReady,false);assert.equal(audit.worldPlaced,false);assert.equal(audit.physicalIPhoneTested,false);
});
