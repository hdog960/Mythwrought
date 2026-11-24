// Native full-repository acceptance: 3 true source M7 seeds x 7 sites.
// Authored but MUST be run under real Node ESM against complete repository.
// This does NOT modify original terrain, save data, PWA or protected refs.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../src/manual-biomes/profile-world.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {M7_MOB_SEEDS as SEEDS,M7_MOB_SURFACES as SURFACES,
  m7MobSourceBiome as sourceBiome} from './helpers/m7-mob-source-sites.mjs';
import {deepCaveRoute} from '../src/deep-cave-network.mjs';
import {findSafeSpawn} from '../src/physics.mjs';
import {BLOCK,chunkCoord} from '../src/voxel.mjs';
import {sectionForY} from '../src/depth.mjs';
import {createLiveMobSession} from '../src/mobs/live-game.mjs';
import {PopulationManager} from '../src/mobs/ecology.mjs';
import {speciesRegistry} from '../src/mobs/species.mjs';

const ROSTER=Object.freeze(speciesRegistry.map(s=>s.id));
function sourceSites(seed){
  const route=deepCaveRoute();
  return [
    ...SURFACES.map(s=>({...s,kind:'surface'})),
    ...[-30,-80].map(floor=>{
      const step=route.find(p=>p.floor===floor);
      assert.ok(step,'Original deep-cave route missing for floor '+floor);
      return {kind:'cave',biome:'cave',x:step.x,z:step.z,
        source:'cave',feet:step.feet,floor};
    })
  ];
}
function emptySidecar(){
  return Object.freeze({
    getItem(){return null;},
    setItem(){throw Error('Read-only M7 acceptance must never persist mobs');}
  });
}

test('authentic M7 three-seed 21-site live mob collision and natural birth acceptance',()=>{
  assert.equal(ROSTER.length,40);
  assert.equal(new Set(ROSTER).size,40);
  const reports=[];
  for(const seed of SEEDS){
    const base=new FourRegionWorld(
      seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
    const world=new Pack2LiveWorld(base);
    const before=JSON.stringify(base.save());
    const beforePack2=JSON.stringify(world.pack2Snapshot());
    // Original VoxelWorld/Pack2LiveWorld has no monotonic editRevision.
    // Do NOT fabricate a constant-0 source revision witness for this test:
    // verify original source saves at the bounded seed boundary instead.
    const sites=sourceSites(seed);
    assert.equal(sites.length,7);
    for(const site of sites){
      if(site.kind==='surface')
        assert.equal(sourceBiome(site.x,site.z,seed),site.source,
          'Never substitute a different M7 biome for the source');
      const player=site.kind==='surface'?
        findSafeSpawn(world,site.x,site.z):
        {x:site.x+.5,z:site.z+.5,feet:site.feet};
      const feet=player.feet;
      const section=sectionForY(Math.floor(feet));
      assert.notEqual(section,null,'Original M7 world section missing');
      const cx=chunkCoord(player.x),cz=chunkCoord(player.z);
      const focus={cx,cz,section,feet};
      const observer=[player.x,feet,player.z];
      const resident=(x,z,s)=>s===section&&Math.abs(x-cx)<=(section===0?2:1)&&
        Math.abs(z-cz)<=(section===0?2:1);
      const live=createLiveMobSession({
        world,seed,storage:emptySidecar(),resident,allowWrites:()=>false,
        // These are deep sites of the SAME M7 profile, not a separate Cave World save.
        worldKind:'normal',
        biomeAt:point=>point[1]<-3.5?'cave':sourceBiome(point[0],point[2],seed),
        skyAt:point=>({light:point[1]<-3.5?.29:.8,
          dayPhase:point[1]<-3.5?'night':'day'}),
        caveAt:point=>({underground:point[1]<-3.5}),
        playerAt:()=>observer
      });
      try{
        assert.equal(live.query.residentAt(observer),true);
        const environment=live.query.environment(observer);
        assert.equal(environment.biome,site.biome,
          'Original source M7 location must be correctly classified');
        assert.equal(environment.hazard,false);
        if(site.kind==='cave'){
          assert.equal(world.get(site.x,site.feet,site.z),BLOCK.AIR,
            'Original source cave must contain physical AIR');
          assert.notEqual(world.get(site.x,site.floor,site.z),BLOCK.AIR,
            'Original source cave floor must be physically supported');
        }
        const engine=live.engine;
        const manager=new PopulationManager(engine,live.query,{
          seed,species:[...ROSTER],spawnOnFirstVisit:true
        });
        let attempts=0,births=0;
        for(let tick=0;tick<40;tick++){
          const outcome=manager.advance(.5,observer,[focus]);
          assert.ok(outcome.evaluated>=0&&outcome.evaluated<=6);
          attempts+=outcome.evaluated;
          if(outcome.spawned){
            births++;
            const mob=engine.get(outcome.spawned);
            assert.ok(mob,'Natural ID must exist in original MobEngine');
            assert.equal(mob.homeChunk,[cx,cz,section].join(','));
            assert.equal(sectionForY(Math.floor(mob.position[1])),section);
            assert.equal(live.query.residentAt(mob.position),true);
            assert.equal(live.query.volume(mob.position,mob.species.body),'clear',
              'M7 newborn must fit real source geometry');
            assert.equal(mob.important,false);
            assert.equal(mob.juvenile,false);
          }
        }
        assert.ok(attempts>0,'Original M7 source region was never evaluated');
        assert.ok(births<=attempts);
        assert.ok(engine.counts().total<=32);
        const remaining=engine.counts().total;
        // Exercise the same manager's real private away ledger on a surviving
        // natural newborn, never an injected mob or a fabricated terrain row.
        // A near tick clears any old history, then 12 far ticks are only
        // 5.5 seconds of away time; the thirteenth reaches the 6s threshold.
        let lifecycleVerified=false;
        const survivor=engine.all().find(m=>!m.important&&m.state!=='downed');
        if(survivor){
          const near=[...survivor.position];
          const far=[near[0]+100,near[1],near[2]];
          assert.equal(manager.advance(.5,near,[]).spawned,null);
          assert.ok(engine.get(survivor.id),'Near natural newborn must survive reset');
          for(let tick=0;tick<12;tick++){
            const result=manager.advance(.5,far,[]);
            assert.equal(result.evaluated,0);
            assert.equal(result.spawned,null);
            assert.ok(engine.get(survivor.id),'Natural newborn removed before six-second grace');
            assert.equal(engine.get(survivor.id).state,'dormant');
          }
          manager.advance(.5,far,[]);
          assert.equal(engine.get(survivor.id),undefined,
            'Natural newborn must despawn at the original six-second threshold');
          lifecycleVerified=true;
        }
        const report={seed,site:site.kind,biome:site.biome,
          cx,cz,section,feet,attempts,births,remaining,lifecycleVerified};
        reports.push(report);
        console.log('MYTHWROUGHT_MOB_M7_REAL_BIRTH '+JSON.stringify(report));
      }finally{live.dispose();}
    }
    assert.equal(JSON.stringify(base.save()),before,
      'No M7 world/schema-1 save mutations in native mob observations');
    assert.equal(JSON.stringify(world.pack2Snapshot()),beforePack2,
      'No original Pack2 overlay mutations across the 7 source sites');
  }
  assert.equal(reports.length,21);
  assert.deepEqual([...new Set(reports.map(r=>r.seed))],SEEDS);
  assert.equal(reports.filter(r=>r.site==='cave').length,6);
  const surfaceBirths=reports.filter(r=>r.site==='surface').reduce((n,r)=>n+r.births,0);
  const caveBirths=reports.filter(r=>r.site==='cave').reduce((n,r)=>n+r.births,0);
  const lifecycleSites=reports.filter(r=>r.lifecycleVerified).length;
  const summary={seeds:3,sites:21,surfaceBirths,caveBirths,lifecycleSites,
    naturalBirths:surfaceBirths+caveBirths,
    attempts:reports.reduce((n,r)=>n+r.attempts,0),
    actualM7:true,originalMobEngine:true,sourceSavesUnchanged:true};
  console.log('MYTHWROUGHT_MOB_M7_REAL_BIRTH_SUMMARY '+JSON.stringify(summary));
  // Finite non-vacuity gates: a census of zero births cannot establish natural
  // spawning. Do not require an invented minimum per biome or force births.
  assert.ok(surfaceBirths>0,'No natural surface births in the bounded 15-site census');
  assert.ok(caveBirths>0,'No natural cave births in the bounded six-site census');
  assert.ok(lifecycleSites>0,'No actual natural newborn completed lifecycle acceptance');
});
