import test from 'node:test';
import assert from 'node:assert/strict';
import {createCDesertSmallMarket} from '../../../src/building-pool/roadmap-c-trades/wave1-desert-market.mjs';
import {validateBlueprint,structuralFingerprint} from '../../../src/building-pool/roadmap-2b/schema.mjs';

const market=createCDesertSmallMarket();
const byCell=new Map(market.voxels.map(v=>[[v.x,v.y,v.z].join(','),v]));
const has=(x,y,z)=>byCell.has([x,y,z].join(','));
function walkable(x,z){
 return byCell.get([x,1,z].join(','))?.kind==='floor'&&
  [2,3,4].every(y=>!has(x,y,z));
}
function connected(){
 const start=market.openings.find(o=>o.type==='entrance'),seen=new Set(),queue=[[start.x,start.z]];
 for(let i=0;i<queue.length;i++){
  const [x,z]=queue[i],key=x+','+z;
  if(seen.has(key)||!walkable(x,z))continue;
  seen.add(key);
  queue.push([x+1,z],[x-1,z],[x,z+1],[x,z-1]);
 }
 return seen;
}
test('trade C first truly empty slot preserves original B staging and is a valid original authoring candidate',()=>{
 assert.equal(market.id,'r2:market-square:desert:small:01');
 assert.equal(market.isolated,true);assert.equal(market.worldPlaced,false);
 assert.equal(market.numericIdsAssigned,false);
 assert.equal(validateBlueprint(market).uniqueCells,market.voxels.length);
 assert.ok(market.voxels.length>3000);
 assert.equal(structuralFingerprint(market),structuralFingerprint(createCDesertSmallMarket()));
});
test('six genuinely covered trade pods and 21 truly absent open-air garden cells',()=>{
 assert.equal(market.boothApproaches.length,6);
 assert.deepEqual(market.physicalOpenCourts.map(c=>(c.x1-c.x0+1)*(c.z1-c.z0+1)),[12,9]);
 for(const c of market.physicalOpenCourts)for(let x=c.x0;x<=c.x1;x++)for(let z=c.z0;z<=c.z1;z++)
  for(let y=0;y<market.extents.y;y++)assert.ok(!has(x,y,z),'fake open courtyard '+[x,y,z]);
 assert.ok(new Set(market.voxels.filter(v=>v.kind==='roof').map(v=>v.roofProfile)).size>=6);
 assert.ok(market.voxels.some(v=>v.kind==='fixture'));
 const windows=market.voxels.filter(v=>v.kind==='window'),records=market.openings.filter(o=>o.type==='window');
 assert.equal(windows.length,records.length);
 for(const w of windows)assert.ok(records.some(o=>o.x===w.x&&o.y===w.y&&o.z===w.z&&o.material===w.material));
});
test('real three-high public entrance and six physically reachable vendor approaches',()=>{
 const entry=market.openings.find(o=>o.type==='entrance');
 for(let y=entry.y;y<entry.y+entry.clearHeightCells;y++)
  assert.ok(!has(entry.x,y,entry.z),'blocked caravan entry');
 const reached=connected();
 assert.ok(reached.size>650,'insufficient open circulation source');
 for(const a of market.boothApproaches)
  assert.ok(reached.has(a.x+','+a.z),'unreachable vendor '+a.name);
 for(const o of market.openings.filter(o=>o.type==='internal-doorway'))
  for(let y=o.y;y<o.y+o.clearHeightCells;y++)
   assert.ok(!has(o.x,y,o.z),'blocked vendor door '+[o.x,y,o.z]);
});
