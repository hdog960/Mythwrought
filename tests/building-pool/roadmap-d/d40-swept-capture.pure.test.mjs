import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectD40SweptOriginalWallRoute,probeD40ActualStrapSweep,
 deriveD40UnregisteredStrapSegment,d40SegmentCellShapes,
 inspectD40StrapMeshRay,screenD40RealTensionCaptureEvidence}
 from '../../../src/building-pool/roadmap-d/d40-swept-exterior-capture.mjs';
const palette={base:[.4,.24,.17],metal:[.29,.32,.33]};
const fixture=()=>{
 const cells=new Map([['0,0,0',{role:'foundation'}],['0,1,0',{role:'floor'}],
  ...[2,3,4,5,6].map(y=>[`0,${y},0`,{role:'wall'}]),
  ['0,7,0',{role:'roof',asset:'live:wood'}]]);
 return {cells,source:{get:(x,y,z)=>cells.get(`${x},${y},${z}`),nav:new Set()}};
};
test('D40 four root-plane/end orientations have an actual bounded closed nonzero winding with all straight and bend prisms clear, but no fastener',()=>{
 for(const plane of ['x','z'])for(const rootAtEnd of [false,true]){
  const {source}=fixture(),a=inspectD40SweptOriginalWallRoute([0,6,0],plane,rootAtEnd,source,
    {radius:3,levels:[4,5,6],halfWidth:.08});
  assert.equal(a.finiteThicknessClosedWindingFound,true,`${plane} ${rootAtEnd}`);
  assert.equal(Math.abs(a.witness.projectedWinding),1);
  assert.equal(a.witness.rearCellActuallyVisited,true);
  assert.equal(a.witness.allStraightAndCornerVolumesSourceClear,true);
  assert.equal(a.witness.path[0].join(','),a.witness.path.at(-1).join(','));
  assert.equal(a.realWallToFoundationRetentionProven,false);
  assert.equal(a.constructionAllowed,false);assert.equal(a.worldWrites,0);
 }
});
test('D40 a genuine lower Y3 course can rescue a bounded route blocked on every x=0 rear-crossing at Y4–Y6; a different source body may still veto it',()=>{
 const {cells,source}=fixture();
 for(const y of [4,5,6])for(let z=-4;z<=4;z++)if(z!==0)cells.set(`0,${y},${z}`,{role:'wall'});
 const hi=inspectD40SweptOriginalWallRoute([0,6,0],'x',false,source,
  {radius:4,levels:[4,5,6]});
 const low=inspectD40SweptOriginalWallRoute([0,6,0],'x',false,source,
  {radius:4,levels:[3,4,5,6]});
 assert.equal(hi.finiteThicknessClosedWindingFound,false);
 assert.equal(low.finiteThicknessClosedWindingFound,true);
 assert.ok(low.witness.elevationChanges>0);
 assert.equal(low.witness.path.some(p=>p[1]===3),true);
 assert.equal(low.constructionAllowed,false);
 source.nav.add('0,2,-1');source.nav.add('0,2,1');
 const blocked=inspectD40SweptOriginalWallRoute([0,6,0],'x',false,source,
  {radius:4,levels:[3,4,5,6]});
 assert.equal(blocked.constructionAllowed,false);
 assert.ok(blocked.centerStandingBodyVetoes>0);
});
test('D40 physical segment sweep vetoes a mid-span socket intrusion invisible to isolated endpoint checks and preserves original source',()=>{
 const {cells,source}=fixture(),before=[...cells];
 const a=[1,5,0],b=[2,5,0],socket={min:[1.98,5.48,.48],max:[2.02,5.52,.52]};
 const endA=probeD40ActualStrapSweep(a,[1,6,0],source); // separate segment is geometrically unblocked
 assert.equal(endA.clearedEntireStraightPhysicalEnvelope,true);
 const across=probeD40ActualStrapSweep(a,b,source,{socketBounds:socket});
 assert.equal(across.socketCollisionEvents,1);
 assert.equal(across.clearedEntireStraightPhysicalEnvelope,false);
 assert.equal(across.originalSourceCollisionEvents,0);
 cells.set('2,5,0',{role:'partition'});
 const blocked=probeD40ActualStrapSweep(a,b,source);
 assert.ok(blocked.originalSourceCollisionEvents>0);
 assert.equal(blocked.constructionAllowed,false);
 cells.delete('2,5,0');
 assert.deepEqual([...cells],before);
 assert.throws(()=>probeD40ActualStrapSweep([1,5,0],[3,5,0],source),/source reader/);
 assert.throws(()=>inspectD40SweptOriginalWallRoute([0,6,0],'x',false,source,{radius:5}),/input/);
});
test('D40 two-cell no-registration source-palette metal strap has real independent original mesh ray and fail-closed capacity/authority labels',()=>{
 const segment=deriveD40UnregisteredStrapSegment([2,6,1],[3,6,1],palette),
  parts=d40SegmentCellShapes(segment),parity=inspectD40StrapMeshRay(segment);
 assert.equal(parts.parts,2);assert.ok(parts.get(2,6,1));assert.ok(parts.get(3,6,1));
 assert.equal(parts.get(2,6,0),null);
 assert.ok(parity.rayDelta<1e-5);assert.equal(parity.productionWebGL2RayAcceptance,false);
 assert.equal(segment.mesh.indices.length,36);
 assert.equal(segment.mesh.colors[0],Math.fround(palette.metal[0]));
 assert.equal(segment.constructionAllowed,false);
 assert.throws(()=>deriveD40UnregisteredStrapSegment([2,6,1],[4,6,1],palette),/adjacent/);
 assert.throws(()=>deriveD40UnregisteredStrapSegment([2,6,1],[3,6,1],{metal:[1,0,0]}),/palette/);
 const {source}=fixture(),route=inspectD40SweptOriginalWallRoute([0,6,0],'x',false,source,
  {radius:3,levels:[4,5,6]}),rear={constructionAllowed:false,geometricallySourceClear:true};
 const proof=screenD40RealTensionCaptureEvidence(route,rear,{ratedTension:'999999'});
 assert.equal(proof.requiredAuthenticatedEvidence.length,12);
 assert.equal(proof.ratedOriginalTensionCapacity,null);assert.equal(proof.constructionAllowed,false);
 assert.throws(()=>screenD40RealTensionCaptureEvidence({...route,constructionAllowed:true},rear),/only source-authentic/);
 source.get=()=>null;
 assert.throws(()=>inspectD40SweptOriginalWallRoute([0,6,0],'x',false,source),/intact/);
});
