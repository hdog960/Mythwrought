// Real M7 enchanted moss-carpet visual material regression.
// Assert actual generated surface material IDs, not fake pixel colors.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {planEnvironmentalColumn} from '../../src/manual-biomes/environment-v7.mjs';
import {terrainHeight,BLOCK} from '../../src/voxel.mjs';
import {ENVIRONMENT_GROUND as G} from '../../src/environment-ground.mjs';

const seed=7919;
const validSoils=new Set([G.woodlandLoam,G.woodlandPeat,G.woodlandMoss]);
function sampledSurfaces(world,cx,cz){
  const counts=new Map();
  for(let z=cz-26;z<=cz+26;z+=2)for(let x=cx-26;x<=cx+26;x+=2){
    const biome=v6BiomeAt(x,z,seed);
    assert.equal(biome?.name,'enchanted','original screenshot grid must stay enchanted');
    assert.ok(biome.weight>=.70,'screenshot test accidentally crossed shoulder');
    const old=terrainHeight(x,z,seed),plan=world._columnPlan(x,z);
    const top=plan.size?Math.max(...plan.keys()):old;
    const id=world.naturalAndLandmarkBlock(x,top,z);
    counts.set(id,(counts.get(id)??0)+1);
    assert.notEqual(id,BLOCK.GRASS,'foreign plains grass in genuine enchanted interior');
    if(validSoils.has(id))assert.equal(world.get(x,top,z),id,
      'the original game must expose the computed ground cap when not occupied');
  }
  return counts;
}
test('original landmark camera stays purple-dominant but retains scattered moonlit moss',()=>{
  const w=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  const counts=sampledSurfaces(w,-74,-585);
  const total=[...counts.values()].reduce((a,b)=>a+b,0);
  assert.equal(total,729);
  const moss=counts.get(G.woodlandMoss)??0;
  const purple=(counts.get(G.woodlandLoam)??0)+(counts.get(G.woodlandPeat)??0);
  assert.ok(moss/total>=.08,'the forest must retain recognizably magical moonmoss');
  assert.ok(moss/total<=.40,'green-gray moss must not dominate the landmark floor');
  assert.ok(purple/total>=.55,'purple earth must dominate the landmark floor');
});
test('both source-backed camera angles retain genuine original-game ground identity',()=>{
  const w=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  const foreground=sampledSurfaces(w,-56,-568);
  const interior=sampledSurfaces(w,-24,-537);
  assert.ok((foreground.get(G.woodlandPeat)??0)>200,
    'purple foreground is still visibly present');
  assert.ok((interior.get(G.woodlandPeat)??0)>400,
    'original deeply purple forest floor remains dominant in the interior');
  assert.equal(w.edits.size,0);
});
test('existing enchanted shoulders keep their former moss cap, and plains stays untouched',()=>{
  const old=terrainHeight(-74,-585,seed);
  const normal=(x,y,z)=>y>old?BLOCK.AIR:y===old?BLOCK.GRASS:BLOCK.DIRT;
  for(const weight of [.51,.60,.69]){
    const plan=planEnvironmentalColumn(-74,-585,seed,normal,{name:'enchanted',weight});
    const top=Math.max(...plan.keys());
    assert.equal(plan.get(top),G.woodlandMoss,
      'existing enchanted shoulder must retain its original green-gray material');
  }
  assert.equal(planEnvironmentalColumn(-74,-585,seed,normal,null).size,0);
  for(const name of ['desert','snow','mountain'])
    assert.notEqual(
      [...planEnvironmentalColumn(-74,-585,seed,normal,{name,weight:1}).values()]
        .at(-1),G.woodlandMoss,'other biome must never inherit changed moss');
  const w=new FourRegionWorld(179,fourRegionProfile(179,M7_ENVIRONMENT_GENERATOR));
  assert.equal(v6BiomeAt(-256,-624,179)?.name,'enchanted');
  assert.ok(v6BiomeAt(-256,-624,179).weight<.5);
  assert.equal(w.get(-256,terrainHeight(-256,-624,179),-624),BLOCK.GRASS,
    'documented legitimate thin transition grass must remain');
});
