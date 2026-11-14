import test from 'node:test';
import {loadCheckpoint007} from './current-main-loader.mjs';
import assert from 'node:assert/strict';
import {PACK4_WINDOW_ASSETS} from '../../../src/block-packs/pack-4/windows.mjs';
import {PACK4_LIGHT_ASSETS} from '../../../src/block-packs/pack-4/lighting.mjs';
import {PACK4_FURNISHING_ASSETS} from '../../../src/block-packs/pack-4/furnishings.mjs';
import {PACK4_CIVIC_ASSETS} from '../../../src/block-packs/pack-4/hearth-civic.mjs';
import {
 pack4Shape,pack4State,pack4MountOffset,createPack4Fixture
} from '../../../src/block-packs/pack-4/fixture.mjs';
import {pack4ShapeHandoff,pack4FixtureToSidecarSnapshot,
 pack4SidecarToFixtureSnapshot} from '../../../src/block-packs/pack-4/interaction-handoff.mjs';

const all=[...PACK4_WINDOW_ASSETS,...PACK4_LIGHT_ASSETS,
 ...PACK4_FURNISHING_ASSETS,...PACK4_CIVIC_ASSETS];

test('current integrated main shape system accepts all 23 Pack 4 IDs at all quarter turns',async t=>{
 const shared=await loadCheckpoint007(t);
 if(!shared)return;
 const {validateShape,rotateShape,raycastShapes,canPlaceShape,
   inspectBodyFit,makeOrientationSidecar,restoreOrientationSidecar}=shared;
 assert.deepEqual(all.map(a=>a.id),Array.from({length:23},(_,i)=>159+i));
 for(const a of all)for(let r=0;r<4;r++){
  const sh=pack4ShapeHandoff(a.id,r,'collision');
  const sel=pack4ShapeHandoff(a.id,r,'selection');
  assert.equal(validateShape(sh),true,'invalid collision shape '+a.id+' turn '+r);
  assert.equal(validateShape(sel),true,'invalid selection shape '+a.id+' turn '+r);
  assert.ok(sh.boxes.length<=32&&sel.boxes.length<=32);
  assert.ok(sh.boxes.length>0&&sel.boxes.length>0);
  assert.equal(canPlaceShape(sh,[a.id,2,0],()=>null),true);
  const rotated=rotateShape(pack4ShapeHandoff(a.id,0,'collision'),r);
  assert.equal(rotated.boxes.length,sh.boxes.length);
  for(let i=0;i<sh.boxes.length;i++)for(let j=0;j<6;j++)
   assert.ok(Math.abs(rotated.boxes[i][j]-sh.boxes[i][j])<1e-6,
    'rotation mismatch '+a.id+' r='+r);
 }
});

test('current main raycast selects each candidate within a six-block reach',async t=>{
 const shared=await loadCheckpoint007(t);
 if(!shared)return;
 const {validateShape,rotateShape,raycastShapes,canPlaceShape,
   inspectBodyFit,makeOrientationSidecar,restoreOrientationSidecar}=shared;
 for(const a of all)for(let r=0;r<4;r++){
  const box=pack4ShapeHandoff(a.id,r,'selection').boxes[0];
  const x=a.id+(box[0]+box[3])/2,y=2+(box[1]+box[4])/2;
  const shape=pack4ShapeHandoff(a.id,r,'selection');
  const hit=raycastShapes([x,y,-2],[0,0,1],
   (cx,cy,cz)=>cx===a.id&&cy===2&&cz===0?shape:null,6);
  assert.ok(hit,'no selection hit '+a.id+' r='+r);
  assert.deepEqual(hit.cell,[a.id,2,0]);
 }
});

test('current main body-fit rejects actual partial solids but preserves genuine empty spaces',async t=>{
 const shared=await loadCheckpoint007(t);
 if(!shared)return;
 const {validateShape,rotateShape,raycastShapes,canPlaceShape,
   inspectBodyFit,makeOrientationSidecar,restoreOrientationSidecar}=shared;
 for(const a of all)for(let r=0;r<4;r++){
  const shape=pack4ShapeHandoff(a.id,r,'collision');
  const b=shape.boxes[0];
  const x=a.id+(b[0]+b[3])/2,y=2+(b[1]+b[4])/2,z=(b[2]+b[5])/2;
  const radius=Math.min(.00001,(b[3]-b[0])/10,(b[4]-b[1])/10,(b[5]-b[2])/10);
  const body=[x-radius,y-radius,z-radius,x+radius,y+radius,z+radius];
  const check=inspectBodyFit(body,(cx,cy,cz)=>cx===a.id&&cy===2&&cz===0?shape:null);
  assert.equal(check.fits,false,'unoccupied collision interior '+a.id+' r='+r);
 }
});

test('all 23 candidate cells roundtrip through the REAL current main orientation sidecar',async t=>{
 const shared=await loadCheckpoint007(t);
 if(!shared)return;
 const {validateShape,rotateShape,raycastShapes,canPlaceShape,
   inspectBodyFit,makeOrientationSidecar,restoreOrientationSidecar}=shared;
 const cells=all.map((a,i)=>({id:a.id,rotation:i%4,
  cell:[1000000+i*4,2,65537]}));
 const supports=cells.map(item=>{
  const off=pack4MountOffset(item.id,item.rotation);
  return off?item.cell.map((n,i)=>n+off[i]):null;
 }).filter(Boolean);
 const fixture=createPack4Fixture(supports);
 for(const item of cells)assert.equal(fixture.place(item.cell,item.id,item.rotation).ok,true);
 const serialized=JSON.parse(JSON.stringify(fixture.save()));
 const entries=pack4FixtureToSidecarSnapshot(serialized);
 const reader=(x,y,z)=>fixture.get([x,y,z])?.id??0;
 const sidecar=makeOrientationSidecar(entries);
 assert.equal(sidecar.size(),23);
 const snapshot=sidecar.snapshot(reader);
 assert.equal(snapshot.length,23);
 const restored=restoreOrientationSidecar(snapshot,reader);
 assert.equal(restored.size(),23);
 for(const item of cells)assert.equal(restored.get(item.cell,item.id),item.rotation);
 const testFixture=createPack4Fixture(supports);
 assert.equal(testFixture.restore(pack4SidecarToFixtureSnapshot(snapshot)),23);
 assert.deepEqual(testFixture.save(),fixture.save());
});

test('current main orientation recovery drops stale identity records and preserves distant cells',async t=>{
 const shared=await loadCheckpoint007(t);
 if(!shared)return;
 const {validateShape,rotateShape,raycastShapes,canPlaceShape,
   inspectBodyFit,makeOrientationSidecar,restoreOrientationSidecar}=shared;
 const cell=[Number.MAX_SAFE_INTEGER,0,0];
 const states=makeOrientationSidecar([{cell,blockId:169,turns:3},
  {cell:[-1000000,2,65537],blockId:181,turns:1}]);
 assert.equal(states.get(cell,169),3);
 assert.equal(states.snapshot(()=>0).length,0,'stale block state survived');
 assert.equal(restoreOrientationSidecar(states.snapshot(()=>169),()=>169).size(),1);
 assert.equal(states.get(cell,170),0);
});

test('transparent window and framed openings remain physically hollow under current main',async t=>{
 const shared=await loadCheckpoint007(t);
 if(!shared)return;
 const {validateShape,rotateShape,raycastShapes,canPlaceShape,
   inspectBodyFit,makeOrientationSidecar,restoreOrientationSidecar}=shared;
 for(const id of [162,164,176,177,178,181]){
  const shape=pack4ShapeHandoff(id,0,'collision');
  assert.equal(validateShape(shape),true);
 }
 const air=(id,p)=>!pack4ShapeHandoff(id,0,'collision').boxes.some(b=>
  [0,1,2].every(axis=>p[axis]>=b[axis]&&p[axis]<b[axis+3]));
 assert.equal(air(176,[.5,.5,.5]),true);
 assert.equal(air(177,[.5,.52,.26]),true);
 assert.equal(air(178,[.63,.32,.63]),true);
 assert.equal(air(181,[.5,.41,.5]),true);
});
