import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectObjectAnchorHandshake as check} from '../../src/auto-integration-support/object-anchor-handshake.mjs';
const s={id:'object:grass-tuft',domain:'surface',anchor:{x:1,y:5,z:2},footprint:[{x:0,y:0,z:0}],triangles:8,alphaMode:'cutout'};
const base={objects:[s],surfaceAnchors:[s.anchor],reservedBlockIds:[76,130]};
test('surface fixture is accepted but not declared integrated',()=>assert.deepEqual(check(base),{ok:true,status:'FIXTURE_COMPATIBLE_ONLY',integrationVerified:false,objects:1,cells:1,triangles:8}));
test('source anchor and cave void required',()=>{
 assert.equal(check({...base,surfaceAnchors:[]}).reason,'missing-surface-anchor');
 const c={...s,id:'object:stalagmite',domain:'cave'};
 assert.equal(check({...base,objects:[c]}).reason,'missing-cave-anchor');
 assert.equal(check({...base,objects:[c],caveVoidCells:[c.anchor]}).ok,true);
});
test('reserved physical block ID is rejected',()=>assert.equal(check({...base,objects:[{...s,blockId:76}]}).reason,'invalid-object-or-id-collision'));
test('solid, void and duplicate occupancy fail closed',()=>{
 assert.equal(check({...base,occupiedCells:[s.anchor]}).reason,'occupied-footprint');
 assert.equal(check({...base,caveVoidCells:[s.anchor]}).reason,'surface-cave-void-conflict');
 assert.equal(check({...base,objects:[s,{...s,id:'object:other'}]}).reason,'occupied-footprint');
 assert.equal(check({...base,objects:[{...s,footprint:[{x:0,y:0,z:0},{x:0,y:0,z:0}]}]}).reason,'duplicate-footprint-cell');
});
test('budget and unsafe lattice coordinates fail closed',()=>{
 assert.equal(check({...base,maxTriangles:7}).reason,'triangle-budget');
 assert.equal(check({...base,objects:[{...s,anchor:{x:Number.MAX_SAFE_INTEGER,y:5,z:2},footprint:[{x:1,y:0,z:0}]}],surfaceAnchors:[{x:Number.MAX_SAFE_INTEGER,y:5,z:2}]}).reason,'coordinate-overflow');
});
test('source arrays and object are not mutated',()=>{const before=structuredClone(base);check(base);assert.deepEqual(base,before)});
