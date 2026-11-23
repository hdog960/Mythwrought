import assert from 'node:assert/strict';
import test from 'node:test';
import {auditSnowS4GrassSourceAttribution as audit}
  from '../src/manual-biomes/snowy-s4-grass-source-attribution.mjs';
const M7='mythwrought-five-surface-regions-v7';
const key=(x,y,z)=>x+','+y+','+z;
const rect={x:13,z:0,width:6,height:6};
function make(grass=new Set(['15,2','16,2','15,3','16,3'])){
  const edits=new Map(),caves=new Map(),baseline=new Map(),original=new Map();
  const natural=(x,y,z)=>original.get(key(x,y,z))??
    (y===6?1:y===5?2:y<=4?3:0);
  const ground=(x,y,z)=>baseline.get(key(x,y,z))??natural(x,y,z);
  const world={seed:179,edits,generationProfile:{generator:M7},
    _columnPlan:(x,z)=>grass.has(x+','+z)?new Map():new Map([[5,278],[6,272]]),
    _environmentBaseline:(x,y,z)=>caves.get(key(x,y,z))??ground(x,y,z),
    environmentCaves:{get:(...p)=>caves.get(key(...p))},
    get:(x,y,z)=>edits.get(key(x,y,z))??caves.get(key(x,y,z))??
      (grass.has(x+','+z)?ground(x,y,z):(y===6?272:y===5?278:y<5?3:0)),
    save:()=>({schema:1,seed:179,edits:[...edits]})};
  const deps={biomeAt:()=>({name:'snow',weight:.96}),
    terrainHeight:()=>6,legacyNatural:natural};
  return {world,deps,edits,caves,baseline,original};
}

test('exact original guard first veto: untouched WOOD above old top is preserved',()=>{
  const v=make();
  v.original.set(key(15,8,2),4);
  const a=audit(v.world,rect,v.deps),row=a.rows.find(r=>r.x===15&&r.z===2);
  assert.equal(a.grassCells,4);
  assert.equal(row.cause,'unsuppressed-original-wood-or-leaves');
  assert.deepEqual(row.firstVeto,{y:8,baseline:4,legacy:4,caveOverride:null,
    category:'unsuppressed-original-wood-or-leaves'});
  assert.equal(a.summary.guardVeto,1);
  assert.equal(a.summary.noGuardVeto,3);
  assert.equal(v.world.get(15,8,2),4);
  assert.equal(a.originalSourcesUnchanged,true);
  assert.deepEqual(a,audit(v.world,rect,v.deps));
});

test('suppressed legacy grove leaves no original guard veto; does NOT imply repair authorization',()=>{
  const v=make();
  v.original.set(key(15,9,2),5);
  v.baseline.set(key(15,9,2),0);
  const a=audit(v.world,rect,v.deps),row=a.rows.find(r=>r.x===15&&r.z===2);
  assert.equal(row.firstVeto,null);
  assert.equal(row.maskedLegacyWoodOrLeaves,1);
  assert.equal(row.cause,'no-original-preservation-guard-veto-observed');
  assert.equal(a.summary.maskedLegacyWoodOrLeaves,1);
  assert.match(row.disposition,/no-terrain-changes/);
});

test('original landmark/rock above old surface is a separate veto from grove',()=>{
  const v=make();
  v.original.set(key(16,7,3),3);
  const a=audit(v.world,rect,v.deps),row=a.rows.find(r=>r.x===16&&r.z===3);
  assert.equal(row.firstVeto.y,7);
  assert.equal(row.cause,'other-elevated-original');
  assert.equal(a.summary.otherElevatedOriginal,1);
});

test('cave AIR under original top is a protected subsurface guard veto',()=>{
  const v=make();
  v.caves.set(key(16,4,2),0);
  const a=audit(v.world,rect,v.deps),row=a.rows.find(r=>r.x===16&&r.z===2);
  assert.equal(row.cause,'invalid-original-subsurface');
  assert.equal(row.firstVeto.y,4);
  assert.equal(row.firstVeto.caveOverride,0);
  assert.equal(row.caveOverrides,1);
  assert.equal(v.caves.get(key(16,4,2)),0);
});

test('edited top excluded by topology and preserved; other originals still classified',()=>{
  const v=make();
  v.edits.set(key(15,6,2),0);
  v.original.set(key(16,8,2),5);
  const before=JSON.stringify(v.world.save());
  const a=audit(v.world,rect,v.deps);
  assert.equal(a.grassCells,3);
  assert.equal(a.rows.find(r=>r.x===15&&r.z===2),undefined);
  assert.equal(a.summary.unsuppressedWoodOrLeaves,1);
  assert.equal(JSON.stringify(v.world.save()),before);
});

test('negative original chunk coordinates are retained and stable',()=>{
  const v=make(new Set(['-17,2','-16,2']));
  v.original.set(key(-17,8,2),5);
  const a=audit(v.world,{x:-19,z:0,width:8,height:6},v.deps);
  assert.equal(a.grassCells,2);
  assert.deepEqual(a.rows.map(r=>[r.x,r.z]),[[-17,2],[-16,2]]);
  assert.equal(a.summary.unsuppressedWoodOrLeaves,1);
});

test('mismatched or mutated source guards fail closed',()=>{
  const v=make();
  assert.throws(()=>audit({...v.world,_environmentBaseline:null},rect,v.deps),/original M7/);
  assert.throws(()=>audit(v.world,rect,{...v.deps,legacyNatural:null}),/original M7/);
  const original=v.deps.legacyNatural;
  let calls=0;
  assert.throws(()=>audit(v.world,rect,{...v.deps,legacyNatural:(x,y,z)=>{
    if(++calls===15)v.caves.set(key(18,9,4),0);
    return original(x,y,z);
  }}),/sampled cave source changed/);
});

test('source changes after first candidate classification are detected by readback',()=>{
  const v=make(),original=v.deps.legacyNatural;
  let changed=false,calls=0;
  assert.throws(()=>audit(v.world,rect,{...v.deps,legacyNatural:(x,y,z)=>{
    if(++calls===55&&!changed){
      v.original.set(key(15,8,2),4);changed=true;
    }
    return original(x,y,z);
  }}),/baseline or legacy source changed/);
});

test('full 128-column envelope stays bounded and reports open clipped component',()=>{
  const grass=new Set();
  for(let x=0;x<16;x++)for(let z=0;z<8;z++)grass.add(x+','+z);
  const v=make(grass);
  const original=v.world._environmentBaseline;
  let samples=0;
  v.world._environmentBaseline=(...args)=>{samples++;return original(...args);};
  const r=audit(v.world,{x:0,z:0,width:16,height:8},v.deps);
  assert.equal(r.sampled,128);
  assert.equal(r.grassCells,128);
  assert.equal(r.components,1);
  assert.equal(r.summary.noGuardVeto,128);
  assert.ok(samples<=128*20*2,`bounded baseline work, found ${samples}`);
  assert.equal(r.rows.length,128);
});

test('zero grass in a bounded authored-snow area is valid read-only evidence',()=>{
  const v=make(new Set());
  const r=audit(v.world,rect,v.deps);
  assert.equal(r.grassCells,0);
  assert.equal(r.rows.length,0);
  assert.equal(r.summary.guardVeto,0);
  assert.equal(r.originalSourcesUnchanged,true);
});

test('invalid original material ID is rejected rather than attributed',()=>{
  const v=make();
  v.baseline.set(key(15,8,2),999999);
  assert.throws(()=>audit(v.world,rect,v.deps),/Invalid original M7 baseline/);
});
