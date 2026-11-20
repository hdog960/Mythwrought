import test from 'node:test';
import assert from 'node:assert/strict';
import {createRoadmapCFirstCityWallBlueprint} from '../../../src/building-pool/roadmap-3b/c3-fourwatch-closed-city-wall.mjs';
import {ASSET_CATALOG} from '../../../src/building-pool/roadmap-3b/assets.mjs';
import {validateBlueprint,geometryFingerprint} from '../../../src/building-pool/roadmap-3b/contract.mjs';
import {validateCityWallTopology} from '../../../src/building-pool/roadmap-3b/fortification-topology.mjs';

const original=createRoadmapCFirstCityWallBlueprint();
const xyz=(x,y,z)=>[x,y,z].join(',');
const src=()=>new Map(original.modules.flatMap(m=>m.cells.map(c=>[xyz(c[0],c[1],c[2]),m.role])));
const patch=(fn)=>{
 const b=structuredClone(original);
 fn(b);
 return b;
};

test('C3 first original city wall is a literal 148-cell closed loop, not detached watchtowers',()=>{
 assert.equal(original.id,'r3:city-wall:temperate:small:1');
 assert.equal(original.status,'theoretical');assert.equal(original.activated,false);
 const data=validateBlueprint(original,ASSET_CATALOG),wall=validateCityWallTopology(original);
 assert.ok(data.cellCount>=2800,'insufficient physically authored architecture');
 assert.equal(wall.perimeterCells,148);
 assert.equal(wall.physicalRampartCells,148);
 assert.equal(wall.gateCrossingCells,2);
 assert.equal(wall.closed,true);
 assert.deepEqual(wall.elevationRange,[7,7]);
 assert.equal(original.fortification.junctionSockets.length,4);
 assert.equal(original.fortification.specialStructures.length,4);
 assert.equal(geometryFingerprint(original),geometryFingerprint(createRoadmapCFirstCityWallBlueprint()));
});

test('C3 each of 148 wall ramparts stands on literal source foundations and has empty upright headroom',()=>{
 const cells=src(),wall=original.fortification;
 const gate=new Set(['20,3','21,3']);
 for(const [x,y,z] of wall.rampartRoute){
  for(const yy of [0,1,5,6])assert.ok(cells.has(xyz(x,yy,z)),'missing source support '+[x,yy,z]);
  for(const yy of [7,8])assert.ok(!cells.has(xyz(x,yy,z)),'blocked physical walkway '+[x,yy,z]);
  if(!gate.has(x+','+z))for(let yy=0;yy<=6;yy++)assert.ok(cells.has(xyz(x,yy,z)),'wall discontinuity '+[x,yy,z]);
 }
});

test('C3 gate has clear two-wide, three-high physical road through both thick ring walls',()=>{
 const cells=src();
 for(let z=1;z<=7;z++)for(let x=20;x<=21;x++){
  assert.ok(cells.has(xyz(x,0,z))&&cells.has(xyz(x,1,z)),'unsupported exterior road at '+[x,z]);
  for(let y=2;y<=4;y++)assert.ok(!cells.has(xyz(x,y,z)),'fake gate, blocked at '+[x,y,z]);
 }
 for(let x=20;x<=21;x++)for(let y=5;y<=6;y++)
  assert.ok(cells.has(xyz(x,y,3)),'gate overhead arch disconnected from defended wall');
});

test('C3 five distinct two-wide source stair treads rise into a continuous high wall circuit',()=>{
 const cells=src();
 for(let i=0;i<5;i++)for(let x=27;x<=28;x++){
  const y=2+i,z=9-i;
  assert.equal(cells.get(xyz(x,y,z)),'stair','no physical tread '+[x,y,z]);
  for(let yy=0;yy<y;yy++)assert.ok(cells.has(xyz(x,yy,z)),'floating stair '+[x,yy,z]);
  for(let yy=y+1;yy<=y+3;yy++)assert.ok(!cells.has(xyz(x,yy,z)),'head collision '+[x,yy,z]);
 }
 assert.equal(original.navigation.edges.filter(e=>e.kind==='stair').length,5);
});

test('C3 wall validator rejects actual severed foundations, fake gate closures and branch discontinuity',()=>{
 const missing=patch(b=>{
  const m=b.modules.find(x=>x.role==='wall');
  const cell=m.cells.find(x=>x[0]===3&&x[1]===3&&x[2]===21);
  assert.ok(cell,'missing base wall source fixture');
  m.cells=m.cells.filter(x=>x!==cell);
 });
 assert.throws(()=>validateCityWallTopology(missing),/foundation-to-rampart continuity/);
 const obstructed=patch(b=>{
  b.modules.find(x=>x.role==='wall').cells.push([20,2,3,'pack1:002']);
 });
 assert.throws(()=>validateCityWallTopology(obstructed),/blocked physical gateway/);
 const disconnected=patch(b=>{b.fortification.rampartRoute[11][0]+=1;});
 assert.throws(()=>validateCityWallTopology(disconnected),/does not match/);
});
