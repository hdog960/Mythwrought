// Real source geometry replay of the exact previously observed empty-region
// 240 attempts. No modified rarity, injected mobs, wider search or edits.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR,ENCHANTED_P2_GENERATOR}
  from '../src/manual-biomes/profile-world.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {deepCaveRoute} from '../src/deep-cave-network.mjs';
import {BLOCK,chunkCoord} from '../src/voxel.mjs';
import {sectionForY} from '../src/depth.mjs';
import {createLiveMobSession} from '../src/mobs/live-game.mjs';
import {speciesRegistry} from '../src/mobs/species.mjs';
import {probeOriginalSpawnRegion,REJECTION_KINDS} from '../src/mobs/ecosystem-diagnostics.mjs';

for(const generator of [M7_ENVIRONMENT_GENERATOR,ENCHANTED_P2_GENERATOR]){
  for(const seed of [379,1001])test('current source deep-cave rejection census '+generator+' '+seed,()=>{
    const base=new FourRegionWorld(seed,fourRegionProfile(seed,generator)),world=new Pack2LiveWorld(base);
    const before=JSON.stringify(base.save()),beforePack=JSON.stringify(world.pack2Snapshot());
    const step=deepCaveRoute().find(s=>s.floor===-80);
    assert.ok(step);const observer=[step.x+.5,step.feet,step.z+.5];
    const cx=chunkCoord(observer[0]),cz=chunkCoord(observer[2]),section=sectionForY(step.feet);
    assert.deepEqual([cx,cz,section,step.feet],[4,5,-5,-79]);
    assert.equal(world.get(step.x,step.feet,step.z),BLOCK.AIR);
    assert.notEqual(world.get(step.x,step.floor,step.z),BLOCK.AIR);
    const live=createLiveMobSession({world,seed,storage:{getItem:()=>null,setItem(){throw Error('No writes');}},
      resident:(x,z,s)=>s===section&&Math.abs(x-cx)<=1&&Math.abs(z-cz)<=1,
      biomeAt:()=> 'cave',caveAt:()=>({underground:true}),
      skyAt:()=>({light:.29,dayPhase:'night'}),playerAt:()=>observer,allowWrites:()=>false});
    try{
      assert.equal(live.query.environment(observer).biome,'cave');
      const reasons=Object.fromEntries(REJECTION_KINDS.map(k=>[k,0]));
      const choices=[];
      for(let serial=0;serial<240;serial+=6){
        const result=probeOriginalSpawnRegion(live.query,speciesRegistry,
          {seed,cx,cz,section,feet:step.feet,observer,serial});
        assert.equal(result.attempts,6);
        for(const k of REJECTION_KINDS)reasons[k]+=result.reasons[k];
        choices.push(...result.choices);
      }
      assert.equal(choices.length,240);
      assert.equal(Object.values(reasons).reduce((n,x)=>n+x,0),240);
      assert.equal(live.engine.counts().total,0);
      console.log('MYTHWROUGHT_DEEP_MOB_REJECTION_CENSUS '+JSON.stringify({
        generator,seed,cx,cz,section,feet:step.feet,attempts:240,reasons,
        uniqueColumns:new Set(choices.map(x=>x.x+','+x.z)).size,
        actualPhysicalWorld:true,emptyRosterReplay:true}));
    }finally{live.dispose();}
    assert.equal(JSON.stringify(base.save()),before);
    assert.equal(JSON.stringify(world.pack2Snapshot()),beforePack);
  });
}
