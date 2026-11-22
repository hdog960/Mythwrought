// MYTHWROUGHT MOUNTAIN #356: independent V7 alpine meadow formula check.
// Match the current guarded live selector exactly without writing edits,
// changing heights or transforming any stored world/profile.
// Run with: node --test tests/mountain-v7-alpine-candidate.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,terrainHeight,VoxelWorld} from '../src/voxel.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {planEnvironmentalColumn} from '../src/manual-biomes/environment-v7.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../src/manual-biomes/profile-world.mjs';

// Smooth world-space two-dimensional noise: absolutely no chunk indices,
// tree placement data, runtime random, or saved edits in the selection.
const smooth=t=>t*t*(3-2*t);
function lattice(x,z,seed){
  let h=Math.imul((x|0)^seed,0x27d4eb2d)^Math.imul((z|0)+seed,0x165667b1);
  h^=h>>>15;h=Math.imul(h,0x85ebca6b);h^=h>>>13;
  return (h>>>0)/4294967295;
}
function coherent(x,z,seed){
  const a=Math.floor(x),b=Math.floor(z),u=smooth(x-a),v=smooth(z-b);
  const p=lattice(a,b,seed)*(1-u)+lattice(a+1,b,seed)*u;
  const q=lattice(a,b+1,seed)*(1-u)+lattice(a+1,b+1,seed)*u;
  return p*(1-v)+q*v;
}
const patches=(x,z,seed)=>.8*coherent(x/64,z/64,seed+7103)+
  .2*coherent(x/20,z/20,seed+7139);

function candidate(x,z,seed,baseline){
  const biome=v6BiomeAt(x,z,seed);
  // Keep the natural scree seam and high rock peaks unchanged.
  if(biome?.name!=='mountain'||biome.weight<.92)return null;
  const original=planEnvironmentalColumn(x,z,seed,baseline,biome);
  if(!original.size)return null; // Genuine cave/landmark veto remains authoritative.
  const top=Math.max(...original.keys());
  if(top<5||top>11||original.get(top)===272)return null;
  // Evaluate only the genuine already-planable neighboring V7 columns. Do
  // not bridge a cave, surface cut, biome edge or steep exposed rock step.
  for(const [dx,dz] of [[2,0],[-2,0],[0,2],[0,-2]]){
    const nearby=v6BiomeAt(x+dx,z+dz,seed);
    if(nearby?.name!=='mountain'||nearby.weight<.90)return null;
    const plan=planEnvironmentalColumn(x+dx,z+dz,seed,baseline,nearby);
    if(!plan.size||Math.abs(Math.max(...plan.keys())-top)>1)return null;
  }
  // A second seeded 11-block exposure field preserves rocky lower shelves.
  if(patches(x,z,seed)<.54||coherent(x/11,z/11,seed+30001)<.56)return null;
  const proposed=new Map(original);
  proposed.set(top,BLOCK.GRASS);
  for(const offset of [1,2])
    if(proposed.has(top-offset))proposed.set(top-offset,BLOCK.DIRT);
  return Object.freeze({top,original,proposed});
}
function plain(x,y,z,seed){
  const old=terrainHeight(x,z,seed);
  return y>old?BLOCK.AIR:y===old?BLOCK.GRASS:y>=old-2?BLOCK.DIRT:BLOCK.STONE;
}
const seed=179, clean=(x,y,z)=>plain(x,y,z,seed);

test('actual V7 lower mountain columns support independent clustered alpine meadow candidates',()=>{
  let total=0,meadows=0,rock=0;
  const positions=[];
  for(let z=-80;z<=80;z+=4)for(let x=-592;x<=-432;x+=4){
    const biome=v6BiomeAt(x,z,seed);
    if(biome?.name!=='mountain'||biome.weight<.92)continue;
    const normal=planEnvironmentalColumn(x,z,seed,clean,biome);
    if(!normal.size)continue;
    total++;
    const result=candidate(x,z,seed,clean);
    const top=Math.max(...normal.keys());
    assert.equal(Boolean(result),normal.get(top)===BLOCK.GRASS,
      'Independent alpine candidate and actual V7 generator disagree');
    if(result){meadows++;positions.push([x,z,result.top]);}
    else rock++;
    assert.deepEqual([...normal],[...planEnvironmentalColumn(x,z,seed,clean,biome)],
      'Normal V7 terrain remains unchanged by candidate inspection');
  }
  assert.ok(total>200, 'Real mountain distribution yielded too few interior columns');
  assert.ok(meadows>20, 'Alpine meadows never materialized');
  assert.ok(rock>20, 'Alpine grass replaced all mountain rock');
  // Multiple adjacent selected samples demonstrate patches rather than
  // isolated one-block confetti; evaluated on world coordinates, not chunks.
  const points=new Set(positions.map(([x,z])=>x+','+z));
  const neighboring=positions.filter(([x,z])=>points.has((x+4)+','+z)||
    points.has((x-4)+','+z)||points.has(x+','+(z+4))||
    points.has(x+','+(z-4))).length;
  assert.ok(neighboring>=10, 'Mountain grass candidate is not spatially coherent');
  console.log('MOUNTAIN ALPINE SOURCE CANDIDATE '+JSON.stringify({
    seed,total,meadows,rock,neighboring,examples:positions.slice(0,8),
    status:'INDEPENDENT LIVE GENERATOR PARITY - no world edits'
  }));
});

test('alpine candidate is only a material proposal and preserves physical column extent',()=>{
  let picked=null;
  outer:for(let x=-580;x<=-450;x+=2)for(let z=-60;z<=60;z+=2)
    if(picked=candidate(x,z,seed,clean))break outer;
  assert.ok(picked,'No candidate found');
  const {top,original,proposed}=picked;
  assert.deepEqual([...proposed.keys()],[...original.keys()]);
  for(const [y,id] of original){
    if(y!==top&&y!==top-1&&y!==top-2)
      assert.equal(proposed.get(y),id,'No hidden rock geometry changed');
  }
  assert.equal(proposed.get(top),BLOCK.GRASS);
  assert.equal(proposed.get(top-1),BLOCK.DIRT);
});

test('actual source-owned rectangular mountain cave entrance remains untouched',()=>{
  const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  const original=new VoxelWorld(seed);
  let preserved=0;
  for(let x=-488;x<=-484;x++)for(let z=23;z<=25;z++){
    const old=terrainHeight(x,z,seed);
    assert.equal(original.naturalAndLandmarkBlock(x,old,z),BLOCK.AIR);
    const proposed=candidate(x,z,seed,(a,b,c)=>world._environmentBaseline(a,b,c));
    assert.equal(proposed,null,'Cave-owned AIR veto must prevent alpine grass');
    assert.equal(world.naturalAndLandmarkBlock(x,old,z),BLOCK.AIR);
    preserved++;
  }
  assert.equal(preserved,15);
  assert.equal(world.edits.size,0);
});

test('candidate never touches plains, desert, snow or enchanted surface profiles',()=>{
  for(const [x,z,name] of [[0,0,null],[512,0,'desert'],[0,512,'snow'],[0,-512,'enchanted']]){
    assert.equal(v6BiomeAt(x,z,seed)?.name??null,name);
    assert.equal(candidate(x,z,seed,clean),null);
  }
});

test('grass pattern is deterministic across repeated calls and world chunk borders',()=>{
  for(const sampleSeed of [1,179,2026]){
    const base=(x,y,z)=>plain(x,y,z,sampleSeed);
    for(let z=-60;z<=60;z+=16)for(let x=-576;x<=-448;x+=16){
      const one=candidate(x,z,sampleSeed,base);
      const two=candidate(x,z,sampleSeed,base);
      assert.deepEqual(one?.proposed??null,two?.proposed??null);
      if(one)assert.ok(one.top<=11&&one.top>=5);
    }
  }
});
