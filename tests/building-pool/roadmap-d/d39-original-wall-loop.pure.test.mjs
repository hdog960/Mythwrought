import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectD39BoundedOriginalWallLoop,deriveD39UnregisteredRearFaceWitness,
 inspectD39OriginalRearFaceWitness,inspectD39RearMeshRayParity,screenD39UnratedExternalCaptureEvidence}
 from '../../../src/building-pool/roadmap-d/d39-actual-multicourse-wall-loop.mjs';
const palette={base:[.4,.24,.17],metal:[.29,.32,.33]};
const fixture=()=>{
 const m=new Map([["0,0,0",{role:'foundation'}],["0,1,0",{role:'floor'}],
  ...[2,3,4,5,6].map(y=>[`0,${y},0`,{role:'wall'}]),
  ["0,7,0",{role:'roof',asset:'live:wood'}]]);
 return {m,s:{get:(x,y,z)=>m.get(`${x},${y},${z}`),nav:new Set()}};
};
test('D39 complete original-wall projected winding requires a REAL closed cell-center path and a true opposite face; never rated capture',()=>{
 for(const axis of ['x','z'])for(const end of [true,false]){
  const {s}=fixture(),x=inspectD39BoundedOriginalWallLoop([0,6,0],axis,end,s,{levels:[5,6]});
  assert.equal(x.sourceOnlyProjectedWindingLoopFound,true);
  assert.equal(x.witness.trueRootBackFaceCellVisited,true);
  assert.equal(Math.abs(x.witness.projectedWinding),1);
  assert.equal(x.witness.path.length,x.witness.fullLoopCellCenterSteps+1);
  assert.deepEqual(x.witness.path[0],x.witness.path.at(-1));
  assert.equal(x.sourceOnlySingleCourseLoops,undefined);
  assert.equal(x.realRetainerOrMechanicalClosureInstalled,false);
  assert.equal(x.constructionAllowed,false);
  const plate=deriveD39UnregisteredRearFaceWitness([0,6,0],axis,end,palette),
   gate=screenD39UnratedExternalCaptureEvidence(x,inspectD39OriginalRearFaceWitness(plate,s),
       {measuredFastenerPullout:'fabricated report'});
  assert.equal(gate.missingAuthenticatedEvidence.length,13);
  assert.equal(gate.realPulloutCapacity,null);assert.equal(gate.constructionAllowed,false);
 }
});
test('D39 Y5 and Y6 direct four-face rings both fail, but bounded genuine multi-course path can detour vertically; no source edits',()=>{
 const {m,s}=fixture(),prior=[...m];
 m.set('1,5,0',{role:'wall'});m.set('-1,6,0',{role:'wall'});
 const x=inspectD39BoundedOriginalWallLoop([0,6,0],'x',false,s,{levels:[4,5,6]});
 assert.equal(x.sourceOnlyProjectedWindingLoopFound,true);
 assert.ok(x.witness.courseChanges>=2);
 assert.ok(x.witness.courseCount>=2);
 assert.equal(x.witness.trueRootBackFaceCellVisited,true);
 assert.ok(x.occupiedSourceVetoes>=2);
 assert.deepEqual([...m].slice(0,prior.length),prior);
 // Block every front/back position: geometry search MUST NOT manufacture a route.
 m.set('1,6,0',{role:'wall'});m.set('-1,5,0',{role:'wall'});
 const veto=inspectD39BoundedOriginalWallLoop([0,6,0],'x',false,s,{levels:[5,6]});
 assert.equal(veto.sourceOnlyProjectedWindingLoopFound,false);
 assert.equal(veto.witness,null);
 assert.equal(veto.constructionAllowed,false);
});
test('D39 original Pack2-metal palette rear-face cup is colored, source-clear and independent exact mesh/collider ray, not a mechanical retainer',()=>{
 for(const axis of ['x','z'])for(const end of [true,false]){
  const {s,m}=fixture(),cup=deriveD39UnregisteredRearFaceWitness([0,6,0],axis,end,palette);
  assert.equal(cup.mesh.indices.length,36);
  assert.equal(cup.sourcePaletteId,61);
  assert.ok(Math.abs(cup.wallBackFaceGeometricArea-.0384)<1e-10);
  assert.equal(cup.constructionAllowed,false);
  const a=inspectD39OriginalRearFaceWitness(cup,s),ray=inspectD39RearMeshRayParity(cup);
  assert.equal(a.geometricallySourceClear,true);
  assert.ok(ray.rayDelta<1e-5);
  assert.equal(ray.productionRaycastNotAccepted,true);
  const [x,y,z]=cup.bounds.min.map(Math.floor);m.set(`${x},${y},${z}`,{role:'wall'});
  const blocked=inspectD39OriginalRearFaceWitness(cup,s);
  assert.ok(blocked.originalSourceCellClashes>0);
  assert.equal(blocked.geometricallySourceClear,false);
 }
});
test('D39 counterfeit roof, weak source provenance, invalid bounds, unbounded search, or invented unowned material fails closed',()=>{
 const {s,m}=fixture();
 assert.throws(()=>inspectD39BoundedOriginalWallLoop([0,6,0],'bad',false,s),/bounded/);
 assert.throws(()=>inspectD39BoundedOriginalWallLoop([0,6,0],'x',false,s,{maxRadius:200}),/bounded/);
 assert.throws(()=>inspectD39BoundedOriginalWallLoop([0,6,0],'x',false,s,{levels:[6,5]}),/bounded/);
 assert.throws(()=>deriveD39UnregisteredRearFaceWitness([0,6,0],'x',false,{...palette,metal:[1,1,1]}),/authentic|original/);
 assert.throws(()=>inspectD39BoundedOriginalWallLoop([0,6,0],'x',false,{get:s.get,nav:new Map()}),/original/);
 m.set('0,7,0',{role:'roof',asset:'live:stone'});
 assert.throws(()=>inspectD39BoundedOriginalWallLoop([0,6,0],'x',false,s),/original/);
});
