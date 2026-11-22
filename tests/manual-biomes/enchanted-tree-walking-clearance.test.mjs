// Exactly the original solid-leaf collision contract: BODY_HEIGHT 1.78
// intersects BOTH block layers above a natural M7 cap. This unit tests the
// opt-in canopy filter without running browser, meshes or other lanes.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {clearEnchantedCanopyForWalking,ENCHANTED_WALKING_HEADROOM_VOXELS,
  ENCHANTED_WALKING_GROUND_NEIGHBORS}
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
  assert.deepEqual(after,[],'nearby protected pillars, terrain and unknown cave data must also protect edge walking');
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

test('body radius truly intersects cardinal and diagonal leaves beside raised natural ground',()=>{
  assert.equal(ENCHANTED_WALKING_GROUND_NEIGHBORS.length,9);
  const supports=[6,7]; // leaf Y=8: player feet 7 or 8
  for(const supportY of supports)
    for(const [dx,dz] of ENCHANTED_WALKING_GROUND_NEIGHBORS.slice(1)){
      const leaf=[dx,8,dz,G.moonLeaves];
      const read=(x,y,z)=>
        x===0&&z===0&&y===supportY?BLOCK.STONE:BLOCK.AIR;
      const filtered=clearEnchantedCanopyForWalking([leaf],read,BLOCK.AIR);
      assert.deepEqual(filtered,[],'adjacent raised cap must not be covered '+dx+','+dz);
      const sourceWorld=canopy=>{
        const leaves=new Map(canopy.map(([x,y,z,id])=>[k(x,y,z),id]));
        return {get:(x,y,z)=>leaves.get(k(x,y,z))??read(x,y,z)};
      };
      // Center remains INSIDE the support column, but .28 radius crosses
      // its edge or corner into the neighboring solid moonleaf.
      const x=dx<0?.22:dx>0?.78:.5;
      const z=dz<0?.22:dz>0?.78:.5;
      const feet=supportY+1;
      assert.equal(collides(sourceWorld([leaf]),x,feet,z),true,
        'the ORIGINAL player collider must witness the obstruction');
      assert.equal(collides(sourceWorld(filtered),x,feet,z),false,
        'after source trimming the true player body must fit');
      assert.equal(collides(sourceWorld(filtered),x,feet-.065,z),true,
        'original source ground probe must remain supported');
    }
});
test('shared candidate support coordinates are memoized for bounded source lookups',()=>{
  const source=[];
  for(let x=0;x<8;x++)for(let z=0;z<8;z++)
    for(let y=8;y<=10;y++)source.push([x,y,z,G.aetherLeaves]);
  let calls=0;
  const result=clearEnchantedCanopyForWalking(source,()=>{
    calls++;return BLOCK.AIR;
  },BLOCK.AIR);
  assert.equal(result,source,'all AIR must leave the original array unmodified');
  const naive=source.length*ENCHANTED_WALKING_GROUND_NEIGHBORS.length*2;
  assert.ok(calls<=450,'cache must keep repeated source-ground probes bounded');
  assert.ok(calls<naive/5,'source-ground reads must be at least fivefold fewer than naive nine-column probes');
  console.log('# ENCHANTED WALK SOURCE PROBE EFFICIENCY '+JSON.stringify({
    leaves:source.length,sourceReads:calls,naiveReads:naive,
    reduction:+(100*(1-calls/naive)).toFixed(1)
  }));
});
