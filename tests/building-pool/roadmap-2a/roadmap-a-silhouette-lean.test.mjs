import test from 'node:test';
import assert from 'node:assert/strict';
import {validateBlueprint,assertDistinctArchitecture} from '../../../src/building-pool/roadmap-2a/schema.mjs';
import {ROADMAP_A_VISUAL19_LEAN_BASES,ROADMAP_A_VISUAL19_HEAVY_ALTERNATIVES,ROADMAP_A_VISUAL19_LEAN_ALTERNATIVES} from '../../../src/building-pool/roadmap-2a/roadmap-a-silhouette-lean.mjs';
const k=v=>v.x+','+v.y+','+v.z;
test('Visual19 LEAN: 19 reversible genuine roof-volume variants retain every original cell and every original source identity',{timeout:240000},()=>{
 const bases=ROADMAP_A_VISUAL19_LEAN_BASES,heavy=ROADMAP_A_VISUAL19_HEAVY_ALTERNATIVES,lean=ROADMAP_A_VISUAL19_LEAN_ALTERNATIVES;
 assert.equal(bases.length,19);assert.equal(heavy.length,19);assert.equal(lean.length,19);
 let originalAdd=0,leanAdd=0;const styles=new Set();
 for(let i=0;i<19;i++){
  const b=bases[i],h=heavy[i],l=lean[i];
  assert.equal(validateBlueprint(l).valid,true);
  assert.equal(b.id,h.id);assert.equal(h.id,l.id);
  const protectedCells=new Map(b.voxels.map(v=>[k(v),v]));
  const heavyCells=new Map(h.voxels.map(v=>[k(v),v]));
  const finalCells=new Map(l.voxels.map(v=>[k(v),v]));
  assert.equal(finalCells.size,l.voxels.length,'duplicate voxel');
  for(const [p,v] of protectedCells)assert.deepEqual(finalCells.get(p),v,'original voxel changed '+b.id+' '+p);
  for(const [p,v] of finalCells)assert.deepEqual(heavyCells.get(p),v,'non-subset or modified fat study cell '+b.id+' '+p);
  const added=l.voxels.filter(v=>!protectedCells.has(k(v)));
  assert.equal(added.length,l.sourceVisualRevision.additiveRoofCells);
  assert.ok(added.length<=.72*h.sourceVisualRevision.additiveRoofCells,b.id);
  assert.ok(l.sourceVisualRevision.genuineRoofColumns>=32,b.id);
  assert.ok(l.extents.y>=h.extents.y,'silhouette peak was lost '+b.id);
  const originalRoofXY=new Set(b.voxels.filter(v=>v.kind==='roof').map(v=>v.x+','+v.z));
  for(const v of added){
   assert.equal(v.kind,'roof');
   assert.ok(originalRoofXY.has(v.x+','+v.z),'added roof in protected courtyard');
   assert.equal(finalCells.get(v.x+','+(v.y-1)+','+v.z)?.kind,'roof','vertical support root broken');
  }
  assert.deepEqual(l.rooms,b.rooms);assert.deepEqual(l.openings,b.openings);
  assert.deepEqual(l.circulation,b.circulation);assert.deepEqual(l.courtyardGeometry,b.courtyardGeometry);
  assert.deepEqual(l.unresolvedDependencies,b.unresolvedDependencies);
  assert.equal(l.worldPlaced,false);assert.equal(l.numericIdsAssigned,false);
  assert.equal(l.sourceVisualRevision.physicalPackMeshAccepted,false);
  assert.equal(l.sourceVisualRevision.actualGPUCostAccepted,false);
  styles.add(l.sourceVisualRevision.roofStyle);
  originalAdd+=h.sourceVisualRevision.additiveRoofCells;leanAdd+=added.length;
 }
 assert.equal(styles.size,6);
 assert.ok(originalAdd>=24000);
 assert.ok(leanAdd<=11500,'source geometry should materially reduce total roof mass');
 assert.ok(leanAdd<=.5*originalAdd,'fail if >50% of massive previous roof voxel count');
 console.log('ROADMAP_A_VISUAL19_LEAN_SOURCE_BUDGET '+JSON.stringify({originalAdd,leanAdd,sourceVoxelReductionPct:+(100*(1-leanAdd/originalAdd)).toFixed(2),realGpuBudgetMeasured:false}));
 assert.equal(assertDistinctArchitecture(lean).distinctArchitectures,19);
});
