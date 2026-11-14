// Pack 2 Milestone 6: cross-family full-state physical/mesh acceptance.
// This is an isolated candidate suite; passing it does NOT register blocks in
// the playable game, exercise production saves, or prove physical iPhone controls.
import test from 'node:test';
import assert from 'node:assert/strict';
import {PACK_2_ASSETS,PACK_2_IDS,pack2PreviewMesh,pack2Shape,pack2Cell}
  from '../../../src/block-packs/pack-2/definitions.mjs';
import {PACK_2_JOINERY,PACK_2_JOINERY_IDS,joineryPreviewMesh,joineryShape,joineryCell}
  from '../../../src/block-packs/pack-2/joinery.mjs';
import {PACK_2_GROUND,PACK_2_GROUND_IDS,groundPreviewMesh,groundShape,groundCell}
  from '../../../src/block-packs/pack-2/ground.mjs';
import {PACK_2_INFRASTRUCTURE,PACK_2_INFRASTRUCTURE_IDS,
  infrastructurePreviewMesh,infrastructureShape,infrastructureCell}
  from '../../../src/block-packs/pack-2/infrastructure.mjs';
import {WATER_ASSET,WATER_CANDIDATE_ID,WATER_FLOW_DIRECTIONS,waterCell,waterShape,
  waterPreviewMesh,waterRaycast,waterSurfaceHeight}
  from '../../../src/block-packs/pack-2/water.mjs';
import {Pack2Fixture,PACK_2_FIXTURE_IDS} from './fixture.mjs';

function allCandidateVariants(){
  return [
    ...PACK_2_ASSETS.flatMap(asset=>
      (asset.rotatable?[0,1,2,3]:[0]).map(rotation=>
        ({id:asset.id,type:'timber',state:{rotation},mesh:()=>pack2PreviewMesh(asset.id,rotation),
          shape:()=>pack2Shape(asset.id,rotation)}))),
    ...PACK_2_JOINERY.flatMap(asset=>asset.variants.flatMap(variant=>
      (asset.toggleable?[false,true]:[false]).flatMap(open=>
        (asset.rotatable?[0,1,2,3]:[0]).map(rotation=>{
          const state={rotation,variant,open};
          return {id:asset.id,type:'joinery',state,
            mesh:()=>joineryPreviewMesh(asset.id,state),
            shape:()=>joineryShape(asset.id,state)};
        })))),
    ...PACK_2_GROUND.flatMap(asset=>
      Array.from({length:asset.orientation.turns},(_,rotation)=>
        ({id:asset.id,type:'ground',state:{rotation},
          mesh:()=>groundPreviewMesh(asset.id,rotation),
          shape:()=>groundShape(asset.id,rotation)}))),
    ...PACK_2_INFRASTRUCTURE.flatMap(asset=>asset.variants.flatMap(variant=>
      Array.from({length:asset.rotations},(_,rotation)=>{
        const state={rotation,variant};
        return {id:asset.id,type:'infrastructure',state,
          mesh:()=>infrastructurePreviewMesh(asset.id,state),
          shape:()=>infrastructureShape(asset.id,state)};
      }))),
    ...Array.from({length:8},(_,level)=>
      (level===0?['still']:WATER_FLOW_DIRECTIONS).map(flow=>{
        const state={level,flow};
        return {id:76,type:'water',state,
          mesh:()=>waterPreviewMesh(state),shape:()=>waterShape(state)};
      })).flat()
  ];
}
function triangleDot(mesh,index){
  const indices=[mesh.indices[index],mesh.indices[index+1],mesh.indices[index+2]];
  const p=indices.map(k=>[mesh.positions[k*3],mesh.positions[k*3+1],mesh.positions[k*3+2]]);
  const u=p[1].map((v,i)=>v-p[0][i]),v=p[2].map((w,i)=>w-p[0][i]);
  const cross=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
  return cross.reduce((s,x,k)=>s+x*mesh.normals[indices[0]*3+k],0);
}

test('full catalogue has exactly 18 exclusive physical candidate identities without source ID aliasing',()=>{
  const ids=[...PACK_2_IDS,...PACK_2_JOINERY_IDS,...PACK_2_GROUND_IDS,
    ...PACK_2_INFRASTRUCTURE_IDS,WATER_CANDIDATE_ID];
  assert.deepEqual(ids,Array.from({length:18},(_,i)=>59+i));
  assert.deepEqual(PACK_2_FIXTURE_IDS,ids);
  assert.equal(new Set(ids).size,18);
  assert.ok(ids.every(n=>n>=59&&n<=108&&n!==255));
  assert.equal(WATER_ASSET.roster,45);
});
test('all 121 physical state variants have finite, bounded, nondegenerate outward-facing triangles',()=>{
  const variants=allCandidateVariants();
  assert.equal(variants.length,121);
  for(const {id,type,state,mesh:make} of variants){
    const m=make(),tag=id+' '+type+' '+JSON.stringify(state);
    assert.equal(m.indices.length%3,0,tag+' triangle index count');
    assert.ok(m.triangles>0&&m.triangles<=1600,tag+' triangle budget');
    assert.equal(m.triangles,m.indices.length/3);
    assert.equal(m.positions.length,m.colors.length);
    assert.equal(m.positions.length,m.normals.length);
    assert.ok([...m.positions,...m.colors,...m.normals].every(Number.isFinite),tag+' finite attributes');
    assert.ok([...m.colors].every(v=>v>=0&&v<=1),tag+' color bounds');
    assert.ok([...m.positions].every(v=>v>=-.005&&v<=1.005),tag+' local geometry bounds');
    for(let t=0;t<m.indices.length;t+=3){
      assert.ok(triangleDot(m,t)>1e-8,tag+' inverted/degenerate triangle #'+t/3);
    }
    if(type==='water'){
      assert.equal(m.materialPass,'transparent');
      assert.equal(m.depthWrite,false);
      assert.ok([...m.alpha].every(a=>a>0&&a<1));
    }
  }
});
test('state traversal does not hide a budget spike beyond 740 triangles',()=>{
  for(const {id,mesh,state} of allCandidateVariants()){
    const m=mesh();
    assert.ok(m.triangles<=740,'budget '+id+' '+JSON.stringify(state)+' '+m.triangles);
  }
});
test('every solid candidate state has valid box union and water has none',()=>{
  for(const {id,type,shape:make} of allCandidateVariants()){
    const s=make();
    assert.equal(s.candidateOnly,true);
    if(type==='water'){
      assert.deepEqual(s.boxes,[]);
      assert.equal(s.solidCollision,false);
      assert.equal(s.occupiedVolume.closed,true);
    }else{
      assert.ok(s.boxes.length>0&&s.boxes.length<=32);
      for(const b of s.boxes)for(let i=0;i<3;i++)
        assert.ok(b[i]>=0&&b[i]<b[i+3]&&b[i+3]<=1,'invalid AABB '+id);
    }
  }
});
test('every candidate ID is selected, placed, read and removed without mutating neighbors',()=>{
  const f=new Pack2Fixture();
  for(const id of PACK_2_FIXTURE_IDS){
    const c=[id-59,0,0];
    f.select(id);
    assert.equal(f.selection().id,id);
    assert.equal(f.place(c),true);
    assert.equal(f.read(c).id,id);
  }
  assert.equal(f.cells.size,18);
  const before=f.serialize();
  const restored=Pack2Fixture.restore(JSON.parse(JSON.stringify(before)));
  assert.deepEqual(restored.serialize(),before);
  for(const id of PACK_2_FIXTURE_IDS){
    const c=[id-59,0,0];
    assert.equal(restored.remove(c),true);
    assert.equal(restored.read(c),null);
  }
  assert.equal(restored.cells.size,0);
  assert.equal(f.cells.size,18);
});
test('rotations, mounts, hinge and fluid levels survive one mixed non-production fixture snapshot',()=>{
  const f=new Pack2Fixture();
  f.select(59);assert.equal(f.place([0,1,0]),true);
  f.select(64);f.turn();f.cycleVariant();assert.equal(f.place([1,1,0]),true);
  f.select(66);f.turn();f.toggleSelection();assert.equal(f.place([2,1,0]),true);
  f.select(73);f.turn();f.cycleVariant();assert.equal(f.place([3,1,0]),true);
  f.select(76);f.setWaterSelection({level:7,flow:'west'});assert.equal(f.place([4,1,0]),true);
  const raw=JSON.stringify(f.serialize());
  const g=Pack2Fixture.restore(JSON.parse(raw));
  assert.equal(JSON.stringify(g.serialize()),raw);
  assert.deepEqual(g.read([1,1,0]),joineryCell(64,{rotation:1,variant:'upper'}));
  assert.equal(g.read([2,1,0]).open,true);
  assert.deepEqual(g.read([3,1,0]),infrastructureCell(73,{rotation:1,variant:'terminal'}));
  assert.deepEqual(g.read([4,1,0]),waterCell({level:7,flow:'west'}));
});
test('the water narrow phase selects a real shallow plane, not its broad-phase prism envelope',()=>{
  const state=waterCell({level:7,flow:'east'});
  const top=waterSurfaceHeight(state,.85,.5);
  const hit=waterRaycast(state,[.85,2,.5],[0,-1,0],[0,0,0],6);
  assert.ok(hit);
  assert.equal(hit.face,'surface');
  assert.ok(Math.abs(hit.distance-(2-top))<1e-7);
  assert.equal(waterRaycast(state,[.85,.9,-1],[0,0,1]),null);
  assert.equal(waterShape(state).solidCollision,false);
});
test('all 36 water states match analytic top-height ray intersection on a 25-point sample grid',()=>{
  const samples=[.05,.25,.5,.75,.95];
  let rays=0;
  for(let level=0;level<8;level++){
    const flows=level===0?['still']:WATER_FLOW_DIRECTIONS;
    for(const flow of flows){
      const state=waterCell({level,flow});
      for(const x of samples)for(const z of samples){
        const y=waterSurfaceHeight(state,x,z);
        const hit=waterRaycast(state,[x,2,z],[0,-1,0],[0,0,0],6);
        assert.ok(hit,'missing top hit '+level+'/'+flow+' '+x+','+z);
        assert.equal(hit.face,'surface');
        assert.ok(Math.abs(hit.distance-(2-y))<1e-6,
          'water triangle/analytic level mismatch '+level+'/'+flow);
        const volume=waterShape(state);
        assert.equal(volume.solidCollision,false);
        rays++;
      }
    }
  }
  assert.equal(rays,900);
});
test('no animation, fluid propagation, world generation or production save integration can be implied',()=>{
  assert.equal(WATER_ASSET.fluidSimulationImplemented,false);
  assert.equal(WATER_ASSET.worldGenerationEnabled,false);
  assert.equal(WATER_ASSET.physicsContract.noLocalSimulation,true);
  assert.equal(WATER_ASSET.saveContract.existingSchema1,'untouched');
  assert.equal(WATER_ASSET.renderContract.transparentSorting,'engine-required');
});
