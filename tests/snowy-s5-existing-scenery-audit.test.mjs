import assert from 'node:assert/strict';
import test from 'node:test';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {reviewSnowS5Scenery,SNOW_S5_REUSED_FAMILIES}
  from '../src/manual-biomes/snowy-s5-existing-scenery-audit.mjs';
const key=(x,y,z)=>x+','+y+','+z;
const seed=179, y=8;
const inSnow=(x,z)=>v6BiomeAt(x,z,seed)?.name==='snow'&&
  v6BiomeAt(x,z,seed).weight>=.8;
const candidates=[];
for(let x=-40;x<=40;x+=8)for(let z=480;z<=540;z+=8)
  if(inSnow(x,z))candidates.push([x,z]);
assert.ok(candidates.length>=5);
function sceneWorld(){
  const edits=new Map(),caves=new Map();
  const ground=new Map();for(const [x,z] of candidates)ground.set(key(x,y-1,z),272);
  const world={seed,generationProfile:{generator:'mythwrought-five-surface-regions-v7'},
    edits,environmentCaves:{get:(...p)=>caves.get(key(...p))},
    naturalAndLandmarkBlock:(...p)=>ground.get(key(...p))??0,
    get:(...p)=>edits.get(key(...p))??ground.get(key(...p))??0,
    save:()=>({schema:1,seed,edits:[...edits]})};
  const placements=SNOW_S5_REUSED_FAMILIES.map((sceneId,i)=>({sceneId,
    anchor:[...candidates[i].slice(0,1),y,candidates[i][1]],
    variant:i%4,orientation:0}));
  placements.push({sceneId:'scene36:freestanding-torch',
    anchor:[candidates[0][0],y,candidates[0][1]]});
  placements.push({sceneId:'nonblock:d:saltgrass',anchor:[0,y,0]});
  const deps={biomeAt:v6BiomeAt,planScenery:()=>placements};
  return {world,placements,ground,edits,caves,deps};
}
test('original V6 snow coordinates count all existing winter family IDs without duplicating their assets',()=>{
  const {world,deps}=sceneWorld(),before=JSON.stringify(world.save());
  const a=reviewSnowS5Scenery(world,0,32,deps);
  assert.deepEqual(a,reviewSnowS5Scenery(world,0,32,deps));
  assert.equal(a.summary.sourceWinter,5);
  assert.equal(a.summary.otherExistingSources,1);
  assert.equal(a.summary.outsideSnowInterior,1);
  assert.ok(SNOW_S5_REUSED_FAMILIES.every(s=>a.counts[s]===1));
  assert.equal(a.summary.caveAtAnchor,0);
  assert.equal(a.summary.treeAnchorConflicts,0);
  assert.equal(a.summary.editsAtAnchor,0);
  assert.equal(JSON.stringify(world.save()),before);
  assert.equal(a.caveAndSceneGeometryFullyAccepted,false);
});
test('winter scene reviewer exposes existing cave, edits and prospective S3 conflict without mutating them',()=>{
  const {world,caves,edits,deps}=sceneWorld(),[x,z]=candidates[0];
  caves.set(key(x,y,z),0);
  edits.set(key(x,y,z),0);
  const a=reviewSnowS5Scenery(world,0,32,{...deps,
    treeCells:[[x,y,z,4]]});
  assert.equal(a.summary.caveAtAnchor,1);
  assert.equal(a.summary.treeAnchorConflicts,1);
  assert.equal(a.summary.editsAtAnchor,1);
  assert.deepEqual([...edits],[ [key(x,y,z),0] ]);
  assert.equal(a.reviewed[0].detachedTreeAnchorConflict,true);
  assert.equal(a.reviewed[0].caveOverride,true);
});
test('fail closed on non-M7 source, malformed scene, wrong source hash, planned save writes',()=>{
  const {world,deps,edits}=sceneWorld();
  for(const input of [
    {...deps,originalSourceBlob:'unverified'},
    {...deps,planScenery:()=>Array.from({length:49},()=>({sceneId:'x',anchor:[0,8,512]}))},
    {...deps,planScenery:()=>[{sceneId:'x',anchor:['oops',8,512]}]},
    {...deps,treeCells:[[0,8,512,999]]},
    {...deps,planScenery:()=>{edits.set('0,8,512',0);return []}}
  ])assert.throws(()=>reviewSnowS5Scenery(world,0,32,input),/original|source|scenery|world|Invalid|Oversized/i);
  assert.throws(()=>reviewSnowS5Scenery({...world,generationProfile:{generator:'legacy'}},0,32,deps),/original|source|scenery/i);
});
