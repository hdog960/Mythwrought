import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeSurfaceFeatures} from '../../src/auto-integration-support/contracts.mjs';
import {preflightWorldComposition} from '../../src/auto-integration-support/composition-preflight.mjs';

const MIN = Number.MIN_SAFE_INTEGER;
const MAX = Number.MAX_SAFE_INTEGER;
const cell = (x,y,z,blockId=1) => ({x,y,z,blockId});
test('surface ordering stays exact at safe integer extremes and ties', () => {
  const source = [cell(MAX,0,0),cell(MIN,0,0),cell(0,MAX,0),cell(0,MIN,0),cell(0,0,MAX),cell(0,0,MIN)];
  const expected = [source[1],source[5],source[3],source[2],source[4],source[0]];
  assert.deepEqual(normalizeSurfaceFeatures(source,{registeredIds:[1]}),expected);
  assert.deepEqual(normalizeSurfaceFeatures([...source].reverse(),{registeredIds:[1]}),expected);
});
test('preflight resolved cell ordering is independent of producer input order at extremes', () => {
  const naturalCells = [cell(MAX,0,0),cell(MIN,0,0),cell(0,MAX,0),cell(0,MIN,0),cell(0,0,MAX),cell(0,0,MIN)];
  const args = {naturalCells,surfaceFeatures:[],playerEdits:[],caveRoutes:[],objects:[],
    registeredIds:[1],depthMinY:-10,depthMaxY:10};
  const forward = preflightWorldComposition(args);
  const reverse = preflightWorldComposition({...args,naturalCells:[...naturalCells].reverse()});
  assert.equal(forward.ok,true);
  assert.deepEqual(forward,reverse);
  assert.deepEqual(forward.cells.map(c=>[c.x,c.y,c.z]),[
    [MIN,0,0],[0,0,MIN],[0,MIN,0],[0,MAX,0],[0,0,MAX],[MAX,0,0]]);
});
test('extreme coordinates remain distinct under overlay and explicit restoration', () => {
  const naturalCells=[cell(MIN,0,0),cell(MAX,0,0)];
  const args={naturalCells,surfaceFeatures:[cell(MIN,0,0,2)],playerEdits:[
    {x:MIN,y:0,z:0,blockId:1,sequence:1}],caveRoutes:[],objects:[],
    registeredIds:[1,2],depthMinY:-1,depthMaxY:1};
  const result=preflightWorldComposition(args);
  assert.equal(result.ok,true);
  assert.deepEqual(result.cells.map(c=>[c.x,c.id,c.source]),[
    [MIN,1,'player-edit'],[MAX,1,'natural']]);
});
