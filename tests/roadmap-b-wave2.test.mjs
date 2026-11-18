// Roadmap B Wave2: six independently authored original candidates; no runtime registration.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {get1BCandidates} from '../src/building-pool/roadmap-1b/candidates.mjs';
import {validateBlueprint as validate1B} from '../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {validateBlueprint as validate2B} from '../src/building-pool/roadmap-2b/schema.mjs';
import {getRoadmapBWave1B1} from '../src/building-pool/roadmap-b/wave1-community-b1.mjs';
import {getRoadmapBWave1B2} from '../src/building-pool/roadmap-b/wave1-trades-b2.mjs';
import {createStoneveinSwitchbackBaths} from '../src/building-pool/roadmap-b/b1-stonevein-switchback-baths.mjs';
import {createIronpassHorseshoeExchange} from '../src/building-pool/roadmap-b/b2-ironpass-market.mjs';
import {getRoadmapBWave2B1,ROADMAP_B_WAVE2_B1_IDS} from '../src/building-pool/roadmap-b/wave2-community-b1.mjs';
import {getRoadmapBWave2B2,ROADMAP_B_WAVE2_B2_IDS} from '../src/building-pool/roadmap-b/wave2-trades-b2.mjs';

const k=(x,y,z)=>x+','+y+','+z;
const basePoints=b=>b.placements?
 b.placements.filter(p=>p.role==='foundation').map(p=>[p.at[0],p.at[2]]):
 b.voxels.filter(p=>p.kind==='floor').map(p=>[p.x,p.z]);
function normalized(points){
 const x=Math.min(...points.map(v=>v[0])),z=Math.min(...points.map(v=>v[1]));
 return new Set(points.map(([a,b])=>(a-x)+','+(b-z)));
}
function d4IoU(a,b){
 const B=normalized(b);let maximum=0;
 for(let mirror=0;mirror<2;mirror++)for(let turn=0;turn<4;turn++){
  const A=normalized(a.map(([xx,zz])=>{let x=mirror?-xx:xx,z=zz;
   for(let i=0;i<turn;i++){const tmp=x;x=-z;z=tmp;}return [x,z];}));
  let intersection=0;for(const point of A)if(B.has(point))intersection++;
  maximum=Math.max(maximum,intersection/(A.size+B.size-intersection));
 }
 return maximum;
}
function walk2B(bp){
 const occupied=new Set(bp.voxels.map(p=>k(p.x,p.y,p.z)));
 const floor=new Set(bp.voxels.filter(p=>p.kind==='floor').map(p=>p.x+','+p.z));
 const open=new Set([...floor].filter(v=>{const [x,z]=v.split(',');
  return !occupied.has(x+',2,'+z)&&!occupied.has(x+',3,'+z);}));
 const gate=bp.openings.find(p=>p.type==='entrance'),first=gate.x+','+gate.z;
 assert.ok(open.has(first),'front doorway obstructed: '+bp.id);
 const reached=new Set([first]),queue=[first];
 while(queue.length){const [x,z]=queue.shift().split(',').map(Number);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const next=(x+dx)+','+(z+dz);if(open.has(next)&&!reached.has(next)){reached.add(next);queue.push(next);}
  }
 }
 assert.equal(reached.size,open.size,'unreachable physical room/floor on '+bp.id);
 for(const p of bp.routeTargets)assert.ok(reached.has(p.x+','+p.z),bp.id+' destination unreachable '+p.purpose);
 return reached.size;
}
test('Wave2 six original IDs are new, in their reserved quotas, with 169/146 historic census protected',()=>{
 const protected1B=get1BCandidates(),old1=new Set(protected1B.map(b=>b.id));
 const ledger=JSON.parse(readFileSync('src/building-pool/roadmap-2b/m1-authoring-ledger.json','utf8'));
 const old2=new Set(ledger.originals.map(x=>x.id));
 assert.equal(old1.size,169);assert.equal(ledger.authoredCandidates,146);
 const b1=getRoadmapBWave2B1(),b2=getRoadmapBWave2B2();
 assert.equal(b1.length,3);assert.equal(b2.length,3);
 const all=[...b1,...b2],ids=all.map(x=>x.id);
 assert.equal(new Set(ids).size,6);
 assert.deepEqual(b1.map(x=>x.id),[...ROADMAP_B_WAVE2_B1_IDS]);
 assert.deepEqual(b2.map(x=>x.id),[...ROADMAP_B_WAVE2_B2_IDS]);
 const already=new Set([...getRoadmapBWave1B1(),...getRoadmapBWave1B2(),
  createStoneveinSwitchbackBaths(),createIronpassHorseshoeExchange()].map(x=>x.id));
 for(const b of all){
  assert.ok(!old1.has(b.id)&&!old2.has(b.id)&&!already.has(b.id),'duplicate with prior candidate '+b.id);
  assert.equal(b.worldPlacement??b.worldPlaced,false);
 }
});
test('Wave2 1B source modules have real separate supported roof masses, source walkability, and unapproved physical dependencies',()=>{
 for(const bp of getRoadmapBWave2B1()){
  assert.equal(validate1B(bp),true,bp.id);
  assert.ok(bp.placements.length>3800,bp.id+' insufficient actual source XYZ');
  assert.ok(bp.walkable.length>800,bp.id+' no connected ground circulation');
  assert.equal(bp.rooms.length,4);assert.ok(bp.portals.length>=6);
  const filled=new Set(bp.placements.map(p=>k(...p.at)));
  for(const p of bp.portals){assert.ok(!filled.has(k(...p.at)),'door blocked '+bp.id);
   assert.ok(!filled.has(k(p.at[0],2,p.at[2])),'head blocked '+bp.id);}
  const roofs=new Set(bp.placements.filter(p=>p.role==='roof').map(p=>p.roofProfile));
  assert.ok(roofs.size>=5,bp.id+' visually clone-prone roof masses');
  assert.ok(bp.dependencies.length>=2&&bp.dependencies.every(p=>p.status==='unresolved'));
  assert.equal(bp.worldPlacement,false);assert.equal(bp.liveIntegration,false);
 }
});
test('Wave2 2B new shops/market/theater physically floodwalk and validate symbolic unresolved producer assets',()=>{
 for(const bp of getRoadmapBWave2B2()){
  assert.equal(validate2B(bp).valid,true,bp.id);
  assert.ok(bp.voxels.length>5500,bp.id+' lacks independent physical source cells');
  assert.ok(walk2B(bp)>1100,'unwalkable physical ground '+bp.id);
  assert.ok(bp.rooms.length>=4&&bp.sourceSupportAudits.length>=6);
  assert.ok(bp.openings.filter(x=>x.type==='window').length>=6);
  assert.ok(new Set(bp.voxels.filter(x=>x.kind==='roof').map(x=>x.roofProfile)).size>=5);
  assert.ok(bp.unresolvedDependencies.every(d=>d.issue.includes('not certified')));
  assert.equal(bp.numericIdsAssigned,false);assert.equal(bp.worldPlaced,false);
 }
});
test('Wave2 14 unique sources pass cross-lane eight-way normalized D4 footprint IoU strictly under 0.85',()=>{
 const all=[...getRoadmapBWave1B1(),...getRoadmapBWave1B2(),
  createStoneveinSwitchbackBaths(),createIronpassHorseshoeExchange(),
  ...getRoadmapBWave2B1(),...getRoadmapBWave2B2()];
 assert.equal(all.length,14);
 for(let i=0;i<all.length;i++)for(let j=0;j<i;j++){
  const score=d4IoU(basePoints(all[i]),basePoints(all[j]));
  assert.ok(score<0.85,all[i].id+' too near '+all[j].id+' D4='+score.toFixed(7));
 }
});
