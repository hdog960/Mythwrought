import assert from 'node:assert/strict';
import test from 'node:test';
import {previewSnowS4PhysicalEdge as preview} from '../src/manual-biomes/snowy-s4-physical-edge-preview.mjs';
const M7='mythwrought-five-surface-regions-v7';
const key=(x,y,z)=>x+','+y+','+z;
function fixture(cx=15,cz=2){
  const edits=new Map(),caves=new Map(),blocks=new Map(),legacy=new Map();
  const makePlan=(x,z)=>{
    if(x===cx&&z===cz)return new Map();
    if(x===cx+1&&z===cz||x===cx-1&&z===cz||x===cx&&z===cz+1||x===cx&&z===cz-1)
      return new Map([[5,278],[6,272]]);
    return new Map();
  };
  let plan=makePlan;
  const get=(x,y,z)=>edits.get(key(x,y,z))??caves.get(key(x,y,z))??
    blocks.get(key(x,y,z))??(y===6?(plan(x,z).size?272:1):y===5?2:y<5?3:0);
  const readOld=(x,y,z)=>legacy.get(key(x,y,z))??(y===6?1:y===5?2:y<5?3:0);
  const world={seed:179,generationProfile:{generator:M7},edits,
    environmentCaves:{get:(...a)=>caves.get(key(...a))},
    _columnPlan:(x,z)=>plan(x,z),_environmentBaseline:get,get,
    save:()=>({schema:1,seed:179,edits:[...edits]})};
  let biome=(x,z)=>({name:'snow',weight:(x===cx&&z===cz)?.36:.97});
  const deps={biomeAt:(...args)=>biome(...args),terrainHeight:()=>6,
    legacyNatural:readOld};
  const row={x:cx,z:cz,old:6,shoulder:null,
    diagnosis:'original-low-blend-without-shoulder',authorizingTerrainWrites:false};
  const transition={kind:'detached-S4-original-M7-transition-hold-review',
    writerEnabled:false,sampled:16,cells:[row]};
  return {world,transition,deps,caves,edits,blocks,legacy,baselinePlan:makePlan,
    changePlan:fn=>{plan=fn},changeBiome:fn=>{biome=fn}};
}
test('source-only four-neighbor physically authored snow yields one research site, no writes',()=>{
  const v=fixture(),before=JSON.stringify(v.world.save());
  const p=preview(v.world,v.transition,v.deps);
  assert.equal(p.examined,1);
  assert.equal(p.proposed.length,1);
  assert.equal(p.rejected.length,0);
  assert.equal(p.sourceFootprintColumns,5);
  assert.equal(p.proposed[0].proposedCapReference,272);
  assert.equal(p.writerEnabled,false);
  assert.equal(p.proposed[0].authorizingTerrainWrites,false);
  assert.equal(v.world.get(15,6,2),1);
  assert.equal(JSON.stringify(v.world.save()),before);
  assert.deepEqual(preview(v.world,v.transition,v.deps),p);
});
test('original wood and leaves inside center are inviolate even if suppressed baseline',()=>{
  for(const id of [4,7]){
    const v=fixture();
    v.legacy.set(key(15,8,2),id);
    const p=preview(v.world,v.transition,v.deps);
    assert.equal(p.proposed.length,0);
    assert.equal(p.rejected[0].reason,'protected-original-center');
  }
});
test('original cave AIR, schema-1 edit or unsupported original center veto',()=>{
  for(const type of ['cave','edit','unsupported']){
    const v=fixture();
    if(type==='cave')v.caves.set(key(15,4,2),0);
    if(type==='edit')v.edits.set(key(15,6,2),0);
    if(type==='unsupported')v.blocks.set(key(15,5,2),0);
    const p=preview(v.world,v.transition,v.deps);
    assert.equal(p.proposed.length,0,type);
    assert.ok(['protected-original-center','modified-or-unsupported-original-center'].includes(p.rejected[0].reason),type);
  }
});
test('adjacent old tree above original snow is a no-repaint conservation veto',()=>{
  const v=fixture();v.legacy.set(key(16,9,2),7);
  const p=preview(v.world,v.transition,v.deps);
  assert.equal(p.proposed.length,0);
  assert.equal(p.rejected[0].reason,'historical-overhead-neighbor');
});
test('snow edge touching different biome cannot receive a future physical proposal',()=>{
  const v=fixture();v.changeBiome((x,z)=>({name:x===16&&z===2?'plains':'snow',weight:.36}));
  const p=preview(v.world,v.transition,v.deps);
  assert.equal(p.proposed.length,0);
  assert.equal(p.rejected[0].reason,'other-biome-neighbor');
});
test('any non-authored snow surface prevents a false isolated grass repair',()=>{
  const v=fixture(),original=v.baselinePlan;
  v.changePlan((x,z)=>x===16&&z===2?new Map():original(x,z));
  const p=preview(v.world,v.transition,v.deps);
  assert.equal(p.proposed.length,0);
  assert.equal(p.rejected[0].reason,'not-fully-authored-snow-neighbor');
});
test('steep 2-block snow lip is rejected before any bridge/physics assumption',()=>{
  const v=fixture(),original=v.baselinePlan;
  v.changePlan((x,z)=>x===16&&z===2?new Map([[5,278],[8,272]]):original(x,z));
  v.blocks.set(key(16,8,2),272);
  const p=preview(v.world,v.transition,v.deps);
  assert.equal(p.proposed.length,0);
  assert.equal(p.rejected[0].reason,'steep-natural-edge');
});
test('neighbor edited support or cave override remains protected',()=>{
  for(const source of ['edit','cave']){
    const v=fixture();
    if(source==='edit')v.edits.set(key(16,5,2),0);
    else v.caves.set(key(16,6,2),0);
    const p=preview(v.world,v.transition,v.deps);
    assert.equal(p.proposed.length,0);
    assert.ok(['protected-or-unsupported-neighbor','not-fully-authored-snow-neighbor'].includes(p.rejected[0].reason));
  }
});
test('source cave mutation during climate callback fails closed',()=>{
  const v=fixture();let changed=false;
  v.changeBiome((x,z)=>{
    if(!changed){changed=true;v.caves.set(key(15,4,2),0)}
    return {name:'snow',weight:x===15&&z===2?.36:.97};
  });
  assert.throws(()=>preview(v.world,v.transition,v.deps),/source or schema-1 save changed/);
});
test('forged transition proof, missing callback, profile mismatch and repeated site are denied',()=>{
  const v=fixture();
  assert.throws(()=>preview({...v.world,generationProfile:{generator:'legacy'}},v.transition,v.deps),/exact original/);
  assert.throws(()=>preview(v.world,{...v.transition,writerEnabled:true},v.deps),/exact original/);
  assert.throws(()=>preview(v.world,v.transition,{...v.deps,legacyNatural:null}),/exact original/);
  assert.throws(()=>preview(v.world,{...v.transition,cells:[v.transition.cells[0],v.transition.cells[0]]},v.deps),/forged or repeated/);
});
test('bounded negative-x physical edge uses correct absolute neighboring columns',()=>{
  const v=fixture(-16,-16);
  const p=preview(v.world,v.transition,v.deps);
  assert.equal(p.proposed.length,1);
  assert.equal(p.proposed[0].x,-16);
  assert.equal(p.sourceFootprintColumns,5);
});
test('128 requested cells cannot accidentally authorize bulk snow conversion',()=>{
  const v=fixture();
  const cells=[];
  for(let z=0;z<8;z++)for(let x=0;x<16;x++)cells.push({...v.transition.cells[0],x,z});
  const p=preview(v.world,{...v.transition,cells,sampled:128},v.deps);
  assert.equal(p.examined,128);
  assert.equal(p.proposed.length,1);
  assert.equal(p.rejected.length,127);
  assert.ok(p.sourceFootprintColumns<=176);
  assert.equal(p.writerEnabled,false);
});
