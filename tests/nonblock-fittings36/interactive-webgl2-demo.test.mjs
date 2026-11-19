import test from 'node:test';
import assert from 'node:assert/strict';
import {createInteractiveFittingsDemo} from '../src/nonblock-fittings36/interactive-webgl2-demo.mjs';
import {describeFitting} from '../src/nonblock-fittings36/fittings-phase1.mjs';

const sign=()=>describeFitting({sceneId:'scene36:signpost',seed:17,anchor:[3,4,5],variant:1,mount:{below:true}});
const config=(extra={})=>({canvas:{getContext:()=>null},seed:17,objects:[sign()],
 authorize:()=>true,readSidecar:()=>null,writeSidecar:()=>true,...extra});

test('demo requires explicit authorization and external sidecar callbacks',()=>{
 for(const key of ['authorize','readSidecar','writeSidecar'])
  assert.throws(()=>createInteractiveFittingsDemo(config({[key]:undefined})),/required/);
});
test('demo refuses duplicate deterministic instance keys before any GPU work',()=>{
 const o=sign();
 assert.throws(()=>createInteractiveFittingsDemo(config({objects:[o,o]})),/duplicate instance keys/);
});
test('demo rejects absent genuine WebGL2 rather than emulating a renderer',()=>{
 assert.throws(()=>createInteractiveFittingsDemo(config()),/real WebGL2 required/);
});
test('demo rejects mismatched seed before GL fixture construction',()=>{
 assert.throws(()=>createInteractiveFittingsDemo(config({seed:18})),/real WebGL2 required|invalid fixture/);
});
