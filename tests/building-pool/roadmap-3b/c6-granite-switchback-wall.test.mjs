import test from 'node:test';
import assert from 'node:assert/strict';
import {createCGraniteSwitchbackCityWall} from '../../../src/building-pool/roadmap-3b/c6-granite-switchback-mountain-wall.mjs';
import {ASSET_CATALOG} from '../../../src/building-pool/roadmap-3b/assets.mjs';
import {validateBlueprint,geometryFingerprint} from '../../../src/building-pool/roadmap-3b/contract.mjs';
import {validateCityWallTopology} from '../../../src/building-pool/roadmap-3b/fortification-topology.mjs';
const blueprint=createCGraniteSwitchbackCityWall();
const K=(x,y,z)=>x+','+y+','+z;
const solids=new Map(blueprint.modules.flatMap(m=>m.cells.map(v=>[K(v[0],v[1],v[2]),m.role])));
const has=(x,y,z)=>solids.has(K(x,y,z));
const walk=(x,z)=>has(x,0,z)&&has(x,1,z)&&[2,3,4].every(y=>!has(x,y,z));

test('C6 Granite Switchback original mountain small city wall uses its exclusive C ID, 3936 real source voxels, distinct 805-column footprint',()=>{
 assert.equal(blueprint.id,'r3:city-wall:mountain:small:1');
 assert.equal(blueprint.status,'theoretical');assert.equal(blueprint.activated,false);
 assert.equal(validateBlueprint(blueprint,ASSET_CATALOG).cellCount,3936);
 assert.equal(blueprint.modules.find(m=>m.role==='foundation').cells.length,805);
 assert.equal(geometryFingerprint(blueprint),geometryFingerprint(createCGraniteSwitchbackCityWall()));
 assert.equal(blueprint.architecture.worldRegistered,false);
 assert.equal(blueprint.fortification.wallPath.length,9);
});

test('C6 closed 176-cell irregular escarpment physically supports complete uninterrupted rampart source route',()=>{
 const topo=validateCityWallTopology(blueprint);
 assert.equal(topo.closed,true);assert.equal(topo.perimeterCells,176);
 assert.equal(topo.physicalRampartCells,176);assert.equal(topo.gateCrossingCells,2);
 assert.deepEqual(topo.elevationRange,[7,7]);
 for(const [x,y,z] of blueprint.fortification.rampartRoute){
  assert.equal(y,7);assert.ok(has(x,6,z),'rampart metadata missing real stone '+K(x,6,z));
  for(let height=7;height<=8;height++)assert.ok(!has(x,height,z),'blocked elevated walking head '+K(x,height,z));
 }
});

test('C6 genuinely passable northern two-wide gate crosses the original walled ridge, with real bridge lintels and support posts',()=>{
 const p=blueprint.fortification.gatePassages[0];
 assert.equal(p.points.length,14);assert.equal(p.width,2);assert.equal(p.height,3);
 for(let z=1;z<=14;z++)for(let x=23;x<=24;x++)assert.ok(walk(x,z),'fake carriage gateway '+K(x,2,z));
 for(const x of [22,25])for(let y=0;y<=5;y++)assert.ok(has(x,y,4),'missing source physical gate post '+K(x,y,4));
 for(const x of [23,24])assert.ok(has(x,5,4),'gate lintel is not true source');
});

test('C6 guard stair foot accessible from outside by actual ground-level flood fill rather than imagined graph edges',()=>{
 const start=[23,1],queue=[start],seen=new Set([start.join(',')]);
 for(let i=0;i<queue.length;i++){
  const [x,z]=queue[i];
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const nx=x+dx,nz=z+dz,k=nx+','+nz;
   if(!seen.has(k)&&walk(nx,nz)){seen.add(k);queue.push([nx,nz]);}
  }
 }
 for(const point of [[23,4],[23,10],[28,10]])assert.ok(seen.has(point.join(',')),'source room disconnected '+point);
 assert.ok(queue.length>=65,'missing real open road/training gallery');
});

test('C6 five genuine two-wide stair treads have load-bearing foundation, no upper head strikes, and join the physical elevated wall',()=>{
 for(let i=0;i<5;i++)for(let x=28;x<=29;x++){
  const z=9-i,top=2+i;
  assert.equal(solids.get(K(x,top,z)),'stair');
  for(let y=0;y<top;y++)assert.ok(has(x,y,z),'unanchored mountain stair '+K(x,y,z));
  for(let y=top+1;y<=top+3;y++)assert.ok(!has(x,y,z),'mountain stair upper head blocked '+K(x,y,z));
 }
 for(let x=28;x<=29;x++)assert.ok(has(x,6,4)&&!has(x,7,4)&&!has(x,8,4));
 assert.ok(blueprint.navigation.edges.filter(e=>e.kind==='stair').length>=5);
});

test('C6 source topology adversarial audit refuses broken closed wall ramparts and blocked real carriage road',()=>{
 const bad=structuredClone(blueprint);
 bad.modules.find(m=>m.role==='wall').cells.push([23,2,4,'pack1:002']);
 assert.throws(()=>validateCityWallTopology(bad),/blocked physical gateway/);
 const hole=structuredClone(blueprint);
 const rampart=hole.modules.find(m=>m.role==='rampart');
 rampart.cells=rampart.cells.filter(c=>!(c[0]===4&&c[2]===4));
 assert.throws(()=>validateCityWallTopology(hole),/rampart not physically walkable/);
});
