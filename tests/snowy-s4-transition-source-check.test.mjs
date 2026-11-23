import assert from 'node:assert/strict';
import test from 'node:test';
import {inspectSnowS4OriginalTransitionHolds as inspect}
  from '../src/manual-biomes/snowy-s4-transition-source-check.mjs';
const M7='mythwrought-five-surface-regions-v7',rect={x:13,z:0,width:6,height:6};
const key=(x,y,z)=>x+','+y+','+z;
function fixture({grass=new Set(['15,2','16,2']),weight=.96,
  neighbor='snow'}={}){
  const edits=new Map(),caves=new Map(),legacy=new Map(),suppressed=new Map();
  const natural=(x,y,z)=>legacy.get(key(x,y,z))??
    (y===6?1:y===5?2:y<5?3:0);
  const ground=(x,y,z)=>caves.get(key(x,y,z))??
    suppressed.get(key(x,y,z))??natural(x,y,z);
  const world={seed:179,edits,generationProfile:{generator:M7},
    environmentCaves:{get:(...p)=>caves.get(key(...p))},
    _environmentBaseline:ground,
    _columnPlan:(x,z)=>grass.has(x+','+z)?new Map():new Map([[5,278],[6,272]]),
    get:(x,y,z)=>edits.get(key(x,y,z))??
      (grass.has(x+','+z)?ground(x,y,z):(y===6?272:y===5?278:y<5?3:0)),
    save:()=>({schema:1,seed:179,edits:[...edits]})};
  let customBiome;
  const deps={biomeAt:(x,z,s)=>customBiome?.(x,z,s)??
    ({name:(x===29&&z===2&&neighbor!=='snow')?neighbor:'snow',weight}),
    terrainHeight:()=>6,legacyNatural:natural};
  return {world,deps,legacy,suppressed,caves,edits,
    changeBiome:(fn)=>{customBiome=fn;}};
}

test('protected old WOOD is never recategorized as blend permission',()=>{
  const v=fixture({weight:.36});
  v.legacy.set(key(15,8,2),4);
  const before=JSON.stringify(v.world.save());
  const r=inspect(v.world,rect,v.deps);
  assert.equal(r.sampled,36);
  assert.equal(r.grassCells,2);
  assert.equal(r.counts.protectedOriginalSource,1);
  assert.equal(r.counts.legitimateLowBlendNoShoulder,1);
  assert.equal(r.cells.find(c=>c.x===15).guardCategory,'unsuppressed-original-wood-or-leaves');
  assert.equal(r.cells.find(c=>c.x===15).authorizingTerrainWrites,false);
  assert.equal(JSON.stringify(v.world.save()),before);
  assert.deepEqual(inspect(v.world,rect,v.deps),r);
});

test('original low-weight blend without shared shoulder explains otherwise unblocked green',()=>{
  const v=fixture({weight:.36});
  const r=inspect(v.world,rect,v.deps);
  assert.equal(r.counts.legitimateLowBlendNoShoulder,2);
  assert.equal(r.counts.protectedOriginalSource,0);
  assert.ok(r.cells.every(c=>c.blend<.065&&c.shoulder===null));
  assert.ok(r.cells.every(c=>c.diagnosis==='original-low-blend-without-shoulder'));
  assert.equal(r.writerEnabled,false);
});

test('high-weight apparently empty plan fails closed as unexplained original source',()=>{
  const v=fixture({weight:.96});
  const r=inspect(v.world,rect,v.deps);
  assert.equal(r.counts.unexplainedEmptyPlan,2);
  assert.ok(r.cells.every(c=>c.blend>.5));
  assert.ok(r.cells.every(c=>c.diagnosis==='unexplained-empty-M7-source-column'));
});

test('shared mountain shoulder has ORIGINAL highest priority and original scree ID 401',()=>{
  const v=fixture({weight:.36});
  // Original shoulder order is east, west, south, north at distance 14.
  v.changeBiome((x,z)=>({name:x===29&&z===2?'mountain':'snow',weight:.36}));
  const r=inspect(v.world,rect,v.deps),a=r.cells.find(c=>c.x===15);
  assert.equal(a.shoulder.id,401);
  assert.equal(a.shoulder.neighbor,'mountain');
  assert.deepEqual(a.shoulder.offset,[14,0]);
  assert.equal(a.diagnosis,'unexplained-empty-M7-source-column');
  assert.equal(r.counts.legitimateLowBlendNoShoulder,1);
});

test('enchanted snow shoulder is original woodland-moss ID 405, other joins ID 258',()=>{
  for(const [name,id] of [['enchanted',405],['desert',258]]){
    const v=fixture({weight:.36});
    v.changeBiome((x,z)=>({name:x===29&&z===2?name:'snow',weight:.36}));
    const a=inspect(v.world,rect,v.deps).cells.find(c=>c.x===15);
    assert.equal(a.shoulder.id,id);
  }
});

test('weight above .50 ignores all shared shoulders (original source short-circuit)',()=>{
  const v=fixture({weight:.51});
  v.changeBiome((x,z)=>({name:x===29&&z===2?'mountain':'snow',weight:.51}));
  const r=inspect(v.world,rect,v.deps);
  assert.equal(r.cells.find(c=>c.x===15).shoulder,null);
  assert.equal(r.counts.unexplainedEmptyPlan,2);
});

test('negative original chunk coordinates do not change diagnostics',()=>{
  const v=fixture({grass:new Set(['-17,2','-16,2']),weight:.36});
  v.legacy.set(key(-17,8,2),7);
  const r=inspect(v.world,{x:-19,z:0,width:8,height:6},v.deps);
  assert.deepEqual(r.cells.map(c=>c.x),[-17,-16]);
  assert.equal(r.counts.protectedOriginalSource,1);
  assert.equal(r.counts.legitimateLowBlendNoShoulder,1);
});

test('transient cave or saved edit mutation during callback is rejected',()=>{
  for(const mutate of ['cave','edit']){
    const v=fixture({weight:.36});
    let done=false;
    v.changeBiome(()=>{
      if(!done){done=true;
        if(mutate==='cave')v.caves.set(key(15,4,2),0);
        else v.edits.set(key(15,8,2),0);
      }
      return {name:'snow',weight:.36};
    });
    assert.throws(()=>inspect(v.world,rect,v.deps),/changed during|source|no.*contract/i);
  }
});

test('unstable climate callback and invalid biome weights fail closed',()=>{
  const v=fixture({weight:.36});
  const calls=new Map();
  v.changeBiome((x,z)=>{
    const k=x+','+z,n=(calls.get(k)??0)+1;calls.set(k,n);
    return {name:'snow',weight:.35+Math.min(n,50)*.001};
  });
  assert.throws(()=>inspect(v.world,rect,v.deps),/biome source changed/);
  const bad=fixture({weight:1.5});
  assert.throws(()=>inspect(bad.world,rect,bad.deps),/not authentic snow climate/);
});

test('empty grass sample is valid but never enables writes',()=>{
  const v=fixture({grass:new Set()});
  const r=inspect(v.world,rect,v.deps);
  assert.equal(r.sampled,36);
  assert.equal(r.grassCells,0);
  assert.deepEqual(r.counts,{protectedOriginalSource:0,
    legitimateLowBlendNoShoulder:0,unexplainedEmptyPlan:0});
  assert.equal(r.writerEnabled,false);
});

test('maximum 128 physical columns stay bounded and remain non-writing',()=>{
  const grass=new Set();
  for(let z=0;z<8;z++)for(let x=-16;x<0;x++)grass.add(x+','+z);
  const v=fixture({grass,weight:.36});
  let caveReads=0;
  const old=v.world.environmentCaves.get;
  v.world.environmentCaves.get=(...args)=>{caveReads++;return old(...args);};
  const r=inspect(v.world,{x:-16,z:0,width:16,height:8},v.deps);
  assert.equal(r.sampled,128);
  assert.equal(r.grassCells,128);
  assert.equal(r.counts.legitimateLowBlendNoShoulder,128);
  assert.ok(caveReads<=128*170,'bounded original cave reads');
  assert.equal(r.writerEnabled,false);
});

test('saved edit or historical stone never receives a transition-write certificate',()=>{
  const v=fixture({weight:.36});
  v.legacy.set(key(15,8,2),3);
  v.edits.set(key(16,6,2),0);
  const before=JSON.stringify(v.world.save());
  const r=inspect(v.world,rect,v.deps);
  assert.equal(r.grassCells,1);
  assert.equal(r.counts.protectedOriginalSource,1);
  assert.equal(r.cells[0].guardCategory,'other-elevated-original');
  assert.equal(r.cells[0].authorizingTerrainWrites,false);
  assert.equal(v.world.get(15,8,2),3);
  assert.equal(v.world.get(16,6,2),0);
  assert.equal(JSON.stringify(v.world.save()),before);
});
