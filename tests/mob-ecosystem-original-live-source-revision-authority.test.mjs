// The original VoxelWorld and Pack2LiveWorld do not expose editRevision.
// This genuine-import Node contract keeps the default legacy session unchanged
// while proving that a trusted external sourceRevision callback is honored.
// Synthetic physical M7 cells are NOT generated original M7/21-site acceptance.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createLiveMobSession} from '../src/mobs/live-game.mjs';
import {getSpecies} from '../src/mobs/species.mjs';
import {spawnEligible,PopulationManager} from '../src/mobs/ecology.mjs';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {M7_ENVIRONMENT_GENERATOR} from '../src/environment-ground.mjs';

function setup({generator=M7_ENVIRONMENT_GENERATOR, sourceRevision,
  stage='stable',hasEditRevision=false}={}){
  const state={revision:0,getReads:0,writes:0};
  const world={
    base:{generationProfile:{generator}},
    get(x,y,z){
      state.getReads++;
      if(stage==='support-edit'&&y===3)state.revision++;
      return y<4?(generator===M7_ENVIRONMENT_GENERATOR?400:BLOCK.STONE):BLOCK.AIR;
    },
    set(){state.writes++;throw Error('Source world must not be modified');}
  };
  if(hasEditRevision)Object.defineProperty(world,'editRevision',
    {get(){return state.revision;}});
  const storage={getItem(){return null;},setItem(){throw Error('No mob sidecar writes')}};
  const options={
    world,storage,seed:179,resident:()=>true,
    biomeAt(){if(stage==='biome-edit')state.revision++;return 'plains';},
    caveAt(){if(stage==='cave-edit')state.revision++;return {underground:false};},
    skyAt(){if(stage==='sky-edit')state.revision++;return {light:.8,dayPhase:'day'};},
    playerAt:()=>[8,4,8],spawnOnFirstVisit:true
  };
  if(sourceRevision!==undefined)options.sourceRevision=
    sourceRevision===true?()=>state.revision:sourceRevision;
  const live=createLiveMobSession(options);
  return {state,world,live,point:[8.5,4,8.5],
    close(){live.dispose();}
  };
}

test('actual source VoxelWorld and Pack2LiveWorld lack monotonic editRevision',()=>{
  const original=new VoxelWorld(179),wrapped=new Pack2LiveWorld(original);
  assert.equal(original.editRevision,undefined);
  assert.equal(wrapped.editRevision,undefined);
});
test('default unmodified live-session fallback is zero, not a source-edit witness',()=>{
  const s=setup({stage:'sky-edit'});
  try{
    assert.equal(s.live.query.revision(),0);
    const env=s.live.query.environment(s.point);
    assert.equal(env.biome,'meadow');
    assert.equal(env.hazard,false);
    assert.ok(s.state.revision>0,'The original source callback did mutate the test witness');
    assert.equal(s.live.query.revision(),0,'Do not claim zero is authoritative');
  }finally{s.close();}
});
test('explicit sourceRevision preserves real monotonic authority through original query',()=>{
  const s=setup({sourceRevision:true});
  try{
    assert.equal(s.live.query.revision(),0);
    s.state.revision=2;
    assert.equal(s.live.query.revision(),2);
    assert.equal(s.live.query.environment(s.point).biome,'meadow');
  }finally{s.close();}
});
test('invalid authority fails construction before writing saves',()=>{
  for(const bad of [0,false,'revision',{},null]){
    assert.throws(()=>setup({sourceRevision:bad}),
      /Invalid live mob source revision authority/);
  }
});
for(const stage of ['biome-edit','cave-edit','sky-edit']){
  test('real source callback revision change '+stage+' cannot certify safe habitat',()=>{
    const s=setup({sourceRevision:true,stage});
    try{
      const env=s.live.query.environment(s.point);
      assert.equal(env.biome,null);
      assert.equal(env.hazard,true);
      assert.ok(s.state.revision>0);
      assert.equal(s.world.editRevision,undefined);
    }finally{s.close();}
  });
}
test('original spawnEligible rejects a source edit during physical ground support',()=>{
  const s=setup({sourceRevision:true,stage:'support-edit'});
  try{
    const deer=getSpecies('deer');
    const allowed=spawnEligible(s.live.query,deer,s.point,[-2,4,8.5]);
    assert.equal(allowed,false);
    assert.ok(s.state.revision>0);
  }finally{s.close();}
});
test('original stable M7 ground remains physically supported with trusted callback',()=>{
  const s=setup({sourceRevision:true});
  try{
    const deer=getSpecies('deer');
    assert.equal(s.live.query.grounded(s.point,deer.body),true);
    assert.equal(spawnEligible(s.live.query,deer,s.point,[-2,4,8.5]),true);
    assert.equal(s.state.writes,0);
  }finally{s.close();}
});
test('non-M7 old physical reader remains unchanged with optional source witness',()=>{
  const s=setup({generator:'mythwrought-five-surface-regions-v6',sourceRevision:true});
  try{
    assert.equal(s.live.query.environment(s.point).biome,'meadow');
    assert.equal(s.live.query.grounded(s.point,getSpecies('deer').body),true);
    assert.equal(s.live.query.revision(),0);
  }finally{s.close();}
});
test('legacy editRevision getter still feeds the unmodified fallback when available',()=>{
  const s=setup({hasEditRevision:true});
  try{
    assert.equal(s.live.query.revision(),0);
    s.state.revision=3;
    assert.equal(s.live.query.revision(),3);
  }finally{s.close();}
});
test('original PopulationManager rejects stale sky world with trusted revision',()=>{
  const s=setup({sourceRevision:true,stage:'sky-edit'});
  try{
    const manager=new PopulationManager(s.live.engine,s.live.query,{
      seed:179,spawnOnFirstVisit:true
    });
    for(let i=0;i<10;i++){
      const tick=manager.advance(.5,[8,4,8],[{cx:0,cz:0,section:0,feet:4}]);
      assert.equal(tick.spawned,null);
    }
    assert.equal(s.live.engine.counts().total,0);
  }finally{s.close();}
});
test('sourceRevision is never invoked as a terrain or sidecar writer',()=>{
  const s=setup({sourceRevision:true});
  try{
    s.live.query.environment(s.point);
    assert.equal(s.state.writes,0);
    assert.equal(s.world.editRevision,undefined);
  }finally{s.close();}
});
