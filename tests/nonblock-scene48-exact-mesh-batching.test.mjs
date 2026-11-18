import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareBreakableObjectDraws} from '../src/nonblock-scene48/breakable-draw-preparation.mjs';
import {NONBLOCK_OBJECT_VERSION} from '../src/nonblock-scene48/nonblock-object-v1.mjs';

function object(key,positions,variant=0,sceneId='scene48:low-grass'){
 const mesh={positions:new Float32Array(positions),materials:new Uint8Array([1])};
 return {contract:NONBLOCK_OBJECT_VERSION,instanceKey:key,sceneId,variant,anchor:[0,0,0],
  selectionAabbs:[{min:[0,0,0],max:[1,1,1]}],render:{mesh,triangleCount:1}};
}
const tri=[0,0,0,1,0,0,0,1,0];
const prepare=objects=>prepareBreakableObjectDraws({contract:NONBLOCK_OBJECT_VERSION,visible:()=>objects},{position:[0,0,0]});
test('identical geometry across distinct anchored identities shares one draw submission',()=>{
 const result=prepare([object('a',tri),object('b',tri)]);
 assert.equal(result.draws.length,1);
 assert.deepEqual(result.draws[0].instances.map(x=>x.instanceKey),['a','b']);
 assert.equal(result.stats.triangles,2);
});
test('different triangle positions, variant or family never share draw submission',()=>{
 const changed=[...tri];changed[3]=0.5;
 const result=prepare([object('a',tri),object('b',changed),object('c',tri,1),object('d',tri,0,'scene48:short-fern')]);
 assert.equal(result.draws.length,4);
 assert.equal(result.stats.selected,4);
});
test('batching respects object caps and leaves caller-owned typed arrays unchanged',()=>{
 const a=object('a',tri),b=object('b',tri);
 const before=[...a.render.mesh.positions];
 const result=prepareBreakableObjectDraws({contract:NONBLOCK_OBJECT_VERSION,visible:()=>[a,b]},{position:[0,0,0]},{maxInstances:1});
 assert.equal(result.draws.length,1);
 assert.equal(result.draws[0].instances.length,1);
 assert.equal(result.stats.budgetDropped,1);
 assert.deepEqual([...a.render.mesh.positions],before);
});
