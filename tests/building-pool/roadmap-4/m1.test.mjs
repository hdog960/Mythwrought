import test from 'node:test';
import assert from 'node:assert/strict';
import {allM1,buildM1,auditM1} from '../../../src/building-pool/roadmap-4/m1-blueprints.mjs';
import {BIOMES,SIZES,validateBlueprint,serializeBlueprint,geometrySignature,validateCollection} from '../../../src/building-pool/roadmap-4/schema.mjs';

const TYPES=['civic-hall','castle-palace'];

test('M1 contains all 30 requested exact biome/size/type combinations and no extra variants',()=>{
  const items=allM1();
  assert.equal(items.length,30);
  assert.equal(new Set(items.map(i=>i.id)).size,30);
  const expected=TYPES.flatMap(t=>BIOMES.flatMap(b=>SIZES.map(s=>'r4:'+t+':'+b+':'+s+':01')));
  assert.deepEqual(items.map(i=>i.id),expected);
  assert.deepEqual(auditM1(),{verified:30,expected:600,complete:false});
});

test('all 30 physical coordinate-authored cell volumes have protected entrance, complete story floors, real rooms and reachable route network',()=>{
  const items=allM1();
  let total=0,routeTotal=0;
  for(const b of items){
    const result=validateBlueprint(b);
    assert.equal(result.theoreticalOnly,true);
    assert.ok(result.occupiedCells>=300,b.id);
    assert.ok(result.walkableCells>=30,b.id);
    assert.ok(result.rooms >= (b.type==='castle-palace'?3:2),b.id);
    assert.equal(result.levels,b.type==='castle-palace'?(b.size==='large'?2:2):b.size==='small'?1:2,b.id);
    assert.equal(result.unresolvedAssets,b.dependencies.length);
    assert.equal(b.openings.filter(o=>o.kind==='entrance').length,1,b.id);
    assert.ok(b.cells.some(c=>c.role==='roof'),b.id);
    assert.ok(b.cells.some(c=>c.role==='wall'),b.id);
    assert.ok(b.cells.some(c=>c.role==='partition'),b.id);
    if(b.type==='castle-palace'||b.size!=='small'){
      assert.ok(b.cells.some(c=>c.role==='stair'),b.id);
      assert.ok(b.navigation.some(n=>n.mode==='stair'),b.id);
    }
    total+=b.cells.length;routeTotal+=b.navigation.length;
  }
  assert.ok(total>100000);assert.ok(routeTotal>30000);
});

test('authored volumes have 30 original geometry fingerprints, not material swaps or mirrored shell copies',()=>{
  const all=allM1();
  assert.equal(new Set(all.map(geometrySignature)).size,30);
  assert.equal(validateCollection(all).verified,30);
});

test('all 30 designs produce deterministic bit-for-bit canonical serialization',()=>{
  for(const b of allM1()){
    const retry=buildM1(b.type,b.biome,b.size);
    assert.equal(serializeBlueprint(retry),serializeBlueprint(b),b.id);
  }
});

test('no numeric future IDs or game saves, no asset aliasing, every future material dependency unresolved and referenced',()=>{
  for(const b of allM1()){
    assert.equal('worldEdits' in b,false);assert.equal('savedPlayer' in b,false);
    const assets=new Set(b.cells.map(c=>c.asset));
    for(const d of b.dependencies){
      assert.ok(assets.has(d.ref),b.id+': orphan '+d.ref);
      assert.ok(d.ref.startsWith('pack')||d.ref.startsWith('biome130:'),b.id);
      assert.equal('numericId' in d,false);
      assert.ok(d.unresolved.length>0);
    }
    assert.ok(b.dependencies.some(d=>d.ref==='pack1:008')||b.size==='small'&&b.type==='civic-hall');
    assert.ok(assets.has('pack3:023'),b.id);
    if(b.type==='castle-palace')assert.ok(b.dependencies.length>=3);
  }
});

test('biome-specific structure profiles differ at all size classes even ignoring palettes',()=>{
  for(const t of TYPES)for(const s of SIZES){
    const signatures=BIOMES.map(b=>geometrySignature(buildM1(t,b,s)));
    assert.equal(new Set(signatures).size,5,t+':'+s);
  }
});

test('interior room floorplans are separate, nontrivial and are not exterior-only shells',()=>{
  for(const b of allM1()){
    const roomAreas=b.spaces.map(s=>s.footprint.length);
    assert.ok(roomAreas.every(x=>x>=2),b.id);
    assert.ok(b.spaces.some(s=>s.footprint.length>=8),b.id);
    const occupancy=new Set(b.cells.map(c=>c.at.join(',')));
    for(const room of b.spaces)for(const [x,z] of room.footprint){
      assert.equal(occupancy.has([x,room.level,z].join(',')),false,b.id);
      assert.equal(occupancy.has([x,room.level+1,z].join(',')),false,b.id);
      assert.equal(occupancy.has([x,room.level-1,z].join(',')),true,b.id);
    }
  }
});
