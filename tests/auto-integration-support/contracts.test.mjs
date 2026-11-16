import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeSurfaceFeatures,composeSurfaceCell,validateCaveHandshake,validateObjectAnchors} from '../../src/auto-integration-support/contracts.mjs';
test('surface normalization is stable and rejects unregistered/duplicate materials',()=>{
  assert.deepEqual(normalizeSurfaceFeatures([{x:2,y:0,z:0,blockId:1},{x:1,y:0,z:0,blockId:1}],{registeredIds:[1]}).map(f=>f.x),[1,2]);
  assert.throws(()=>normalizeSurfaceFeatures([{x:0,y:0,z:0,blockId:256}],{registeredIds:[1]}),/registered/);
  assert.throws(()=>normalizeSurfaceFeatures([{x:0,y:0,z:0,blockId:1},{x:0,y:0,z:0,blockId:1}],{registeredIds:[1]}),/duplicate/);
});
test('restoring natural type is still an edit and never resurrects an overlay',()=>{
  assert.deepEqual(composeSurfaceCell({naturalId:1,overlayId:2,hasPlayerEdit:true,playerEditId:1,registeredIds:[1,2]}),{id:1,source:'player-edit'});
  assert.deepEqual(composeSurfaceCell({naturalId:1,overlayId:2,registeredIds:[1,2]}),{id:2,source:'overlay'});
  assert.deepEqual(composeSurfaceCell({naturalId:1,overlayId:2,hasPlayerEdit:true,playerEditId:0,registeredIds:[1,2]}),{id:0,source:'player-edit'});
});
test('cave handshake checks depth and Manhattan connectivity',()=>{
  const good={surfaceY:12,entranceY:11,depthMinY:-40,depthMaxY:12,path:[{x:0,y:11,z:0},{x:0,y:10,z:0},{x:1,y:10,z:0}]};
  assert.equal(validateCaveHandshake(good).ok,true);
  assert.equal(validateCaveHandshake({...good,path:[good.path[0],good.path[2]]}).reason,'disconnected-path');
  assert.equal(validateCaveHandshake({...good,entranceY:-41}).reason,'invalid-bounds');
});
test('non-block object anchors reject collisions, duplicate IDs and excessive geometry',()=>{
  const obj={id:'object:fern-1',anchor:{x:0,y:1,z:0},footprint:[{x:0,y:0,z:0}],triangles:24,alphaMode:'cutout'};
  assert.equal(validateObjectAnchors([obj],{maxTriangles:24}).ok,true);
  assert.equal(validateObjectAnchors([obj],{occupiedCells:[{x:0,y:1,z:0}]}).reason,'occupied-footprint');
  assert.equal(validateObjectAnchors([obj,obj]).reason,'duplicate-object-id');
  assert.equal(validateObjectAnchors([obj],{maxTriangles:23}).reason,'triangle-budget');
});
