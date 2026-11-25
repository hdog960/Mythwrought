// Native observation of authentic M7 five-biome terrain and historical caves.
// No synthetic mob injection, world edits, browser substitution or PWA changes.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {findSafeSpawn} from '../src/physics.mjs';
import {BLOCK,chunkCoord} from '../src/voxel.mjs';
import {sectionForY} from '../src/depth.mjs';
import {deepCaveRoute} from '../src/deep-cave-network.mjs';
import {createMobHostView} from '../src/mobs/host-view.mjs';
import {classifyLiveBiome} from '../src/mobs/live-game.mjs';
import {MobEngine} from '../src/mobs/engine.mjs';
import {PopulationManager,spawnEligible} from '../src/mobs/ecology.mjs';
import {supportedPosition} from '../src/mobs/movement.mjs';
import {speciesRegistry} from '../src/mobs/species.mjs';
import {probeOriginalSpawnRegion,REJECTION_KINDS}
  from '../src/mobs/ecosystem-diagnostics.mjs';
import {eligibleHabitatPool,planHabitatCandidate}
  from '../src/mobs/ecosystem-habitat.mjs';

const SEED=179;
const SURFACE=Object.freeze([
  {biome:'meadow',x:0,z:0,source:'plains'},
  {biome:'desert',x:512,z:0,source:'desert'},
  {biome:'snow',x:0,z:512,source:'snow'},
  {biome:'alpine',x:-512,z:0,source:'mountain'},
  {biome:'forest',x:0,z:-512,source:'enchanted'}
]);
const ROSTER=speciesRegistry.map(creature=>creature.id);
function sourceBiome(x,z,seed){
  return v6BiomeAt(x,z,seed)?.name??'plains';
}

test('actual M7 cardinal sites and historical cave route provide seven source identities',()=>{
  assert.deepEqual(SURFACE.map(({x,z})=>sourceBiome(x,z,SEED)),
    SURFACE.map(s=>s.source),'Do not fabricate V7 biome identities');
  for(const floor of [-30,-80])
    assert.ok(deepCaveRoute().some(p=>p.floor===floor),
      'Missing original deep-cave route at floor '+floor);
});

test('seven genuine M7 biome and cave regions expose original and habitat-first spawn evidence',()=>{
  const started=Date.now();
  const base=new FourRegionWorld(SEED,fourRegionProfile(SEED,M7_ENVIRONMENT_GENERATOR));
  const world=new Pack2LiveWorld(base);
  const originalSave=JSON.stringify(base.save());
  let focus=null;
  const resident=(cx,cz,section)=>focus!==null&&section===focus.section&&
    Math.abs(cx-focus.cx)<=(section===0?2:1)&&
    Math.abs(cz-focus.cz)<=(section===0?2:1);
  const query=createMobHostView(world,{
    resident,
    biomeAt:point=>({
      id:point[1]<-3.5?'cave':
        classifyLiveBiome(sourceBiome(point[0],point[2],SEED),point[1],false),
      hazard:false,climbable:point[1]<-3.5
    }),
    caveAt:point=>({
      ready:resident(chunkCoord(point[0]),chunkCoord(point[2]),
        sectionForY(Math.floor(point[1]))),
      climbable:point[1]<-3.5
    }),
    skyAt:point=>({light:point[1]<-3.5?.29:.8,
      dayPhase:point[1]<-3.5?'night':'day'})
  });
  const caveRoute=deepCaveRoute();
  const sites=[
    ...SURFACE.map(s=>({...s,kind:'original-M7-surface'})),
    ...[-30,-80].map(floor=>{
      const p=caveRoute.find(v=>v.floor===floor);
      return {kind:'original-deep-cave',biome:'cave',
        x:p.x,z:p.z,feet:p.feet,source:'cave',floor};
    })
  ];
  const results=[];
  for(const site of sites){
    const player=site.kind==='original-M7-surface'?
      findSafeSpawn(world,site.x,site.z):{x:site.x+.5,z:site.z+.5,feet:site.feet};
    const feet=player.feet;
    const section=sectionForY(Math.floor(feet));
    assert.notEqual(section,null,'Outside genuine world section at '+site.biome);
    focus={cx:chunkCoord(player.x),cz:chunkCoord(player.z),section};
    const observer=[player.x,feet,player.z];
    assert.equal(query.residentAt(observer),true,'Expected real resident chunks');
    assert.equal(query.environment(observer).biome,site.biome,
      'Real biome adapter mismatch at '+site.biome);
    if(site.kind==='original-deep-cave'){
      assert.equal(world.get(site.x,site.feet,site.z),BLOCK.AIR,
        'Original authored cave air is absent at '+site.floor);
      assert.notEqual(world.get(site.x,site.floor,site.z),BLOCK.AIR,
        'Original authored cave floor is unsupported at '+site.floor);
    }
    const light=site.biome==='cave'?.29:.8;
    const pool=eligibleHabitatPool({biome:site.biome,feet,light});
    assert.ok(pool.length>0,'Original habitat pool empty at '+site.biome);
    const reasons=Object.fromEntries(REJECTION_KINDS.map(reason=>[reason,0]));
    let originalEligible=0,proposedEligible=0;
    for(let window=0;window<3;window++){
      const replay=probeOriginalSpawnRegion(query,speciesRegistry,{
        seed:SEED,cx:focus.cx,cz:focus.cz,section,feet,
        observer,serial:window*6
      });
      assert.equal(replay.attempts,6);
      originalEligible+=replay.eligible;
      for(const name of REJECTION_KINDS)reasons[name]+=replay.reasons[name];
    }
    for(let serial=1;serial<=18;serial++){
      const candidate=planHabitatCandidate(pool,{
        seed:SEED,cx:focus.cx,cz:focus.cz,section,serial
      });
      assert.ok(candidate&&pool.includes(candidate.species));
      const point=supportedPosition(query,candidate.x,candidate.z,
        feet+1,feet-1.5,candidate.species.body);
      if(point&&sectionForY(Math.floor(point[1]))===section&&
        spawnEligible(query,candidate.species,point,observer))proposedEligible++;
    }
    const engine=new MobEngine(query,SEED,{maxEntities:32,maxActive:8});
    const ecology=new PopulationManager(engine,query,{
      seed:SEED,species:ROSTER,spawnOnFirstVisit:true
    });
    let attempted=0,births=0;
    for(let tick=0;tick<40;tick++){
      const outcome=ecology.advance(.5,observer,[{...focus,feet}]);
      attempted+=outcome.evaluated;
      if(outcome.spawned)births++;
    }
    const mobs=engine.all();
    assert.ok(attempted>0,'No natural spawn candidates evaluated');
    assert.ok(births<=attempted);
    assert.ok(mobs.length<=32,'Original mob population cap exceeded');
    for(const mob of mobs){
      assert.equal(query.volume(mob.position,mob.species.body),'clear',
        'Natural birth intersects the real M7 world: '+mob.species.id);
      assert.ok(mob.position.every(Number.isFinite));
    }
    const report={
      seed:SEED,kind:site.kind,biome:site.biome,source:site.source,
      cx:focus.cx,cz:focus.cz,section,feet,poolSize:pool.length,
      originalProposals:18,originalEligible,
      habitatFirstProposals:18,habitatFirstPhysicallyEligible:proposedEligible,
      nativeAttempts:attempted,nativeBirths:births,nativeRemaining:mobs.length,
      rejected:reasons
    };
    console.log('MYTHWROUGHT_MOB_M7_SOURCE_CENSUS '+JSON.stringify(report));
    results.push(report);
    engine.dispose();
  }
  assert.deepEqual(results.map(r=>r.biome),
    ['meadow','desert','snow','alpine','forest','cave','cave']);
  assert.equal(results.length,7);
  assert.equal(JSON.stringify(base.save()),originalSave,
    'An observational natural-spawn test must not write player saves');
  console.log('MYTHWROUGHT_MOB_M7_SOURCE_CENSUS_SUMMARY '+JSON.stringify({
    seed:SEED,siteCount:results.length,
    totalOriginalProposals:results.reduce((n,r)=>n+r.originalProposals,0),
    totalHabitatFirstProposals:results.reduce((n,r)=>n+r.habitatFirstProposals,0),
    totalNativeAttempts:results.reduce((n,r)=>n+r.nativeAttempts,0),
    totalNativeBirths:results.reduce((n,r)=>n+r.nativeBirths,0),
    originalEligible:results.reduce((n,r)=>n+r.originalEligible,0),
    proposedEligible:results.reduce((n,r)=>n+r.habitatFirstPhysicallyEligible,0),
    elapsedMs:Date.now()-started
  }));
});
