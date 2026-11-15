import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,VoxelWorld} from '../src/voxel.mjs';
import {orientedParts,rotateCellOffset} from '../src/block-packs/pack-5/fixture.mjs';
import {PACK5_BUILDER_CATALOG,PACK5_BUILDER_FAMILIES,resolvePack5BuilderAsset} from '../src/pack5-integration/catalog.mjs';
import {createPack5ConstructionLayer,PACK5_BUILDER_SIDECAR} from '../src/pack5-integration/construction-layer.mjs';

const key=cell=>cell.join(',');
function world(seed=179){
  const cells=new Map();
  return {seed,cells,get(x,y,z){return cells.get(key([x,y,z]))??BLOCK.AIR;},
    solid(cell,enabled=true){if(enabled)cells.set(key(cell),BLOCK.STONE);else cells.delete(key(cell));}};
}
function support(w,id,anchor,rotation=0){
  const {descriptor}=resolvePack5BuilderAsset(id);
  if(descriptor.attachment==='floor')
    for(const p of orientedParts(descriptor,rotation)){
      const c=p.cell.map((v,i)=>v+anchor[i]);w.solid([c[0],c[1]-1,c[2]]);
    }
  if(descriptor.attachment==='ceiling')w.solid([anchor[0],anchor[1]+1,anchor[2]]);
  if(descriptor.attachment==='wall'){
    const side=rotateCellOffset([0,0,-1],rotation);
    w.solid(anchor.map((v,i)=>v+side[i]));
  }
}
const families=PACK5_BUILDER_CATALOG;

test('registry exposes 18 exactly-once symbolic physical families and 36 unique variants',()=>{
  assert.equal(families.length,18);
  assert.equal(PACK5_BUILDER_FAMILIES.length,18);
  for(let i=0;i<18;i++){
    const f=families[i],id='pack5:'+String(79+i).padStart(3,'0');
    assert.equal(f.symbolicId,id);
    assert.equal(f.variants.length,2);
    assert.equal(new Set(f.variants).size,2);
    for(const v of f.variants)assert.equal(resolvePack5BuilderAsset(id,v).descriptor.symbolicId,id);
  }
  assert.throws(()=>resolvePack5BuilderAsset('pack5:078'));
  assert.throws(()=>resolvePack5BuilderAsset('pack5:095','invented'));
});
test('all 36 authentic variant meshes survive all four 90-degree rotations',()=>{
  for(const f of families)for(const variant of f.variants)for(let rot=0;rot<4;rot++){
    const {descriptor,mesh}=resolvePack5BuilderAsset(f.symbolicId,variant);
    const m=mesh(descriptor,{rotation:rot});
    assert.ok(m.vertexCount>0&&m.vertexCount<=6144, f.symbolicId);
    assert.equal(m.positions.length,m.vertexCount*3);
    assert.equal(m.colors.length,m.vertexCount*4);
    assert.equal(m.indices.length%3,0);
    assert.ok(Array.from(m.indices).every(i=>i<m.vertexCount));
    assert.ok(Array.from(m.positions).every(Number.isFinite));
  }
});
test('all 18 real physical families can coexist with world-verified supports',()=>{
  const w=world(),layer=createPack5ConstructionLayer(w);
  for(let i=0;i<families.length;i++){
    const f=families[i],anchor=[i*7,4,0],rotation=i%4;
    support(w,f.symbolicId,anchor,rotation);
    const placed=layer.place(f.symbolicId,anchor,rotation,f.variants[1]);
    assert.equal(placed.ok,true,f.symbolicId+': '+placed.reason);
    for(const cell of placed.cells){
      assert.equal(layer.cell(cell).symbolicId,f.symbolicId);
      assert.equal(layer.cell(cell).variant,f.variants[1]);
    }
    const m=layer.meshAt(anchor);
    assert.ok(m.vertexCount>0&&m.triangles>0);
    assert.equal(m.symbolicId,f.symbolicId);
    assert.ok(Math.min(...m.positions.filter((_,j)=>j%3===0))>=anchor[0]-2);
  }
  assert.equal(layer.count(),18);
  assert.equal(layer.list().length,18);
  assert.equal(layer.snapshot().entries.length,18);
});
test('sidecar restores placements independently without changing the seeded base world',()=>{
  const w=world(123),a=createPack5ConstructionLayer(w);
  support(w,'pack5:082',[0,4,0],1);
  assert.equal(a.place('pack5:082',[0,4,0],1,'moonwatch-canopy').ok,true);
  const before=[...w.cells];
  const data=JSON.parse(JSON.stringify(a.snapshot()));
  assert.equal(data.format,PACK5_BUILDER_SIDECAR);
  assert.equal(data.schema,undefined);
  const b=createPack5ConstructionLayer(w);
  assert.equal(b.restore(data),true);
  assert.deepEqual(b.snapshot(),data);
  assert.deepEqual([...w.cells],before);
  assert.equal(b.count(),1);
});
test('invalid snapshot and duplicate occupancy never partially alter a valid layer',()=>{
  const w=world(99),layer=createPack5ConstructionLayer(w);
  assert.equal(layer.place('pack5:080',[0,4,0]).ok,true);
  const previous=layer.snapshot();
  for(const incoming of [
    {format:PACK5_BUILDER_SIDECAR,seed:99,entries:[[0,4,0,'pack5:080',0,'hearth-running-bond'],[0,4,0,'pack5:083',0,'hearthside-highback']]},
    {...previous,seed:100},
    {...previous,schema:1},
    {...previous,entries:[...previous.entries,[9,4,0,'pack5:999',0]]},
    {schema:1,seed:99,edits:[]}
  ]){
    assert.throws(()=>layer.restore(incoming));
    assert.deepEqual(layer.snapshot(),previous);
  }
});
test('world solids block placement and legacy occlusion prevents through-wall picking',()=>{
  const w=world(),layer=createPack5ConstructionLayer(w);
  w.solid([0,4,0]);
  assert.equal(layer.place('pack5:080',[0,4,0]).ok,false);
  w.solid([0,4,0],false);
  assert.equal(layer.place('pack5:080',[0,4,0]).ok,true);
  const unblocked=layer.raycast([.5,4.5,3],[0,0,-2],6);
  assert.ok(unblocked&&unblocked.symbolicId==='pack5:080');
  w.solid([0,4,1]);
  assert.equal(layer.raycast([.5,4.5,3],[0,0,-1],6),null);
  assert.equal(layer.removeRay([.5,4.5,3],[0,0,-1],6),false);
  assert.equal(layer.count(),1);
});
test('builder world reach is normalized and out-of-range rays never remove assets',()=>{
  const layer=createPack5ConstructionLayer(world());
  assert.equal(layer.place('pack5:080',[0,4,0]).ok,true);
  const hit=layer.raycast([.5,4.5,3],[0,0,-300],6);
  assert.ok(hit&&hit.distance>=2&&hit.distance<=3);
  assert.equal(layer.removeRay([.5,4.5,3],[0,0,-300],1),false);
  assert.equal(layer.removeRay([.5,4.5,3],[0,0,-300],6),true);
});
test('player-sized collider and legacy solid collider are respected',()=>{
  const w=world(),layer=createPack5ConstructionLayer(w);
  const denied=layer.place('pack5:080',[0,4,0],0,null,{playerBox:[0,4,0,1,6,1]});
  assert.equal(denied.ok,false);
  assert.equal(layer.count(),0);
  assert.equal(layer.place('pack5:080',[0,4,0]).ok,true);
  assert.equal(layer.collidesPack5([.45,4.4,.45,.55,4.6,.55]),true);
  assert.equal(layer.collides([.45,4.4,.45,.55,4.6,.55]),true);
  w.solid([3,4,0]);
  assert.equal(layer.collides([3.1,4.1,.1,3.2,4.2,.2]),true);
  assert.equal(layer.collides([6,4,0,6.2,4.2,.2]),false);
});
test('real schema-1 VoxelWorld is never mutated by builder placement or sidecar',()=>{
  const w=new VoxelWorld(179),layer=createPack5ConstructionLayer(w);
  const before=JSON.stringify(w.save());
  const target=[0,19,0];
  assert.equal(w.get(...target),BLOCK.AIR);
  assert.equal(layer.place('pack5:080',target).ok,true);
  assert.equal(layer.count(),1);
  assert.equal(w.get(...target),BLOCK.AIR);
  assert.equal(JSON.stringify(w.save()),before);
  assert.equal(VoxelWorld.restore(JSON.parse(before)).save().schema,1);
  assert.throws(()=>VoxelWorld.restore(layer.snapshot()));
});
test('no persistent IDs or global game settings changed by importing this bridge',()=>{
  assert.equal(BLOCK.AIR,0);
  assert.equal(BLOCK.DEEPSTONE,8);
  assert.equal(families.some(f=>Object.hasOwn(f,'numericId')),false);
  assert.equal(createPack5ConstructionLayer(world()).count(),0);
  assert.throws(()=>createPack5ConstructionLayer({seed:0}));
});
