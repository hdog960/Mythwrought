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

test('cave producer handshake proves exact world anchors and optionally a simple path',()=>{
  const entrance={x:4,y:9,z:-2}, exit={x:5,y:7,z:-2};
  const path=[entrance,{x:4,y:8,z:-2},{x:4,y:7,z:-2},exit];
  const base={surfaceY:10,entranceY:9,depthMinY:-50,depthMaxY:10,path,entrance,exit,requireSimplePath:true};
  assert.deepEqual(validateCaveHandshake(base),{ok:true,visitedCells:4});
  assert.equal(validateCaveHandshake({...base,entrance:{x:3,y:9,z:-2}}).reason,'entrance-mismatch');
  assert.equal(validateCaveHandshake({...base,exit:{x:6,y:7,z:-2}}).reason,'exit-mismatch');
  assert.equal(validateCaveHandshake({...base,entrance:{x:4,y:8,z:-2}}).reason,'invalid-entrance-anchor');
  assert.equal(validateCaveHandshake({...base,path:[...path,{x:4,y:7,z:-2}]}).reason,'revisited-path-cell');
  assert.equal(validateCaveHandshake({...base,path:[...path,{x:4,y:7,z:-2}],requireSimplePath:false}).reason,'exit-mismatch');
  assert.equal(validateCaveHandshake({...base,path:[entrance,{x:4,y:8,z:-2},{x:4,y:9,z:-2}]}).reason,'revisited-path-cell');
});
