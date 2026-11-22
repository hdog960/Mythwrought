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
import {eligibleHabitatPool,planHabitatCandidate,
  planRegionalHabitatCandidate,deterministicHabitatRoll}
  from '../src/mobs/ecosystem-habitat.mjs';
import {proposeTerrainAwarePosition}
  from '../src/mobs/ecosystem-terrain-placement.mjs';
import {MAX_PROPOSALS_PER_TICK}
  from '../src/mobs/ecosystem-region-proposals.mjs';
import {MobEngine} from '../src/mobs/engine.mjs';
import {prepareOriginalMobPoll,settleOriginalMobPoll}
  from '../src/mobs/ecosystem-region-poll.mjs';
import {createGlobalEcologyClock,advanceGlobalEcologyClock,
  commitGlobalEcologyRegion} from '../src/mobs/ecosystem-global-clock.mjs';
import {deriveRegionalMobState}
  from '../src/mobs/ecosystem-region-snapshot.mjs';

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
      // One read-only regional POLL on the same real loaded source site.
      // Empty counts and explicit capacity are hypothetical inputs, not
      // natural births, current-game population or spawn integration.
      const sourceRegion={cx,cz,section,feet};
      const sourceEngine=new MobEngine(proposedQuery,seed,{
        maxEntities:32,maxActive:8
      });
      const sourceRoster=deriveRegionalMobState(sourceEngine.all(),sourceRegion);
      assert.equal(sourceRoster.regionName,[cx,cz,section].join(','));
      assert.equal(sourceRoster.localCounts.size,40,
        'Source bridge must cover all 40 original creature species');
      assert.equal(sourceRoster.rosterAvailable,true);
      assert.equal(sourceRoster.occupiedPositions.length,0);
      // Empty roster is an EXPLICIT hypothetical source game state,
      // never a claim about existing natural mob populations.
      const sourceTick=advanceGlobalEcologyClock(createGlobalEcologyClock(),{
        seconds:.5,regions:[sourceRegion]
      });
      assert.equal(sourceTick.reason,'selected');
      assert.equal(sourceTick.selection.key,[cx,cz,section].join(','));
      assert.equal(sourceTick.selection.time,.5);
      const regional=prepareOriginalMobPoll({
        engine:sourceEngine,world:proposedQuery,seed,
        region:sourceTick.selection.region,observer,
        biome:site.biome,light:site.biome==='cave'?.29:.8,
        kind:site.siteType,now:sourceTick.selection.time,
        record:sourceTick.selection.record,spawnOnFirstVisit:true
      });
      assert.equal(regional.kind,'evaluated',
        'Source-first original scheduling allows the same bounded read-only poll');
      assert.equal(regional.record.next,.5);
      const noBirth=settleOriginalMobPoll(regional,{world:proposedQuery});
      assert.equal(noBirth.serial,regional.attempts,
        'Source serial only advances when the real poll is settled');
      assert.equal(noBirth.next,.5,
        'A source-generated position is NOT a confirmed natural birth');
      const committedClock=commitGlobalEcologyRegion(
        sourceTick.clock,sourceTick.selection,noBirth
      );
      assert.equal(committedClock.entries.length,1,
        'Exactly one original-region record per source M7 site');
      assert.equal(committedClock.entries[0][0],[cx,cz,section].join(','));
      assert.equal(committedClock.cursor,1,
        'Original global cursor advances exactly once');
      assert.equal(sourceEngine.counts().total,0,
        'Never inject a mob into the original M7 world');
      sourceEngine.dispose();
      assert.ok(regional.attempts>=0&&regional.attempts<=MAX_PROPOSALS_PER_TICK);
      assert.equal(regional.nextSerial,regional.attempts);
      assert.equal(Object.isFrozen(regional),true);
      if(regional.proposal){
        const {species,point,sourceSerial}=regional.proposal;
        const sameDraw=planRegionalHabitatCandidate(pool,{
          seed,cx,cz,section,serial:sourceSerial
        });
        assert.equal(sameDraw.species,species,
          'Regional proposal must use uniform source-habitat species draw');
        assert.equal(sameDraw.x,point[0]);
        assert.equal(sameDraw.z,point[2]);
        assert.ok(deterministicHabitatRoll(
          seed^0x3c91c7f5,cx,cz,section,sourceSerial
        )<=species.population.rarity,
          'Never bypass original independent rarity acceptance');
        assert.equal(proposedQuery.residentAt(point),true,
          'Original loaded voxel residency must permit any candidate');
        assert.equal(proposedQuery.grounded(point,species.body),true,
          'No manufactured floating spawn positions');
        assert.equal(sectionForY(Math.floor(point[1])),section,
          'No change of original vertical section');
        assert.equal(spawnEligible(proposedQuery,species,point,observer),true,
          'Original habitat, light, depth and player distance contract');
        if(site.siteType==='cave'){
          assert.equal(spawnEligible(oldQuery,species,point,observer),true,
            'Isolated cave proposals must remain original-physics eligible');
          assert.equal(regional.proposal.offset,0,
            'No cave vertical probing beyond original window');
        }
      }
      let originalEligible=0,compatibleEligible=0,terrainAwareEligible=0;
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
        // The new isolated search may only extend the SAME source-backed
        // compatible reader. It cannot skip original physics or eligibility.
        const terrain=proposeTerrainAwarePosition(proposedQuery,{
          species:candidate.species,x:candidate.x,z:candidate.z,
          feet,section,observer,kind:site.siteType
        });
        if(terrain){
          assert.equal(sectionForY(Math.floor(terrain.point[1])),section,
            'Surface search must not cross a vertical residency section');
          assert.equal(proposedQuery.grounded(terrain.point,candidate.species.body),true,
            'Terrain-aware improvements must not manufacture ground');
          assert.equal(spawnEligible(proposedQuery,candidate.species,terrain.point,observer),true,
            'Every proposed placement must pass original habitat/distance rules');
          terrainAwareEligible++;
        }
        if(afterEligible){
          assert.ok(terrain,'A valid original compatible position must never disappear');
          assert.equal(terrain.offset,0,'Preserve exact original supported window first');
          assert.deepEqual(terrain.point,second,
            'Previously eligible coordinates must remain byte-equivalent');
        }
        if(beforeEligible){
          assert.ok(afterEligible,
            'Only source-known formerly-unknown M7 geometry is reclassified; '+
            'a previously valid source position may not become invalid');
          originalEligible++;
        }
        if(afterEligible)compatibleEligible++;
      }
      assert.ok(originalEligible<=24&&compatibleEligible<=24&&terrainAwareEligible<=24);
      assert.ok(compatibleEligible>=originalEligible);
      assert.ok(terrainAwareEligible>=compatibleEligible,
        'Terrain-aware surface extension must not erase an original valid placement');
      if(site.siteType==='cave'){
        assert.equal(compatibleEligible,originalEligible,
          'M7 physical-ground reader must not mutate deep authored cave physics');
        assert.equal(terrainAwareEligible,originalEligible,
          'Cave physics must retain the exact ORIGINAL single-height window');
      }
      const item={seed,biome:site.biome,siteType:site.siteType,
        x:site.x,z:site.z,section,feet,poolSize:pool.length,
        proposals:24,originalFoundGround:originalClear,
        compatibleFoundGround:proposedClear,
        originalEligible,compatibleEligible,terrainAwareEligible,
        regionalAttempts:regional.attempts,
        regionalCandidate:Boolean(regional.proposal),
        regionalRejected:regional.rejected};
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
    terrainAwareEligible:outcomes.reduce((a,r)=>a+r.terrainAwareEligible,0),
    boundedRegionalCandidates:outcomes.filter(r=>r.regionalCandidate).length,
    boundedRegionalAttempts:outcomes.reduce((a,r)=>a+r.regionalAttempts,0),
    assumedEmptyLocalCounts:true,
    unchangedSourceSaves:true,
    noMobsInjected:true
  };
  assert.ok(summary.compatibleEligible>=summary.originalEligible);
  assert.ok(summary.terrainAwareEligible>=summary.compatibleEligible);
  assert.ok(summary.boundedRegionalCandidates<=summary.measurements);
  assert.ok(summary.boundedRegionalAttempts<=summary.measurements*MAX_PROPOSALS_PER_TICK);
  console.log('MYTHWROUGHT_MOB_M7_COLLISION_COMPARISON_SUMMARY '+JSON.stringify(summary));
});
