import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,VoxelWorld} from '../../../src/voxel.mjs';
import {PACK_2_IDS} from '../../../src/block-packs/pack-2/definitions.mjs';
import {PACK_2_JOINERY_IDS} from '../../../src/block-packs/pack-2/joinery.mjs';
import {PACK_2_GROUND_IDS} from '../../../src/block-packs/pack-2/ground.mjs';
import {PACK_2_INFRASTRUCTURE_IDS} from '../../../src/block-packs/pack-2/infrastructure.mjs';
import {WATER_ASSET,WATER_CANDIDATE_ID,WATER_FLOW_DIRECTIONS,WATER_LEVELS,
  waterCell,parseWaterCell,waterSurfaceHeight,waterCorners,waterVolumeContains,
  waterShape,waterRaycast,waterPreviewMesh}
  from '../../../src/block-packs/pack-2/water.mjs';
import {PACK_2_FIXTURE_IDS,Pack2Fixture} from './fixture.mjs';

const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-6, 'expected '+a+' near '+b);

test('single new water candidate ID 76 completes 18-family roster without other pack collisions',()=>{
  assert.equal(WATER_CANDIDATE_ID,76);
  assert.equal(WATER_ASSET.id,76);
  assert.equal(WATER_ASSET.roster,45);
  assert.equal(WATER_ASSET.family,'physical-water-voxel');
  assert.equal(WATER_ASSET.fluidSimulationImplemented,false);
  const ids=[...PACK_2_IDS,...PACK_2_JOINERY_IDS,...PACK_2_GROUND_IDS,
    ...PACK_2_INFRASTRUCTURE_IDS,WATER_CANDIDATE_ID];
  assert.equal(ids.length,18);
  assert.equal(new Set(ids).size,18);
  assert.ok(ids.every(id=>id>=59&&id<=108&&id!==255));
  assert.deepEqual(PACK_2_FIXTURE_IDS,ids);
  assert.deepEqual(Object.values(BLOCK).sort((a,b)=>a-b),[0,1,2,3,4,5,6,7,8]);
});
test('source water has one-meter physical fluid volume and no false solid boxes',()=>{
  assert.deepEqual(waterCell(),{id:76,level:0,flow:'still',source:true});
  const shape=waterShape();
  assert.equal(shape.solidCollision,false);
  assert.equal(shape.collision,'passable-fluid-volume');
  assert.equal(shape.selection,'exact-closed-prism-triangles');
  assert.equal(shape.boxes.length,0);
  assert.deepEqual(shape.broadPhaseBox,[0,0,0,1,1,1]);
  assert.ok(shape.occupiedVolume.closed);
  assert.equal(shape.occupiedVolume.topCorners.length,4);
});
test('eight exact physical fill levels descend monotonically in one-eighth units',()=>{
  assert.deepEqual(WATER_LEVELS,[0,1,2,3,4,5,6,7]);
  for(let level=0;level<8;level++){
    const s=waterCell({level});
    near(waterSurfaceHeight(s,.5,.5),(8-level)/8);
    near(Math.max(...waterCorners(s).map(x=>x[1])),(8-level)/8);
    assert.equal(s.source,level===0);
  }
  assert.ok(waterSurfaceHeight({level:7},.5,.5)>.0);
});
test('cardinal flow tilts the actual physical top toward its stated direction',()=>{
  assert.deepEqual(WATER_FLOW_DIRECTIONS,['still','north','east','south','west']);
  const n=waterCell({level:3,flow:'north'});
  const e=waterCell({level:3,flow:'east'});
  const s=waterCell({level:3,flow:'south'});
  const w=waterCell({level:3,flow:'west'});
  assert.ok(waterSurfaceHeight(n,.5,1)>waterSurfaceHeight(n,.5,0));
  assert.ok(waterSurfaceHeight(e,0,.5)>waterSurfaceHeight(e,1,.5));
  assert.ok(waterSurfaceHeight(s,.5,0)>waterSurfaceHeight(s,.5,1));
  assert.ok(waterSurfaceHeight(w,1,.5)>waterSurfaceHeight(w,0,.5));
  near(waterSurfaceHeight(waterCell({level:3}),0,0),.625);
});
test('even thinnest shallow north/south/east/west flows remain within one voxel',()=>{
  for(const flow of WATER_FLOW_DIRECTIONS){
    const s=waterCell({level:7,flow});
    for(const corner of waterCorners(s))assert.ok(corner[1]>0&&corner[1]<1);
    assert.ok(waterShape(s).broadPhaseBox[4]<=1);
  }
});
test('fluid membership is exact sloped volume rather than inflated bounding cube',()=>{
  const state=waterCell({level:4,flow:'east'});
  assert.equal(waterVolumeContains(state,[.02,.52,.5]),true);
  assert.equal(waterVolumeContains(state,[.98,.52,.5]),false);
  assert.equal(waterVolumeContains(state,[.5,.5,.5]),true);
  assert.equal(waterVolumeContains(state,[.5,.501,.5]),false);
  assert.equal(waterVolumeContains(state,[.5,-.01,.5]),false);
  assert.equal(waterVolumeContains(state,[1,.01,.5]),false);
  assert.equal(waterVolumeContains(state,[-.01,.01,.5]),false);
});
test('vertical selection ray strikes actual fluid height for each of eight fill levels',()=>{
  for(let level=0;level<8;level++){
    const state=waterCell({level});
    const hit=waterRaycast(state,[.5,2,.5],[0,-1,0],[0,0,0],6);
    assert.equal(hit.face,'surface');
    near(hit.distance,2-(8-level)/8);
    near(hit.normal[1],1);
  }
});
test('sloped water ray targets actual triangle, never a tall broad-phase false hit',()=>{
  const s=waterCell({level:4,flow:'east'});
  const west=waterRaycast(s,[.1,2,.5],[0,-1,0],[0,0,0],6);
  const east=waterRaycast(s,[.9,2,.5],[0,-1,0],[0,0,0],6);
  assert.ok(west.distance<east.distance);
  near(west.distance,2-waterSurfaceHeight(s,.1,.5));
  near(east.distance,2-waterSurfaceHeight(s,.9,.5));
  assert.ok(west.normal[1]>.99);
});
test('transparent side boundaries are physically ray-targetable but do not block the player',()=>{
  const s=waterCell({level:2,flow:'north'});
  const hit=waterRaycast(s,[.5,.2,-1],[0,0,1],[0,0,0],6);
  assert.equal(hit.face,'side');
  near(hit.distance,1);
  assert.equal(waterShape(s).solidCollision,false);
  assert.equal(WATER_ASSET.physicsContract.collision,'non-blocking-volume');
  assert.equal(WATER_ASSET.physicsContract.buoyancy,'engine-required');
});
test('ray from above shallow water misses its side profile at too-high side altitude',()=>{
  const shallow=waterCell({level:7,flow:'west'});
  assert.equal(waterRaycast(shallow,[.5,.9,-1],[0,0,1],[0,0,0],6),null);
  assert.equal(waterRaycast(shallow,[.5,.04,-1],[0,0,1],[0,0,0],6).face,'side');
  assert.equal(waterRaycast(shallow,[2,.5,.5],[1,0,0],[0,0,0],6),null);
});
test('water ray can be selected from inside volume or from below its physical bottom',()=>{
  const s=waterCell({level:6});
  const inside=waterRaycast(s,[.5,.1,.5],[0,-1,0]);
  near(inside.distance,0);assert.equal(inside.face,'inside-fluid');
  const below=waterRaycast(s,[.5,-1,.5],[0,1,0]);
  near(below.distance,1);
  assert.equal(below.face,'bottom');
});
test('invalid ray directions, positions, reach and flow states reject deterministically',()=>{
  assert.throws(()=>waterRaycast({},[.5,2,.5],[0,0,0]),RangeError);
  assert.throws(()=>waterRaycast({},[.5,2,.5],[0,NaN,0]),TypeError);
  assert.throws(()=>waterRaycast({},[.5,2,.5],[0,-1,0],[0,.5,0]),TypeError);
  assert.throws(()=>waterRaycast({},[.5,2,.5],[0,-1,0],[0,0,0],-1),TypeError);
  assert.throws(()=>waterCell({level:8}),RangeError);
  assert.throws(()=>waterCell({level:1.5}),RangeError);
  assert.throws(()=>waterCell({level:0,flow:'east'}),RangeError);
  assert.throws(()=>waterCell({level:4,source:true}),RangeError);
  assert.throws(()=>waterCell({level:0,source:false}),RangeError);
  assert.throws(()=>waterCell({level:2,flow:'diagonal'}),RangeError);
  assert.throws(()=>waterSurfaceHeight({},2,.5),RangeError);
});
test('water records preserve exactly id, level, direction and source validity',()=>{
  for(let level=0;level<8;level++)for(const flow of level===0?['still']:WATER_FLOW_DIRECTIONS){
    const c=waterCell({level,flow});
    assert.deepEqual(parseWaterCell(JSON.parse(JSON.stringify(c))),c);
  }
  assert.throws(()=>parseWaterCell({id:76,level:0,flow:'still'}),TypeError);
  assert.throws(()=>parseWaterCell({id:76,level:0,flow:'still',source:true,debug:1}),TypeError);
  assert.throws(()=>parseWaterCell({id:75,level:1,flow:'still',source:false}),TypeError);
});
test('transparent preview has real sloped prism boundary and separate surface details',()=>{
  for(let level=0;level<8;level++)for(const flow of level===0?['still']:WATER_FLOW_DIRECTIONS){
    const m=waterPreviewMesh({level,flow});
    assert.equal(m.physicalTriangles,12);
    assert.equal(m.detailTriangles,6);
    assert.equal(m.triangles,18);
    assert.equal(m.materialPass,'transparent');
    assert.equal(m.depthWrite,false);
    assert.equal(m.solidCollision,false);
    assert.equal(m.positions.length,m.colors.length);
    assert.equal(m.positions.length,m.normals.length);
    assert.equal(m.positions.length/3,m.alpha.length);
    assert.equal(m.uv.length,m.alpha.length*2);
    assert.equal(m.indices.length,m.triangles*3);
    assert.ok([...m.positions,...m.colors,...m.normals,...m.alpha,...m.uv].every(Number.isFinite));
    assert.ok([...m.alpha].every(a=>a>0&&a<1));
    assert.ok([...m.colors].every(v=>v>=0&&v<=1));
    assert.ok([...m.positions].every(v=>v>=0&&v<=1.002));
  }
});
test('surface and ripple triangles face outward and deterministic alpha values survive regeneration',()=>{
  const a=waterPreviewMesh({level:3,flow:'south'});
  const b=waterPreviewMesh({level:3,flow:'south'});
  assert.deepEqual(a.positions,b.positions);
  assert.deepEqual(a.alpha,b.alpha);
  assert.deepEqual(a.uv,b.uv);
  for(let t=0;t<a.indices.length;t+=3){
    const p=[a.indices[t],a.indices[t+1],a.indices[t+2]]
      .map(index=>[...a.positions.slice(index*3,index*3+3)]);
    const u=p[1].map((v,i)=>v-p[0][i]),v=p[2].map((w,i)=>w-p[0][i]);
    const normal=[...a.normals.slice(a.indices[t]*3,a.indices[t]*3+3)];
    const cross=[u[1]*v[2]-u[2]*v[1],
      u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
    assert.ok(cross.reduce((sum,n,i)=>sum+n*normal[i],0)>0);
  }
});
test('water render and save contracts explicitly require shared engine support',()=>{
  assert.equal(WATER_ASSET.renderContract.pass,'transparent');
  assert.equal(WATER_ASSET.renderContract.depthWrite,false);
  assert.equal(WATER_ASSET.renderContract.transparentSorting,'engine-required');
  assert.equal(WATER_ASSET.renderContract.neighborSurfaceCull,'engine-required');
  assert.equal(WATER_ASSET.physicsContract.hydraulicPropagation,'engine-required');
  assert.equal(WATER_ASSET.physicsContract.noLocalSimulation,true);
  assert.equal(WATER_ASSET.saveContract.existingSchema1,'untouched');
  assert.equal(WATER_ASSET.worldGenerationEnabled,false);
});
test('fixture selects, edits, ray targets and removes actual transparent water surface',()=>{
  const fixture=new Pack2Fixture();fixture.select(76);
  assert.deepEqual(fixture.selection(),waterCell());
  fixture.setWaterSelection({level:4,flow:'north'});
  assert.deepEqual(fixture.selection(),waterCell({level:4,flow:'north'}));
  assert.ok(fixture.place([0,1,0]));
  const h=fixture.target([.5,3,.5],[0,-1,0],6);
  assert.equal(h.id,76);assert.equal(h.face,'surface');assert.equal(h.fluid,true);
  near(h.distance,1.5);
  assert.ok(fixture.mineRay([.5,3,.5],[0,-1,0],6).removed);
  assert.equal(fixture.read([0,1,0]),null);
});
test('fixture edits water levels explicitly, with no automatically propagated neighboring cells',()=>{
  const f=new Pack2Fixture();
  f.select(76);f.place([0,0,0]);
  const a=f.setWaterCell([0,0,0],{level:6,flow:'west'});
  assert.equal(a.level,6);assert.equal(a.flow,'west');
  assert.equal(f.cells.size,1);
  assert.equal(f.toggleCell([0,0,0]),false);
  assert.throws(()=>f.setWaterCell([2,0,0],{level:2}),RangeError);
  f.select(59);
  assert.throws(()=>f.setWaterSelection({level:1}),RangeError);
  assert.equal(f.select(76).source,true);
});
test('legacy fixture row formats and new water 7-column row roundtrip intact',()=>{
  const f=new Pack2Fixture();
  f.place([0,1,0]); // wood 59, 5 fields
  f.select(68);f.turn();f.toggleSelection();f.place([2,1,0]); // hinge 7
  f.select(72);f.turn();f.place([4,1,0]); // ground 5
  f.select(75);f.turn();f.cycleVariant();f.place([6,1,0]); // infrastructure 6
  f.select(76);f.setWaterSelection({level:3,flow:'east'});f.place([8,1,0]); // water 7
  const s=f.serialize();
  assert.deepEqual(s.cells.map(row=>row.length),[5,7,5,6,7]);
  assert.deepEqual(s.cells[4],[8,1,0,76,3,'east',false]);
  const copy=Pack2Fixture.restore(JSON.parse(JSON.stringify(s)));
  assert.deepEqual(copy.serialize(),s);
  assert.equal(copy.read([2,1,0]).open,true);
  assert.equal(copy.read([6,1,0]).variant,'edge-trim');
  assert.equal(copy.read([8,1,0]).flow,'east');
  assert.equal(new VoxelWorld().set(8,1,0,76),false);
  assert.throws(()=>VoxelWorld.restore(s));
});
test('invalid water snapshot rows and mixed-field aliases refuse restoration',()=>{
  const f=new Pack2Fixture();const s=f.serialize();
  const cases=[
    [[0,0,0,76,8,'east',false]],
    [[0,0,0,76,0,'north',true]],
    [[0,0,0,76,2,'still',true]],
    [[0,0,0,76,1,'east']],
    [[0,0,0,76,2,'west',false,1]],
    [[0,0,0,76,7,'west',false],[0,0,0,76,7,'north',false]],
    [[0,20,0,76,1,'east',false]]
  ];
  for(const cells of cases)assert.throws(()=>Pack2Fixture.restore({...s,cells}));
  assert.deepEqual(f.serialize(),s);
});
test('fluid candidate remains immutable metadata, not a seeded-world placement or simulation',()=>{
  const s=waterCell({level:5,flow:'east'});
  assert.ok(Object.isFrozen(s));
  assert.ok(Object.isFrozen(WATER_ASSET));
  assert.equal(WATER_ASSET.physicsContract.noLocalSimulation,true);
  assert.equal(WATER_ASSET.renderContract.timeDrivenUVOnly,'engine-required; no animation is implemented in this pack');
  assert.ok(waterRaycast(s,[.5,2,.5],[0,-1,0]));
  assert.equal(waterShape(s).boxes.length,0);
  assert.equal(WATER_ASSET.worldGenerationEnabled,false);
});
