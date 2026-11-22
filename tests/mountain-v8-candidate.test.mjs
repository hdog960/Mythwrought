// Focused, local tests for the NEVER-DISPATCHED V8 proposal, not V7 acceptance.
import test from 'node:test';
import assert from 'node:assert/strict';
import {planMountainV8Candidate as plan} from '../src/manual-biomes/mountain-v8-candidate.mjs';
const args=(x,z,seed=179)=>({x,z,seed,legacyTop:5,biomeWeight:1,
  neighborTops:[5,5,5,5],worldMaxY:30});
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
  const steep=plan({...a,neighborTops:[0,0,0,0]});
  assert.ok(steep.cliff);assert.notEqual(steep.cap,'alpine-grass');
  assert.deepEqual(a,original);
});

test('nonrecursive V8 neighbor prediction is bounded and deterministic',()=>{
  const p=plan(args(-24,28));
  assert.equal(p.proposedNeighborTops.length,4);
  assert.ok(p.proposedNeighborTops.every(y=>Number.isInteger(y)&&y>=0&&y<=28));
  const weights=[1,.98,.91,.86];
  const varied=plan({...args(-24,28),neighborBiomeWeights:weights});
  assert.equal(varied.proposedNeighborTops.length,4);
  assert.ok(varied.proposedNeighborTops.every(y=>Number.isInteger(y)));
  assert.deepEqual(varied,plan({...args(-24,28),neighborBiomeWeights:weights}));
  assert.equal(plan({...args(0,0),neighborBiomeWeights:[1,1,NaN,1]}),null);
  assert.equal(plan({...args(0,0),neighborTops:[5,-1,5,5]}),null);
});

test('V8 19-high proposal keeps both snow and exposed non-snow terrain at two seeds',()=>{
  for(const seed of [179,2026]){
    const counts=new Map();
    for(let z=-96;z<=96;z+=4)for(let x=-96;x<=96;x+=4){
      const v=plan({...args(x,z,seed),worldMaxY:19});
      assert.ok(v);
      counts.set(v.cap,(counts.get(v.cap)??0)+1);
    }
    const total=[...counts.values()].reduce((a,b)=>a+b,0),snow=counts.get('snow')??0;
    assert.equal(total,2401);
    assert.ok(snow>50&&snow<total*.75,
      'A seeded mountain must have meaningful snow without blanketing all caps');
    assert.ok((counts.get('alpine-grass')??0)>25,'Gentle alpine grass vanished');
    assert.ok(['slate','scree','gneiss'].some(id=>(counts.get(id)??0)>50),
      'Exposed mineable stone materials vanished');
  }
});
