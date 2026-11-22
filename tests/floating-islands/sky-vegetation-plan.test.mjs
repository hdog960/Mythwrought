import test from 'node:test';
import assert from 'node:assert/strict';
import {planSkyIslandVegetation} from '../../src/floating-islands/sky-vegetation-plan.mjs';
const makeIsland=(cx=0,cz=0)=>{
  const surface=[];
  for(let dx=-8;dx<=8;dx++)for(let dz=-8;dz<=8;dz++){
    const rim=Math.max(Math.abs(dx),Math.abs(dz));
    surface.push({x:cx+dx,y:142-(rim>=7?2:0),z:cz+dz,
      supported:true,exposed:true,clearance:rim>=7?3:10,
      moisture:.73,fertility:rim>=7?.36:.88,slope:rim>=7?2:1});
  }
  return surface;
};
test('complete island candidate order does not change deterministic flora',()=>{
  const surface=makeIsland(12033,-10881);
  const a=planSkyIslandVegetation({seed:179,surface});
  const b=planSkyIslandVegetation({seed:179,surface:[...surface].reverse()});
  assert.deepEqual(a,b);
  assert.ok(a.placements.length>6);
  assert.ok(a.placements.some(p=>p.group==='canopy'));
  assert.ok(a.placements.some(p=>p.group==='ground-cover'));
  assert.equal(a.worldWrites,0);
});
test('no physical canopy overlap and no tree under seven blocks clearance',()=>{
  const surface=makeIsland();
  const map=new Map(surface.map(p=>[`${p.x},${p.y+1},${p.z}`,p]));
  const a=planSkyIslandVegetation({seed:2026,surface});
  const trees=a.placements.filter(p=>p.group==='canopy');
  assert.ok(trees.length<=8);
  for(let i=0;i<trees.length;i++){
    assert.ok(map.get(`${trees[i].x},${trees[i].y},${trees[i].z}`).clearance>=7);
    for(let j=i+1;j<trees.length;j++)
      assert.ok((trees[i].x-trees[j].x)**2+(trees[i].z-trees[j].z)**2>=36);
  }
});
test('unsupported, covered and zero-clearance sites are strictly rejected',()=>{
  const surface=makeIsland().map((p,i)=>({...p,supported:i%3!==0,exposed:i%3!==1,
    clearance:i%3===2?0:p.clearance}));
  const a=planSkyIslandVegetation({seed:179,surface});
  assert.equal(a.candidateCount,0);assert.equal(a.placements.length,0);
});
test('fertile micro-island receives deterministic minimum ground cover',()=>{
  const s=[{x:-10001,y:30,z:10002,supported:true,exposed:true,
    clearance:1,slope:1,moisture:0,fertility:1}];
  const a=planSkyIslandVegetation({seed:179,surface:s});
  assert.deepEqual(a.placements.map(p=>p.kind),['windgrass-tuft']);
});
test('strict quotas preserve bounded iPhone work',()=>{
  const a=planSkyIslandVegetation({seed:179,surface:makeIsland(),maxDecor:9,maxTrees:2});
  assert.ok(a.placements.length<=9);assert.ok(a.treeCount<=2);
  const b=planSkyIslandVegetation({seed:179,surface:makeIsland(),maxDecor:0});
  assert.equal(b.placements.length,0);
});
test('seed and distant coordinates alter eligible variation without losing safety',()=>{
  const s=makeIsland(12345,-17654);
  const a=planSkyIslandVegetation({seed:179,surface:s});
  const b=planSkyIslandVegetation({seed:2026,surface:s});
  assert.notDeepEqual(a.placements,b.placements);
  for(const p of a.placements)assert.ok(p.x>10000&&p.z< -10000);
});
test('reject invalid input and duplicate authored surface coordinates',()=>{
  assert.throws(()=>planSkyIslandVegetation({seed:179,surface:[{},{}]}));
  assert.throws(()=>planSkyIslandVegetation({seed:179,surface:new Array(1025).fill({})}));
  const first=makeIsland()[0];
  assert.throws(()=>planSkyIslandVegetation({seed:179,surface:[first,first]}));
});
