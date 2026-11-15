import test from 'node:test';
import assert from 'node:assert/strict';
import {PACK2_BUILDER_SYMBOLS,PACK2_BUILDER_IDS,PACK2_BUILDER_AVAILABILITY,
  resolvePack2BuilderAsset,planPack2BuilderStructure} from '../src/builder-assets/pack2.mjs';
import {PACK2_LIVE_IDS} from '../src/pack2-integration.mjs';
import {Pack2LiveWorld,savePack2LiveWorld,loadPack2LiveWorld} from '../src/pack2-world.mjs';
import {VoxelWorld} from '../src/voxel.mjs';

test('18 approved Pack 2 symbols use immutable roster keys and unique physical IDs',()=>{
  assert.deepEqual(PACK2_BUILDER_SYMBOLS,[
    ...Array.from({length:10},(_,i)=>'pack2:'+String(13+i).padStart(3,'0')),
    ...Array.from({length:8},(_,i)=>'pack2:'+String(39+i).padStart(3,'0'))]);
  assert.equal(new Set(PACK2_BUILDER_IDS).size,18);
  assert.deepEqual([...PACK2_BUILDER_IDS].sort((a,b)=>a-b),PACK2_LIVE_IDS);
  assert.equal(PACK2_BUILDER_AVAILABILITY.creatorArtworkApproved,true);
  assert.equal(PACK2_BUILDER_AVAILABILITY.requiresCoordinatedFivePackIntegration,true);
  assert.equal(PACK2_BUILDER_AVAILABILITY.liveGameRegistry,false);
  assert.equal(PACK2_BUILDER_AVAILABILITY.livePlaceable,false);
});

test('all 18 original physical assets resolve with actual collision or non-solid water',()=>{
  let triangles=0;
  for(const symbol of PACK2_BUILDER_SYMBOLS){
    const a=resolvePack2BuilderAsset(symbol);
    assert.equal(a.sourcePack,2);
    assert.equal(a.builderUsable,true);
    assert.equal(a.livePlaceable,false);
    assert.equal(a.worldRegistered,false);
    assert.ok(a.triangleCount>=12);
    triangles+=a.triangleCount;
    if(a.fluid){
      assert.equal(a.blockId,76);
      assert.equal(a.shape.boxes.length,0);
      assert.ok(a.fluidVolume.topCorners.length===4);
    }else{
      assert.ok(a.shape.boxes.length>0);
      for(const box of a.shape.boxes){
        assert.equal(box.length,6);
        for(let n=0;n<3;n++)
          assert.ok(box[n]>=0&&box[n]<box[n+3]&&box[n+3]<=1);
      }
    }
  }
  assert.ok(triangles>18*12);
});

test('builder resolves authored rotations, hinges, variants and source/flow metadata',()=>{
  const rotations=[
    ['pack2:014','east',{},60],
    ['pack2:017','south',{variant:'upper'},64],
    ['pack2:019','west',{open:true},66],
    ['pack2:020','east',{open:true},67],
    ['pack2:021','south',{variant:'lower',open:true},68],
    ['pack2:043','west',{variant:'terminal'},73],
    ['pack2:044','east',{variant:'drain-slot'},74],
    ['pack2:046','east',{variant:'edge-trim'},75],
    ['pack2:045','north',{level:3,flow:'north',source:false},76]
  ];
  for(const [symbol,orientation,state,id] of rotations){
    const a=resolvePack2BuilderAsset(symbol,orientation,state);
    assert.equal(a.blockId,id);
    for(const [key,value] of Object.entries(state))assert.equal(a.state[key],value);
    assert.ok(a.triangleCount>=12);
  }
  assert.equal(resolvePack2BuilderAsset('pack2:019','west',{open:true}).state.rotation,3);
  assert.equal(resolvePack2BuilderAsset('pack2:045','north',{level:3,flow:'north',source:false}).fluid,true);
});

test('village/town/city builder plan keeps physical walls, stairs, rails and liquid separate',()=>{
  const before=new VoxelWorld(179).save();
  const plan=planPack2BuilderStructure([
    {asset:'pack2:013',at:[0,0,0]},
    {asset:'pack2:017',at:[0,1,0],orientation:'east'},
    {asset:'pack2:019',at:[1,0,0],orientation:'south',state:{open:false}},
    {asset:'pack2:043',at:[2,0,0],orientation:'west',state:{variant:'terminal'}},
    {asset:'pack2:044',at:[3,0,0],state:{variant:'drain-slot'}},
    {asset:'pack2:045',at:[4,0,0],state:{level:4,flow:'east',source:false}}
  ],{origin:[100,5,-30]});
  assert.equal(plan.cells.length,6);
  assert.equal(plan.livePlaced,false);
  assert.equal(plan.saveWritten,false);
  assert.ok(plan.worldBoxes.length>15);
  assert.equal(plan.fluidVolumes.length,1);
  assert.deepEqual(plan.cells[0].at,[100,5,-30]);
  assert.equal(plan.fluidVolumes[0].blockId,76);
  for(const part of plan.worldBoxes)assert.ok(part.box.every(Number.isFinite));
  assert.deepEqual(new VoxelWorld(179).save(),before);
});

test('builder rejects unknown pack symbols, unsafe states and conflicting coordinates',()=>{
  for(const symbol of ['pack2:059','pack1:013','pack2:023','pack2:255','pack3:069'])
    assert.throws(()=>resolvePack2BuilderAsset(symbol),RangeError);
  assert.throws(()=>resolvePack2BuilderAsset('pack2:013','east'),RangeError);
  assert.throws(()=>resolvePack2BuilderAsset('pack2:044','south'),RangeError);
  assert.throws(()=>resolvePack2BuilderAsset('pack2:019','north',{open:'yes'}),RangeError);
  assert.throws(()=>resolvePack2BuilderAsset('pack2:045','east'),RangeError);
  assert.throws(()=>resolvePack2BuilderAsset('pack2:045','north',{level:0,flow:'north'}),RangeError);
  assert.throws(()=>resolvePack2BuilderAsset('pack2:017','north',{futureState:4}),TypeError);
  assert.throws(()=>planPack2BuilderStructure([
    {asset:'pack2:013',at:[0,0,0]},{asset:'pack2:014',at:[0,0,0]}
  ]),/Duplicate/);
  assert.throws(()=>planPack2BuilderStructure([{asset:'pack2:013',at:[.5,0,0]}]),TypeError);
  assert.throws(()=>planPack2BuilderStructure([{asset:'pack2:013',at:[0,0,0]}],{maxCells:0}),RangeError);
});

test('all 18 blueprints can place in an isolated Pack 2 overlay and survive verified reload',()=>{
  const placements=PACK2_BUILDER_SYMBOLS.map((asset,i)=>({asset,at:[i,0,0]}));
  const plan=planPack2BuilderStructure(placements,{origin:[300,19,300]});
  const base=new VoxelWorld(179),before=JSON.stringify(base.save());
  const live=new Pack2LiveWorld(base);
  for(const cell of plan.cells){
    assert.equal(live.placePack2(...cell.at,cell.blockId,cell.state),true);
    assert.equal(live.get(...cell.at),cell.blockId);
  }
  assert.equal(live.pack2Cells.size,18);
  assert.equal(JSON.stringify(base.save()),before);
  const data=new Map(),store={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v))};
  const saved=savePack2LiveWorld(store,live);
  assert.equal(saved.ok,true,JSON.stringify(saved));
  const recovered=loadPack2LiveWorld(store,new VoxelWorld(179));
  assert.equal(recovered.recovered,false);
  assert.deepEqual(recovered.world.pack2Snapshot(),live.pack2Snapshot());
  assert.equal(JSON.stringify(recovered.world.save()),before);
});
