import test from 'node:test';
import assert from 'node:assert/strict';
import {createObservationCatalog,sampleNearbyObservations,SAMPLE_LIMIT} from '../src/navigation00/navigation-observation-catalog.mjs';
import {classifyHeightObservation,inspectUpperCover,createPhysicalNavigationReader,observePhysicalNavigationSurface,flightDiscoveryRadius} from '../src/navigation00/navigation-height-observation.mjs';
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
test('legacy-only classification fails closed at Y255 without physical evidence',()=>{
 const base={legacyMax:19,physicalMax:256,legacyObservation:{kind:'surface',surfaceY:7},upperCover:false};
 assert.equal(classifyHeightObservation({...base,player:{x:0,y:255.22,z:0}}).kind,'unknown');
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

const physicalReader=(overrides={})=>createPhysicalNavigationReader({
 legacyMin:-3,legacyMax:19,physicalMax:256,sections:15,
 bounds:s=>({minY:20+(s-1)*16,maxY:Math.min(256,35+(s-1)*16)}),
 occupied:()=>false,resident:()=>false,legacyResident:()=>true,
 read:(x,y,z)=>y===6?3:0,...overrides});
test('physical map admits witnessed open flight at Y21, Y100 and ceiling without reading empty upper sections',()=>{
 let reads=0;
 const reader=physicalReader({read:(x,y,z)=>{assert.ok(y<=19);reads++;return y===6?3:0;}});
 for(const y of [21,100,255.22]){
  const o=observePhysicalNavigationSurface({player:{x:-.1,y,z:4},reader,minY:-3,maxY:256});
  assert.equal(o.kind,'surface');assert.equal(o.surfaceY,7);assert.equal(o.x,-1);
 }
 assert.ok(reads<=42);assert.equal(reader.read(0,230,0),0);
 assert.equal(flightDiscoveryRadius(255.22,7,19),8);
 assert.equal(flightDiscoveryRadius(7,7,19),3);
});
test('physical map samples upper terrain but never reads unresident occupied sections',()=>{
 let reads=0;
 const reader=physicalReader({occupied:(x,z,s)=>s===8,resident:()=>true,
 read:(x,y,z)=>{reads++;return y===139||y===6?3:0;}});
 assert.equal(reader.surfaceAt(0,0).surfaceY,140);
 assert.equal(observePhysicalNavigationSurface({player:{x:0,y:100,z:0},reader,minY:-3,maxY:256}).kind,'covered');
 assert.equal(observePhysicalNavigationSurface({player:{x:0,y:141,z:0},reader,minY:-3,maxY:256}).kind,'surface');
 assert.ok(reads>0);
 const unknown=physicalReader({occupied:(x,z,s)=>s===8,read:()=>{throw Error('unknown read');}});
 assert.equal(unknown.surfaceAt(0,0),null);assert.equal(unknown.resident(0,139,0),false);
 assert.equal(unknown.read(0,139,0),undefined);
});
test('expanded flight radius is still witnessed and bounded, including negative coordinates',()=>{
 const d={seen:new Set(),has(x,z){return this.seen.has(Math.floor(x/4)+','+Math.floor(z/4));}};
 const c=createObservationCatalog({seed:8,discovery:d});let far=false,attempts=0;
 for(let i=0;i<80;i++){
  const n=sampleNearbyObservations({catalog:c,discovery:d,player:{x:-.1,z:-.1},radius:8,sampleLimit:3,refreshIndex:i,
    residentAt:()=>true,admit:(x,z)=>{d.seen.add(x+','+z);return true;},
    sample:(x,z)=>{attempts++;const dx=Math.floor(x/4)+1,dz=Math.floor(z/4)+1;
      assert.ok(dx*dx+dz*dz<=64);if(dx*dx+dz*dz>9)far=true;return x<0?{ink:'#abcdef',y:7}:null;}});
  assert.ok(n<=3);
 }
 assert.ok(far);assert.ok(attempts<=240);assert.ok([...d.seen].every(k=>Number(k.split(',')[0])<0));
});
test('old version-one observations reopen with more than 8192 detailed tiles and preserve old entries',()=>{
 const d={seen:new Set(),has(x,z){return this.seen.has(Math.floor(x/4)+','+Math.floor(z/4));}},s=store();
 for(let i=0;i<8200;i++)d.seen.add(i+',0');
 const key='mythwrought-navigation00-observations-v1-12';
 s.setItem(key,JSON.stringify({version:1,seed:12,tiles:[[0,0,'#abcdef',7]],marks:[]}));
 const c=createObservationCatalog({seed:12,discovery:d,storage:s});
 for(let i=1;i<8200;i++)assert.ok(c.observeTile(i,0,'#123456',7,{witnessed:true}));
 assert.ok(c.flush());const reopened=createObservationCatalog({seed:12,discovery:d,storage:s});
 assert.equal(reopened.tileCount,8200);assert.equal(reopened.ink(0,0),'#abcdef');assert.equal(reopened.ink(8199,0),'#123456');
});

test('bounded live aerial survey maps actual ground when renderer has no ground mesh',()=>{
 let reads=0;const survey={x:.5,z:.5,radius:36,maxReads:96};
 const reader=physicalReader({legacyResident:()=>false,survey,read:(x,y,z)=>{reads++;return y===6?3:0;}});
 assert.equal(observePhysicalNavigationSurface({player:{x:.5,y:150,z:.5},reader,minY:-3,maxY:256}).surfaceY,7);
 assert.equal(reader.sourceReads,14);assert.equal(reads,14);
 assert.equal(reader.surfaceAt(0,0).surfaceY,7);assert.equal(reads,14,'duplicate reads reuse the batch cache');
 assert.equal(reader.surfaceAt(100,100),null);assert.equal(reads,14);
 for(let x=1;x<20;x++)reader.surfaceAt(x,0);
 assert.ok(reader.sourceReads<=96);assert.equal(reads,96);
 assert.equal(reader.surfaceAt(24,0),null,'exhausted survey fails closed');
});
test('aerial survey is opt-in, and cannot read unknown terrain outside the live footprint',()=>{
 let reads=0;
 const options={legacyResident:()=>false,occupied:()=>true,resident:()=>false,read:()=>{reads++;return 0;}};
 assert.equal(physicalReader(options).surfaceAt(0,0),null);assert.equal(reads,0);
 const reader=physicalReader({...options,survey:{x:.5,z:.5,radius:36,maxReads:20}});
 assert.equal(reader.read(100,140,0),undefined);assert.equal(reads,0);
 assert.equal(reader.surfaceAt(0,0),null);assert.equal(reads,20);
 assert.equal(reader.read(1,256,0),undefined);assert.equal(reads,20);
});
