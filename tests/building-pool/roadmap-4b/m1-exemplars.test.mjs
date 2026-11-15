import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_EXEMPLARS,M1_REPORT,getM1Exemplar} from '../../src/building-pool/roadmap-4b/m1-exemplars.mjs';
import {validateBlueprint,validateCollection,geometrySignature,PLANNED_TOTAL,PROGRAM}
 from '../../src/building-pool/roadmap-4b/schema.mjs';

const at=x=>x.join(',');
const count=(b,r)=>b.cells.filter(c=>c.role===r).length;
const cells=b=>new Map(b.cells.map(c=>[at(c.at),c]));
test('exactly five independently authored M1 buildings, one per owned category',()=>{
  assert.equal(M1_EXEMPLARS.length,5);
  assert.equal(M1_REPORT.authored,5);
  assert.equal(M1_REPORT.original,5);
  assert.equal(M1_REPORT.inherited,0);
  assert.equal(M1_REPORT.remaining,280);
  assert.equal(M1_REPORT.creatorApproved,0);
  assert.equal(M1_REPORT.integrated,0);
  assert.equal(M1_REPORT.productionRegistered,false);
  assert.equal(PLANNED_TOTAL,285);
  assert.deepEqual(new Set(M1_EXEMPLARS.map(x=>x.type)),new Set(PROGRAM.map(x=>x.type)));
  assert.deepEqual(new Set(M1_EXEMPLARS.map(x=>x.biome)),
    new Set(['temperate','snow','desert','enchanted-forest','mountain']));
  assert.equal(new Set(M1_EXEMPLARS.map(x=>x.id)).size,5);
  assert.equal(M1_REPORT.distinctShapeFingerprints,5);
  assert.deepEqual(validateCollection(M1_EXEMPLARS),{authored:5,remaining:280,creatorApproved:0,integrated:0});
});
for(const b of M1_EXEMPLARS){
  test(b.id+': committed physically addressable coordinates, shell and full roof',()=>{
    const report=validateBlueprint(b),index=cells(b);
    assert.equal(report.theoreticalOnly,true);
    assert.equal(report.physicalCells,b.cells.length);
    assert.ok(report.physicalCells>300,'not a symbolic bounding box');
    assert.ok(count(b,'foundation')>60);
    assert.equal(count(b,'foundation'),count(b,'floor'));
    assert.ok(count(b,'roof')>count(b,'wall')/4);
    assert.ok(count(b,'beam')>=4);
    assert.ok(count(b,'window')>=4);
    assert.ok(count(b,'fixture')>=2);
    const roof6=b.cells.filter(c=>c.role==='roof'&&c.at[1]===6);
    for(const floor of b.cells.filter(c=>c.role==='floor'))
      assert.ok(index.get(at([floor.at[0],6,floor.at[2]]))?.role==='roof',
        'missing weather-plane roof directly above '+at(floor.at));
    assert.equal(roof6.length,count(b,'floor'));
    assert.ok(b.cells.some(c=>c.role==='roof'&&c.at[1]===7),'no authored raised ridge');
    const ids=b.cells.map(c=>at(c.at));
    assert.equal(new Set(ids).size,ids.length);
    assert.ok(getM1Exemplar(b.id)===b);
  });
  test(b.id+': accessible rooms, headroom and hollow door openings',()=>{
    const index=cells(b),nav=new Set(b.navigation.map(n=>at(n.at)));
    assert.ok(b.spaces.length>=3);
    for(const room of b.spaces){
      assert.ok(room.footprint.length>=3);
      assert.ok(nav.has(at(room.access)));
      for(const p of room.footprint){
        assert.ok(index.has(at([p[0],room.level-1,p[1]])), 'missing room floor');
        assert.equal(index.has(at([p[0],room.level,p[1]])),false,'room foot blocked');
        assert.equal(index.has(at([p[0],room.level+1,p[1]])),false,'room head blocked');
      }
    }
    for(const door of b.openings.filter(o=>o.kind!=='window')){
      assert.ok(nav.has(at(door.at)));
      assert.ok(!index.has(at(door.at))&&!index.has(at([door.at[0],door.at[1]+1,door.at[2]])));
    }
    assert.ok(b.openings.filter(o=>o.kind==='window').length>=6);
  });
  test(b.id+': unresolved source-symbolic furniture and glazing are honest',()=>{
    assert.ok(b.dependencies.length>=2);
    for(const d of b.dependencies){
      assert.match(d.ref,/^pack[1-5]:\d{3}$/);
      assert.equal(d.source,'manual-five-pack');
      assert.equal(d.status,'catalog-provisional');
      assert.equal(d.shape,'unknown');
      assert.equal(d.orientation,'unknown');
      assert.ok(d.unresolved.some(x=>/collision|footprint/i.test(x)));
      assert.ok(!Object.hasOwn(d,'numericId'));
    }
    for(const f of b.features){
      assert.equal(f.active,false);
      assert.ok(b.cells.some(c=>at(c.at)===at(f.at)&&c.role==='fixture'));
    }
    assert.ok(b.openings.filter(o=>o.kind!=='window').every(o=>o.plannedClosure==='pack2:020'));
    assert.equal(b.worldPlaced,false);
    assert.equal(b.creatorApproved,false);
    assert.equal(b.integrated,false);
  });
}
test('not cloned by rotation, translation, reflection, recoloring, or label swaps',()=>{
  const signatures=M1_EXEMPLARS.map(geometrySignature);
  assert.equal(new Set(signatures).size,5);
  const b=structuredClone(M1_EXEMPLARS[0]);
  b.variant=2;b.id=b.id.replace(':01',':02');
  b.cells.forEach(c=>{if(c.asset==='live:wood')c.asset='live:stone';});
  assert.equal(geometrySignature(b),signatures[0]);
  assert.throws(()=>validateCollection([M1_EXEMPLARS[0],b]),/duplicate architecture/);
});
test('academy has an honestly open uncovered courtyard inside connected wings',()=>{
  const a=M1_EXEMPLARS.find(x=>x.type==='arcane-academy'),index=cells(a);
  for(let x=11;x<=16;x++)for(let z=9;z<=17;z++)
    assert.ok(!index.has(at([x,6,z])),'court accidentally weather-roofed');
  assert.ok(a.spaces.some(s=>s.kind==='lecture-hall'));
  assert.ok(a.spaces.some(s=>s.kind==='study-chamber'));
});
test('research secure repository is architectural, not active spell simulation',()=>{
 const b=M1_EXEMPLARS.find(x=>x.type==='magical-research-institute');
 assert.ok(b.spaces.some(x=>x.kind==='secure-repository'));
 assert.equal(b.features.every(x=>x.active===false),true);
 assert.equal(b.provenance.liveIntegration,false);
});
