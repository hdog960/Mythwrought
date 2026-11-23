// Native full-repository acceptance: 3 true source M7 seeds x 7 sites.
// Authored but MUST be run under real Node ESM against complete repository.
// This does NOT modify original terrain, save data, PWA or protected refs.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../src/manual-biomes/profile-world.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {deepCaveRoute} from '../src/deep-cave-network.mjs';
import {findSafeSpawn} from '../src/physics.mjs';
import {BLOCK,chunkCoord} from '../src/voxel.mjs';
import {sectionForY} from '../src/depth.mjs';
import {createLiveMobSession} from '../src/mobs/live-game.mjs';
import {PopulationManager} from '../src/mobs/ecology.mjs';
import {speciesRegistry} from '../src/mobs/species.mjs';

const SEEDS=Object.freeze([179,379,1001]);
const SURFACES=Object.freeze([
  {biome:'meadow',source:'plains',x:0,z:0},
  {biome:'desert',source:'desert',x:512,z:0},
  {biome:'snow',source:'snow',x:0,z:512},
  {biome:'alpine',source:'mountain',x:-512,z:0},
  {biome:'forest',source:'enchanted',x:0,z:-512}
]);
const ROSTER=Object.freeze(speciesRegistry.map(s=>s.id));
const sourceBiome=(x,z,seed)=>v6BiomeAt(x,z,seed)?.name??null;
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
        world,seed,storage:emptySidecar(),resident,
        worldKind:site.kind==='cave'?'cave':'normal',
        biomeAt:point=>sourceBiome(point[0],point[2],seed),
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
        const report={seed,site:site.kind,biome:site.biome,
          cx,cz,section,feet,attempts,births,remaining:engine.counts().total};
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
  const summary={seeds:3,sites:21,
    naturalBirths:reports.reduce((n,r)=>n+r.births,0),
    attempts:reports.reduce((n,r)=>n+r.attempts,0),
    actualM7:true,originalMobEngine:true,sourceSavesUnchanged:true};
  console.log('MYTHWROUGHT_MOB_M7_REAL_BIRTH_SUMMARY '+JSON.stringify(summary));
});
