// Exactly the original solid-leaf collision contract: BODY_HEIGHT 1.78
// intersects BOTH block layers above a natural M7 cap. This unit tests the
// opt-in canopy filter without running browser, meshes or other lanes.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {clearEnchantedCanopyForWalking,ENCHANTED_WALKING_HEADROOM_VOXELS}
  from '../../src/manual-biomes/enchanted-tree-walking-clearance.mjs';
import {ENVIRONMENT_GROUND as G} from '../../src/environment-ground.mjs';
import {BLOCK,BODY_HEIGHT,BODY_RADIUS,collides} from '../../src/voxel.mjs';
import {buildEnchantedTreeCandidate}
  from '../../src/manual-biomes/enchanted-tree-candidates.mjs';

const k=(x,y,z)=>x+','+y+','+z;

test('exact 1.78-high player needs both unobstructed air voxels above real cap',()=>{
  assert.equal(BODY_HEIGHT,1.78);
  assert.equal(BODY_RADIUS,.28);
  assert.equal(ENCHANTED_WALKING_HEADROOM_VOXELS,2);
  const leaf1=[2,7,3,G.moonLeaves],leaf2=[2,8,3,G.aetherLeaves];
  const bark=[3,7,3,G.aetherBark],high=[2,9,3,G.moonLeaves];
  const original=[leaf1,leaf2,bark,high];
  const read=(x,y,z)=>(x===2&&z===3&&y<=6)?G.woodlandMoss:BLOCK.AIR;
  const filtered=clearEnchantedCanopyForWalking(original,read,BLOCK.AIR);
  assert.deepEqual(filtered,[bark,high],
    'leaf in first and second body voxels removed; bark and canopy above head kept');
  assert.deepEqual(original,[leaf1,leaf2,bark,high],
    'immutable original candidate must not be mutated');
});
test('current baseline landmarks, cliff shoulders and cave unknowns never acquire low leaf blocks',()=>{
  const original=[
    [0,8,0,G.aetherLeaves],[1,8,0,G.moonLeaves],
    [2,8,0,G.aetherLeaves],[3,8,0,G.moonLeaves]
  ];
  const read=(x,y,z)=>x===0&&y===7?BLOCK.STONE:
    x===1&&y===6?G.woodlandMoss:
    x===2&&y===6?undefined:BLOCK.AIR;
  const after=clearEnchantedCanopyForWalking(original,read,BLOCK.AIR);
  assert.deepEqual(after,[original[3]],'protect existing pillar, rising terrain and unknown cave provenance');
});
test('copy-on-first-cut fast path preserves original array for high clear crowns',()=>{
  const source=[[0,11,0,G.aetherLeaves],[0,12,0,G.moonLeaves],[0,9,0,G.aetherBark]];
  const result=clearEnchantedCanopyForWalking(source,()=>BLOCK.AIR,BLOCK.AIR);
  assert.equal(result,source,'no new array allocation for unaffected tree geometry');
  assert.throws(()=>clearEnchantedCanopyForWalking(source,null),/Invalid enchanted walking clearance input/);
  assert.throws(()=>clearEnchantedCanopyForWalking([[0,1]],()=>0),/Invalid enchanted canopy voxel/);
});
test('genuine source tree silhouettes can preserve physical roots while pruning raised-ground low leaves',()=>{
  let samples=0,removed=0;
  for(const roll of [.001,.07,.1399,.14,.31,.62,.63,.82,.99]){
    const shape=buildEnchantedTreeCandidate(0,3,0,roll);
    assert.ok(shape);
    const lowest=shape.cells.filter(([,,,id])=>id!==G.aetherBark)
      .reduce((m,cell)=>Math.min(m,cell[1]),Infinity);
    const raisedCap=lowest-2;
    const read=(x,y,z)=>y<=raisedCap?G.woodlandLoam:BLOCK.AIR;
    const filtered=clearEnchantedCanopyForWalking(shape.cells,read,BLOCK.AIR);
    const originalBark=shape.cells.filter(([,,,id])=>id===G.aetherBark);
    assert.deepEqual(filtered.filter(([,,,id])=>id===G.aetherBark),originalBark,
      'player clearance must never remove an authored structural branch');
    assert.ok(filtered.every(([x,y,z,id])=>id===G.aetherBark||y>raisedCap+2),
      'no solid leaf in player body air layers above raised natural ground');
    assert.ok(filtered.length<shape.cells.length,'test must actually remove some low leaves');
    samples++;removed+=shape.cells.length-filtered.length;
  }
  assert.equal(samples,9);assert.ok(removed>20);
});
test('actual original full-cube collision rejects low leaves and permits same standing pose after trim',()=>{
  const shape=buildEnchantedTreeCandidate(0,3,0,.82);
  const leaf=shape.cells.find(([x,y,z,id])=>id===G.moonLeaves&&
    !shape.cells.some(([a,b,c,other])=>
      a===x&&c===z&&other===G.aetherBark&&(b===y-1||b===y-2)));
  assert.ok(leaf,'real moonwillow source has a leaf-only low fringe');
  const [x,y,z]=leaf,cap=y-2;
  const read=(a,b,c)=>a===x&&c===z&&b<=cap?BLOCK.STONE:BLOCK.AIR;
  const original=[leaf],trim=clearEnchantedCanopyForWalking(original,read,BLOCK.AIR);
  assert.equal(trim.length,0,'one obstructive fringe leaf should be removed');
  const world=leaves=>{
    const ids=new Map(leaves.map(v=>[k(...v.slice(0,3)),v[3]]));
    return {get:(a,b,c)=>ids.get(k(a,b,c))??read(a,b,c)};
  };
  const playerX=x+.5,playerZ=z+.5,feet=cap+1;
  assert.equal(collides(world(original),playerX,feet,playerZ),true);
  assert.equal(collides(world(trim),playerX,feet,playerZ),false,
    'clearance makes a previously leaf-blocked standing pose truly walkable');
  assert.equal(collides(world(trim),playerX,feet-.065,playerZ),true,
    'original ground probe must still detect actual supporting terrain');
});
