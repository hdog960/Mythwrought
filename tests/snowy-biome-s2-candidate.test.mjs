// Real M7 source survey and physical cap safety; no synthetic terrain.
import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {BLOCK,terrainHeight,VoxelWorld} from '../src/voxel.mjs';
import {biome130Block} from '../src/biome130-registry.mjs';
import {FourRegionWorld,fourRegionProfile,restoreFourRegionWorld,
  M7_ENVIRONMENT_GENERATOR,M6_BALANCED_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {proposedSnowS2Cap,SNOW_S2_PHYSICAL_CAP}
  from '../src/manual-biomes/snowy-s2-cap-candidate.mjs';

const worldFor=seed=>new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const sample=world=>{
  const found=[];
  for(let x=-160;x<=160;x+=8)for(let z=352;z<=672;z+=8){
    const plan=proposedSnowS2Cap(world,x,z);
    if(plan)found.push(plan);
  }
  return found;
};
test('S2 source candidate covers real exposed snowy grass, not shaders or other biomes',()=>{
  const block=biome130Block(SNOW_S2_PHYSICAL_CAP);
  assert.equal(block.solid,true);
  assert.ok(block.boxes.some(b=>b.join(',')==='0,0,0,1,1,1'));
  for(const seed of [179,2026]){
    const world=worldFor(seed),before=world.save();
    const plans=sample(world);
    assert.ok(plans.length>0,seed+' must have an authentic supported grass cap');
    assert.deepEqual(plans,sample(world),'Candidate must be deterministic');
    assert.equal(new Set(plans.map(p=>[p.x,p.y,p.z].join(','))).size,plans.length);
    for(const p of plans){
      assert.equal(p.y,terrainHeight(p.x,p.z,seed));
      assert.equal(world.get(p.x,p.y,p.z),BLOCK.GRASS);
      assert.equal(world.get(p.x,p.y-1,p.z)===BLOCK.AIR,false);
      assert.equal(world.edits.has([p.x,p.y,p.z].join(',')),false);
      assert.equal(p.from,BLOCK.GRASS);assert.equal(p.to,272);
      for(let y=p.y+1;y<=19;y++)
        assert.equal(world.get(p.x,y,p.z),BLOCK.AIR);
    }
    assert.deepEqual(world.save(),before,'Proposal must never write an M7 world');
  }
});
test('S2 rejects protected real wood, leaves, stone, live edits and other profiles',()=>{
  const witnesses=[
    {seed:179,x:-152,z:368,above:[8,BLOCK.WOOD]},
    {seed:179,x:-104,z:456,above:[15,BLOCK.LEAVES]},
    {seed:2026,x:-104,z:360,above:[10,BLOCK.STONE]}
  ];
  for(const w of witnesses){
    const world=worldFor(w.seed);
    assert.equal(world.get(w.x,w.above[0],w.z),w.above[1]);
    assert.equal(proposedSnowS2Cap(world,w.x,w.z),null);
    assert.equal(world.get(w.x,w.above[0],w.z),w.above[1]);
  }
  const world=worldFor(179),p=sample(world)[0];
  assert.ok(world.set(p.x,p.y,p.z,BLOCK.AIR));
  assert.equal(proposedSnowS2Cap(world,p.x,p.z),null);
  const v6=new FourRegionWorld(179,fourRegionProfile(179,M6_BALANCED_GENERATOR));
  assert.equal(proposedSnowS2Cap(v6,p.x,p.z),null);
  for(const [x,z] of [[0,0],[512,0],[-512,0],[0,-512]])
    assert.equal(proposedSnowS2Cap(world,x,z),null);
});
test('S2 cap-only proposal protects original AIR and roundtrips explicit edit without M7 upgrade',()=>{
  const world=worldFor(179),p=sample(world)[0],profile=world.generationProfile;
  const original=new VoxelWorld(179),witnesses=[
    [-160,5,456],[-152,8,368],[-104,15,456]
  ];
  const old=witnesses.map(([x,y,z])=>world.get(x,y,z));
  assert.equal(profile.generator,M7_ENVIRONMENT_GENERATOR);
  assert.ok(world.set(p.x,p.y,p.z,p.to),'Physical snow cap is regular playable voxel');
  assert.equal(world.get(p.x,p.y,p.z),272);
  const saved=world.save(),reloaded=restoreFourRegionWorld(saved,profile);
  assert.equal(saved.schema,1);
  assert.equal(saved.edits.length,1);
  assert.deepEqual(reloaded.save(),saved,'Exact old schema-1 saved-byte structure');
  assert.equal(reloaded.get(p.x,p.y,p.z),272);
  for(let i=0;i<witnesses.length;i++){
    const [x,y,z]=witnesses[i];
    assert.equal(reloaded.get(x,y,z),old[i],'Cave, tree or landmark changed');
  }
  assert.equal(worldFor(179).get(p.x,p.y,p.z),BLOCK.GRASS,'Old M7 unchanged');
  assert.equal(original.get(p.x,p.y,p.z),BLOCK.GRASS,'Legacy unchanged');
});
test('S2 candidate remains detached from all live world/profile readers',()=>{
  for(const path of ['src/manual-biomes/profile-world.mjs',
    'src/manual-biomes/environment-v7.mjs','src/main.mjs']){
    assert.equal(readFileSync(path,'utf8').includes('snowy-s2-cap-candidate'),false,
      'S2 candidate cannot silently modify existing M7 saves: '+path);
  }
});
