import test from 'node:test';
import assert from 'node:assert/strict';
import {createRoadmapCFirstGatehouseBlueprint} from '../../../src/building-pool/roadmap-3b/c1-twinstone-pass-gatehouse.mjs';
import {ASSET_CATALOG} from '../../../src/building-pool/roadmap-3b/assets.mjs';
import {validateBlueprint,geometryFingerprint} from '../../../src/building-pool/roadmap-3b/contract.mjs';
import {validateGatehouseTopology} from '../../../src/building-pool/roadmap-3b/fortification-topology.mjs';

const b=createRoadmapCFirstGatehouseBlueprint();
const cells=new Map(b.modules.flatMap(m=>m.cells.map(c=>[[c[0],c[1],c[2]].join(','),{role:m.role,asset:c[3]}])));
const has=(x,y,z)=>cells.has([x,y,z].join(','));

test('C2 first new gatehouse is original 3B identity with real voxel source and strict source acceptance',()=>{
 assert.equal(b.id,'r3:gatehouse:temperate:small:1');
 assert.equal(b.status,'theoretical');assert.equal(b.activated,false);
 const native=validateBlueprint(b,ASSET_CATALOG),top=validateGatehouseTopology(b);
 assert.ok(native.cellCount>1000);
 assert.equal(top.routeSteps,28);
 assert.equal(top.clearCells,56);
 assert.equal(top.oppositeAccess,true);
 assert.equal(b.architecture.trueOpenCourtyardGroundCells,24);
 assert.equal(new Set(b.modules.flatMap(m=>m.cells.map(c=>c.slice(0,3).join(',')))).size,native.cellCount);
 assert.equal(geometryFingerprint(b),geometryFingerprint(createRoadmapCFirstGatehouseBlueprint()));
});

test('C2 actual gate is uninterrupted two-wide, three-high and roof-supported, with real foundation and cross-bridges',()=>{
 for(let z=0;z<28;z++){
  for(let x=12;x<=13;x++){
   for(let y=2;y<=4;y++)assert.ok(!has(x,y,z),'source collision at '+[x,y,z]);
   assert.ok(has(x,0,z)&&has(x,1,z),'missing all-route floor '+[x,z]);
  }
 }
 for(const x of [11,14])for(let y=0;y<=5;y++)
  assert.ok(has(x,y,14),'missing anchored gate post '+[x,y,14]);
 for(const x of [12,13])assert.ok(has(x,5,14),'no physical arch over actual gate');
 for(const z of [7,8,20,21])for(let x=8;x<=19;x++)
  assert.ok(has(x,0,z)&&has(x,1,z),'missing physically continuous guard link '+[x,z]);
});

test('C2 guard rooms and sky-lit courts are actual source geometry, not only labels',()=>{
 assert.deepEqual(b.spaces.filter(s=>s.kind==='guard-room').map(s=>s.id),
  ['western-guard-house','eastern-guard-house']);
 for(const rect of [[3,5,12,15],[22,24,12,15]])for(let x=rect[0];x<=rect[1];x++)for(let z=rect[2];z<=rect[3];z++){
  for(let y=0;y<b.envelope.height;y++)
   assert.ok(!has(x,y,z),'false courtyard source occupancy '+[x,y,z]);
 }
 assert.ok(b.spaces.some(s=>s.kind==='muster'));
 assert.ok(b.spaces.some(s=>s.kind==='battlement'));
});

test('C2 two-wide source stair treads genuinely rise onto a roof deck with headroom',()=>{
 for(let i=0;i<4;i++)for(let x=8;x<=9;x++){
  assert.equal(cells.get([x,2+i,22+i].join(','))?.role,'stair','missing physical stair '+[x,i]);
  for(let y=3+i;y<=5+i;y++)
   assert.ok(!has(x,y,22+i),'blocked stair headroom '+[x,y,22+i]);
 }
 assert.ok(has(10,6,25)&&has(11,6,25),'roof deck not source-backed');
 for(const x of [10,11])for(let y=7;y<=9;y++)
  assert.ok(!has(x,y,25),'parapet corridor blocked '+[x,y,25]);
 assert.equal(b.navigation.edges.filter(e=>e.kind==='stair').length,5);
});
