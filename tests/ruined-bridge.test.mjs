import test from 'node:test';
import assert from 'node:assert/strict';
import {ruinedBridgeVertices,RUINED_BRIDGE_LIMITS} from '../src/ruined-bridge.mjs';

// Artificial terrain fixture deliberately models a real dry channel:
// three lanes across, lower natural stone bed, and firm matching banks.
const baseAt=(x,y,z)=>y===5?(x>=5&&x<=11?0:1):y===4?1:0;
const world={seed:4,get:(x,y,z)=>baseAt(x,y,z)};
const crossingAt=()=>({natural:true,width:3,x:8,z:8,bankY:5,axis:'x'});
const render=(w=world,c=crossingAt,base=baseAt)=>ruinedBridgeVertices(w,0,0,{crossingAt:c,baseAt:base});
test('bridge fails closed without independent terrain verification',()=>{
 assert.equal(ruinedBridgeVertices(world,0,0).length,0);
 assert.equal(ruinedBridgeVertices(world,0,0,{crossingAt}).length,0);
 assert.equal(render(world,()=>({...crossingAt(),natural:false})).length,0);
 assert.equal(render(world,()=>({...crossingAt(),width:2.5})).length,0);
 assert.equal(render(world,()=>({...crossingAt(),axis:'invalid'})).length,0);
});
test('flat plains and fake channel hints never produce a bridge',()=>{
 const flat=()=>1;
 assert.equal(render({seed:4,get:flat},crossingAt,flat).length,0);
});
test('bridge refuses player edits on banks, channel floor and overhead',()=>{
 for(const [x,y,z,id] of [[3,5,8,0],[8,5,8,2],[8,6,8,2],[8,4,8,0],[8,7,9,2]]){
  const edited={...world,get:(a,b,c)=>a===x&&b===y&&c===z?id:world.get(a,b,c)};
  assert.equal(render(edited).length,0,`edit at ${x},${y},${z}`);
 }
});
test('bridge geometry is deterministic, bounded and uses existing stone',()=>{
 const first=render(),second=render();
 assert.deepEqual(first,second);
 assert.ok(first.length>0,'genuine natural crossing should render');
 assert.equal(first.length%RUINED_BRIDGE_LIMITS.stride,0);
 assert.ok(first.length/RUINED_BRIDGE_LIMITS.stride<=RUINED_BRIDGE_LIMITS.maxVerticesPerChunk);
 for(let i=8;i<first.length;i+=9)assert.equal(first[i],3);
});
