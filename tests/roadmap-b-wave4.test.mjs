// Roadmap B Wave4 isolated source-only acceptance; never register or place in a world.
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
import {getRoadmapBWave4B1,ROADMAP_B_WAVE4_B1_IDS} from '../src/building-pool/roadmap-b/wave4-community-b1.mjs';
import {getRoadmapBWave4B2,ROADMAP_B_WAVE4_B2_IDS} from '../src/building-pool/roadmap-b/wave4-trades-b2.mjs';
import {createStoneveinSwitchbackBaths} from '../src/building-pool/roadmap-b/b1-stonevein-switchback-baths.mjs';
import {createIronpassHorseshoeExchange} from '../src/building-pool/roadmap-b/b2-ironpass-market.mjs';

const coord=(x,y,z)=>[x,y,z].join(',');
const sourceFootprint=b=>b.placements?
 b.placements.filter(p=>p.role==='foundation').map(p=>[p.at[0],p.at[2]]):
 b.voxels.filter(p=>p.kind==='floor').map(p=>[p.x,p.z]);
function normalized(points){
 const xx=Math.min(...points.map(p=>p[0])),zz=Math.min(...points.map(p=>p[1]));
 return new Set(points.map(([x,z])=>(x-xx)+','+(z-zz)));
}
function d4IoU(a,b){
 const B=normalized(b);let maximum=0;
 for(let mirror=0;mirror<2;mirror++)for(let rot=0;rot<4;rot++){
  const A=normalized(a.map(([xx,zz])=>{
   let x=mirror?-xx:xx,z=zz;for(let j=0;j<rot;j++){const v=x;x=-z;z=v;}return [x,z];
  }));
  let overlap=0;for(const k of A)if(B.has(k))overlap++;
  maximum=Math.max(maximum,overlap/(A.size+B.size-overlap));
 }
 return maximum;
}
function physicalWalk(b){
 const filled=new Set(b.voxels.map(v=>coord(v.x,v.y,v.z)));
 const floor=new Set(b.voxels.filter(v=>v.kind==='floor').map(v=>v.x+','+v.z));
 const air=new Set([...floor].filter(key=>{const [x,z]=key.split(',');
  return !filled.has(x+',2,'+z)&&!filled.has(x+',3,'+z);
 }));
 const gate=b.openings.find(p=>p.type==='entrance');
 assert.ok(gate,'no source-backed outside doorway '+b.id);
 const start=gate.x+','+gate.z;assert.ok(air.has(start),'blocked outside doorway '+b.id);
 const seen=new Set([start]),queue=[start];
 while(queue.length){const [x,z]=queue.shift().split(',').map(Number);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const next=(x+dx)+','+(z+dz);
   if(air.has(next)&&!seen.has(next)){seen.add(next);queue.push(next);}
  }
 }
 assert.equal(seen.size,air.size,'physical walkable space split '+b.id);
 for(const t of b.routeTargets)assert.ok(seen.has(t.x+','+t.z),'route target inaccessible '+b.id+' '+t.purpose);
 return seen.size;
}
test('Wave4 original eight IDs are unused and all 169/146 historic source candidates remain immutable',()=>{
 const historic1B=get1BCandidates();
 const ledger=JSON.parse(readFileSync('src/building-pool/roadmap-2b/m1-authoring-ledger.json','utf8'));
 assert.equal(historic1B.length,169);assert.equal(ledger.authoredCandidates,146);
 const old=new Set([...historic1B.map(b=>b.id),...ledger.originals.map(b=>b.id)]);
 const previous=[...getRoadmapBWave1B1(),...getRoadmapBWave1B2(),...getRoadmapBWave2B1(),...getRoadmapBWave2B2(),
  ...getRoadmapBWave3B1(),...getRoadmapBWave3B2(),createStoneveinSwitchbackBaths(),createIronpassHorseshoeExchange()];
 const prevIDs=new Set(previous.map(b=>b.id)),new1=getRoadmapBWave4B1(),new2=getRoadmapBWave4B2(),eight=[...new1,...new2];
 assert.equal(previous.length,22);assert.equal(new1.length,4);assert.equal(new2.length,4);
 assert.deepEqual(new1.map(b=>b.id),[...ROADMAP_B_WAVE4_B1_IDS]);
 assert.deepEqual(new2.map(b=>b.id),[...ROADMAP_B_WAVE4_B2_IDS]);
 assert.equal(new Set(eight.map(b=>b.id)).size,8);
 for(const b of eight){
  assert.ok(!old.has(b.id),'protected historic ID collision '+b.id);
  assert.ok(!prevIDs.has(b.id),'earlier Roadmap B staging ID collision '+b.id);
  assert.equal(b.worldPlacement??b.worldPlaced,false);
 }
});
test('Wave4 four 1B community structures have physical source-cell interiors, portal clearance and distinct supported roofs',()=>{
 for(const b of getRoadmapBWave4B1()){
  assert.equal(validate1B(b),true,b.id);
  assert.ok(b.placements.length>2500&&b.walkable.length>600,b.id+' incomplete actual XYZ shell or circulation');
  assert.equal(b.rooms.length,4);assert.ok(b.portals.length>=5);
  const filled=new Set(b.placements.map(p=>coord(...p.at)));
  for(const p of b.portals){
   assert.ok(!filled.has(coord(...p.at)),'blocked doorway '+b.id);
   assert.ok(!filled.has(coord(p.at[0],2,p.at[2])),'blocked doorway head '+b.id);
  }
  const roofs=new Set(b.placements.filter(p=>p.role==='roof').map(p=>p.roofProfile));
  assert.ok(roofs.size>=5,'too few real source-authored roof masses '+b.id);
  assert.ok(b.dependencies.length>=2&&b.dependencies.every(d=>d.status==='unresolved'));
  assert.equal(b.liveIntegration,false);assert.equal(b.worldPlacement,false);
 }
});
test('Wave4 four 2B temple, shop and culture sources pass genuine 2-cell-high floor floodwalk and symbolic producer dependencies',()=>{
 for(const b of getRoadmapBWave4B2()){
  assert.equal(validate2B(b).valid,true,b.id);
  assert.ok(b.voxels.length>3800,b.id+' lacks actual source occupied volume');
  assert.ok(physicalWalk(b)>700,b.id+' lacks traversable source-floor cells');
  assert.ok(b.rooms.length>=4&&b.openings.filter(p=>p.type==='window').length>=6);
  const roofNames=new Set(b.voxels.filter(p=>p.kind==='roof').map(p=>p.roofProfile));
  assert.ok(roofNames.size>=5,'missing original roof massing '+b.id);
  assert.ok(b.sourceSupportAudits.length>=5&&b.unresolvedDependencies.length>=6);
  assert.ok(b.unresolvedDependencies.every(d=>d.issue.includes('not certified')));
  assert.equal(b.worldPlaced,false);assert.equal(b.worldRegistration,false);
 }
});
test('Wave4 30-source staging roster has 435 distinct cross-lane pairwise eight-way D4 floor IoU below 0.85',()=>{
 const all=[...getRoadmapBWave1B1(),...getRoadmapBWave1B2(),...getRoadmapBWave2B1(),...getRoadmapBWave2B2(),
  ...getRoadmapBWave3B1(),...getRoadmapBWave3B2(),createStoneveinSwitchbackBaths(),createIronpassHorseshoeExchange(),
  ...getRoadmapBWave4B1(),...getRoadmapBWave4B2()];
 assert.equal(all.length,30);
 let pairs=0,max=0;
 for(let i=0;i<all.length;i++)for(let j=0;j<i;j++){
  const score=d4IoU(sourceFootprint(all[i]),sourceFootprint(all[j]));
  pairs++;max=Math.max(max,score);
  assert.ok(score<0.85,all[i].id+' duplicates '+all[j].id+' at D4 IoU '+score.toFixed(7));
 }
 assert.equal(pairs,435);assert.ok(max<0.85);
});
