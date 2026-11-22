import test from 'node:test';
import assert from 'node:assert/strict';
import {boundedChannelFlow} from '../src/resonance/network36/channel-flow.mjs';
const flow=(edges,demand)=>boundedChannelFlow({source:'a',sink:'z',edges,demand});
test('series bottleneck limits throughput without creating energy',()=>{
 const r=flow([{id:'1',from:'a',to:'b',capacity:9},{id:'2',from:'b',to:'z',capacity:3}],8);
 assert.equal(r.delivered,3);assert.equal(r.shortfall,5);
});
test('parallel paths combine finite capacity deterministically',()=>{
 const edges=[{id:'1',from:'a',to:'b',capacity:4},{id:'2',from:'b',to:'z',capacity:4},{id:'3',from:'a',to:'c',capacity:2},{id:'4',from:'c',to:'z',capacity:2}];
 assert.equal(flow(edges,20).delivered,6);assert.deepEqual(flow(edges,20),flow(edges,20));
});
test('disconnected and zero-capacity channels deliver no energy',()=>{
 assert.equal(flow([{id:'1',from:'a',to:'z',capacity:0}],5).delivered,0);
 assert.equal(flow([],5).delivered,0);
});
test('reject malformed inputs and over-budget graphs',()=>{
 assert.throws(()=>flow([{id:'x',from:'a',to:'z',capacity:-1}],1));
 assert.throws(()=>flow([{id:'x',from:'a',to:'z',capacity:1},{id:'x',from:'a',to:'z',capacity:1}],1));
 assert.throws(()=>boundedChannelFlow({source:'a',sink:'z',edges:[],demand:1,maxEdges:2049}));
});
