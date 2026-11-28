import test from 'node:test';
import assert from 'node:assert/strict';
import {createStarterCircuit} from '../src/resonance/network36/starter-circuit.mjs';
const p=(id,x,y=0,z=0)=>({id,x,y,z,loaded:true});
const circuit=()=>createStarterCircuit({seed:1,generators:[{id:'crystal',model:'crystal',anchor:[-1,0,0]}],lamps:[{id:'lamp',anchor:[2,0,0]}],stores:[{id:'battery',anchor:[0,1,0],capacity:4,charge:0,inputRate:2,outputRate:1}]});
const line=[p('a',0),p('b',1)];
test('original source -> channels -> lamp and storage; deficit then recover',()=>{
 const c=circuit();
 const a=c.step({tick:0,channels:line,observations:{crystal:{crystalPresent:true}}});
 assert.equal(a.states[0].mode,'running');assert.equal(a.consumed,1);assert.equal(a.stores[0].charge,2);assert.equal(a.allocation.totals.produced,3);
 const b=c.step({tick:1,channels:line});assert.equal(b.states[0].mode,'running');assert.equal(b.stores[0].charge,1);assert.equal(b.allocation.totals.drawn,1);
 const d=c.step({tick:2,channels:[line[0]]});assert.equal(d.states[0].mode,'stopped');assert.equal(d.stores[0].charge,1);
 const e=c.step({tick:3,channels:line});assert.equal(e.states[0].mode,'running');assert.equal(e.stores[0].charge,0);
 const f=c.step({tick:4,channels:line});assert.equal(f.states[0].mode,'stopped');
 const g=c.step({tick:5,channels:line,observations:{crystal:{crystalPresent:true}}});assert.equal(g.states[0].mode,'running');assert.equal(g.stores[0].charge,2);
});
test('wireless radius and channel break cannot share energy across islands',()=>{
 const c=createStarterCircuit({seed:1,generators:[{id:'hand',model:'hand',anchor:[-1,0,0]}],lamps:[{id:'lamp',anchor:[3,0,0]}]});
 const channel=[p('a',0)],tx={...p('tx',1),radius:2};
 assert.equal(c.step({tick:0,channels:channel,transmitters:[tx],observations:{hand:{operator:true}}}).consumed,1);
 assert.equal(c.step({tick:1,channels:channel,transmitters:[{...tx,radius:1}],observations:{hand:{operator:true}}}).consumed,0);
 assert.equal(c.step({tick:2,channels:[],transmitters:[tx],observations:{hand:{operator:true}}}).consumed,0);
 assert.equal(c.step({tick:3,channels:channel,transmitters:[tx],observations:{hand:{operator:true}}}).consumed,1);
});
test('failed frame leaves tick and storage unchanged; replay rejected',()=>{
 const c=circuit();
 assert.throws(()=>c.step({tick:0,channels:[p('bad',0,257)]}));
 assert.throws(()=>c.step({tick:0,channels:[p('bad',0),p('bad2',0)]}));
 assert.throws(()=>c.step({tick:0,channels:line,observations:{fake:{}}}));
 assert.equal(c.step({tick:0,channels:line,observations:{crystal:{crystalPresent:true}}}).stores[0].charge,2);
 assert.throws(()=>c.step({tick:0,channels:line}));
 assert.equal(c.step({tick:1,channels:line}).stores[0].charge,1);
});
test('upper and deep world fixture bounds, no fuelled source authorization',()=>{
 for(const y of [-210,256]){
  const c=createStarterCircuit({seed:1,generators:[{id:'h',model:'hand',anchor:[-1,y,0]}],lamps:[{id:'lamp',anchor:[1,y,0]}]});
  assert.equal(c.step({tick:0,channels:[p('a',0,y)],observations:{h:{operator:true}}}).consumed,1);
 }
 assert.throws(()=>createStarterCircuit({seed:1,generators:[{id:'h',model:'heat',anchor:[0,0,0]}],lamps:[]}));
});
