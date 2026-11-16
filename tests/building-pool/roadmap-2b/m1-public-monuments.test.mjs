import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {M1_PUBLIC_MONUMENTS} from '../../../src/building-pool/roadmap-2b/m1-public-monuments.mjs';
import {M1_REGIONAL_EXEMPLARS} from '../../../src/building-pool/roadmap-2b/m1-regional-exemplars.mjs';
import {TRADE_CULTURE_M1_EXEMPLARS} from '../../../src/building-pool/roadmap-2b/m1-trades-culture-exemplars.mjs';
import {MARKET_SQUARE_TEMPERATE_SMALL} from '../../../src/building-pool/roadmap-2b/market-square-temperate-small.mjs';
import {LEGACY_TEMPLES} from '../../../src/building-pool/roadmap-2b/legacy-temples.mjs';
import {validateBlueprint,assertDistinctArchitecture} from '../../../src/building-pool/roadmap-2b/schema.mjs';
import {plannedSlots} from '../../../src/building-pool/roadmap-2b/catalog.mjs';

const all=[...LEGACY_TEMPLES,MARKET_SQUARE_TEMPERATE_SMALL,
 ...TRADE_CULTURE_M1_EXEMPLARS,...M1_REGIONAL_EXEMPLARS,...M1_PUBLIC_MONUMENTS];
const index=new Map(M1_PUBLIC_MONUMENTS.map(m=>[m.id,m]));
const m=(category,biome,size,variant=1)=>index.get(
 'r2:'+category+':'+biome+':'+size+':'+String(variant).padStart(2,'0'));
const cell=(x,y,z)=>x+','+y+','+z;
function voxels(bp){return new Map(bp.voxels.map(v=>[cell(v.x,v.y,v.z),v]));}
function accessible(bp,blocked=[]){
 const v=voxels(bp),vis=new Set(),queue=[];
 const start=bp.openings.find(o=>o.type==='entrance');
 const denied=new Set(blocked.map(p=>p[0]+','+p[1]));
 queue.push([start.x,start.z]);
 for(let i=0;i<queue.length;i++){
  const [x,z]=queue[i],k=x+','+z;
  if(x<0||z<0||x>=bp.extents.x||z>=bp.extents.z||vis.has(k)||denied.has(k))continue;
  if(v.get(cell(x,1,z))?.kind!=='floor'||[2,3,4].some(y=>v.has(cell(x,y,z))))continue;
  vis.add(k);
  for(const [dx,dz] of [[0,1],[0,-1],[1,0],[-1,0]])queue.push([x+dx,z+dz]);
 }
 return vis;
}
test('M1 new 2B monuments are six true reserved original coordinate-authored identities',()=>{
 assert.equal(M1_PUBLIC_MONUMENTS.length,6);
 const ids=[
  'r2:temple:temperate:small:02','r2:temple:desert:medium:02',
  'r2:market-square:mountain:small:01',
  'r2:market-square:enchanted-forest:large:01',
  'r2:theater:desert:medium:01','r2:theater:mountain:large:01'
 ];
 assert.deepEqual(M1_PUBLIC_MONUMENTS.map(b=>b.id),ids);
 const planned=new Set(plannedSlots().map(s=>s.id));
 for(const bp of M1_PUBLIC_MONUMENTS){
  assert(planned.has(bp.id),bp.id);
  assert.equal(bp.worldPlaced,false);
  assert.equal(bp.numericIdsAssigned,false);
  assert.equal(bp.status,'authored-candidate');
  assert.equal(validateBlueprint(bp).valid,true);
  assert(bp.voxels.length>=1100,bp.id+' is a placeholder');
  assert(bp.rooms.length>=2,bp.id);
 }
 assert.deepEqual(assertDistinctArchitecture(all),{authored:39,distinctArchitectures:39});
});
test('all original monumental floor cells are supported, no overlaps and windows truly occupy physical positions',()=>{
 for(const bp of M1_PUBLIC_MONUMENTS){
  const v=voxels(bp);
  assert.equal(v.size,bp.voxels.length,bp.id);
  for(let x=0;x<bp.extents.x;x++)for(let z=0;z<bp.extents.z;z++){
   assert.equal(v.get(cell(x,0,z))?.kind,'foundation',bp.id+' no foundation');
   assert.equal(v.get(cell(x,1,z))?.kind,'floor',bp.id+' no walkable level');
  }
  const actual=bp.voxels.filter(q=>q.kind==='window');
  const listed=bp.openings.filter(q=>q.type==='window');
  assert.equal(actual.length,listed.length,bp.id+' missing window metadata');
  for(const w of listed)assert.equal(v.get(cell(w.x,w.y,w.z))?.material,w.material,bp.id+' window mismatch');
  for(const port of bp.openings.filter(q=>['entrance','internal-doorway'].includes(q.type))){
   assert.equal(port.clearHeightCells,3);
   for(let y=port.y;y<port.y+3;y++)
    assert(!v.has(cell(port.x,y,port.z)),bp.id+' doorway occupied '+cell(port.x,y,port.z));
  }
  const refs=new Set([...bp.voxels.map(x=>x.material),'pack2:020']);
  assert.deepEqual([...refs].sort(),bp.unresolvedDependencies.map(d=>d.ref),bp.id);
 }
});
test('every advertised public, cloister, market, backstage and sanctuary floor target is actually reachable',()=>{
 for(const bp of M1_PUBLIC_MONUMENTS){
  const seen=accessible(bp);
  assert(bp.routeTargets.length>=2,bp.id);
  for(const target of bp.routeTargets)
   assert(seen.has(target.x+','+target.z),bp.id+' unreachable target '+target.name);
 }
});
test('two structurally different new temples have real separate processional volumes, altars and unapproved physical stair approaches',()=>{
 const cloister=m('temple','temperate','small',2),sunwell=m('temple','desert','medium',2);
 const a=voxels(cloister),b=voxels(sunwell);
 assert.equal(cloister.voxels.filter(x=>x.material==='pack5:093').length,1);
 assert.equal(sunwell.voxels.filter(x=>x.material==='pack5:093').length,1);
 assert.equal(cloister.symbolicStairApproaches.length,2);
 assert.equal(sunwell.symbolicStairApproaches.length,2);
 for(const bp of [cloister,sunwell]){
  assert(bp.symbolicStairApproaches.every(s=>s.shapeRotationStatus==='unresolved-symbolic'));
  for(const s of bp.symbolicStairApproaches){
   assert.equal(voxels(bp).get(cell(s.x,s.y,s.z))?.material,'pack1:008');
   assert(voxels(bp).has(cell(s.upperLanding.x,2,s.upperLanding.z)));
  }
  for(const o of bp.intentionallyOpenRoof)
   for(let x=o.x0;x<=o.x1;x++)for(let z=o.z0;z<=o.z1;z++)
    assert(!voxels(bp).has(cell(x,7,z)),bp.id+' enclosed intentional sky opening');
 }
 assert(accessible(cloister).has('3,9'));
 assert(!accessible(cloister,[[5,9]]).has('3,9'),'west chapel has an unplanned bypass');
 assert(!accessible(cloister,[[15,9]]).has('17,9'),'east chapel has an unplanned bypass');
 assert.equal(a.get('1,10,1')?.kind,'roof','temple belfry unsupported or absent');
 assert.equal(b.get('2,10,3')?.kind,'roof','desert shade tower absent');
});
test('staggered Mountain market and eight-wing Forest market have physically roofed independent vendor stalls',()=>{
 const mountain=m('market-square','mountain','small'),forest=m('market-square','enchanted-forest','large');
 assert.equal(mountain.routeTargets.filter(t=>t.name.includes('stall')).length,4);
 assert.equal(forest.routeTargets.filter(t=>t.name.includes('-')).length>=8,true);
 for(const [bp,count] of [[mountain,4],[forest,8]]){
  const v=voxels(bp),stalls=bp.routeTargets.filter(t=>t.name.includes('stall')||t.name.startsWith('west-')||t.name.startsWith('east-')||t.name.startsWith('north-'));
  assert(stalls.length>=count,bp.id+' stalled market roster');
  assert(bp.voxels.filter(w=>w.role?.includes('canopy')).length>=count*25,bp.id);
  for(const t of stalls.slice(-count)){
   const x=t.x-2,z=t.z-1;
   for(const xx of [x,x+4])for(const zz of [z,z+4])
    for(let y=0;y<=6;y++)assert(v.has(cell(xx,y,zz)),bp.id+' unsupported stall');
  }
 }
 assert(accessible(mountain).has('12,21'));
 assert(accessible(forest).has('18,16'));
 assert(!voxels(forest).has('18,6,16'),'forest market center should remain open to sky');
});
test('two new theaters have physically distinct stages, opposed real backstage doors and symbolic-only stage slope',()=>{
 for(const [bp,expectedStage] of [
  [m('theater','desert','medium'),13*6],[m('theater','mountain','large'),17*6]]){
  const v=voxels(bp);
  assert.equal(bp.voxels.filter(w=>w.role==='raised-stage').length,expectedStage,bp.id);
  assert.equal(bp.voxels.filter(w=>w.role==='symbolic-stage-stair').length,2,bp.id);
  const ports=bp.openings.filter(o=>o.type==='internal-doorway');
  assert.equal(ports.length,2,bp.id);
  const back=bp.routeTargets.find(x=>x.name==='west-backstage');
  assert(accessible(bp).has(back.x+','+back.z),bp.id);
  assert(!accessible(bp,ports.map(o=>[o.x,o.z])).has(back.x+','+back.z),
   bp.id+' backstage can be entered through an unplanned opening');
  assert(bp.unresolvedDependencies.some(d=>d.ref==='pack1:008'),bp.id);
  assert.equal(v.get(cell(ports[0].x,1,ports[0].z))?.kind,'floor');
 }
});
test('no new 2B test-source facade: exact checked out Git blob parity and current cumulative 79-entry ledger',()=>{
 const file='src/building-pool/roadmap-2b/m1-public-monuments.mjs';
 const committed=execFileSync('git',['rev-parse','HEAD:'+file],{encoding:'utf8'}).trim();
 const worktree=execFileSync('git',['hash-object',file],{encoding:'utf8'}).trim();
 assert.equal(committed,worktree);
 const ledger=JSON.parse(readFileSync(new URL('../../../src/building-pool/roadmap-2b/m1-authoring-ledger.json',import.meta.url),'utf8'));
 assert.equal(ledger.authoredCandidates,84);
 assert.equal(ledger.remainingUnauthored,336);
 assert.equal(ledger.creatorAccepted,0);
 assert.equal(ledger.integratedInGame,0);
 assert.equal(new Set(all.map(b=>b.id)).size,39);
 const inheritedFromPriorM1=all.filter(x=>x.category!=='temple'||x.variation!==1).map(x=>x.id);
 assert.equal(inheritedFromPriorM1.length,24,'historical public M1 candidate set changed');
 const currentIds=new Set(ledger.originals.map(x=>x.id));
 assert.equal(ledger.originals.length,69,'cumulative original count includes forty post-public-M1 additions');
 for(const id of inheritedFromPriorM1)assert(currentIds.has(id),'lost earlier 2B candidate '+id);
});
