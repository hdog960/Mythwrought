import test from 'node:test';
import assert from 'node:assert/strict';
import {createCRoadmapCDesertBarracks} from '../../../src/building-pool/roadmap-3b/c4-sandglass-fork-desert-barracks.mjs';
import {ASSET_CATALOG} from '../../../src/building-pool/roadmap-3b/assets.mjs';
import {validateBlueprint,geometryFingerprint} from '../../../src/building-pool/roadmap-3b/contract.mjs';

const bp=createCRoadmapCDesertBarracks(),K=(x,y,z)=>[x,y,z].join(',');
const cells=new Map(bp.modules.flatMap(m=>m.cells.map(([x,y,z,asset])=>[K(x,y,z),{role:m.role,asset}])));
const has=(x,y,z)=>cells.has(K(x,y,z));
const clear=(x,z)=>has(x,0,z)&&has(x,1,z)&&[2,3,4].every(y=>!has(x,y,z));

test('C4 original desert medium barracks VARIANT 2 is not protected variant 1, and has 6739 literal source cells',()=>{
 assert.equal(bp.id,'r3:barracks:desert:medium:2');
 assert.equal(bp.status,'theoretical');assert.equal(bp.activated,false);
 assert.equal(validateBlueprint(bp,ASSET_CATALOG).cellCount,6739);
 assert.equal(bp.modules.find(m=>m.role==='foundation').cells.length,1757);
 assert.equal(bp.modules.find(m=>m.role==='roof').cells.length,1749);
 assert.equal(bp.modules.find(m=>m.role==='stair').cells.length,8);
 assert.equal(bp.spaces.length,7);
 assert.equal(bp.navigation.nodes.length,14);
 assert.equal(bp.architecture.creatorAccepted,false);
 assert.equal(geometryFingerprint(bp),geometryFingerprint(createCRoadmapCDesertBarracks()));
});
test('C4 two 3x3 parade/cooling courts truly omit ground and every roof voxel',()=>{
 for(const p of bp.physicalCourtyardVoids)
  for(let x=p.x0;x<=p.x1;x++)for(let z=p.z0;z<=p.z1;z++)
   for(let y=0;y<bp.envelope.height;y++)assert.ok(!has(x,y,z),'court is a fake decoration '+K(x,y,z));
});
test('C4 physical ground-supported two-wide floor route reaches all key barracks spaces, including the real rear exit',()=>{
 const start=[24,0],queue=[start],visited=new Set([start.join(',')]);
 assert.ok(clear(...start));
 for(let at=0;at<queue.length;at++){
  const [x,z]=queue[at];
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const nx=x+dx,nz=z+dz,s=nx+','+nz;
   if(!visited.has(s)&&clear(nx,nz)){visited.add(s);queue.push([nx,nz]);}
  }
 }
 for(const node of bp.navigation.nodes.filter(n=>n.y===2)){
  assert.ok(visited.has(node.x+','+node.z),'room was connected only by fake navigation metadata: '+node.id);
  assert.ok(clear(node.x+1,node.z),'2-wide path closed at '+node.id);
 }
 assert.ok(queue.length>180,'rooms are not physically connected by a broad public route');
});
test('C4 four physical treads have source-bearing undercolumns, continuous rising access and real open heads',()=>{
 for(let i=0;i<4;i++)for(let x=22;x<=23;x++){
  const z=41+i,tread=2+i;
  assert.equal(cells.get(K(x,tread,z))?.role,'stair','stair was not physically authored');
  for(let y=0;y<tread;y++)assert.ok(has(x,y,z),'unsupported step '+K(x,y,z));
  for(let y=tread+1;y<=tread+3;y++)assert.ok(!has(x,y,z),'hidden head strike '+K(x,y,z));
 }
 for(let x=20;x<=21;x++){
  assert.equal(cells.get(K(x,6,44))?.role,'roof','missing supported roof lookout landing');
  for(let y=7;y<=9;y++)assert.ok(!has(x,y,44),'roof landing blocked');
 }
 assert.equal(bp.navigation.edges.filter(e=>e.kind==='stair').length,5);
});
test('C4 independent irregular roof heights, real support walls, two open opposite doors and furnishing assets are all source-backed',()=>{
 const elevations=new Set(bp.modules.filter(m=>m.role==='roof').flatMap(m=>m.cells.map(c=>c[1])));
 assert.deepEqual([...elevations].sort((a,b)=>a-b),[6,7,8,9,10]);
 for(const z of [0,48])for(let x=24;x<=25;x++){
  for(const y of [0,1])assert.ok(has(x,y,z));
  for(const y of [2,3,4])assert.ok(!has(x,y,z));
 }
 assert.equal(bp.openings.length,2);
 assert.ok(bp.modules.some(m=>m.role==='equipment'&&m.cells.length===12));
 assert.equal(bp.architecture.gameRegistered,false);
});
