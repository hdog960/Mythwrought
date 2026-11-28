import test from 'node:test';
import assert from 'node:assert/strict';
import {createObservationCatalog,sampleNearbyObservations,SAMPLE_LIMIT} from '../src/navigation00/navigation-observation-catalog.mjs';
import {classifyHeightObservation,inspectUpperCover} from '../src/navigation00/navigation-height-observation.mjs';
const discovery=()=>({seen:new Set(Array.from({length:49},(_,i)=>(i%7-3)+','+(Math.floor(i/7)-3))),has(x,z){return this.seen.has(Math.floor(x/4)+','+Math.floor(z/4));}});
const store=()=>{const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v)};};
test('witnessed terrain and landmarks persist per seed without changing fog',()=>{
 const d=discovery(),s=store(),open=seed=>createObservationCatalog({seed,discovery:d,storage:s}),c=open(4),before=[...d.seen];
 assert.equal(c.ink(0,0),'#35464a');assert.equal(c.ink(100,100),'#122126');
 assert.equal(c.observeTile(0,0,'#abcdef',5),false);
 assert.ok(c.observeTile(0,0,'#abcdef',5,{witnessed:true}));
 assert.ok(c.observeLandmark({id:'cave-0-0',kind:'cave',x:1,y:-4,z:1},{witnessed:true}));
 assert.ok(c.flush());const reopened=open(4);assert.equal(reopened.ink(0,0),'#abcdef');assert.equal(reopened.height(0,0),5);assert.equal(reopened.visible()[0].y,-4);assert.equal(open(5).visible().length,0);
 assert.deepEqual([...d.seen],before);
});
test('sampling is resident-only and bounded; paint is source free',()=>{
 const d=discovery(),c=createObservationCatalog({seed:4,discovery:d});let reads=0;
 const n=sampleNearbyObservations({catalog:c,discovery:d,player:{x:0,z:0},residentAt:(x,z)=>x>=0,sample:(x,z)=>{assert.ok(x>=0);reads++;return {ink:'#abcdef',y:4};}});
 assert.equal(n,SAMPLE_LIMIT);assert.equal(reads,SAMPLE_LIMIT);
 for(let i=0;i<100;i++)c.ink(i,i);
 assert.equal(reads,SAMPLE_LIMIT);
});
test('corrupt and stale observations never overwrite storage',()=>{
 const d=discovery(),s=store(),open=()=>createObservationCatalog({seed:7,discovery:d,storage:s}),a=open(),b=open();
 a.observeTile(0,0,'#abcdef',4,{witnessed:true});assert.ok(a.flush());const raw=s.getItem(a.key);
 b.observeTile(1,0,'#123456',5,{witnessed:true});assert.equal(b.flush(),false);assert.equal(s.getItem(a.key),raw);
 s.setItem(a.key,'{bad');const c=open();assert.ok(c.readOnly);assert.equal(c.flush(),false);assert.equal(s.getItem(a.key),'{bad');
});
test('height contract does not treat Y255 flight as ground exploration',()=>{
 const base={legacyMax:19,physicalMax:256,legacyObservation:{kind:'surface',surfaceY:7},upperCover:false};
 assert.equal(classifyHeightObservation({...base,player:{x:0,y:255.22,z:0}}).kind,'upper');
 assert.equal(classifyHeightObservation({...base,player:{x:0,y:-210,z:0}}).kind,'underground');
 assert.equal(classifyHeightObservation({...base,player:{x:0,y:7,z:0},upperCover:null}).kind,'unknown');
 assert.equal(classifyHeightObservation({...base,player:{x:0,y:7,z:0}}).kind,'surface');
});
test('upper cover never reads unoccupied or nonresident sections',()=>{
 let reads=0;const base={player:{x:0,y:7,z:0},sections:15,bounds:s=>({minY:20+(s-1)*16,maxY:Math.min(256,35+(s-1)*16)}),resident:()=>false,read:()=>{reads++;return 1;}};
 assert.equal(inspectUpperCover({...base,occupied:()=>false}),false);assert.equal(reads,0);
 assert.equal(inspectUpperCover({...base,occupied:()=>true}),null);assert.equal(reads,0);
 assert.equal(inspectUpperCover({...base,occupied:s=>true,resident:()=>true}),true);assert.equal(reads,1);
});
