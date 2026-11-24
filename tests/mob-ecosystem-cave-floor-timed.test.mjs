// Actual generated-world regression for the new bounded underground selector.
// Reuses the historical zero-birth sites, same seeds, sections, 40 polls,
// original physics and rarity. No injected creatures or source changes.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR,ENCHANTED_P2_GENERATOR}
  from '../src/manual-biomes/profile-world.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {deepCaveRoute} from '../src/deep-cave-network.mjs';
import {BLOCK,chunkCoord} from '../src/voxel.mjs';
import {sectionForY} from '../src/depth.mjs';
import {createLiveMobSession} from '../src/mobs/live-game.mjs';
import {PopulationManager} from '../src/mobs/ecology.mjs';
import {speciesRegistry} from '../src/mobs/species.mjs';

for(const generator of [M7_ENVIRONMENT_GENERATOR,ENCHANTED_P2_GENERATOR]){
  test('actual improved deep-cave natural births '+generator,()=>{
    const rows=[];
    for(const seed of [379,1001]){
      const base=new FourRegionWorld(seed,fourRegionProfile(seed,generator)),world=new Pack2LiveWorld(base);
      const before=JSON.stringify(base.save()),beforePack=JSON.stringify(world.pack2Snapshot());
      const step=deepCaveRoute().find(s=>s.floor===-80);
      assert.ok(step);
      const observer=[step.x+.5,step.feet,step.z+.5],cx=chunkCoord(observer[0]),
        cz=chunkCoord(observer[2]),section=sectionForY(step.feet);
      assert.deepEqual([cx,cz,section,step.feet],[4,5,-5,-79]);
      assert.equal(world.get(step.x,step.feet,step.z),BLOCK.AIR);
      assert.notEqual(world.get(step.x,step.floor,step.z),BLOCK.AIR);
      const live=createLiveMobSession({world,seed,storage:{getItem:()=>null,setItem(){throw Error('No writes');}},
        resident:(x,z,s)=>s===section&&Math.abs(x-cx)<=1&&Math.abs(z-cz)<=1,
        biomeAt:()=> 'cave',caveAt:()=>({underground:true}),
        skyAt:()=>({light:.29,dayPhase:'night'}),playerAt:()=>observer,allowWrites:()=>false});
      try{
        const engine=live.engine,manager=new PopulationManager(engine,live.query,{
          seed,species:speciesRegistry.map(s=>s.id),spawnOnFirstVisit:true});
        let births=0,attempts=0; const samples=[];
        for(let tick=0;tick<40;tick++){
          const start=performance.now();
          const result=manager.advance(.5,observer,[{cx,cz,section,feet:step.feet}]);
          samples.push(performance.now()-start);
          assert.ok(result.evaluated>=0&&result.evaluated<=6);
          attempts+=result.evaluated;
          if(result.spawned){
            births++;
            const mob=engine.get(result.spawned);
            assert.ok(mob);
            assert.equal(mob.homeChunk,[cx,cz,section].join(','));
            assert.equal(sectionForY(Math.floor(mob.position[1])),section);
            assert.equal(live.query.residentAt(mob.position),true);
            assert.equal(live.query.volume(mob.position,mob.species.body),'clear');
            const range=Math.hypot(...mob.position.map((p,i)=>p-observer[i]));
            assert.ok(range>=5&&range<=26);
            assert.equal(mob.important,false);
            assert.equal(mob.juvenile,false);
          }
        }
        assert.ok(attempts>0&&attempts<=240);
        samples.sort((a,b)=>a-b);
        rows.push({generator,seed,attempts,births,actualPhysicalWorld:true,polls:samples.length,p50Ms:samples[19],p95Ms:samples[37],maxMs:samples.at(-1),timingScope:'native PopulationManager.advance, not device frames'});
      }finally{live.dispose();}
      assert.equal(JSON.stringify(base.save()),before);
      assert.equal(JSON.stringify(world.pack2Snapshot()),beforePack);
    }
    console.log('MYTHWROUGHT_DEEP_MOB_COLUMN_BIRTHS '+JSON.stringify(rows));
    assert.ok(rows.some(r=>r.births>0),'No improvement over original zero-birth sites in this profile');
  });
}
