// Builder 1A: real source-physical Wave8 acceptance with 255 earlier original objects protected.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
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
import {HOSPITALITY_WAVE8_IDS} from '../../../src/building-pool/roadmap-1a/m3-hospitality-wave8.mjs';
import {validateBlueprint,validatePool,structuralFingerprint} from '../../../src/building-pool/roadmap-1a/legacy-schema.mjs';
import {findMirroredOrRotatedDuplicates} from '../../../src/building-pool/roadmap-1a/legacy-uniqueness.mjs';
import {auditM1PhysicalSources} from '../../../src/building-pool/roadmap-1a/m1-physical-sources.mjs';
const prior=[...getM1Blueprints(),...getM1InnExemplars(),...getM2Originals(),...getM2HousingTranche(),...getM2HousingWave2(),...getM2HousingWave3(),...getM2HousingWave4(),...getM2HousingWave5(),...getM2HousingWave6(),...getM2HousingWave7(),...getM2HousingWave8(),...getM2HousingWave9(),...getHospitalityWave1(),...getHospitalityWave2(),...getHospitalityWave3(),...getHospitalityWave4(),...getHospitalityWave5(),...getHospitalityWave6(),...getHospitalityWave7()];
const wave=getHospitalityWave8(),pool=[...prior,...wave];
const fixture=JSON.parse(readFileSync(new URL('./m3-hospitality-baseline245.json',import.meta.url),'utf8'));
const key=p=>p.join(',');
function fnv(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619)>>>0;return h.toString(16).padStart(8,'0');}
function plan(b){return new Set(b.placements.filter(p=>p.role==='partition'&&p.at[1]===1).map(p=>Math.floor(16*p.at[0]/b.footprint.width)+','+Math.floor(16*p.at[2]/b.footprint.depth)));}
function silhouette(b){const {width:w,depth:d}=b.footprint,cuts=b.architecturalIdentity.exteriorNotches??[],set=new Set();
 for(let x=0;x<16;x++)for(let z=0;z<16;z++){
 const a=Math.min(w-1,Math.floor((x+.5)*w/16)),c=Math.min(d-1,Math.floor((z+.5)*d/16));
 if(cuts.every(n=>a<n[0]||a>n[2]||c<n[1]||c>n[3]))set.add(x+','+z);
 }return set;}
function iou(a,b){let both=0;for(const k of a)if(b.has(k))both++;return both/(a.size+b.size-both||1);}
test('immutable prior 245 complete full-source fingerprints and 10 Wave7 source IDs survive Wave8',()=>{
 assert.equal(prior.length,255);assert.equal(fixture.count,245);
 assert.deepEqual(prior.slice(0,245).map(b=>{const s=JSON.stringify(b);return {id:b.id,chars:s.length,fnv:fnv(s)};}),fixture.records);
 assert.deepEqual(prior.slice(245).map(b=>b.id),getHospitalityWave7().map(b=>b.id));
 const immutableWave7=[
  {
    "id": "r1:tavern:temperate:medium:001",
    "chars": 2080231,
    "fnv": "be942f3a"
  },
  {
    "id": "r1:tavern:desert:medium:005",
    "chars": 1825215,
    "fnv": "b2d9def2"
  },
  {
    "id": "r1:tavern:enchanted-forest:medium:003",
    "chars": 2415826,
    "fnv": "29618a6d"
  },
  {
    "id": "r1:tavern:mountain:large:002",
    "chars": 2701565,
    "fnv": "37fed24d"
  },
  {
    "id": "r1:tavern:mountain:small:004",
    "chars": 1624906,
    "fnv": "0a89ee30"
  },
  {
    "id": "r1:inn:temperate:large:004",
    "chars": 2422239,
    "fnv": "9c0ac6a5"
  },
  {
    "id": "r1:inn:desert:medium:005",
    "chars": 2566833,
    "fnv": "808ceab9"
  },
  {
    "id": "r1:inn:snow:medium:004",
    "chars": 2686897,
    "fnv": "e213cc78"
  },
  {
    "id": "r1:inn:enchanted-forest:large:004",
    "chars": 3376232,
    "fnv": "a9ea1512"
  },
  {
    "id": "r1:inn:mountain:small:005",
    "chars": 1786854,
    "fnv": "ad2601a0"
  }
];
 assert.deepEqual(prior.slice(245).map(b=>{const s=JSON.stringify(b);return {id:b.id,chars:s.length,fnv:fnv(s)};}),immutableWave7,
  'all ten Wave7 prior complete source serializations must match accepted FNV/byte lengths');
});
test('five new original buildings: 260 IDs, 260 physical signatures, 87,472 voxels, D4 zero repeats',()=>{
 assert.deepEqual(wave.map(b=>b.id),HOSPITALITY_WAVE8_IDS);
 assert.equal(wave.length,5);
 assert.equal(wave.filter(b=>b.category==='tavern').length,3);
 assert.equal(wave.filter(b=>b.category==='inn').length,2);
 assert.equal(wave.reduce((s,b)=>s+b.placements.length,0),87472);
 assert.equal(wave.reduce((s,b)=>s+b.architecturalIdentity.exteriorVoidFootprintCells,0),5107);
 assert.equal(wave.reduce((s,b)=>s+b.rooms.length,0),29);
 assert.equal(wave.reduce((s,b)=>s+b.footprintReservations.length,0),9);
 assert.deepEqual(pool.reduce((o,b)=>(o[b.category]=(o[b.category]||0)+1,o),{}),{house:150,tavern:61,inn:49});
 assert.equal(validatePool(pool).authored,260);assert.equal(validatePool(pool).remaining,190);
 assert.equal(new Set(pool.map(b=>b.id)).size,260);
 assert.equal(new Set(pool.map(structuralFingerprint)).size,260);
 assert.deepEqual(findMirroredOrRotatedDuplicates(pool),[]);
 assert.ok(pool.every(b=>b.status==='candidate'&&!b.worldPlacement&&!b.liveIntegration));
});
test('distinct source H/U/T floor partitions and true concave silhouettes versus all earlier 255',()=>{
 const plans=pool.map(plan),shapes=pool.map(silhouette);
 for(let j=255;j<pool.length;j++)for(let i=0;i<j;i++){
 assert.ok(iou(plans[i],plans[j])<.88,'floor IoU '+pool[i].id+' / '+pool[j].id);
 assert.ok(iou(shapes[i],shapes[j])<.975,'silhouette IoU '+pool[i].id+' / '+pool[j].id);
 }
 const p=wave.map(b=>b.architecturalIdentity.plan);
 assert.equal(new Set(p).size,5);
 assert.equal(p.filter(s=>s.includes('-h-')).length,2);
 assert.equal(p.filter(s=>s.includes('-u-')).length,2);
 assert.equal(p.filter(s=>s.includes('-t-')).length,1);
 assert.ok(p.every(s=>!s.includes('staggered-s')));
});
for(const b of wave)test('physical access/roof/weather/producer support: '+b.id,()=>{
 assert.equal(validateBlueprint(b),true);
 const {width:w,depth:d,height:h}=b.footprint,cuts=b.architecturalIdentity.exteriorNotches,occ=new Map(b.placements.map(p=>[key(p.at),p])),walk=new Set(b.walkable.map(key));
 const active=(x,z)=>cuts.every(n=>x<n[0]||x>n[2]||z<n[1]||z>n[3]);
 assert.equal(occ.size,b.placements.length);assert.equal(b.portals.length,b.rooms.length);
 assert.equal(b.architecturalIdentity.exteriorOutline,'genuine-concave-perimeter');
 let missing=0;
 for(let x=0;x<w;x++)for(let z=0;z<d;z++)
  if(!active(x,z)){missing++;for(let y=0;y<h;y++)assert.ok(!occ.has(key([x,y,z])),'false exterior void');}
  else assert.equal(occ.get(key([x,0,z]))?.role,'foundation','missing footing');
 assert.equal(missing,b.architecturalIdentity.exteriorVoidFootprintCells);
 const roof=b.placements.filter(p=>p.role==='roof'),wings=b.architecturalIdentity.roofWings;
 assert.ok(wings.length>=5&&new Set(wings.map(w=>w.style)).size>=3);
 assert.deepEqual([...new Set(wings.map(w=>w.raise))].sort(),[0,1,2]);
 assert.ok(new Set(roof.map(p=>p.at[1])).size>=3);
 for(const p of roof){assert.ok(occ.has(key([p.at[0],p.at[1]-1,p.at[2]])),'floating roof');assert.equal(p.weatherSealApproved,false);}
 for(const w of wings){const [x0,z0,x1,z1]=w.rect;assert.ok(roof.some(p=>p.at[0]>=x0&&p.at[0]<=x1&&p.at[2]>=z0&&p.at[2]<=z1),w.name+' lacks true roof');}
 for(const d of b.portals){const [x,y,z]=d.at;assert.ok(walk.has(key(d.at))&&!occ.has(key([x,y,z]))&&!occ.has(key([x,y+1,z])),'blocked door');}
 assert.equal(b.footprintReservations.length,b.category==='inn'?3:1);
 for(const r of b.footprintReservations)for(const pt of r.extraCells)assert.ok(active(pt[0],pt[2])&&!occ.has(key(pt))&&!walk.has(key(pt)),'bed foot obstructed');
 for(const role of ['foundation','wall','partition','roof','support','door','window','furnishing'])assert.ok(b.placements.some(p=>p.role===role),role+' absent');
 const audit=auditM1PhysicalSources(b);
 assert.equal(audit.catalog.families,96);assert.equal(audit.catalog.numericVariants,106);
 assert.deepEqual(audit.errors,[]);assert.deepEqual(audit.unresolved,[]);
 assert.equal(audit.roofTiles,audit.roofBackingCells);assert.equal(audit.bedHeads,audit.bedFeet);
 assert.equal(audit.productionReady,false);assert.equal(audit.worldPlaced,false);assert.equal(audit.physicalIPhoneTested,false);
});
