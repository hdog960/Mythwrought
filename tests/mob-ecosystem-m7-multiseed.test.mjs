// Independent source-native comparative observation. Does not create mobs,
// write saves, activate production, or change the original generated world.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../src/manual-biomes/profile-world.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {deepCaveRoute} from '../src/deep-cave-network.mjs';
import {findSafeSpawn} from '../src/physics.mjs';
import {chunkCoord} from '../src/voxel.mjs';
import {sectionForY} from '../src/depth.mjs';
import {createMobHostView} from '../src/mobs/host-view.mjs';
import {classifyLiveBiome} from '../src/mobs/live-game.mjs';
import {spawnEligible} from '../src/mobs/ecology.mjs';
import {supportedPosition} from '../src/mobs/movement.mjs';
import {createM7MobCollisionReader}
  from '../src/mobs/ecosystem-world-geometry.mjs';
import {eligibleHabitatPool,planHabitatCandidate}
  from '../src/mobs/ecosystem-habitat.mjs';

const SURFACE=Object.freeze([
  {biome:'meadow',source:'plains',x:0,z:0},
  {biome:'desert',source:'desert',x:512,z:0},
  {biome:'snow',source:'snow',x:0,z:512},
  {biome:'alpine',source:'mountain',x:-512,z:0},
  {biome:'forest',source:'enchanted',x:0,z:-512}
]);
const CAVE_FLOORS=Object.freeze([-30,-80]);
function sourceBiome(x,z,seed){
  return v6BiomeAt(x,z,seed)?.name??'plains';
}

test('three-seed real M7 five-biome and historical-cave collision comparison is nonmutating',()=>{
  const outcomes=[];
  for(const seed of [179,379,1001]){
    const base=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
    const world=new Pack2LiveWorld(base),reader=createM7MobCollisionReader(world);
    const before=JSON.stringify(base.save());
    const route=deepCaveRoute();
    const samples=[
      ...SURFACE.map(s=>({...s,siteType:'surface'})),
      ...CAVE_FLOORS.map(floor=>{
        const step=route.find(p=>p.floor===floor);
        assert.ok(step,'Historical cave source missing at floor '+floor);
        return {biome:'cave',source:'deep-cave',siteType:'cave',floor,
          x:step.x,z:step.z,feet:step.feet};
      })
    ];
    for(const site of samples){
      if(site.siteType==='surface')
        assert.equal(sourceBiome(site.x,site.z,seed),site.source,
          'Never invent or relabel a source-generated biome');
      const player=site.siteType==='surface'?
        findSafeSpawn(world,site.x,site.z):
        {x:site.x+.5,z:site.z+.5,feet:site.feet};
      const feet=player.feet;
      const section=sectionForY(Math.floor(feet));
      assert.notEqual(section,null);
      const cx=chunkCoord(player.x),cz=chunkCoord(player.z);
      const resident=(x,z,s)=>s===section&&Math.abs(x-cx)<=2&&Math.abs(z-cz)<=2;
      const options={
        resident,
        biomeAt:point=>({
          id:point[1]<-3.5?'cave':
            classifyLiveBiome(sourceBiome(point[0],point[2],seed),point[1],false),
          hazard:false,climbable:point[1]<-3.5
        }),
        caveAt:point=>({ready:resident(chunkCoord(point[0]),chunkCoord(point[2]),
          sectionForY(Math.floor(point[1]))),climbable:point[1]<-3.5}),
        skyAt:point=>({light:point[1]<-3.5?.29:.8,
          dayPhase:point[1]<-3.5?'night':'day'})
      };
      const oldQuery=createMobHostView(world,options);
      const proposedQuery=createMobHostView(reader,options);
      const observer=[player.x,feet,player.z];
      assert.equal(oldQuery.environment(observer).biome,site.biome);
      assert.equal(proposedQuery.environment(observer).biome,site.biome);
      const pool=eligibleHabitatPool({biome:site.biome,feet,
        light:site.biome==='cave'?.29:.8});
      assert.ok(pool.length>0,'Source-approved species list is empty');
      let originalEligible=0,compatibleEligible=0;
      let originalClear=0,proposedClear=0;
      for(let serial=1;serial<=24;serial++){
        const candidate=planHabitatCandidate(pool,{seed,cx,cz,section,serial});
        assert.ok(pool.includes(candidate.species));
        const high=feet+1,low=feet-1.5;
        const first=supportedPosition(oldQuery,candidate.x,candidate.z,
          high,low,candidate.species.body);
        const second=supportedPosition(proposedQuery,candidate.x,candidate.z,
          high,low,candidate.species.body);
        if(first)originalClear++;
        if(second)proposedClear++;
        const beforeEligible=Boolean(first&&
          sectionForY(Math.floor(first[1]))===section&&
          spawnEligible(oldQuery,candidate.species,first,observer));
        const afterEligible=Boolean(second&&
          sectionForY(Math.floor(second[1]))===section&&
          spawnEligible(proposedQuery,candidate.species,second,observer));
        if(beforeEligible){
          assert.ok(afterEligible,
            'Only source-known formerly-unknown M7 geometry is reclassified; '+
            'a previously valid source position may not become invalid');
          originalEligible++;
        }
        if(afterEligible)compatibleEligible++;
      }
      assert.ok(originalEligible<=24&&compatibleEligible<=24);
      assert.ok(compatibleEligible>=originalEligible);
      if(site.siteType==='cave')
        assert.equal(compatibleEligible,originalEligible,
          'An M7 surface-ground reader must not mutate deep authored cave physics');
      const item={seed,biome:site.biome,siteType:site.siteType,
        x:site.x,z:site.z,section,feet,poolSize:pool.length,
        proposals:24,originalFoundGround:originalClear,
        compatibleFoundGround:proposedClear,
        originalEligible,compatibleEligible};
      outcomes.push(item);
      console.log('MYTHWROUGHT_MOB_M7_COLLISION_COMPARISON '+JSON.stringify(item));
    }
    assert.equal(JSON.stringify(base.save()),before,
      'Reading real source voxels must preserve Schema-1 saved bytes');
  }
  assert.equal(outcomes.length,21);
  const summary={
    seeds:3,sitesPerSeed:7,measurements:outcomes.length,
    proposals:outcomes.length*24,
    originalEligible:outcomes.reduce((a,r)=>a+r.originalEligible,0),
    compatibleEligible:outcomes.reduce((a,r)=>a+r.compatibleEligible,0),
    unchangedSourceSaves:true,
    noMobsInjected:true
  };
  assert.ok(summary.compatibleEligible>=summary.originalEligible);
  console.log('MYTHWROUGHT_MOB_M7_COLLISION_COMPARISON_SUMMARY '+JSON.stringify(summary));
});
