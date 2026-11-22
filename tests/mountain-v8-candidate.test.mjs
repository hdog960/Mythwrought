// Focused, local tests for the NEVER-DISPATCHED V8 proposal, not V7 acceptance.
import test from 'node:test';
import assert from 'node:assert/strict';
import {planMountainV8Candidate as plan} from '../src/manual-biomes/mountain-v8-candidate.mjs';
const args=(x,z,seed=179)=>({x,z,seed,legacyTop:5,biomeWeight:1,
  neighborTops:[13,12,13,12],worldMaxY:30});
test('V8 proposal deterministic and independent of traversal order',()=>{
  const sites=Array.from({length:225},(_,i)=>args((i%15)*4-28,Math.floor(i/15)*4-28));
  const forward=sites.map(plan),reverse=[...sites].reverse().map(plan).reverse();
  assert.deepEqual(forward,reverse);
  assert.ok(forward.every(v=>v?.safeToIntegrate===false));
});
test('V8 proposes natural meadow, cliffs, exposed stone and irregular snowlines',()=>{
  const caps=new Set(),snowlines=new Set(),cliffs=[];
  for(let z=-96;z<=96;z+=4)for(let x=-96;x<=96;x+=4){
    const v=plan(args(x,z));assert.ok(v);
    caps.add(v.cap);snowlines.add(v.snowline.toFixed(2));
    if(v.cliff)cliffs.push(v);
    assert.ok(v.top>=5&&v.top<=28);
    assert.ok(v.cap!=='alpine-grass'||(!v.snowy&&!v.cliff&&v.slope<=.52));
    assert.ok(v.cap!=='snow'||v.snowy);
  }
  assert.ok(caps.has('snow')&&caps.has('alpine-grass')&&caps.has('slate'));
  assert.ok(cliffs.length>10&&snowlines.size>30);
});
test('protected caves and other biomes fail closed, no V7 identity mutation',()=>{
  const base=args(0,0);
  for(const patch of [{protectedColumn:true},{biomeName:'desert'},
    {biomeWeight:.6},{neighborTops:null},{legacyTop:90},
    {neighborTops:[11,12,NaN,13]}])
    assert.equal(plan({...base,...patch}),null);
  assert.equal(plan(base).generatorIdentityRequired,'v8-new-opt-in');
});
test('neighbor slope checks reject grassy cliffs without modifying source columns',()=>{
  const a=args(8,-24),original=structuredClone(a);
  const steep=plan({...a,neighborTops:[1,1,1,1]});
  assert.ok(steep.cliff);assert.notEqual(steep.cap,'alpine-grass');
  assert.deepEqual(a,original);
});
