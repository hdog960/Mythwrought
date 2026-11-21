import test from 'node:test';
import assert from 'node:assert/strict';
import {describeDeviceStatus} from '../src/resonance/devices48/status-v1.mjs';
const device=(id,demand=2,enabled=true)=>({id,seed:9,demand,enabled});
const grant=(id,amount)=>({id,seed:9,tick:4,amount});
test('stable order, running and safe stopped deficits',()=>{
 const frame=describeDeviceStatus({seed:9,tick:4,produced:3,stored:5,devices:[device('z'),device('a')],grants:[grant('z',2),grant('a',1)]});
 assert.deepEqual(frame.devices.map(x=>x.id),['a','z']);
 assert.equal(frame.used,2);assert.equal(frame.deficit,2);assert.equal(frame.devices[0].mode,'stopped');
});
test('disabled device never consumes grant',()=>{
 const f=describeDeviceStatus({seed:9,tick:4,devices:[device('lamp',2,false)],grants:[]});
 assert.equal(f.used,0);assert.equal(f.devices[0].mode,'off');
 assert.throws(()=>describeDeviceStatus({seed:9,tick:4,devices:[device('lamp',2,false)],grants:[grant('lamp',1)]}));
});
test('rejects duplicates, foreign seeds, unknown and excessive grants',()=>{
 const base={seed:9,tick:4,devices:[device('a')],grants:[]};
 for(const changes of [{devices:[device('a'),device('a')]},{grants:[grant('x',1)]},{grants:[grant('a',3)]},{grants:[grant('a',1),grant('a',1)]},{devices:[{...device('a'),seed:10}]}]) assert.throws(()=>describeDeviceStatus({...base,...changes}));
});
