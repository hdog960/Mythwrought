import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const x=JSON.parse(readFileSync(new URL('../../docs/building-pool/EIGHT_LANE_ROSTER.json',import.meta.url)));
test('preserves the 3030-plan, 135-authored eight-lane accounting without duplication',()=>{
 assert.equal(x.lanes.length,8);assert.equal(x.lanes.reduce((a,b)=>a+b.planned,0),3030);
 assert.equal(x.lanes.reduce((a,b)=>a+b.inherited,0),135);
 assert.equal(x.lanes.reduce((a,b)=>a+b.remaining,0),2895);
 assert.equal(x.manualFamilies,96);assert.equal(x.manualPhysicalVariants,106);
 assert.equal(new Set(x.lanes.map(l=>l.lane)).size,8);
 const all=new Set();
 for(const l of x.lanes){
  assert.equal(l.active,false);assert.equal(l.creatorApproved,0);
  assert.equal(Object.values(l.categories).reduce((a,b)=>a+b,0),l.planned);
  assert.equal(Object.values(l.carried).reduce((a,b)=>a+b,0),l.inherited);
  for(const [key,n] of Object.entries(l.categories)){assert.equal(n%15,0);assert.equal(all.has(key),false);all.add(key);}
 }
});
