import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {MARKET_SQUARE_TEMPERATE_SMALL as market} from '../../../src/building-pool/roadmap-2b/market-square-temperate-small.mjs';
import {LEGACY_TEMPLES} from '../../../src/building-pool/roadmap-2b/legacy-temples.mjs';
import {SCHEMA,validateBlueprint,assertDistinctArchitecture} from '../../../src/building-pool/roadmap-2b/schema.mjs';
import {plannedSlots,inventory} from '../../../src/building-pool/roadmap-2b/catalog.mjs';
const summary=JSON.parse(readFileSync(new URL('../../../src/building-pool/roadmap-2b/m1-candidates.json',import.meta.url),'utf8'));
const cells=new Map(market.voxels.map(v=>[[v.x,v.y,v.z].join(','),v]));
const at=(x,y,z)=>cells.get([x,y,z].join(','));
const clear=(x,z)=>at(x,1,z)?.kind==='floor'&&[2,3,4].every(y=>!at(x,y,z));
function accessible(){
  const visited=new Set(),queue=[[11,0]];
  for(let i=0;i<queue.length;i++){
    const [x,z]=queue[i],k=x+','+z;
    if(x<0||x>=market.extents.x||z<0||z>=market.extents.z||visited.has(k)||!clear(x,z))continue;
    visited.add(k);
    for(const [dx,dz] of [[-1,0],[1,0],[0,-1],[0,1]])queue.push([x+dx,z+dz]);
  }
  return visited;
}
test('M1 first fresh blueprint: full authored coordinate map, valid namespace and truthful 16/420 count',()=>{
 assert.equal(market.schema,SCHEMA);
 assert.deepEqual(validateBlueprint(market),{valid:true,voxels:market.voxels.length,uniqueCells:market.voxels.length,rooms:3});
 assert(plannedSlots().some(s=>s.id===market.id));
 assert.equal(market.id,'r2:market-square:temperate:small:01');
 assert.equal(cells.size,market.voxels.length);
 assert(market.voxels.length>1100,'no physical floor, structure and stalls');
 assert.equal(market.status,'authored-candidate');
 assert.equal(market.worldPlaced,false);
 assert.equal(market.numericIdsAssigned,false);
 assert.deepEqual([summary.target,summary.authored,summary.inherited,summary.newlyAuthored,summary.unauthored,summary.creatorAccepted,summary.integrated],[420,16,15,1,404,0,0]);
 assert.deepEqual(summary.categoryCounts,{'market-square':1,tailor:0,butcher:0,jeweler:0,bookshop:0,temple:15,theater:0});
 assert.equal(inventory().target,420);
 assert.equal(summary.candidateIds.length,1);
 assert.deepEqual(assertDistinctArchitecture([market,...LEGACY_TEMPLES]),{authored:16,distinctArchitectures:16});
});
test('M1 market has four independent open, supported roofed vendor bays and 16 honest glazed/frame physical cells',()=>{
 assert.equal(market.boothApproaches.length,4);
 for(const {x,z,id} of market.boothApproaches){
   assert(clear(x,z),id+' no open three-high customer approach');
   const lowX=x-2,lowZ=z-1;
   for(const xx of [lowX,lowX+4])for(const zz of [lowZ,lowZ+4])
     for(let y=0;y<=6;y++)assert(at(xx,y,zz),id+' unsupported post/roof at '+xx+','+y+','+zz);
   for(let xx=lowX;xx<=lowX+4;xx++)for(let zz=lowZ;zz<=lowZ+4;zz++)
     assert.equal(at(xx,6,zz)?.kind,'roof',id+' canopy gap');
   for(let xx=lowX+1;xx<=lowX+3;xx++)
     assert.equal(at(xx,2,lowZ+3)?.material,'pack5:086',id+' missing actual counter cell');
 }
 const windowVoxels=market.voxels.filter(v=>v.kind==='window');
 const listed=market.openings.filter(o=>o.type==='window');
 assert.equal(windowVoxels.length,16);
 assert.equal(listed.length,16);
 assert.deepEqual(listed.map(w=>[w.x,w.y,w.z,w.material]),windowVoxels.map(w=>[w.x,w.y,w.z,w.material]));
});
test('M1 public paths are truly walkable with three-high conceptual headroom and no blocked central port',()=>{
 const seen=accessible();
 for(const target of market.routeTargets){
  assert(clear(target.x,target.z),target.name+' approach occupied');
  assert(seen.has([target.x,target.z].join(',')),target.name+' not reachable from south gate');
 }
 for(let z=0;z<=20;z++)assert(clear(11,z),'center axial path at '+z);
 assert(!at(11,6,10),'central court must remain skylit, no fake full plaza roof');
 const entry=market.openings.find(x=>x.type==='entrance');
 assert.deepEqual([entry.x,entry.y,entry.z,entry.clearHeightCells],[11,2,0,3]);
});
test('M1 covered north pavilion has actual roof, posts, public exchange and weather shelter',()=>{
 for(const xx of [7,15])for(const zz of [19,21])
  for(let y=0;y<=6;y++)assert(at(xx,y,zz),'floating north pavilion roof');
 for(let xx=7;xx<=15;xx++)for(let zz=19;zz<=21;zz++)
  assert.equal(at(xx,6,zz)?.kind,'roof','north pavilion canopy gap');
 assert(clear(11,20));
 assert.equal(at(11,2,21)?.kind,'wall');
 assert.equal(at(11,6,20)?.kind,'roof');
});
test('M1 physical family references remain explicit unresolved dependencies, never auto-register or place',()=>{
 const actual=new Set(market.voxels.map(v=>v.material));
 assert.deepEqual([...actual].sort(),market.unresolvedDependencies.map(d=>d.ref));
 assert.deepEqual([...actual].sort(),market.dependencyLedger.map(d=>d.ref));
 assert(market.dependencyLedger.every(x=>x.status==='integration-blocked'&&x.checks.includes('schema-1 save encoding')));
 assert(!market.numericIdsAssigned&&!market.worldPlaced);
});
test('M1 native Node test reads the exact current GitHub PR HEAD file blob, not a test facade',()=>{
 const file='src/building-pool/roadmap-2b/market-square-temperate-small.mjs';
 const committed=execFileSync('git',['rev-parse','HEAD:'+file],{encoding:'utf8'}).trim();
 const working=execFileSync('git',['hash-object',file],{encoding:'utf8'}).trim();
 assert.equal(committed,working,'checked-out authoring source must match PR HEAD blob');
 assert.equal(market.id,'r2:market-square:temperate:small:01');
});
