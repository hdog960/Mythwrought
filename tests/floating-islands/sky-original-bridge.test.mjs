import test from 'node:test';
import assert from 'node:assert/strict';
import {createSkyOriginalMaterials,createSkyOriginalWorldView,
  createSkyOriginalPhysicalQueries} from '../../src/floating-islands/sky-original-core.mjs';
const families=new Map([
 [370,['Pine logs',true,false]], [379,['Pine needle clusters',false,true]],
 [376,['Moonwillow logs',true,false]],[385,['Moonwillow silverleaf curtains',false,true]],
 [375,['Blackwood logs',true,false]],[384,['Blackwood thornleaf canopies',false,true]],
 [287,['Star-moss ground',false,true]], [256,['Full opaque',true,false]]
]);
const source={
  isBiome130BlockId:id=>families.has(id),
  biome130Block(id,rotation=0){
    assert.ok(Number.isInteger(rotation)&&rotation>=0&&rotation<=3);
    const row=families.get(id);if(!row)throw Error('missing registry ID');
    return {name:row[0],solid:row[1],transparent:row[2],opacity:1,
      alphaMode:row[2]?'cutout':'opaque',boxes:id===256?[[0,0,0,1,1,1]]:[[.2,0,.2,.8,1,.8]]};
  },
  biome130Color:(id,x,y,z,face)=>[id/65535,(x^y^z&255)/255,face/5],
  environmentGround:id=>id===400?{color:[.36,.4,.43]}:null,
  prototypeSurfaceMesh:({prototypeOnly,boxes})=>{
    assert.equal(prototypeOnly,true);assert.equal(boxes.length,1);
    return {positions:new Float32Array([0,0,0]),normals:new Float32Array([1,0,0]),indices:new Uint16Array([0,0,0])};
  }
};
const materials=()=>createSkyOriginalMaterials(source);
test('three real named tree families and star moss map to source-registered physical blocks',()=>{
  const m=materials();
  assert.deepEqual([m.assetFor('windbent-pine','trunk'),m.assetFor('windbent-pine','leaves')],[370,379]);
  assert.deepEqual([m.assetFor('cloudleaf-tree','trunk'),m.assetFor('cloudleaf-tree','leaves')],[376,385]);
  assert.deepEqual([m.assetFor('starbloom-tree','trunk'),m.assetFor('starbloom-tree','leaves')],[375,384]);
  assert.equal(m.assetFor('glowmoss','ground-cover'),287);
});
test('unsupported grasses and blossoms never turn into invented IDs',()=>{
  const m=materials(),plan={placements:[
    {kind:'windgrass-tuft',group:'ground-cover'},
    {kind:'windbent-pine',group:'canopy'},
    {kind:'skybell-flowers',group:'ground-cover'},
    {kind:'glowmoss',group:'ground-cover'}]};
  const filtered=m.filterSupportedVegetation(plan);
  assert.deepEqual(filtered.placements.map(p=>p.kind),['windbent-pine','glowmoss']);
  assert.equal(filtered.omitted,2);assert.equal(plan.placements.length,4);
});
test('original shape registry semantics distinguish shaped foliage, solid bark, and full solids',()=>{
  const m=materials();
  assert.deepEqual(m.shapeFor(379),{cube:false,opaque:false});
  assert.deepEqual(m.shapeFor(370),{cube:false,opaque:true});
  assert.deepEqual(m.shapeFor(256),{cube:true,opaque:true});
  assert.equal(m.surfaceMeshFor(370,2),m.surfaceMeshFor(370,2));
  assert.equal(m.stats().cachedShapes,1);
});
test('materials sample true source palette at far coordinates and legacy ground colors',()=>{
  const m=materials();
  assert.deepEqual(m.appearanceFor(370,12005,101,-14200,2),
    {color:source.biome130Color(370,12005,101,-14200,2),mat:0});
  assert.deepEqual(m.appearanceFor(400,1,100,1,0),{color:[.36,.4,.43],mat:42});
  assert.deepEqual(m.appearanceFor(3,1,100,1,0),{color:[.48,.51,.55],mat:3});
});
test('original ground at Y19 is not replaced, sky AIR edit at Y20 overrides source',()=>{
  const edits=new Map([['0,20,0',0]]),ground={get:(x,y,z)=>y===19?3:0,rotationAt:()=>3};
  const v=createSkyOriginalWorldView({groundWorld:ground,skyGet:()=>370,
    skyEdits:edits,skyRotationAt:()=>1,skyRotations:new Map([['0,99,0',2]]),
    validateSkyId:materials().validateId});
  assert.equal(v.get(0,19,0),3);assert.equal(v.get(0,20,0),0);
  assert.equal(v.get(0,21,0),370);assert.equal(v.get(0,257,0),0);
  assert.equal(v.rotationAt(0,19,0),3);assert.equal(v.rotationAt(0,99,0),2);
  assert.equal(edits.get('0,20,0'),0);
});
test('real collision/raycast API injected into original shape-aware raycaster',()=>{
  const original={get:()=>0,biomeCellCount:0};
  const world=createSkyOriginalWorldView({groundWorld:original,
    skyGet:()=>379,validateSkyId:materials().validateId});
  const q=createSkyOriginalPhysicalQueries(world,{
    collides:(w,x,y,z)=>w.get(Math.floor(x),Math.floor(y),Math.floor(z))!==0,
    raycast:(w,eye,direction,range)=>{
      assert.equal(w.biomeCellCount,1);assert.equal(w.get(0,50,0),379);
      return {hit:[0,50,0],distance:range};
    }});
  assert.equal(q.isBodyClear({x:.5,y:50,z:.5}),false);
  assert.deepEqual(q.raycast([0,50,3],[0,0,-1],7),{hit:[0,50,0],distance:7});
});
test('unknown IDs and forged family names fail closed instead of becoming full cubes',()=>{
  const m=materials();
  for(const id of [255,386,411,65535,-1])assert.throws(()=>m.validateId(id));
  const rogue=createSkyOriginalMaterials({...source,
    biome130Block:(id,r)=>id===370?{...source.biome130Block(id,r),name:'Unregistered copy'}:
      source.biome130Block(id,r)});
  assert.equal(rogue.assetFor('windbent-pine','trunk'),null);
  assert.throws(()=>m.surfaceMeshFor(370,4));
});
test('original auxiliary collision, targeting and physical overlays remain owned by ground runtime',()=>{
  const ground={get:()=>0,pack3Runtime:{size:()=>1},
    manual14Layer:{size:()=>1},manual14Collision:()=>true,
    pack5Collision:()=>false,stagedNonblockCollision:()=>true,
    getPack2State:()=>({open:false}),pack2Cells:new Map()};
  const v=createSkyOriginalWorldView({groundWorld:ground,skyGet:()=>0,
    validateSkyId:materials().validateId});
  assert.equal(v.pack3Runtime,ground.pack3Runtime);
  assert.equal(v.manual14Layer,ground.manual14Layer);
  assert.equal(v.manual14Collision(),true);
  assert.deepEqual(v.getPack2State(0,0,0),{open:false});
  assert.throws(()=>v.get(1.5,20,0));
});
