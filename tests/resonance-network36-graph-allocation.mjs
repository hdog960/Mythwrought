import test from 'node:test';
import assert from 'node:assert/strict';
import {allocateFromChannelGraph} from '../src/resonance/network36/graph-allocation.mjs';
const p=(id,x,y=0,z=0)=>({id,x,y,z,loaded:true});
const run=(channels,endpoints,generation=[],devices=[],stores=[])=>allocateFromChannelGraph({channels,endpoints,generation,devices,stores,tick:7});
test('split prevents cross-network energy transfer',()=>{
 const r=run([p('a',0),p('c',2)],[p('gen',0,1),p('motor',2,1)],[{id:'gen',available:10}],[{id:'motor',demand:3,priority:5}]);
 assert.equal(r.allocation.totals.spent,0);
 assert.deepEqual(r.allocation.networks.find(n=>n.network==='channel:c').stopped,['motor']);
});
test('join restores service without changing device identity',()=>{
 const r=run([p('a',0),p('b',1),p('c',2)],[p('gen',0,1),p('motor',2,1)],[{id:'gen',available:10}],[{id:'motor',demand:3,priority:5}]);
 assert.equal(r.allocation.totals.spent,3);
});
test('disconnected generators never deliver energy',()=>{
 const r=run([p('a',0)],[p('gen',5),p('motor',0,1)],[{id:'gen',available:10}],[{id:'motor',demand:3,priority:5}]);
 assert.equal(r.allocation.totals.produced,0);assert.equal(r.disconnected[0].id,'gen');
});
test('ambiguous endpoint fails closed',()=>{
 const r=run([p('a',0),p('c',2)],[p('gen',0,1),p('motor',1)],[{id:'gen',available:10}],[{id:'motor',demand:3,priority:5}]);
 assert.equal(r.disconnected[0].reason,'ambiguous');assert.equal(r.allocation.totals.spent,0);
});
test('reject missing endpoint, caller network override and duplicate IDs',()=>{
 assert.throws(()=>run([p('a',0)],[],[{id:'gen',available:1}]));
 assert.throws(()=>run([p('a',0)],[p('gen',0,1)],[{id:'gen',available:1,network:'fake'}]));
 assert.throws(()=>run([p('a',0)],[p('gen',0,1)],[{id:'gen',available:1}],[{id:'gen',demand:1,priority:1}]));
});
test('storage remains physically attached after network split',()=>{
 const r=run([p('a',0),p('c',2)],[p('battery',0,1),p('motor',2,1)],[],[{id:'motor',demand:2,priority:1}],[{id:'battery',capacity:10,charge:5,inputRate:5,outputRate:5}]);
 assert.equal(r.allocation.totals.drawn,0);
 assert.equal(r.allocation.networks.find(n=>n.network==='channel:a').stores[0].charge,5);
});
