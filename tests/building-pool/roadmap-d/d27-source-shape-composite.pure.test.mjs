// Native Node pure geometry tests; initial local execution requires NO game checkout.
import test from 'node:test';
import assert from 'node:assert/strict';
import {composeD27Pack2WoodFace,d27PositiveVolumeOverlap} from '../../../src/building-pool/roadmap-d/d27-source-shape-composite.mjs';
// Byte-identical dimensions of original Pack2 definitions.mjs at D26 head;
// full connected-GitHub native test additionally compares canonical owner source.
const X=[
 [0,.26,.26,1,.74,.74],[0,.20,.20,.14,.80,.80],[.86,.20,.20,1,.80,.80]
];
const Z=X.map(([x,y,z,X,Y,Z])=>[1-Z,y,x,1-z,Y,X]);
const POST=[
 [.33,0,.33,.67,1,.67],[.23,0,.23,.77,.14,.77],[.27,.86,.27,.73,1,.73]
];
const CUBE=[[0,0,0,1,1,1]];
test('pure original-dimension x/z Pack2 cut produces seven bounded collision boxes and exact nonduplicated wood face',()=>{
 for(const [axis,beam] of [['x',X],['z',Z]]){
  const a=composeD27Pack2WoodFace(beam,POST,axis,CUBE);
  assert.equal(a.originalBeamBoxCount,3);assert.equal(a.addedDerivedPostBoxCount,4);
  assert.equal(a.colliderBoxCount,7);
  assert.equal(Math.round(a.roofFaceArea*10000),2116);
  assert.equal(Math.round(a.nearEndFaceArea*10000),3600);
  assert.equal(Math.round(a.farEndFaceArea*10000),3600);
  assert.equal(a.boxes.length,7);
  for(let i=0;i<3;i++)for(let j=3;j<7;j++)
   assert.equal(d27PositiveVolumeOverlap(a.boxes[i],a.boxes[j]),false);
  assert.equal(a.liveGameInstalled,false);
  assert.equal(a.loadBearingOrGravityStrengthCertified,false);
 }
});
test('pure source must reject forged WOOD, beam shortening, disconnected owner and missing roof-contact geometry',()=>{
 assert.throws(()=>composeD27Pack2WoodFace(X,POST,'x',[[0,0,0,1,.125,1]]),/full-cube WOOD/);
 assert.throws(()=>composeD27Pack2WoodFace(X.map(b=>[b[0]+.01,b[1],b[2],b[3]-.01,b[4],b[5]]),POST,'x',CUBE),/wall-to-beam/);
 assert.throws(()=>composeD27Pack2WoodFace(X,POST.map(b=>[b[0],b[1],b[2],b[3],.99,b[5]]),'x',CUBE),/wood|detached/i);
 assert.throws(()=>composeD27Pack2WoodFace(X,POST,'y',CUBE),/exact bounded/);
 assert.throws(()=>composeD27Pack2WoodFace([[0,0,0,1,1,1]],POST,'x',CUBE),/exact bounded/);
});
test('returned read-only shape does not allow mutation of the source arrays or returned box records',()=>{
 const x=X.map(b=>[...b]),p=POST.map(b=>[...b]);
 const a=composeD27Pack2WoodFace(x,p,'x');
 assert.ok(Object.isFrozen(a));assert.ok(Object.isFrozen(a.boxes));
 assert.ok(a.boxes.every(Object.isFrozen));
 assert.throws(()=>{a.boxes[0][0]=.5;},TypeError);
 assert.deepEqual(x,X);assert.deepEqual(p,POST);
});
