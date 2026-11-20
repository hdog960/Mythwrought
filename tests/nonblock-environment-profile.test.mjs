import assert from 'node:assert/strict';
import test from 'node:test';
import {BLOCK,VoxelWorld,collides,raycast,terrainHeight} from '../src/voxel.mjs';
import {biome130Block,isBiome130BlockId} from '../src/biome130-registry.mjs';
import {createStagedCaveRuntime} from '../src/manual-caves/opt-in-runtime.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {pack2WaterSectionVertices} from '../src/pack2-integration.mjs';
import {exportM2World,inspectSnapshotWorld} from '../src/manual-biomes/m2-runtime-bridge.mjs';
import {makeVaultRecord,validateVaultRecord} from '../src/vault.mjs';
import {mirrorSnapshot,validateMirrorSnapshot} from '../src/mirror.mjs';
import {findSafeSpawn} from '../src/physics.mjs';
import {createLiveMobSession} from '../src/mobs/live-game.mjs';
import {planEnvironmentalScenery} from '../src/nonblock/staged-habitats.mjs';
import {environmentalWaterEffects,prepareCandidateEffects} from '../src/nonblock/candidate-effects.mjs';
import {FourRegionWorld,fourRegionProfile,M6_BALANCED_GENERATOR,M7_ENVIRONMENT_GENERATOR,
  restoreFourRegionWorld} from '../src/manual-biomes/profile-world.mjs';

const sites={desert:[512,0],snow:[0,512],mountain:[-512,0],enchanted:[0,-512]};
const capIds={desert:[256,257,259],snow:[272,276,279],mountain:[400,401,402,272],enchanted:[403,404,405]};
const surface=(world,x,z)=>{
  for(let y=19;y>=2;y--){
    const id=world.get(x,y,z);
    if(id!==BLOCK.AIR)return {id,y};
  }
  return {id:BLOCK.AIR,y:0};
};

test('the explicit environment profile uses continuous solid terrain in the four biome interiors',()=>{
  assert.equal(typeof M7_ENVIRONMENT_GENERATOR,'string');
  for(const seed of [179,2026]){
    const evolved=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
    const legacy=new VoxelWorld(seed);
    for(const [x,z] of [[0,0],[5,-7],[-7,4]])
      for(let y=-3;y<=19;y++)assert.equal(evolved.get(x,y,z),legacy.get(x,y,z),'Plains spawn changed');
    for(const [name,[cx,cz]] of Object.entries(sites)){
      let selected=0;
      for(let x=cx-10;x<=cx+10;x+=2)for(let z=cz-10;z<=cz+10;z+=2){
        const {id,y}=surface(evolved,x,z);
        if(!capIds[name].includes(id))continue;
        if(isBiome130BlockId(id))
          assert.ok(biome130Block(id).boxes.some(box=>box.join(',')==='0,0,0,1,1,1'));
        assert.notEqual(evolved.get(x,y-1,z),BLOCK.AIR,'Found unsupported natural terrain');
        selected++;
      }
      assert.ok(selected>=72,seed+' '+name+' has too little coherent terrain');
    }
  }
});

test('new materials and removals round-trip as schema-1 edits without changing older profiles',()=>{
  const seed=179;
  const profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
  const world=new FourRegionWorld(seed,profile);
  const olderBefore=new FourRegionWorld(seed,fourRegionProfile(seed,M6_BALANCED_GENERATOR));
  const [x,z]=sites.enchanted;
  const before=surface(olderBefore,x,z);
  assert.ok(world.set(50,18,50,404));
  const {y}=surface(world,x,z);
  assert.deepEqual(raycast(world,[x+.5,y+2.5,z+.5],[0,-1,0],6)?.hit,[x,y,z]);
  assert.ok(world.set(x,y,z,BLOCK.AIR));
  const saved=world.save();
  assert.equal(saved.schema,1);
  const reopened=restoreFourRegionWorld(saved,profile);
  assert.equal(reopened.get(50,18,50),404);
  assert.equal(reopened.get(x,y,z),BLOCK.AIR);
  assert.deepEqual(reopened.save(),saved);
  assert.deepEqual(surface(new FourRegionWorld(seed,olderBefore.generationProfile),x,z),before);
});

test('new biome terrain keeps actual cave air and existing protected mouths',()=>{
  for(const seed of [179,2026]){
    const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
    const legacy=new VoxelWorld(seed);
    let air=0;
    for(const [cx,cz] of Object.values(sites))for(let x=cx-5;x<=cx+5;x++)for(let z=cz-5;z<=cz+5;z++){
      const limit=terrainHeight(x,z,seed)-2;
      for(let y=-3;y<=limit;y++)if(legacy.get(x,y,z)===BLOCK.AIR){
        assert.equal(world.get(x,y,z),BLOCK.AIR);
        air++;
      }
    }
    assert.ok(air>0,'The sample must include real cave air');
  }
});

test('the combined world uses the protected cave routes, with ordinary collision and save edits',()=>{
  const seed=179,profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
  const world=new FourRegionWorld(seed,profile);
  const {world:original,entrancePlan}=createStagedCaveRuntime(seed,undefined,{approved:true});
  assert.equal(world.environmentCaves.entranceSites.length,4);
  assert.ok(world.environmentCaves.cavePlanReport.surfaceTransitionConnected);
  assert.ok(world.environmentCaves.cavePlanReport.vaultBridgeConnected);
  assert.ok(world.environmentCaves.cavePlanReport.eastGalleryConnected);
  for(const {route} of entrancePlan.entrances){
    for(const {x,z,floor,feet} of route){
      assert.equal(world.get(x,floor,z),original.get(x,floor,z));
      assert.equal(world.get(x,feet,z),BLOCK.AIR);
      assert.equal(collides(world,x+.5,feet,z+.5),false);
      assert.equal(collides(world,x+.5,feet-.06,z+.5),true);
    }
  }
  const {x,z,floor}=entrancePlan.entrances[0].route[0];
  assert.ok(world.set(x,floor,z,BLOCK.AIR));
  const saved=world.save(),reopened=restoreFourRegionWorld(saved,profile);
  assert.equal(saved.schema,1);
  assert.equal(reopened.get(x,floor,z),BLOCK.AIR);
  assert.notEqual(original.get(x,floor,z),BLOCK.AIR);
});

test('new biome forests use climate-specific editable trees with deterministic chunk edges',()=>{
  const seed=179,profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
  const world=new FourRegionWorld(seed,profile);
  const reload=new FourRegionWorld(seed,profile);
  for(const [name,leaves] of [['snow',[406,407]],['enchanted',[409,410]]]){
    const [cx,cz]=sites[name];
    let seen=0;
    for(let z=cz+20;z>=cz-20;z--)for(let x=cx-20;x<=cx+20;x++){
      for(let y=9;y<=19;y++){
        const block=world.get(x,y,z);
        if(!leaves.includes(block))continue;
        assert.equal(reload.get(x,y,z),block);
        seen++;
      }
    }
    assert.ok(seen>=30,name+' needs a visible climate-specific canopy');
  }
  assert.equal(world.save().edits.length,0);
});

test('a piece of generated canopy stays mined on reload',()=>{
  const seed=179,profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
  const world=new FourRegionWorld(seed,profile);
  let target;
  for(let x=-20;x<=20&&!target;x++)for(let z=490;z<=535&&!target;z++)
    for(let y=17;y>=8;y--)if([406,407].includes(world.get(x,y,z))){
      target=[x,y,z];
      break;
    }
  assert.ok(target);
  assert.ok(world.set(...target,BLOCK.AIR));
  assert.equal(restoreFourRegionWorld(world.save(),profile).get(...target),BLOCK.AIR);
});

test('neighboring special biomes share a solid shoulder without an exposed Plains ribbon',()=>{
  const seed=179;
  const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  for(const [x,z] of [[-640,288],[-260,440],[252,-432],[512,284]]){
    const {id,y}=surface(world,x,z);
    assert.notEqual(id,BLOCK.GRASS,'Special-biome transition exposed a legacy grass column at '+[x,z]);
    assert.notEqual(world.get(x,y-1,z),BLOCK.AIR);
  }
});

test('the vault and mirror retain the immutable profile and Schema-1 edits together',()=>{
  const seed=179,profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
  const world=new Pack2LiveWorld(new FourRegionWorld(seed,profile));
  assert.ok(world.set(50,18,50,404));
  const raw=exportM2World(world);
  const vault=validateVaultRecord(makeVaultRecord(raw,'v010:fixed:abcdefghij'));
  const mirror=validateMirrorSnapshot(mirrorSnapshot(raw,seed),seed);
  for(const copy of [vault,mirror]){
    assert.equal(copy.raw,raw);
    const restored=inspectSnapshotWorld(copy.raw,seed);
    assert.deepEqual(restored.base.generationProfile,profile);
    assert.equal(restored.save().schema,1);
    assert.equal(restored.get(50,18,50),404);
  }
  assert.throws(()=>mirrorSnapshot(raw,seed+1),/seed mismatch/);
  const {pack2,...damaged}=JSON.parse(raw);
  assert.throws(()=>makeVaultRecord(JSON.stringify(damaged),'v010:fixed:abcdefghij'),/Incomplete biome export/);
});

test('real combined spawn terrain attracts its native creatures during the first habitat survey',()=>{
  for(const seed of [179,2026]){
    const world=new Pack2LiveWorld(new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR)));
    const player=findSafeSpawn(world);
    const regions=[];
    for(let cz=-1;cz<=1;cz++)for(let cx=-1;cx<=1;cx++)
      regions.push({cx,cz,section:0,feet:player.feet});
    regions.sort((a,b)=>a.cx**2+a.cz**2-b.cx**2-b.cz**2);
    const session=createLiveMobSession({world,seed,storage:{getItem:()=>null},resident:()=>true,
      biomeAt:()=> 'plains',skyAt:()=>({light:1,dayPhase:'day'}),caveAt:()=>({underground:false}),
      playerAt:()=>[player.x,player.feet,player.z],spawnOnFirstVisit:true});
    for(let i=0;i<100;i++)session.advance(.1,regions);
    assert.equal(session.status().species,40);
    const inhabitants=session.drawEntities();
    assert.ok(inhabitants.length>0,'Fresh combined region stayed empty for seed '+seed);
    assert.ok(inhabitants.every(({species})=>species.habitat.biomes.includes('meadow')));
    session.dispose();
  }
});

test('a natural desert oasis shares the ordinary fluid mesh, interaction and save paths',()=>{
  const seed=179,profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
  const world=new Pack2LiveWorld(new FourRegionWorld(seed,profile));
  const pool=[572,7,63], [x,y,z]=pool;
  assert.equal(world.get(...pool),76);
  assert.equal(world.getPack2State(...pool).source,true);
  assert.equal(collides(world,x+.5,y+.05,z+.5),false);
  assert.deepEqual(raycast(world,[x+.5,y+3,z+.5],[0,-1,0],6)?.hit,pool);
  assert.ok(pack2WaterSectionVertices(world,35,3,0).length>0);
  assert.ok(world.base.environmentOasisShore(35,3).length>0);
  assert.ok(planEnvironmentalScenery(world.base,35,3).some(item=>
    item.sceneId==='nonblock:d:saltgrass'||item.sceneId==='nonblock:d:desert-bloom'));
  const waterChunks=[{x:35,z:3,section:0}],viewer=[x+.5,y+2,z+.5];
  const naturalEffects=environmentalWaterEffects(world,waterChunks,viewer,2);
  assert.deepEqual(naturalEffects.map(effect=>effect.sceneId),['scene48:surface-ripples']);
  assert.ok(prepareCandidateEffects(naturalEffects)({seconds:1,seed,viewer,parents:new Set()}).vertices.length>0);
  assert.deepEqual(world.save().edits,[]);
  assert.equal(world.placePack2(x,y+2,z,76,{level:3,source:false,flow:'north'}),true);
  assert.ok(environmentalWaterEffects(world,waterChunks,viewer,2).some(effect=>effect.sceneId==='scene48:spray'));
  assert.equal(environmentalWaterEffects(world,waterChunks,viewer,1).length,1);
  assert.equal(world.set(...pool,BLOCK.AIR),true);
  const restored=inspectSnapshotWorld(exportM2World(world),seed);
  assert.equal(restored.get(...pool),BLOCK.AIR);
  assert.equal(restored.getPack2State(...pool),null);
  assert.equal(restored.get(x+1,y,z),76);
});
