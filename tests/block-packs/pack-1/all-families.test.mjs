// MYTHWROUGHT Pack 1 — Milestone 6, real-Node-ready all-family acceptance audit.
// Owns only the manual Pack 1 catalog. Does NOT import unmerged :00/:12
// prototype modules or make any shared engine/world/CI modifications.
import test from 'node:test';
import assert from 'node:assert/strict';
import {MASONRY_IDS,CORE_MASONRY,masonryTexture} from '../../../src/block-packs/pack-1/core-masonry.mjs';
import {STONE_SHAPE_IDS,STONE_SHAPES,stoneShapeDescriptor,stoneShapeTexture} from '../../../src/block-packs/pack-1/stone-shapes.mjs';
import {GARDEN_IDS,GARDEN_COMPONENTS,gardenDescriptor,gardenTexture} from '../../../src/block-packs/pack-1/garden-components.mjs';
import {FOLIAGE_IDS,FOLIAGE_ASSETS,foliageDescriptor,foliageTexture} from '../../../src/block-packs/pack-1/physical-foliage.mjs';
import {FLORAL_IDS,FLORAL_CANDIDATES,floralDescriptor,floralTexture} from '../../../src/block-packs/pack-1/floral-forms.mjs';
import {createMasonryFixture,restoreMasonryFixture} from '../../../src/block-packs/pack-1/fixture.mjs';
import {createStoneShapeFixture,restoreStoneShapeFixture} from '../../../src/block-packs/pack-1/stone-shape-fixture.mjs';
import {createGardenFixture,restoreGardenFixture} from '../../../src/block-packs/pack-1/garden-fixture.mjs';
import {createFoliageFixture,restoreFoliageFixture} from '../../../src/block-packs/pack-1/foliage-fixture.mjs';
import {createFloralFixture,restoreFloralFixture} from '../../../src/block-packs/pack-1/floral-fixture.mjs';

const collections=[CORE_MASONRY,STONE_SHAPES,GARDEN_COMPONENTS,FOLIAGE_ASSETS,FLORAL_CANDIDATES];
const ids=[...Object.values(MASONRY_IDS),...Object.values(STONE_SHAPE_IDS),
  ...Object.values(GARDEN_IDS),...Object.values(FOLIAGE_IDS),...Object.values(FLORAL_IDS)];
const definitions=collections.flat();
const descriptor=(id,rotation=0)=>{
  if(id<=14)return CORE_MASONRY.find(x=>x.id===id).shape;
  if(id<=20)return stoneShapeDescriptor(id,{rotation});
  if(id<=23)return gardenDescriptor(id,{rotation});
  if(id<=31)return foliageDescriptor(id,{rotation});
  return floralDescriptor(id,{rotation});
};
const texture=(id)=>{
  if(id<=14)return masonryTexture(id,'north',24);
  if(id<=20)return stoneShapeTexture(id,'north',24);
  if(id<=23)return gardenTexture(id,'north',24);
  if(id<=31)return foliageTexture(id,'north',24,'leaf');
  const role=id<=35?'petal':'cap';
  return floralTexture(id,role,'north',24);
};
function validateBoxes(boxes){
  assert.ok(Array.isArray(boxes)&&boxes.length>0&&boxes.length<=32);
  for(const b of boxes){
    assert.ok(Array.isArray(b)&&b.length===6);
    for(let k=0;k<3;k++)
      assert.ok(Number.isFinite(b[k])&&Number.isFinite(b[k+3])&&
        b[k]>=0&&b[k]<b[k+3]&&b[k+3]<=1,'invalid physical occupancy box '+b);
  }
}

test('21 assigned roster families and 30 stable reserved persistent candidate IDs',()=>{
  assert.equal(definitions.length,30);
  assert.equal(ids.length,30);
  assert.equal(new Set(ids).size,30);
  assert.deepEqual([...ids].sort((a,b)=>a-b),Array.from({length:30},(_,i)=>i+9));
  assert.deepEqual([...new Set(definitions.map(x=>x.roster))].sort((a,b)=>a-b),
    [...Array.from({length:12},(_,i)=>i+1),...Array.from({length:9},(_,i)=>i+47)]);
  for(const item of definitions){
    assert.ok(item.id>=9&&item.id<=58&&item.id!==255);
    assert.ok(typeof item.name==='string'&&item.name.length>3);
  }
  assert.equal(new Set(definitions.map(x=>x.id)).size,30);
});
test('each candidate is a real unit-cell volume in four orientations: 120 descriptors',()=>{
  let count=0;
  for(const id of ids)for(const rotation of [0,1,2,3]){
    const d=descriptor(id,rotation);
    validateBoxes(d.boxes);
    assert.equal(d.boxes.length>=1,true);
    if(id>14){
      assert.equal(d.rotation,rotation);
      assert.equal(d.orientationRequiresEngineSave,rotation!==0);
    }
    count++;
  }
  assert.equal(count,120);
});
test('full cubes only for core masonry; 24 shaped candidates have real empty unit space',()=>{
  for(const id of ids){
    const d=descriptor(id);
    if(id<=14)assert.deepEqual(d.boxes,[[0,0,0,1,1,1]]);
    else assert.ok(d.boxes.every(b=>JSON.stringify(b)!=='[0,0,0,1,1,1]'));
  }
});
test('family variants are independently shaped, not one geometry recolored',()=>{
  for(const set of [[25,26],[27,28],[29,30,31],[32,33,34,35],[36,37,38]]){
    const geometry=set.map(id=>JSON.stringify(descriptor(id).boxes));
    assert.equal(new Set(geometry).size,geometry.length,'duplicate silhouette in '+set);
  }
});
test('foliage, flowers, mushrooms use bounded 1/8 voxel edges for mobile mesh budget',()=>{
  for(const id of ids.filter(x=>x>=24)){
    const d=descriptor(id);
    for(const b of d.boxes)for(const n of b)
      assert.ok(Math.abs(n*8-Math.round(n*8))<1e-9,'unaligned box boundary for ID '+id);
  }
});
test('original RGBA pixel artwork deterministic and visually distinct for all 30 IDs',()=>{
  const signatures=[];
  for(const id of ids){
    const a=texture(id),b=texture(id);
    assert.equal(a.width,24);assert.equal(a.height,24);
    assert.equal(a.pixels.length,2304);
    assert.deepEqual(a.pixels,b.pixels);
    let palette=new Set();
    let hash=2166136261;
    for(let i=0;i<a.pixels.length;i+=4){
      assert.equal(a.pixels[i+3],255,'material role should be opaque within its physical surface');
      palette.add(a.pixels[i]+','+a.pixels[i+1]+','+a.pixels[i+2]);
      for(let k=0;k<3;k++)hash=Math.imul(hash^a.pixels[i+k],16777619)>>>0;
    }
    assert.ok(palette.size>=15,'texture not distinctive enough '+id);
    signatures.push(hash);
  }
  assert.equal(new Set(signatures).size,30,'pixel-art asset has duplicated surface texture');
});
test('soft flowers/leaves maintain distinct selection geometry without fake solid cubes',()=>{
  for(const id of [26,27,28,29,30,31,32,33,34,35]){
    const d=descriptor(id);
    assert.ok(d.selection.boxes.length>0,'soft foliage not selectable');
    assert.equal(d.collision.boxes.length,0,'soft foliage should be walk-through');
  }
  for(const id of [36,37,38]){
    const d=descriptor(id);
    assert.ok(d.collision.boxes.length>0&&d.collision.boxes.length<d.boxes.length);
    assert.equal(d.lightEmission,0,'decorative pale mushroom cannot emit functional light');
  }
});
const fixtures=[
  {name:'core',ids:[9,10,11,12,13,14],make:createMasonryFixture,restore:restoreMasonryFixture},
  {name:'stone',ids:[15,16,17,18,19,20],make:createStoneShapeFixture,restore:restoreStoneShapeFixture},
  {name:'garden',ids:[21,22,23],make:createGardenFixture,restore:restoreGardenFixture},
  {name:'foliage',ids:[24,25,26,27,28,29,30,31],make:createFoliageFixture,
    restore:payload=>restoreFoliageFixture(payload,{mountForVines:true})},
  {name:'floral',ids:[32,33,34,35,36,37,38],make:createFloralFixture,restore:restoreFloralFixture}
];
test('every one of 30 IDs can be placed, saved canonically, restored, then removed independently',()=>{
  let placed=0;
  for(const group of fixtures){
    const w=group.make(179);
    for(const [i,id] of group.ids.entries()){
      const options=group.name==='foliage'&&[27,28].includes(id)?{wallMount:true}:{};
      assert.equal(w.place(i*2,3,0,id,options).ok,true,'cannot place ID '+id);
      assert.equal(w.get(i*2,3,0),id);
      placed++;
    }
    assert.equal(w.size,group.ids.length);
    const save=w.save();
    assert.deepEqual(Object.keys(save),['schema','seed','edits']);
    assert.equal(save.schema,1);
    assert.ok(save.edits.every(x=>x.length===4));
    const clone=group.restore(JSON.parse(JSON.stringify(save)));
    assert.deepEqual(clone.save(),save);
    for(const [i,id] of group.ids.entries())
      assert.equal(clone.remove(i*2,3,0).id,id);
    assert.equal(clone.size,0);
    assert.equal(w.size,group.ids.length,'restore/removal mutated original fixture');
  }
  assert.equal(placed,30);
});
test('rotated fixtures explicitly reject lossy legacy-schema saves',()=>{
  const cases=[
    [createStoneShapeFixture,16,{}],
    [createGardenFixture,22,{}],
    [createFoliageFixture,27,{wallMount:true}],
    [createFloralFixture,33,{}]
  ];
  for(const [create,id,options] of cases){
    const f=create(179);
    assert.equal(f.place(0,3,0,id,{...options,rotation:1}).ok,true);
    assert.throws(()=>f.save(),/rotation|oriented|Rotated/i);
  }
});
test('all assets remain strictly candidate-only, independent of worldgen or schema upgrades',()=>{
  for(const a of CORE_MASONRY)assert.equal(a.integration,'candidate-only');
  for(const a of STONE_SHAPES)assert.equal(a.integration,'candidate-only');
  for(const a of GARDEN_COMPONENTS)assert.match(a.integration,/CANDIDATE/);
  for(const a of FOLIAGE_ASSETS)assert.match(a.integration,/CANDIDATE/);
  for(const a of FLORAL_CANDIDATES)assert.match(a.status,/CANDIDATE/);
});
