import test from 'node:test';
import assert from 'node:assert/strict';
import {preflightWorldComposition} from '../../src/auto-integration-support/composition-preflight.mjs';
const cell=(x,y,z,blockId=1)=>({x,y,z,blockId});
const base=()=>({naturalCells:[cell(0,9,0),cell(1,9,0),cell(0,8,0,0)],
 surfaceFeatures:[cell(0,9,0,2)],playerEdits:[],caveRoutes:[],objects:[],
 registeredIds:[1,2],depthMinY:-40,depthMaxY:12});
test('explicit natural restoration and mined air mask overlays independent of edit order',()=>{
 const a=base(); a.playerEdits=[{x:0,y:9,z:0,blockId:1,sequence:3},{x:1,y:9,z:0,blockId:0,sequence:4}];
 const one=preflightWorldComposition(a);
 const two=preflightWorldComposition({...a,playerEdits:[...a.playerEdits].reverse(),naturalCells:[...a.naturalCells].reverse()});
 assert.equal(one.ok,true); assert.deepEqual(one,two);
 assert.equal(one.cells.find(c=>c.x===0&&c.y===9).source,'player-edit');
 assert.equal(one.cells.find(c=>c.x===0&&c.y===9).id,1);
 assert.equal(one.cells.find(c=>c.x===1).id,0);
});
test('fail closed for orphan overlay and orphan edits',()=>{
 assert.equal(preflightWorldComposition({...base(),surfaceFeatures:[cell(9,9,9,2)]}).reason,'overlay-without-natural-cell');
 assert.equal(preflightWorldComposition({...base(),playerEdits:[{x:9,y:9,z:9,blockId:1,sequence:1}]}).reason,'edit-without-natural-cell');
});
test('cave path must anchor to a known surface cell and respect depth',()=>{
 const a=base();a.caveRoutes=[{surfaceY:9,entrance:{x:0,y:9,z:0},exit:{x:0,y:8,z:0},path:[{x:0,y:9,z:0},{x:0,y:8,z:0}]}];
 assert.equal(preflightWorldComposition(a).ok,true);
 assert.equal(preflightWorldComposition({...a,caveRoutes:[{...a.caveRoutes[0],entrance:{x:9,y:9,z:0}}]}).reason,'cave-entrance-without-surface');
 assert.equal(preflightWorldComposition({...a,depthMinY:9}).reason,'cave-invalid-path-cell');
});
test('object footprints cannot overlap resolved solid terrain but may occupy mined cells',()=>{
 const a=base();a.objects=[{id:'object:fern-1',anchor:{x:1,y:9,z:0},footprint:[{x:0,y:0,z:0}],triangles:12,alphaMode:'cutout'}];
 assert.equal(preflightWorldComposition(a).reason,'object-occupied-footprint');
 a.playerEdits=[{x:1,y:9,z:0,blockId:0,sequence:1}];
 assert.equal(preflightWorldComposition(a).ok,true);
});
