// Moonwillow-specific Phase 2 geometry acceptance. Grounded in the actual
// opt-in tree source, not a decorative mock or screenshot-only assertion.
// The original M7 generator, caves, protected landmarks, collision engine,
// other species and the historical save identity remain unchanged.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildEnchantedTreeCandidate,ENCHANTED_TREE_MAX_CELLS,
  ENCHANTED_TREE_CANDIDATE_KIND} from '../../src/manual-biomes/enchanted-tree-candidates.mjs';
import {ENVIRONMENT_GROUND as G} from '../../src/environment-ground.mjs';
import {WORLD_MAX_Y} from '../../src/depth.mjs';

const pos=(x,y,z)=>x+','+y+','+z;
const directions=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
const drapes=[
 [-3,0,4],[3,0,3],[0,-3,4],[0,3,3],
 [-2,-2,3],[2,2,4],[-2,2,2],[2,-2,3],
 [-3,-1,2],[3,1,2],[1,-3,3],[-1,3,2]
];

test('five authentic Moonwillow styles make a wide, open umbrella instead of a solid conical canopy',()=>{
 for(const roll of [.63,.75,.8,.82,.99]){
  const floor=3,tree=buildEnchantedTreeCandidate(0,floor,0,roll);
  assert.equal(tree.species,ENCHANTED_TREE_CANDIDATE_KIND.MOONWILLOW);
  assert.ok(tree.highestY<=WORLD_MAX_Y);
  assert.ok(tree.cells.length<=135,'keep tree below tighter experimental mobile leaf budget');
  assert.ok(tree.cells.length<=ENCHANTED_TREE_MAX_CELLS);
  const byY=y=>tree.cells.filter(([x,b,z,id])=>b===floor+y&&id!==G.aetherBark);
  const broad=byY(tree.trunkHeight),underside=byY(tree.trunkHeight-1),
    upper=byY(tree.trunkHeight+1);
  assert.ok(broad.length>=37,'flat mid-crown must be broadly spread, not a pine cone');
  assert.ok(underside.length<broad.length,'open hollow lower skirt must be less dense than the moonlit cap');
  assert.ok(upper.length<broad.length,'thin top rim must be less dense than the horizontal cap');
  assert.ok(upper.length<=5,
    'moonlit top tuft must not rebuild the pine-like solid upper crown');
  const low=tree.cells.filter(([x,y,z,id])=>id===G.moonLeaves&&
    y<=floor+tree.trunkHeight-3);
  assert.ok(low.length>=7&&low.length<=17,
    'keep separated hanging tips without restoring a continuous solid lower curtain');
  assert.ok(tree.cells.every(([x,y,z,id])=>Number.isInteger(x)&&
    Number.isInteger(y)&&Number.isInteger(z)&&Number.isInteger(id)&&
    Math.abs(x)<=4&&Math.abs(z)<=4&&y>=floor+1&&y<=WORLD_MAX_Y));
  assert.ok(tree.cells.every(([x,y,z,id])=>id===G.aetherBark||y>=floor+3),
    'no Moonwillow pendant may block the original player head on level roots');
 }
});
test('twelve staggered drapes remain separated and attached to the original rooted bark arms',()=>{
 for(const roll of [.63,.75,.8,.82,.99]){
  const tree=buildEnchantedTreeCandidate(0,3,0,roll);
  const at=new Map(tree.cells.map(([x,y,z,id])=>[pos(x,y,z),id]));
  const bend=roll<.81?-1:1,top=tree.trunkHeight;
  const tips=new Set();
  for(const [dx,dz,hang] of drapes){
    const low=pos(bend+dx,3+top-hang,dz);
    assert.ok(!tips.has(low),'all 12 curtain tips have distinct coordinates');
    tips.add(low);
    for(let dy=top-hang;dy<=top;dy++)
      assert.equal(at.get(pos(bend+dx,3+dy,dz)),G.moonLeaves,
        'each hanging curtain must be a face-connected continuous leaf column');
  }
  assert.equal(tips.size,12);
  for(const dir of [-1,1])for(const dist of [1,2]){
    assert.equal(at.get(pos(bend+dist*dir,3+top-1,0)),G.aetherBark);
    assert.equal(at.get(pos(bend,3+top-1,dist*dir)),G.aetherBark);
  }
 }
});
test('every mineable Moonwillow canopy voxel has a six-face path back to its real root',()=>{
 for(const roll of [.63,.75,.8,.82,.99]){
  const tree=buildEnchantedTreeCandidate(-32,3,-512,roll);
  const all=new Set(tree.cells.map(([x,y,z])=>pos(x,y,z)));
  const root=pos(-32,4,-512);
  assert.ok(all.has(root));
  const found=new Set([root]),queue=[root];
  while(queue.length){
    const [x,y,z]=queue.pop().split(',').map(Number);
    for(const [dx,dy,dz] of directions){
      const nearby=pos(x+dx,y+dy,z+dz);
      if(all.has(nearby)&&!found.has(nearby)){
        found.add(nearby);queue.push(nearby);
      }
    }
  }
  assert.equal(found.size,all.size,
    'no isolated hanging leaf island may float away from the physical branch network');
  assert.deepEqual(buildEnchantedTreeCandidate(-32,3,-512,roll).cells,tree.cells,
    'same seeded style must build identical Moonwillow voxel order and IDs');
 }
});
