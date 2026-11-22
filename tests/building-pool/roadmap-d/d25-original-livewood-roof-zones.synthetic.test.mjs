import test from 'node:test';
import assert from 'node:assert/strict';
import {planD25OriginalLiveWoodRoofZones as plan} from '../../../src/building-pool/roadmap-d/d25-original-livewood-roof-zones.mjs';
const K=a=>a.join(',');
function fixture(){
 const cells=[],navigation=[];
 for(let z=0;z<8;z++)for(let x=0;x<16;x++){
  const anchor=[0,6,12,15].includes(x);
  cells.push({at:[x,0,z],role:'foundation',asset:'live:stone'});
  cells.push({at:[x,1,z],role:'floor',asset:'live:wood'});
  cells.push({at:[x,7,z],role:'roof',feature:'weather-plane',asset:'live:wood'});
  if(anchor)for(let y=2;y<=6;y++)cells.push({at:[x,y,z],role:'wall',asset:'live:stone'});
  else navigation.push({at:[x,2,z],mode:'walk'});
 }
 const b={id:'SYNTHETIC-D25-TEST-NOT-ORIGINAL',cells,navigation,integrated:false,worldPlaced:false,creatorApproved:false};
 const beam=z=>{
  const points=[1,2,3,4,5].map(x=>[x,6,z]);
  return {blueprintId:b.id,verifiedSourceBearingToFoundation:true,
   originalPrimaryAndNewBeamCellsDisjoint:true,proposedBeamCells:points.map(p=>({at:p,asset:'pack2:015',candidateId:61})),
   proposedTrussSpans:[{spanCells:points.length,points,bearingStart:[0,6,z],bearingEnd:[6,6,z],
    bothBearingsReachUnbrokenOriginalFoundation:true}]};
 };
 return {b,p:beam(0),s:beam(1)};
}
test('synthetic full-height walking columns remain inviolable; real-overhead third lane is geometrically bounded',()=>{
 const {b,p,s}=fixture();const before=b.cells.map(c=>K(c.at)+'|'+c.asset).join(';');
 const r=plan(b,p,s,{distanceLimit:4});
 assert.equal(r.originalRoofCells,128);assert.equal(r.verifiedOriginalFoundationWallRoofAnchors,32);
 assert.equal(r.sourceFullHeightPierCandidates,0);
 assert.equal(r.originalEmptyY2ToY6RoofColumns,96);
 assert.equal(r.originalEmptyColumnsWithNavigation,96);
 assert.ok(r.thirdLaneProposedSpans.length>0);
 const occupied=new Set(b.cells.map(c=>K(c.at)));
 const prior=new Set([...p.proposedBeamCells,...s.proposedBeamCells].map(c=>K(c.at)));
 for(const c of r.thirdLaneProposedCells){assert.equal(c.at[1],6);assert.equal(c.asset,'pack2:015');
  assert.ok(!occupied.has(K(c.at)));assert.ok(!prior.has(K(c.at)));
  assert.equal(b.cells.find(x=>K(x.at)===K([c.at[0],7,c.at[2]]))?.asset,'live:wood');}
 assert.equal(r.originalWalkingSourceUnmodified,true);
 assert.equal(r.actualLiveWoodGravityLoadAccepted,false);
 assert.equal(r.realPack2ToActualLiveWoodPhysicalContactCertified,false);
 assert.equal(r.originalGameWebGL2Accepted,false);
 assert.equal(b.cells.map(c=>K(c.at)+'|'+c.asset).join(';'),before);
});
test('planning metrics never convert Pack2 or Pack3 visual source into certified load support',()=>{
 const {b,p,s}=fixture(),r=plan(b,p,s,{distanceLimit:2,maxNewSpans:0,maxNewBeamCells:0});
 assert.equal(r.thirdLaneProposedSpans.length,0);
 assert.ok(r.originalPlusD19D22HypotheticalWithinRadius>=r.strictOriginalWallOnlyWithinRadius);
 assert.equal(r.originalPlusD19D22HypotheticalBeyondRadius+r.originalPlusD19D22HypotheticalWithinRadius,128);
 assert.equal(r.actualRoofMaterial,'live:wood');assert.equal(r.originalPack3RoofActuallyAuthored,false);
});
test('forged Y7 roofing, invalid wall bearing, duplicated authored cell and colliding D22 beam fail closed',()=>{
 const {b,p,s}=fixture();
 const roof=b.cells.find(c=>c.at[1]===7);
 assert.throws(()=>plan({...b,cells:b.cells.map(c=>c===roof?{...c,asset:'pack3:109'}:c)},p,s),/live:wood/);
 assert.throws(()=>plan({...b,cells:[...b.cells,b.cells[0]]},p,s),/duplicate/);
 const invalid={...p,proposedTrussSpans:p.proposedTrussSpans.map(q=>({...q,bearingStart:[1,6,0]}))};
 assert.throws(()=>plan(b,invalid,s),/foundation support|endpoint-to-foundation/);
 const collided={...s,proposedBeamCells:s.proposedBeamCells.map((q,i)=>i? q:{...q,at:p.proposedBeamCells[0].at})};
 assert.throws(()=>plan(b,p,collided),/collision/);
});
test('geometry, nav, budget and source-mode constraints are explicit',()=>{
 const {b,p,s}=fixture();
 assert.throws(()=>plan({...b,worldPlaced:true},p,s),/unplaced/);
 assert.throws(()=>plan({...b,navigation:[...b.navigation,b.navigation[0]]},p,s),/ambiguous/);
 assert.throws(()=>plan(b,p,s,{maxSpanCells:64}),/out of range/);
 assert.throws(()=>plan(b,p,s,{maxReportedZones:-1}),/out of range/);
});
