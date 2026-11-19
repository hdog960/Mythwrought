// Roadmap B Wave11 source-only: original community and culture buildings. No production ID registration.
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
import {getRoadmapBWave5B1} from '../src/building-pool/roadmap-b/wave5-community-b1.mjs';
import {getRoadmapBWave5B2} from '../src/building-pool/roadmap-b/wave5-trades-b2.mjs';
import {getRoadmapBWave6B1} from '../src/building-pool/roadmap-b/wave6-community-b1.mjs';
import {getRoadmapBWave8B1} from '../src/building-pool/roadmap-b/wave8-community-b1.mjs';
import {getRoadmapBWave9B1} from '../src/building-pool/roadmap-b/wave9-community-b1.mjs';
import {getRoadmapBWave10B1} from '../src/building-pool/roadmap-b/wave10-community-b1.mjs';
import {getRoadmapBWave11B1,ROADMAP_B_WAVE11_B1_IDS} from '../src/building-pool/roadmap-b/wave11-community-b1.mjs';
import {getRoadmapBWave7B1} from '../src/building-pool/roadmap-b/wave7-community-b1.mjs';
import {getRoadmapBWave6B2} from '../src/building-pool/roadmap-b/wave6-trades-b2.mjs';
import {getRoadmapBWave8B2} from '../src/building-pool/roadmap-b/wave8-trades-b2.mjs';
import {getRoadmapBWave9B2} from '../src/building-pool/roadmap-b/wave9-trades-b2.mjs';
import {getRoadmapBWave10B2} from '../src/building-pool/roadmap-b/wave10-trades-b2.mjs';
import {getRoadmapBWave11B2,ROADMAP_B_WAVE11_B2_IDS} from '../src/building-pool/roadmap-b/wave11-trades-b2.mjs';
import {getRoadmapBWave7B2} from '../src/building-pool/roadmap-b/wave7-trades-b2.mjs';
import {createStoneveinSwitchbackBaths} from '../src/building-pool/roadmap-b/b1-stonevein-switchback-baths.mjs';
import {createIronpassHorseshoeExchange} from '../src/building-pool/roadmap-b/b2-ironpass-market.mjs';
const k=(x,y,z)=>x+','+y+','+z;
const base=b=>b.placements?b.placements.filter(p=>p.role==='foundation').map(p=>[p.at[0],p.at[2]]):
 b.voxels.filter(p=>p.kind==='floor').map(p=>[p.x,p.z]);
function normalized(points){
 const minX=Math.min(...points.map(x=>x[0])),minZ=Math.min(...points.map(x=>x[1]));
 return new Set(points.map(([x,z])=>(x-minX)+','+(z-minZ)));
}
function d4IoU(a,b){
 const B=normalized(b);let maximum=0;
 for(let mirror=0;mirror<2;mirror++)for(let rotation=0;rotation<4;rotation++){
  const A=normalized(a.map(([xx,zz])=>{
   let x=mirror?-xx:xx,z=zz;
   for(let n=0;n<rotation;n++){const previous=x;x=-z;z=previous;}
   return [x,z];
  }));
  let same=0;for(const p of A)if(B.has(p))same++;
  maximum=Math.max(maximum,same/(A.size+B.size-same));
 }
 return maximum;
}
function walk2B(b){
 const occupied=new Set(b.voxels.map(v=>k(v.x,v.y,v.z)));
 const floor=new Set(b.voxels.filter(v=>v.kind==='floor').map(v=>v.x+','+v.z));
 const clear=new Set([...floor].filter(p=>{const [x,z]=p.split(',');
  return !occupied.has(x+',2,'+z)&&!occupied.has(x+',3,'+z);
 }));
 const entrance=b.openings.find(p=>p.type==='entrance');
 assert.ok(entrance,b.id+' missing real exterior entrance');
 const first=entrance.x+','+entrance.z;
 assert.ok(clear.has(first),b.id+' exterior entry physically blocked');
 const visited=new Set([first]),queue=[first];
 while(queue.length){
  const [x,z]=queue.shift().split(',').map(Number);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const next=(x+dx)+','+(z+dz);
   if(clear.has(next)&&!visited.has(next)){visited.add(next);queue.push(next);}
  }
 }
 assert.equal(visited.size,clear.size,b.id+' physically disconnected room');
 for(const t of b.routeTargets)
  assert.ok(visited.has(t.x+','+t.z),b.id+' unreachable physically authored destination '+t.purpose);
 return visited.size;
}
test('Wave11 eight original reserved IDs do not collide with historical 169/146 or previous 86 staged source IDs',()=>{
 const historic1=get1BCandidates();
 const hist2=JSON.parse(readFileSync('src/building-pool/roadmap-2b/m1-authoring-ledger.json','utf8'));
 assert.equal(historic1.length,169);assert.equal(hist2.authoredCandidates,146);
 const originals=new Set([...historic1.map(b=>b.id),...hist2.originals.map(b=>b.id)]);
 const prior=[...getRoadmapBWave1B1(),...getRoadmapBWave1B2(),...getRoadmapBWave2B1(),...getRoadmapBWave2B2(),
  ...getRoadmapBWave3B1(),...getRoadmapBWave3B2(),...getRoadmapBWave4B1(),...getRoadmapBWave4B2(),
  ...getRoadmapBWave5B1(),...getRoadmapBWave5B2(),...getRoadmapBWave6B1(),...getRoadmapBWave6B2(),
  createStoneveinSwitchbackBaths(),createIronpassHorseshoeExchange(),...getRoadmapBWave7B1(),...getRoadmapBWave7B2(),...getRoadmapBWave8B1(),...getRoadmapBWave8B2(),...getRoadmapBWave9B1(),...getRoadmapBWave9B2(),...getRoadmapBWave10B1(),...getRoadmapBWave10B2()];
 const new1=getRoadmapBWave11B1(),new2=getRoadmapBWave11B2(),incoming=[...new1,...new2];
 assert.equal(prior.length,78);assert.equal(new1.length,4);assert.equal(new2.length,4);
 assert.deepEqual(new1.map(b=>b.id),[...ROADMAP_B_WAVE11_B1_IDS]);
 assert.deepEqual(new2.map(b=>b.id),[...ROADMAP_B_WAVE11_B2_IDS]);
 assert.equal(new Set(incoming.map(b=>b.id)).size,8);
 const previous=new Set(prior.map(b=>b.id));
 for(const b of incoming){
  assert.ok(!originals.has(b.id),b.id+' collides with protected historic original');
  assert.ok(!previous.has(b.id),b.id+' collides with prior Roadmap B wave');
  assert.equal(b.worldPlacement??b.worldPlaced,false,b.id+' unapproved world placement');
 }
});
test('Wave11 four 1B community structures have genuine walkable source geometry, roofs, doors and unresolved pack dependencies',()=>{
 for(const b of getRoadmapBWave11B1()){
  assert.equal(validate1B(b),true,b.id);
  assert.ok(b.placements.length>4000&&b.walkable.length>1000,b.id+' missing source cells');
  assert.equal(b.rooms.length,4);assert.ok(b.portals.length>=6);
  const taken=new Set(b.placements.map(p=>k(...p.at)));
  for(const p of b.portals){
   assert.ok(!taken.has(k(...p.at)),b.id+' door blocked');
   assert.ok(!taken.has(k(p.at[0],2,p.at[2])),b.id+' doorway head blocked');
  }
  const masses=new Set(b.placements.filter(p=>p.role==='roof').map(p=>p.roofProfile));
  assert.ok(masses.size>=6,b.id+' insufficient unique roof regions');
  assert.ok(b.dependencies.length>=2&&b.dependencies.every(d=>d.status==='unresolved'));
  assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
 }
});
test('Wave11 four 2B originals have source-backed accessible rooms with two-cell headroom and realistic source-local bounds',()=>{
 for(const b of getRoadmapBWave11B2()){
  assert.equal(validate2B(b).valid,true,b.id);
  assert.ok(b.voxels.length>6000,b.id+' insufficient physically occupied cells');
  assert.ok(walk2B(b)>1050,b.id+' lacks walkable circulation');
  assert.equal(b.rooms.length,4);assert.ok(b.sourceSupportAudits.length>=6);
  for(const r of b.rooms){
   const f=r.bounds;assert.ok(f.x0<f.x1&&f.z0<f.z1&&f.x0>=0&&f.z0>=0&&f.x1<b.extents.x&&f.z1<b.extents.z,b.id+' nonspecific room bounds');
  }
  assert.ok(b.openings.filter(p=>p.type==='window').length>=6);
  assert.ok(new Set(b.voxels.filter(p=>p.kind==='roof').map(p=>p.roofProfile)).size>=6);
  assert.ok(b.unresolvedDependencies.length>=6&&b.unresolvedDependencies.every(d=>d.issue.includes('not certified')));
  assert.equal(b.worldPlaced,false);assert.equal(b.worldRegistration,false);
 }
});
test('Wave11 86 unique Roadmap B staged sources pass 3655 eight-way D4 occupied-floor IoU comparisons strictly below 0.85',()=>{
 const all=[...getRoadmapBWave1B1(),...getRoadmapBWave1B2(),...getRoadmapBWave2B1(),...getRoadmapBWave2B2(),
  ...getRoadmapBWave3B1(),...getRoadmapBWave3B2(),...getRoadmapBWave4B1(),...getRoadmapBWave4B2(),
  ...getRoadmapBWave5B1(),...getRoadmapBWave5B2(),...getRoadmapBWave6B1(),...getRoadmapBWave6B2(),createStoneveinSwitchbackBaths(),createIronpassHorseshoeExchange(),...getRoadmapBWave7B1(),...getRoadmapBWave7B2(),...getRoadmapBWave8B1(),...getRoadmapBWave8B2(),...getRoadmapBWave9B1(),...getRoadmapBWave9B2(),...getRoadmapBWave10B1(),...getRoadmapBWave10B2(),
  ...getRoadmapBWave11B1(),...getRoadmapBWave11B2()];
 assert.equal(all.length,86);let comparisons=0,maximum=0;
 for(let i=0;i<all.length;i++)for(let j=0;j<i;j++){
  const score=d4IoU(base(all[i]),base(all[j]));maximum=Math.max(maximum,score);comparisons++;
  assert.ok(score<0.85,all[i].id+' mirrors '+all[j].id+' IoU '+score.toFixed(7));
 }
 assert.equal(comparisons,3655);assert.ok(maximum<0.85);
});
