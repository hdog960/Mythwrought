import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {FULL_CUBE,raycastShapes,validateShape,rotateShape}
  from '../src/voxel-shape-interactions.mjs';
import {auditMountainV8ProvisionalFloraPhysics as audit}
  from '../src/manual-biomes/mountain-v8-unapproved-flora-physics-prototype.mjs';
import {MOUNTAIN_V8_PLANT_PATTERNS}
  from '../src/manual-biomes/mountain-v8-vegetation-cells.mjs';

const proposal=()=>audit();
const mapped=()=>new Map(proposal().materials.map(x=>[x.material,x]));
const lookup=(shape)=>((x,y,z)=>x===0&&y===0&&z===0?shape:null);
test('exact six source-authored flora descriptors have distinct narrowly bounded selection boxes',()=>{
  const r=proposal();
  assert.deepEqual(r.materials.map(x=>x.material),[
    'flower','flower-petal','heather','heather-tip',
    'conifer-trunk','conifer-needles']);
  assert.equal(r.originalSourceMaterialCount,6);
  for(const x of r.materials){
    assert.ok(validateShape({boxes:x.selectionBoxes}));
    assert.ok(x.selectionBoxes.every(b=>JSON.stringify(b)!==JSON.stringify(FULL_CUBE.boxes[0])));
    assert.ok(Object.isFrozen(x));
    assert.ok(Object.isFrozen(x.selectionBoxes));
    assert.ok(x.selectionBoxes.every(Object.isFrozen));
    assert.equal(x.rotationsChecked,4);
    assert.equal(x.newNumericBlockId,null);
    assert.equal(x.approvedForGameplay,false);
  }
});
test('flora proposal conservatively keeps soft stems/petals/heather/needles pass-through',()=>{
  for(const x of proposal().materials){
    if(x.material==='conifer-trunk')continue;
    assert.equal(x.bodySolid,false,x.material);
    assert.deepEqual(x.bodyCollisionBoxes,[],x.material);
    assert.ok(x.selectionBoxes.length>0,x.material);
  }
});
test('dwarf conifer trunk is narrow and collidable without making leaf canopy solid',()=>{
  const rows=mapped();
  assert.equal(rows.get('conifer-trunk').bodySolid,true);
  assert.deepEqual(rows.get('conifer-trunk').bodyCollisionBoxes,
    [[.36,0,.36,.64,1,.64]]);
  assert.equal(rows.get('conifer-needles').bodySolid,false);
  assert.equal(rows.get('conifer-needles').bodyCollisionBoxes.length,0);
});
test('original shape raycast passes through empty flower-cell corner unlike full-cube fallback',()=>{
  const rows=mapped();
  const origin=[.04,.50,-.5],dir=[0,0,1];
  assert.equal(raycastShapes(origin,dir,lookup({boxes:rows.get('flower').selectionBoxes}),2),null);
  const cube=raycastShapes(origin,dir,lookup(FULL_CUBE),2);
  assert.deepEqual(cube.cell,[0,0,0]);
});
test('actual conifer trunk AABB ray hit differs in distance from full cube',()=>{
  const rows=mapped(),origin=[.5,.5,-.5],dir=[0,0,1];
  const trunk=raycastShapes(origin,dir,lookup({boxes:rows.get('conifer-trunk').selectionBoxes}),2);
  const cube=raycastShapes(origin,dir,lookup(FULL_CUBE),2);
  assert.deepEqual(trunk?.cell,[0,0,0]);
  assert.ok(Math.abs(trunk.distance-.86)<1e-6);
  assert.ok(Math.abs(cube.distance-.5)<1e-6);
  assert.ok(trunk.distance>cube.distance);
});
test('all six proposed shapes use authentic original shape rotations with no full-cube fallback',()=>{
  for(const x of proposal().materials){
    for(let rotation=0;rotation<4;rotation++){
      const shape=rotateShape({boxes:x.selectionBoxes},rotation);
      assert.equal(validateShape(shape),true);
      assert.ok(shape.boxes.every(b=>JSON.stringify(b)!==JSON.stringify(FULL_CUBE.boxes[0])));
    }
  }
});
test('original 2/2/13 pattern positions and materials are source preserved',()=>{
  const rows=proposal().authoredPatterns;
  assert.deepEqual(rows.map(x=>[x.kind,x.sourceCells]),[
    ['alpine-flower',2],['low-heather',2],['dwarf-conifer',13]
  ]);
  for(const row of rows)
    assert.deepEqual(row.cellMaterials,MOUNTAIN_V8_PLANT_PATTERNS[row.kind].map(x=>x[3]));
});
test('candidate audit causes no writes to existing V7 schema-1 world',()=>{
  const world=new VoxelWorld(179);
  assert.equal(world.set(0,-100,0,BLOCK.AIR),true);
  const original=JSON.stringify(world.save());
  const report=proposal();
  assert.equal(JSON.stringify(world.save()),original);
  assert.equal(report.noRuntimeRegistration,true);
  assert.equal(report.actualMiningTargetingImplemented,false);
  assert.equal(report.actualV8ColliderImplemented,false);
  assert.equal(report.realV8GpuDataMeasured,false);
  assert.equal(report.safeToIntegrate,false);
  assert.equal(Object.isFrozen(report),true);
});
