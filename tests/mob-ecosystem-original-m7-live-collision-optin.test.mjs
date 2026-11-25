// Original-source, opt-in M7 live MobEngine collision integration regression.
// Requires the FULL original repo for native node:test execution.
// Uses controlled voxel cells; NOT genuine generated M7/21 sites or iPhone.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createLiveMobSession} from '../src/mobs/live-game.mjs';
import {createM7MobCollisionReader}
  from '../src/mobs/ecosystem-world-geometry.mjs';
import {M7_ENVIRONMENT_GENERATOR,environmentGround}
  from '../src/environment-ground.mjs';
import {getSpecies} from '../src/mobs/species.mjs';
import {MobEngine} from '../src/mobs/engine.mjs';
import {PopulationManager} from '../src/mobs/ecology.mjs';
import {BLOCK} from '../src/voxel.mjs';
import {sectionForY} from '../src/depth.mjs';

const M7='mythwrought-five-surface-regions-v7';
const OTHER='mythwrought-five-surface-regions-v6';
const M7_IDS=Object.freeze([400,401,402,403,404,405,406,407,408,409,410]);
function mockWorld({generator=M7,material=400,floor=4,pack3Runtime,pack5Collision}={}){
  let reads=0,saves=0,writes=0;
  const world={
    base:{generationProfile:{generator}},
    editRevision:0,
    get(x,y,z){reads++;return y<floor?material:BLOCK.AIR;},
    set(){writes++;throw Error('Mob collision must not write to original source');},
    save(){saves++;throw Error('Mob collision must not write Schema-1');},
    pack3Runtime,pack5Collision,
    counts(){return {reads,writes,saves};}
  };
  return world;
}
function session({generator=M7,material=400,floor=4,
  biome='mountain',pack3Runtime,pack5Collision}={}){
  const world=mockWorld({generator,material,floor,pack3Runtime,pack5Collision});
  const storage={getItem(){return null;},setItem(){throw Error('No mob sidecar writes');}};
  const live=createLiveMobSession({
    world,seed:179,storage,resident:()=>true,
    biomeAt:()=>biome,
    caveAt:()=>({underground:floor<-3.5}),
    skyAt:()=>({light:floor<0?.25:.8,dayPhase:'day'}),
    playerAt:()=>[8,floor,8]
  });
  return {world,live,query:live.query,finish(){live.dispose()}};
}
function physical(point=[8.5,4,8.5],speciesId='mountain-goat'){
  return {point,body:getSpecies(speciesId).body};
}
test('original M7 world identity is literal and collision reader recognizes full authored terrain span',()=>{
  assert.equal(M7_ENVIRONMENT_GENERATOR,M7);
  assert.equal(M7_IDS.every(id=>Boolean(environmentGround(id))),true);
  for(const id of M7_IDS){
    const s=session({material:id,biome:'mountain'});
    try{
      const {point,body}=physical();
      assert.equal(s.world.get(8,3,8),id,'Source raw material never rewritten');
      assert.equal(s.query.volume(point,body),'clear');
      assert.equal(s.query.grounded(point,body),true,
        'M7 material '+id+' must physically support an original mob');
      assert.equal(s.world.counts().writes,0);
      assert.equal(s.world.counts().saves,0);
    }finally{s.finish();}
  }
});
test('wrong M7 generator cannot opt into 400-410 collision reinterpretation',()=>{
  for(const generator of [OTHER,'legacy',null]){
    const s=session({generator,material:400});
    try{
      const {point,body}=physical();
      assert.equal(s.query.grounded(point,body),false);
      assert.equal(s.query.volume([8.5,3.2,8.5],body),'unknown');
      assert.equal(s.world.get(8,3,8),400);
    }finally{s.finish();}
  }
});
test('unadapted original source reader still fails closed on environmental voxels',()=>{
  const world=mockWorld({material:400});
  const result=createM7MobCollisionReader(world);
  assert.equal(result.get(8,3,8),BLOCK.STONE);
  assert.equal(result.set,undefined);
  assert.equal(result.save,undefined);
  assert.equal(result.base,undefined);
  assert.equal(result.edits,undefined);
  assert.equal(Object.isFrozen(result),true);
  assert.throws(()=>createM7MobCollisionReader(mockWorld({generator:OTHER})),
    /exact M7 generator/);
});
test('normal non-M7 world keeps original stone ground support and source identities',()=>{
  const s=session({generator:OTHER,material:BLOCK.STONE,biome:'plains'});
  try{
    const {point,body}=physical([8.5,4,8.5],'deer');
    assert.equal(s.query.grounded(point,body),true);
    assert.equal(s.query.environment(point).biome,'meadow');
    assert.equal(s.world.get(8,3,8),BLOCK.STONE);
  }finally{s.finish();}
});
test('isolated M7 mountain receives genuine original alpine habitat without fake voxel edits',()=>{
  const s=session({material:400,biome:'mountain'});
  try{
    const point=[8.5,4,8.5];
    assert.equal(s.query.environment(point).biome,'alpine');
    assert.equal(s.query.grounded(point,getSpecies('mountain-goat').body),true);
    assert.equal(s.world.counts().writes,0);
  }finally{s.finish();}
});
test('isolated M7 enchanted forest receives original forest habitat and physical support',()=>{
  const s=session({material:403,biome:'enchanted'});
  try{
    const point=[8.5,4,8.5];
    assert.equal(s.query.environment(point).biome,'forest');
    assert.equal(s.query.grounded(point,getSpecies('fox').body),true);
    assert.equal(s.world.get(8,3,8),403);
  }finally{s.finish();}
});
test('source Pack3 shape overlay still blocks adapted M7 mob admission',()=>{
  const pack3Runtime={size:()=>1,playerFits:()=>({fits:false})};
  const s=session({material:400,pack3Runtime});
  try{
    assert.equal(s.query.volume([8.5,4,8.5],getSpecies('mountain-goat').body),
      'solid');
    assert.equal(s.query.grounded([8.5,4,8.5],getSpecies('mountain-goat').body),
      false);
  }finally{s.finish();}
});
test('source Pack5 collision callback still blocks adapted M7 mob admission',()=>{
  const s=session({material:400,pack5Collision:()=>true});
  try{
    assert.equal(s.query.volume([8.5,4,8.5],getSpecies('mountain-goat').body),
      'solid');
  }finally{s.finish();}
});
test('M7 adapter leaves source caves with ordinary stone collision unchanged',()=>{
  const s=session({floor:-34,material:BLOCK.STONE,biome:'plains'});
  try{
    const point=[8.5,-34,8.5];
    assert.equal(sectionForY(-34),-2);
    assert.equal(s.query.environment(point).biome,'cave');
    assert.equal(s.query.grounded(point,getSpecies('slime').body),true);
  }finally{s.finish();}
});
function firstTick({generator=M7,material,biome,seed}){
  const s=session({generator,material,biome});
  const engine=new MobEngine(s.query,seed,{maxEntities:128,maxActive:32});
  const manager=new PopulationManager(engine,s.query,{seed,spawnOnFirstVisit:true});
  try{
    const result=manager.advance(.5,[8,4,8],[{cx:0,cz:0,section:0,feet:4}]);
    const newborn=result.spawned?engine.get(result.spawned):null;
    return {evaluated:result.evaluated,
      species:newborn?.species.id??null,
      position:newborn?.position??null,
      home:newborn?.homeChunk??null,
      count:engine.counts().total};
  }finally{engine.dispose();s.finish();}
}
test('original M7 alpine and enchanted physical readers unlock controlled first-tick births',()=>{
  for(const [biome,material] of [['mountain',400],['enchanted',403]]){
    let births=0;
    for(let seed=1;seed<=64;seed++){
      const a=firstTick({biome,material,seed});
      if(a.count){births++;assert.equal(a.home,'0,0,0');}
    }
    assert.ok(births>0,'Original real source creatures must spawn on '+biome);
  }
});
test('every original M7 environmental material is an opt-in read-only physical cube',()=>{
  for(const id of M7_IDS){
    const s=session({material:id});
    try{
      assert.equal(s.query.volume([8.5,3.2,8.5],
        getSpecies('mountain-goat').body),'solid');
      assert.equal(s.query.volume([8.5,4,8.5],
        getSpecies('mountain-goat').body),'clear');
    }finally{s.finish();}
  }
});
