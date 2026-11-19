// Source-exact C6 real-voxel far-wall proposal tests; no renderer mutation.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createStagedCaveRuntime}
 from '../src/manual-caves/opt-in-runtime.mjs';
import {HISTORIC_NAMED_TARGETS,findNamedCavePlayerRoute}
 from '../src/manual-caves/named-destination-audit.mjs';
import {historicSecondaryScenes}
 from './cave-roadmap-secondary-browser-evidence.mjs';
import {FAR_CAVE_PROPOSAL,traceCaveFarVisibility}
 from './cave-roadmap-far-visibility-proposal.mjs';
import {BLOCK,chunkCoord} from '../src/voxel.mjs';

const seed=314159;
const runtime=createStagedCaveRuntime(seed,null,{approved:true});
const world=runtime.world,base=world.base;
const oldMapSize=base.caveCellMap.size,oldEditSize=base.edits.size;
function primary(name){
 const feature=HISTORIC_NAMED_TARGETS.find(x=>x.name===name);
 assert.ok(feature,'Protected #173 primary source missing '+name);
 const result=findNamedCavePlayerRoute(world,feature);
 assert.equal(result.ok,true,'Primary original source path not proven '+name);
 const at=result.target,back=result.route[Math.max(0,result.route.length-4)];
 return {name,at:{x:at.x,y:at.floor+1,z:at.z},
   to:{x:back.x,y:back.floor+2,z:back.z}};
}
const secondary=await historicSecondaryScenes(world,seed);
function other(name){
 const row=secondary.find(x=>x.secondary===name);
 assert.ok(row,'Protected #173 secondary original source not found '+name);
 return {name,at:row.at,to:row.to};
}
function show(scene,viewport=[844,390]){
 const report=traceCaveFarVisibility(world,{at:scene.at,to:scene.to,viewport});
 console.log('C6_READ_ONLY_FAR_ROCK_WITNESS',JSON.stringify({
  name:scene.name,viewport,near:report.nearResident,sourceRays:report.realSourceRayCount,
  outsideFirstRock:report.farFirstRock,unbounded:report.unboundedRayCount,
  potentialSourceChunks:report.candidatesFound,
  selected:report.selected.map(x=>({chunk:x.key,hits:x.hits,
    realBytes:x.actualMeshBytes,realVertices:x.actualVertices,at:[x.sourceX,x.sourceY,x.sourceZ]})),
  selectedExtraGpuBytes:report.selectedExtraGpuBytes,
  uncoveredFarRays:report.uncoveredFarRays,uncertain:report.uncertainCount}));
 return report;
}
test('C6 proposal uses production FOV and bounded actual voxel traces',()=>{
 const report=show(primary('Vaulted Stone Fan'));
 assert.equal(report.activeSection,-8);
 assert.equal(report.nearResident,27);
 assert.equal(report.realSourceRayCount,51);
 assert.ok(report.horizontalHFovDegrees>100&&report.horizontalHFovDegrees<120);
 assert.ok(report.rayBudget<=3264);
 assert.ok(report.bounded);
 assert.equal(report.rendersAnything,false);
 assert.equal(report.visualAcceptance,false);
 assert.ok(report.selected.length<=4);
 assert.ok(report.selectedExtraGpuBytes<=1048576);
});
test('C6 every proposed far occluder is outside near field and an actual mesh',()=>{
 const report=show(primary('Vaulted Stone Fan'),[932,430]);
 for(const c of report.selected){
  assert.ok(Math.max(Math.abs(c.cx-chunkCoord(report.source.at.x)),
   Math.abs(c.cz-chunkCoord(report.source.at.z)))===2);
  assert.ok(c.actualMeshBytes>0);
  assert.equal(c.actualMeshBytes,c.actualVertices*36);
  assert.ok([BLOCK.STONE,BLOCK.DEEPSTONE].includes(
   world.get(c.sourceX,c.sourceY,c.sourceZ)));
 }
 assert.ok(report.totalResidentProposal<=31);
});
test('C6 probes protected Rift Terraces second chamber and Crescent secondary refuge',()=>{
 for(const name of ['Rift Terraces / second offset chamber',
  'Crescent Refuge / secondary refugial pocket']){
  const scene=other(name),report=show(scene);
  assert.equal(report.nearResident,27);
  assert.equal(report.source.at.x,scene.at.x);
  assert.equal(report.source.at.z,scene.at.z);
  assert.equal(report.selected.length<=FAR_CAVE_PROPOSAL.maxExtraChunks,true);
  assert.ok(report.selectedExtraGpuBytes<=FAR_CAVE_PROPOSAL.maxExtraGpuBytes);
  assert.equal(report.visualAcceptance,false,'Source ray is not a real pixel-level result');
 }
});
test('C6 candidate cap cannot silently declare visual success',()=>{
 const scene=primary('Vaulted Stone Fan');
 const denied=traceCaveFarVisibility(world,{at:scene.at,to:scene.to,
  config:{...FAR_CAVE_PROPOSAL,maxExtraChunks:0,maxExtraGpuBytes:0}});
 assert.equal(denied.selected.length,0);
 assert.equal(denied.rendersAnything,false);
 assert.equal(denied.visualAcceptance,false);
 assert.equal(denied.bounded,true);
});
test('C6 viewport-derived HFOV changes candidate diagnostics, never GPU hard cap',()=>{
 for(const viewport of [[667,375],[844,390],[932,430]]){
  const report=show(primary('Vaulted Stone Fan'),viewport);
  assert.ok(report.bounded);
  assert.ok(report.horizontalHFovDegrees>90&&report.horizontalHFovDegrees<120);
  assert.ok(report.selectedExtraGpuBytes<=1048576);
 }
});
test('C6 preserves bedrock bottom near budget and never escapes world bounds',()=>{
 const scene=primary('Bedrock Labyrinth');
 const report=show(scene);
 assert.equal(report.nearResident,18);
 assert.equal(report.totalResidentProposal<=22,true);
 assert.ok(report.selectedExtraGpuBytes<=1048576);
});
test('C6 refuses surface camera, missing context and phantom proposal world',()=>{
 const scene=primary('Vaulted Stone Fan');
 assert.throws(()=>traceCaveFarVisibility({},scene),/INVALID_SOURCE/);
 assert.throws(()=>traceCaveFarVisibility(world,{at:{x:0,y:2,z:0},
  to:{x:10,y:2,z:10}}),/NOT_UNDERGROUND/);
 assert.throws(()=>traceCaveFarVisibility(world,{
  at:scene.at,to:scene.at}),/NO_CAMERA_FACING/);
 assert.throws(()=>traceCaveFarVisibility(world,{
  at:scene.at,to:scene.to,viewport:[0,390]}),/INVALID_VIEWPORT/);
});
test('C6 source probe does not edit any canonical cave physical cells or saves',()=>{
 assert.equal(runtime.registeredInHomeScreen,false);
 assert.equal(base.caveCellMap.size,oldMapSize);
 assert.equal(base.edits.size,oldEditSize);
 assert.equal(world.get(204,-125,136),BLOCK.DEEPSTONE);
 assert.equal(FAR_CAVE_PROPOSAL.productionRegistered,false);
 assert.equal(FAR_CAVE_PROPOSAL.proposalOnly,true);
});
