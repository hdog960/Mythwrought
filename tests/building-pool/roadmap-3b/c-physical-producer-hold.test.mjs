// Source-accurate, deliberately NON-CERTIFYING producer ABI exposure audit.
// Every unresolved Pack family stays blocked until actual runtime geometry,
// rotated occupied offsets, collision and iPhone source/producer parity pass.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ASSET_CATALOG} from '../../../src/building-pool/roadmap-3b/assets.mjs';
import {createRoadmapCFirstGatehouseBlueprint} from '../../../src/building-pool/roadmap-3b/c1-twinstone-pass-gatehouse.mjs';
import {createRoadmapCFirstCityWallBlueprint} from '../../../src/building-pool/roadmap-3b/c3-fourwatch-closed-city-wall.mjs';
import {createCRoadmapCDesertBarracks} from '../../../src/building-pool/roadmap-3b/c4-sandglass-fork-desert-barracks.mjs';
import {createCSunbarrowCaravanGatehouse} from '../../../src/building-pool/roadmap-3b/c5-sunbarrow-desert-gatehouse.mjs';
import {createCGraniteSwitchbackCityWall} from '../../../src/building-pool/roadmap-3b/c6-granite-switchback-mountain-wall.mjs';
const cases=[
 ['r3:gatehouse:temperate:small:1',3142,2595,createRoadmapCFirstGatehouseBlueprint],
 ['r3:city-wall:temperate:small:1',2871,2452,createRoadmapCFirstCityWallBlueprint],
 ['r3:barracks:desert:medium:2',6739,4982,createCRoadmapCDesertBarracks],
 ['r3:gatehouse:desert:small:1',3535,2654,createCSunbarrowCaravanGatehouse],
 ['r3:city-wall:mountain:small:1',3936,3131,createCGraniteSwitchbackCityWall]
];
test('C owned source exact producer audit refuses to imply runtime variants or AABB approval for 15814 unresolved pack placements',()=>{
 const unresolved=new Map();let total=0,candidateVoxels=0;
 for(const [id,expectedCells,expectedUnresolved,builder] of cases){
  const b=builder();
  assert.equal(b.id,id);
  const cells=b.modules.flatMap(m=>m.cells);
  assert.equal(cells.length,expectedCells,'source voxel physical occupancy drift '+id);
  let pending=0;
  for(const [x,y,z,ref] of cells){
   assert.ok([x,y,z].every(Number.isSafeInteger),'unreal source placement');
   const producer=ASSET_CATALOG[ref];
   assert.ok(producer,'used symbol outside authoring catalog '+ref);
   if(producer.kind!=='existing'){
    assert.equal(producer.kind,'candidate','unexpected runtime-ready source asset flag '+ref);
    assert.equal(producer.dimensions,null,'unverified producer AABB stated as resolved '+ref);
    assert.equal(producer.persistentId,null,'unapproved production numeric ID '+ref);
    assert.equal(producer.orientation,null,'unapproved yaw/rotation mapping '+ref);
    pending++;
    unresolved.set(ref,(unresolved.get(ref)||0)+1);
   }
  }
  assert.equal(pending,expectedUnresolved,id+' unresolved producer block count drift');
  assert.equal(b.status,'theoretical');assert.equal(b.activated,false);
  assert.equal(b.architecture?.physicalProducerResolved||false,false,
   'source claims real producer was certified on source-only branch '+id);
  total+=cells.length;candidateVoxels+=pending;
  console.log('MYTHWROUGHT_C_SOURCE_PRODUCER_FIT_HOLD='+JSON.stringify({
   id,totalSourceVoxels:cells.length,unverifiedPhysicalFamilyPlacements:pending,
   realProducerCollisionCertified:false}));
 }
 assert.equal(total,20223);
 assert.equal(candidateVoxels,15814);
 assert.equal(unresolved.size,14,'manual Pack physical family dependency catalog changed');
 assert.equal([...unresolved.values()].reduce((a,b)=>a+b,0),candidateVoxels);
 assert.ok(unresolved.has('pack3:070')&&unresolved.has('pack1:008'));
 console.log('MYTHWROUGHT_C_3B_PRODUCER_BLOCKED='+JSON.stringify({
  sourceCandidates:cases.length,voxels:total,unverifiedCells:candidateVoxels,
  uniqueUnverifiedFamilies:unresolved.size,sourceCubeNotFinalProducer:true,
  realAabbYawCollisionAcceptancePassed:false}));
});
