import test from 'node:test';
import assert from 'node:assert/strict';
import {ruinedBridgeVertices,RUINED_BRIDGE_LIMITS} from '../src/ruined-bridge.mjs';
const world={seed:4,get:(x,y,z)=>y===5?1:0};
const crossingAt=()=>({natural:true,width:3,x:8,z:8,bankY:5,axis:'x'});
test('bridge fails closed without terrain-owned verified crossing',()=>{
 assert.equal(ruinedBridgeVertices(world,0,0).length,0);
 assert.equal(ruinedBridgeVertices(world,0,0,{crossingAt:()=>({...crossingAt(),natural:false})}).length,0);
});
test('bridge respects saved edits and overhead obstructions',()=>{
 const altered={...world,get:(x,y,z)=>x===3&&y===6?2:world.get(x,y,z)};
 assert.equal(ruinedBridgeVertices(altered,0,0,{crossingAt}).length,0);
});
test('bridge is deterministic and bounded with existing material channels',()=>{
 const first=ruinedBridgeVertices(world,0,0,{crossingAt});
 const second=ruinedBridgeVertices(world,0,0,{crossingAt});
 assert.deepEqual(first,second);
 assert.ok(first.length>0,'verified crossing must render a landmark');
 assert.equal(first.length%RUINED_BRIDGE_LIMITS.stride,0);
 assert.ok(first.length/RUINED_BRIDGE_LIMITS.stride<=RUINED_BRIDGE_LIMITS.maxVerticesPerChunk);
 for(let i=8;i<first.length;i+=9)assert.equal(first[i],3);
});
