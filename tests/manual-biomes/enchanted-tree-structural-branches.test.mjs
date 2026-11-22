// Focused exact-source physical trunk connectivity for the three experimental
// enchanted species. Unlike image-only proof, this proves all authored bark
// is face-connected to a mineable root: no diagonally floating shafts,
// disconnected branch tips, or leaves replacing supports inside one tree.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildEnchantedTreeCandidate,ENCHANTED_TREE_MAX_CELLS,
  ENCHANTED_TREE_CANDIDATE_KIND}
  from '../../src/manual-biomes/enchanted-tree-candidates.mjs';
import {ENVIRONMENT_GROUND as G} from '../../src/environment-ground.mjs';
import {WORLD_MAX_Y} from '../../src/depth.mjs';

const coord=(x,y,z)=>[x,y,z].join(',');
const rolls=[
  [.001,'ancient-giant'],[.07,'ancient-giant'],[.13999,'ancient-giant'],
  [.14,'starspire'],[.31,'starspire'],[.62,'starspire'],
  [.63,'moonwillow'],[.82,'moonwillow'],[.99,'moonwillow']
];
const directions=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];

test('nine original deterministic style variations have wholly face-connected physical bark',()=>{
  let branches=0,totalBark=0;
  for(const [roll,species] of rolls){
    const floor=4,worldX=-32,worldZ=-512;
    const tree=buildEnchantedTreeCandidate(worldX,floor,worldZ,roll);
    assert.ok(tree,'source style must fit the unchanged WORLD_MAX_Y');
    assert.equal(tree.species,species);
    assert.ok(tree.highestY<=WORLD_MAX_Y);
    assert.ok(tree.cells.length<=ENCHANTED_TREE_MAX_CELLS);
    const bark=new Set(tree.cells.filter(([,,,id])=>id===G.aetherBark)
      .map(([x,y,z])=>coord(x,y,z)));
    const start=tree.footprint.map(([dx,dz])=>coord(worldX+dx,floor+1,worldZ+dz));
    for(const at of start)assert.ok(bark.has(at),'every stated root must actually be bark');
    const pending=[...start],connected=new Set(start);
    while(pending.length){
      const [x,y,z]=pending.pop().split(',').map(Number);
      for(const [dx,dy,dz] of directions){
        const at=coord(x+dx,y+dy,z+dz);
        if(bark.has(at)&&!connected.has(at)){
          connected.add(at);pending.push(at);
        }
      }
    }
    assert.equal(connected.size,bark.size,
      species+' style='+roll+' has bark only connected by a corner, edge or floating island');
    totalBark+=bark.size;
    branches++;
  }
  assert.equal(branches,9);
  console.log('# ENCHANTED PHASE2 CONNECTED TREE BARK '+JSON.stringify({
    variations:branches,totalBark,worldMaxY:WORLD_MAX_Y,
    allMineableFacesConnected:true
  }));
});

test('original Starspire and Moonwillow shafts remain bark even under overlapping own crown leaves',()=>{
  const floor=3;
  for(const roll of [.14,.31,.62,.63,.82,.99]){
    const tree=buildEnchantedTreeCandidate(0,floor,0,roll);
    const get=new Map(tree.cells.map(([x,y,z,id])=>[coord(x,y,z),id]));
    const bend=tree.species===ENCHANTED_TREE_CANDIDATE_KIND.STARSPIRE?
      roll<.38?-1:1:roll<.81?-1:1;
    for(let dy=1;dy<=tree.trunkHeight;dy++){
      const dx=dy>=tree.trunkHeight-2?bend:0;
      assert.equal(get.get(coord(dx,floor+dy,0)),G.aetherBark,
        'canopy may not hollow out the load-bearing bent shaft');
    }
    assert.equal(get.get(coord(bend,floor+tree.trunkHeight-3,0)),G.aetherBark,
      'bent trunk must have a true horizontal elbow');
    if(tree.species===ENCHANTED_TREE_CANDIDATE_KIND.STARSPIRE){
      for(const dir of [-1,1])
        for(const dx of [1,2])
          assert.equal(get.get(coord(bend+dx*dir,floor+tree.trunkHeight-2,0)),
            G.aetherBark,'two-block side spire requires a face-joined arm');
    }else{
      for(const dir of [-1,1])
        for(const dx of [1,2])
          assert.equal(get.get(coord(bend+dx*dir,floor+tree.trunkHeight-1,0)),
            G.aetherBark,'Moonwillow branch must remain attached after all fronds');
    }
  }
});

test('Ancient Giant 2x2 shaft and its four outer heavy branches stay supported by bark beams',()=>{
  for(const roll of [.001,.07,.13999]){
    const floor=3,tree=buildEnchantedTreeCandidate(0,floor,0,roll);
    const at=new Map(tree.cells.map(([x,y,z,id])=>[coord(x,y,z),id]));
    for(let dy=1;dy<=tree.trunkHeight;dy++)
      for(const dx of [0,1])for(const dz of [0,1])
        assert.equal(at.get(coord(dx,floor+dy,dz)),G.aetherBark,
          'original 2x2 Giant shaft must not be hollowed by crown leaves');
    for(const [a,b] of [
      [[-1,0],[-2,0]],[[2,0],[3,0]],
      [[0,-1],[0,-2]],[[0,2],[0,3]]
    ]){
      for(const [dx,dz] of [a,b])
        assert.equal(at.get(coord(dx,floor+tree.trunkHeight-3,dz)),G.aetherBark,
          'heavy outer branch requires real contiguous bearing beam');
    }
  }
});

test('canopies leave the two standing/player head voxels unobstructed away from trunks',()=>{
  for(const [roll] of rolls){
    const floor=3,tree=buildEnchantedTreeCandidate(0,floor,0,roll);
    assert.ok(tree.cells.some(([,,,id])=>id===G.moonLeaves||id===G.aetherLeaves));
    assert.ok(tree.cells.every(([x,y,z,id])=>id===G.aetherBark||
      y>=floor+3),'low-hanging leaves may not fill a two-block player standing area');
    assert.ok(tree.cells.every(([x,y,z,id])=>Number.isInteger(x)&&Number.isInteger(y)&&
      Number.isInteger(z)&&Number.isInteger(id)&&y<=WORLD_MAX_Y));
    assert.deepEqual(buildEnchantedTreeCandidate(0,floor,0,roll).cells,tree.cells,
      'repeated world generation must be deterministic');
  }
});
