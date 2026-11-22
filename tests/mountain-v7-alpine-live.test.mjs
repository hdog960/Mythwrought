// MYTHWROUGHT: actual V7 mountain meadow physical regression, Phase 1.
// This exercises the production plan + real M7 VoxelWorld, not the prototype
// classifier. No browser mocks, no seed/profile conversion, no save writes.
import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,terrainHeight,VoxelWorld,meshChunk,chunkCoord} from '../src/voxel.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR,
  M6_BALANCED_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {planEnvironmentalColumn} from '../src/manual-biomes/environment-v7.mjs';
import {ENVIRONMENT_GROUND as G} from '../src/environment-ground.mjs';

const seed=179;
const simple=(x,y,z)=>{
  const top=terrainHeight(x,z,seed);
  return y>top?BLOCK.AIR:y===top?BLOCK.GRASS:y>=top-2?BLOCK.DIRT:BLOCK.STONE;
};
const center=[-512,0];
function inspect(){
  const rows=[],ids=new Map();
  for(let z=center[1]-80;z<=center[1]+80;z+=4)
    for(let x=center[0]-80;x<=center[0]+80;x+=4){
      const biome=v6BiomeAt(x,z,seed);
      if(biome?.name!=='mountain'||biome.weight<.92)continue;
      const plan=planEnvironmentalColumn(x,z,seed,simple,biome);
      if(!plan.size)continue;
      const top=Math.max(...plan.keys()),id=plan.get(top);
      rows.push({x,z,top,id});
      ids.set(x+','+z,id);
    }
  return {rows,ids};
}
test('M7 mountain native planner genuinely generates bounded connected alpine grass',()=>{
  const {rows,ids}=inspect();
  const meadows=rows.filter(r=>r.id===BLOCK.GRASS),rock=rows.filter(r=>r.id!==BLOCK.GRASS);
  assert.ok(rows.length>500,'Missing original mountain sample region');
  assert.ok(meadows.length>=30,'M7 grass material was not actually integrated');
  assert.ok(rock.length>=200,'M7 converted most stone to grass');
  const adjacent=meadows.filter(({x,z})=>
    ids.get((x+4)+','+z)===BLOCK.GRASS||ids.get((x-4)+','+z)===BLOCK.GRASS||
    ids.get(x+','+(z+4))===BLOCK.GRASS||ids.get(x+','+(z-4))===BLOCK.GRASS);
  assert.ok(adjacent.length>=15,'Grass was not connected into natural meadow patches');
  assert.ok(meadows.every(({top})=>top>=5&&top<=11),'High cliffs/peaks turned grassy');
  console.log('MOUNTAIN M7 LIVE ALPINE CAPS '+JSON.stringify({
    seed,sampled:rows.length,alpine:meadows.length,rock:rock.length,
    neighbors:adjacent.length,anchors:meadows.slice(0,8)}));
});

test('seed 2026 mountain retains substantial real mineable stone around alpine patches',()=>{
  // This independently reinforces the existing strict 72/121 source contract
  // in nonblock-environment-profile.test.mjs; never reduce its threshold.
  const sourceSeed=2026;
  const w=new FourRegionWorld(sourceSeed,
    fourRegionProfile(sourceSeed,M7_ENVIRONMENT_GENERATOR));
  const allowedRock=new Set([G.slate,G.scree,G.gneiss,272]);
  let rock=0,grass=0,foreign=0,unsupported=0;
  for(let x=-522;x<=-502;x+=2)for(let z=-10;z<=10;z+=2){
    let id=BLOCK.AIR,y=0;
    for(let level=19;level>=2;level--){
      const cell=w.get(x,level,z);
      if(cell!==BLOCK.AIR){id=cell;y=level;break;}
    }
    if(allowedRock.has(id))rock++;
    else if(id===BLOCK.GRASS){
      grass++;
      if(w.get(x,y-1,z)===BLOCK.AIR)unsupported++;
    }else foreign++;
  }
  assert.ok(rock>=72,'Source contract requires >=72 real rocky caps out of 121');
  assert.ok(grass>=8,'Mountain meadow improvements disappeared entirely from this seed');
  assert.ok(grass<=42,'Mountain grass overwhelmed rocky lower slopes');
  assert.equal(unsupported,0,'A new alpine cap became unsupported');
  assert.equal(w.edits.size,0,'Sampling naturally generated stone changed the save');
  console.log('MOUNTAIN SEED 2026 EXPOSED STONE '+JSON.stringify({
    rock,grass,foreign,unsupported,examined:121,seed:sourceSeed
  }));
});

test('actual M7 VoxelWorld resolves native grass caps and protected cave-owned air',()=>{
  const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  assert.equal(world.generationProfile.generator,M7_ENVIRONMENT_GENERATOR);
  const {rows}=inspect();
  const sites=rows.filter(r=>r.id===BLOCK.GRASS).slice(0,32);
  let materialized=0,protectedOrOccluded=0;
  for(const site of sites){
    const {x,z,top}=site;
    const natural=world.get(x,top,z);
    if(natural===BLOCK.GRASS){
      assert.equal(world.get(x,top+1,z),BLOCK.AIR);
      assert.equal(world.get(x,top-1,z),BLOCK.DIRT);
      materialized++;
    }else protectedOrOccluded++;
  }
  assert.ok(materialized>=1,'No actual M7 mountain grass cap is visible');
  for(let x=-488;x<=-484;x++)for(let z=23;z<=25;z++){
    const top=terrainHeight(x,z,seed);
    assert.equal(world.get(x,top,z),BLOCK.AIR,
      'Actual source-authored rectangular cave throat must not be filled');
  }
  assert.equal(world.edits.size,0,'Reading M7 meadows modified player saves');
  console.log('MOUNTAIN M7 REAL SOURCE MATERIAL '+JSON.stringify({
    materialized,protectedOrOccluded,legacyCaveAir:15,
    saveEditCount:world.edits.size}));
});

test('M7 alpine surfaces remain deterministic and do not change M6 or nonmountain profiles',()=>{
  const a=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  const b=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  for(const [x,z] of [[-584,-80],[-580,-80],[-576,-80],[-512,0],[-480,0],[-488,24]]){
    const top=terrainHeight(x,z,seed);
    for(let y=top-2;y<=17;y++)assert.equal(a.get(x,y,z),b.get(x,y,z));
  }
  const m6=new FourRegionWorld(seed,fourRegionProfile(seed,M6_BALANCED_GENERATOR));
  assert.equal(m6.generationProfile.generator,M6_BALANCED_GENERATOR);
  for(const [x,z,name] of [[512,0,'desert'],[0,512,'snow'],[0,-512,'enchanted']]){
    const biome=v6BiomeAt(x,z,seed);
    assert.equal(biome?.name,name);
    const cap=planEnvironmentalColumn(x,z,seed,simple,biome);
    assert.ok(![...cap.values()].includes(BLOCK.GRASS),
      'Mountain grass leaked to '+name);
  }
  assert.equal(a.edits.size,0);
  assert.equal(b.edits.size,0);
  assert.equal(m6.edits.size,0);
});

test('actual V7 mountain chunk mesh remains below production 8 MiB budget',()=>{
  const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  const chunks=[[-36,-5],[-33,0],[-32,0],[-30,2]];
  const sizes=[];
  for(const [cx,cz] of chunks){
    const vertices=meshChunk(world,cx,cz);
    assert.ok(vertices instanceof Float32Array);
    assert.equal(vertices.length%9,0);
    assert.ok(vertices.byteLength<=8*1024*1024,
      'Generated meadow chunk exceeded GPU mesh allocation ceiling');
    sizes.push({cx,cz,bytes:vertices.byteLength,vertices:vertices.length/9});
  }
  assert.equal(world.edits.size,0);
  console.log('MOUNTAIN M7 LIVE MESH BUDGET '+JSON.stringify({seed,sizes}));
});
