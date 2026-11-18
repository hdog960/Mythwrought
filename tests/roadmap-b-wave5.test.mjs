// Roadmap B Wave5 eight ORIGINAL source candidates; no production registration or schema-1 edits.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {get1BCandidates} from '../src/building-pool/roadmap-1b/candidates.mjs';
import {validateBlueprint as validate1B} from '../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {validateBlueprint as validate2B} from '../src/building-pool/roadmap-2b/schema.mjs';
import {getRoadmapBWave1B1} from '../src/building-pool/roadmap-b/wave1-community-b1.mjs';
import {getRoadmapBWave1B2} from '../src/building-pool/roadmap-b/wave1-trades-b2.mjs';
import {getRoadmapBWave2B1} from '../src/building-pool/roadmap-b/wave2-community-b1.mjs';
import {getRoadmapBWave2B2} from '../src/building-pool/roadmap-b/wave2-trades-b2.mjs';
import {getRoadmapBWave3B1} from '../src/building-pool/roadmap-b/wave3-community-b1.mjs';
import {getRoadmapBWave3B2} from '../src/building-pool/roadmap-b/wave3-trades-b2.mjs';
import {getRoadmapBWave4B1} from '../src/building-pool/roadmap-b/wave4-community-b1.mjs';
import {getRoadmapBWave4B2} from '../src/building-pool/roadmap-b/wave4-trades-b2.mjs';
import {getRoadmapBWave5B1,ROADMAP_B_WAVE5_B1_IDS} from '../src/building-pool/roadmap-b/wave5-community-b1.mjs';
import {getRoadmapBWave5B2,ROADMAP_B_WAVE5_B2_IDS} from '../src/building-pool/roadmap-b/wave5-trades-b2.mjs';
import {createStoneveinSwitchbackBaths} from '../src/building-pool/roadmap-b/b1-stonevein-switchback-baths.mjs';
import {createIronpassHorseshoeExchange} from '../src/building-pool/roadmap-b/b2-ironpass-market.mjs';
const xyz=(x,y,z)=>x+','+y+','+z;
const floorPoints=b=>b.placements?
 b.placements.filter(x=>x.role==='foundation').map(x=>[x.at[0],x.at[2]]):
 b.voxels.filter(x=>x.kind==='floor').map(x=>[x.x,x.z]);
function normalized(ps){
 const x=Math.min(...ps.map(k=>k[0])),z=Math.min(...ps.map(k=>k[1]));
 return new Set(ps.map(([a,b])=>(a-x)+','+(b-z)));
}
function d4(a,b){
 const B=normalized(b);let max=0;
 for(let mirror=0;mirror<2;mirror++)for(let rot=0;rot<4;rot++){
  const A=normalized(a.map(([xx,zz])=>{let x=mirror?-xx:xx,z=zz;
   for(let j=0;j<rot;j++){let q=x;x=-z;z=q;}return [x,z];}));
  let hit=0;for(const k of A)if(B.has(k))hit++;
  max=Math.max(max,hit/(A.size+B.size-hit));
 }
 return max;
}
function check2BWalk(b){
 const occupied=new Set(b.voxels.map(p=>xyz(p.x,p.y,p.z)));
 const floor=new Set(b.voxels.filter(p=>p.kind==='floor').map(p=>p.x+','+p.z));
 const air=new Set([...floor].filter(k=>{const [x,z]=k.split(',');
  return !occupied.has(x+',2,'+z)&&!occupied.has(x+',3,'+z);}));
 const door=b.openings.find(x=>x.type==='entrance');assert.ok(door,b.id+' entrance missing');
 const first=door.x+','+door.z;assert.ok(air.has(first),b.id+' entrance obstructed');
 const seen=new Set([first]),queue=[first];
 while(queue.length){const [x,z]=queue.shift().split(',').map(Number);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const k=(x+dx)+','+(z+dz);
   if(air.has(k)&&!seen.has(k)){seen.add(k);queue.push(k);}
  }
 }
 assert.equal(seen.size,air.size,b.id+' disconnected physical standing room');
 for(const p of b.routeTargets)assert.ok(seen.has(p.x+','+p.z),b.id+' inaccessible target '+p.purpose);
 return seen.size;
}
test('Wave5 eight original blueprints use unused slots and do not change historical 169/146 census',()=>{
 const old1=get1BCandidates(),ledger=JSON.parse(readFileSync('src/building-pool/roadmap-2b/m1-authoring-ledger.json','utf8'));
 assert.equal(old1.length,169);assert.equal(ledger.authoredCandidates,146);
 const inherited=new Set([...old1.map(b=>b.id),...ledger.originals.map(b=>b.id)]);
 const previous=[...getRoadmapBWave1B1(),...getRoadmapBWave1B2(),...getRoadmapBWave2B1(),...getRoadmapBWave2B2(),
  ...getRoadmapBWave3B1(),...getRoadmapBWave3B2(),...getRoadmapBWave4B1(),...getRoadmapBWave4B2(),
  createStoneveinSwitchbackBaths(),createIronpassHorseshoeExchange()];
 const before=new Set(previous.map(b=>b.id)),a=getRoadmapBWave5B1(),b=getRoadmapBWave5B2(),fresh=[...a,...b];
 assert.equal(previous.length,30);assert.equal(a.length,4);assert.equal(b.length,4);
 assert.deepEqual(a.map(b=>b.id),[...ROADMAP_B_WAVE5_B1_IDS]);
 assert.deepEqual(b.map(b=>b.id),[...ROADMAP_B_WAVE5_B2_IDS]);
 assert.equal(new Set(fresh.map(x=>x.id)).size,8);
 for(const x of fresh){
  assert.ok(!inherited.has(x.id),x.id+' historical original collision');
  assert.ok(!before.has(x.id),x.id+' existing staged source collision');
  assert.equal(x.worldPlaced??x.worldPlacement,false,x.id+' illegal world registration');
 }
});
test('Wave5 four original 1B source plans have walkable physical XYZ, clear portals and unresolved Pack ABI',()=>{
 for(const b of getRoadmapBWave5B1()){
  assert.equal(validate1B(b),true,b.id);
  assert.ok(b.placements.length>3200&&b.walkable.length>800,b.id+' lacks real physical structure');
  assert.equal(b.rooms.length,4);assert.ok(b.portals.length>=5);
  const occ=new Set(b.placements.map(p=>xyz(...p.at)));
  for(const p of b.portals){
   assert.ok(!occ.has(xyz(...p.at)),b.id+' door blocked');
   assert.ok(!occ.has(xyz(p.at[0],2,p.at[2])),b.id+' head blocked');
  }
  assert.ok(new Set(b.placements.filter(p=>p.role==='roof').map(p=>p.roofProfile)).size>=6);
  assert.ok(b.dependencies.length>=2&&b.dependencies.every(d=>d.status==='unresolved'));
  assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 }
});
test('Wave5 four original 2B cultural/trade buildings have authentic source walk connectivity and supported roof regions',()=>{
 for(const b of getRoadmapBWave5B2()){
  assert.equal(validate2B(b).valid,true,b.id);
  assert.ok(b.voxels.length>5000,b.id+' missing actual source-occupied volumetry');
  assert.ok(check2BWalk(b)>1000,b.id+' missing accessible floor');
  assert.ok(b.sourceSupportAudits.length>=5,b.id+' support witness missing');
  assert.ok(b.openings.filter(p=>p.type==='window').length>=6,b.id+' missing supported glazing');
  assert.ok(new Set(b.voxels.filter(p=>p.kind==='roof').map(p=>p.roofProfile)).size>=6);
  assert.ok(b.unresolvedDependencies.length>=6&&b.unresolvedDependencies.every(d=>d.issue.includes('not certified')));
  assert.equal(b.worldPlaced,false);assert.equal(b.worldRegistration,false);
 }
});
test('Wave5 38 isolated source buildings pass all 703 pairwise eight-way D4 normalized floor IoU under 0.85',()=>{
 const all=[...getRoadmapBWave1B1(),...getRoadmapBWave1B2(),...getRoadmapBWave2B1(),...getRoadmapBWave2B2(),
  ...getRoadmapBWave3B1(),...getRoadmapBWave3B2(),...getRoadmapBWave4B1(),...getRoadmapBWave4B2(),
  createStoneveinSwitchbackBaths(),createIronpassHorseshoeExchange(),...getRoadmapBWave5B1(),...getRoadmapBWave5B2()];
 assert.equal(all.length,38);let pairs=0,highest=0;
 for(let i=0;i<all.length;i++)for(let j=0;j<i;j++){
  const score=d4(floorPoints(all[i]),floorPoints(all[j]));pairs++;highest=Math.max(highest,score);
  assert.ok(score<0.85,all[i].id+' near-duplicates '+all[j].id+' under D4 '+score.toFixed(7));
 }
 assert.equal(pairs,703);assert.ok(highest<0.85);
});
