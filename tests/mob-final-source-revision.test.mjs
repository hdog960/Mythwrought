import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {createMobSourceRevision} from '../src/mobs/source-edit-epoch.mjs';
import {createLiveMobSession} from '../src/mobs/live-game.mjs';
import {createPack3RuntimeStage} from '../src/builder-assets/pack3-runtime.mjs';
import {createManual14Layer} from '../src/builder-assets/manual14-layer.mjs';
import {MANUAL_FIVE_PACK_CATALOG} from '../src/builder-assets/manual-five-pack.mjs';
import {createPack5ConstructionLayer} from '../src/pack5-integration/construction-layer.mjs';
import {FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {applyBlockAction} from '../src/blocks.mjs';
const fresh=()=>new Pack2LiveWorld(new VoxelWorld(179));
function check(revision,action){
 const prior=revision(),result=action();
 assert.ok(revision()>prior,'Actual source writer did not invalidate the Mob revision');
 assert.equal(revision(),revision(),'Stable source is monotonic and stable');
 return result;
}
test('real base, wrapper, Pack2 placement/state/removal and unloaded cells invalidate only their world',()=>{
 const w=fresh(),other=fresh(),revision=createMobSourceRevision(w),unrelated=createMobSourceRevision(other);
 assert.equal(revision(),0);
 assert.equal(w.set(500,100000,500,BLOCK.STONE),false);assert.equal(revision(),0);
 assert.equal(check(revision,()=>w.base.set(500,-20,500,BLOCK.AIR)),true);
 assert.equal(check(revision,()=>w.set(500,-20,500,59)),true);
 const state=w.getPack2State(500,-20,500);assert.ok(state);
 assert.equal(check(revision,()=>w.updatePack2State(500,-20,500,state)),true);
 assert.equal(check(revision,()=>w.set(500,-20,500,BLOCK.AIR)),true);
 assert.equal(check(revision,()=>w.set(501,-20,500,BLOCK.STONE)),true);
 assert.equal(unrelated(),0);assert.equal(createMobSourceRevision(w)(),0);
});
test('real Pack3 direct layer writes, rejected batch, remove, restoration and replacement',()=>{
 const w=fresh(),r=createMobSourceRevision(w);
 const layer=createPack3RuntimeStage(w);
 check(r,()=>{w.pack3Runtime=layer;});
 const entry={at:[530,19,500],asset:'pack3:069',orientation:0};
 assert.equal(check(r,()=>layer.placeMany([entry])),1);
 const before=r();assert.throws(()=>layer.placeMany([entry]),/Occupied/);assert.equal(r(),before);
 const saved=layer.serialize(),legacy=JSON.stringify(w.save());
 assert.equal(check(r,()=>layer.remove(entry.at)),true);
 assert.equal(check(r,()=>layer.restore(saved)),1);
 assert.equal(JSON.stringify(w.save()),legacy);
 check(r,()=>{w.pack3Runtime=createPack3RuntimeStage(w);});
});
test('real Manual14 direct batch, rejection, same-size restore and removal',()=>{
 const w=fresh(),r=createMobSourceRevision(w),layer=createManual14Layer(w);
 check(r,()=>{w.manual14Layer=layer;w.manual14Collision=b=>layer.collision(b);});
 const masonry=MANUAL_FIVE_PACK_CATALOG.find(x=>x.numericId===9&&x.pack===1);
 const entry={asset:masonry.symbol,numericId:9,at:[500,19,500]};
 assert.equal(check(r,()=>layer.placeMany([entry])),1);
 const old=layer.snapshot(),v=r();
 assert.throws(()=>layer.placeMany([entry]),/Overlapping/);assert.equal(r(),v);
 assert.equal(check(r,()=>layer.restore(old)),1);
 assert.equal(check(r,()=>layer.remove(entry.at)),true);
});
test('real Pack5 direct place, remove, restore and late attachment',()=>{
 const w=fresh(),r=createMobSourceRevision(w),layer=createPack5ConstructionLayer(w);
 check(r,()=>{w.pack5Layer=layer;w.pack5Collision=b=>layer.collidesPack5(b);});
 assert.equal(check(r,()=>layer.place('pack5:080',[0,19,0])).ok,true);
 const old=layer.snapshot(),legacy=JSON.stringify(w.save());
 assert.equal(check(r,()=>layer.remove([0,19,0])),true);
 assert.equal(check(r,()=>layer.restore(old)),true);
 assert.equal(check(r,()=>layer.restore(old)),true);
 assert.equal(JSON.stringify(w.save()),legacy);
});
test('real Mountain supported tree rollback invalidates source without changing saved bytes',()=>{
 const w=new Pack2LiveWorld(new FourRegionWorld(179,fourRegionProfile(179,M8_MOUNTAIN_GENERATOR)));
 const x=-470,y=13,z=5,r=createMobSourceRevision(w),before=JSON.stringify(w.save());
 const act=cb=>applyBlockAction(w,[x+.001,y+.5,z+.5],[1,0,0],'mine',BLOCK.STONE,{x:x-3,feet:y,z:z+.5},cb);
 assert.equal(check(r,()=>act(()=>{throw Error('injected GPU rejection')})).ok,false);
 assert.equal(JSON.stringify(w.save()),before);
 const result=check(r,()=>act(()=>{}));
 assert.equal(result.ok,true);assert.equal(result.affectedCells.length,13);
});
test('actual live host rejects mixed-time habitat after a real source edit and unloading',()=>{
 const w=fresh(),r=createMobSourceRevision(w);let mutate=false,resident=true;
 const live=createLiveMobSession({world:w,seed:179,sourceRevision:r,
  storage:{getItem:()=>null,setItem(){throw Error('No writes');}},allowWrites:()=>false,
  resident:()=>resident,biomeAt:()=> 'plains',caveAt:()=>({underground:false}),
  skyAt:()=>{if(mutate){mutate=false;assert.equal(w.set(500,-20,500,BLOCK.AIR),true);}
   return {light:.8,dayPhase:'day'};},playerAt:()=>[8,4,8]});
 try{
  assert.equal(live.query.environment([8,4,8]).biome,'meadow');
  mutate=true;assert.equal(live.query.environment([8,4,8]).hazard,true);
  assert.equal(live.query.environment([8,4,8]).biome,'meadow');
  resident=false;assert.equal(live.query.environment([8,4,8]).hazard,true);
 }finally{live.dispose();}
});

// Combined production regression: upper geometry must retain both independent
// owner transactions and Mob invalidation, including failed GPU publication.
test('shared-height accepted upper voxel and Pack2 edits invalidate only their source',()=>{
 const w=fresh(),other=fresh(),r=createMobSourceRevision(w),o=createMobSourceRevision(other);
 const cell=[500,35,500],initial=JSON.stringify(w.save());
 assert.equal(check(r,()=>w.set(...cell,BLOCK.STONE)),true);
 assert.equal(check(r,()=>w.set(...cell,BLOCK.AIR)),true);
 assert.equal(check(r,()=>w.set(...cell,59)),true);
 assert.ok(w.getPack2State(...cell));
 assert.equal(check(r,()=>w.set(...cell,BLOCK.AIR)),true);
 const prior=r();assert.equal(w.set(500,257,500,BLOCK.STONE),false);
 assert.equal(r(),prior);assert.equal(o(),0);assert.equal(JSON.stringify(w.save()),initial);
});
test('shared-height Manual14 and Pack3 upper owner changes invalidate Mob source',()=>{
 const w=fresh(),r=createMobSourceRevision(w);
 const p=createPack3RuntimeStage(w),m=createManual14Layer(w);
 check(r,()=>{w.pack3Runtime=p;w.manual14Layer=m;});
 const roof={at:[530,35,500],asset:'pack3:069',orientation:0};
 const stone=MANUAL_FIVE_PACK_CATALOG.find(x=>x.numericId===9&&x.pack===1);
 const row={asset:stone.symbol,numericId:9,at:[500,256,500]};
 assert.equal(check(r,()=>p.placeMany([roof])),1);
 assert.equal(check(r,()=>m.placeMany([row])),1);
 const prior=r();assert.throws(()=>m.placeMany([row]),/Overlapping/);assert.equal(r(),prior);
 assert.equal(check(r,()=>p.remove(roof.at)),true);
 assert.equal(check(r,()=>m.remove(row.at)),true);
});
test('shared-height Pack5 rollback invalidates transient source and retains actual owner state',()=>{
 const w=fresh(),r=createMobSourceRevision(w),initial=JSON.stringify(w.save());
 let reject=true;
 const layer=createPack5ConstructionLayer(w,{upperRebuild:()=>{if(reject)throw Error('Injected GPU failure');}});
 check(r,()=>{w.pack5Layer=layer;});
 const cell=[0,256,0];
 const fail=check(r,()=>layer.place('pack5:080',cell));
 assert.equal(fail.ok,false);assert.match(fail.reason,/Injected GPU failure/);
 assert.equal(layer.count(),0);assert.equal(layer.upperOccupied('sky:0,0,14'),false);
 reject=false;assert.equal(check(r,()=>layer.place('pack5:080',cell)).ok,true);
 assert.equal(layer.upperOccupied('sky:0,0,14'),true);
 reject=true;assert.equal(check(r,()=>layer.remove(cell)),false);
 assert.equal(layer.count(),1);assert.equal(layer.upperOccupied('sky:0,0,14'),true);
 reject=false;assert.equal(check(r,()=>layer.remove(cell)),true);
 assert.equal(layer.count(),0);assert.equal(layer.upperOccupied('sky:0,0,14'),false);
 assert.equal(JSON.stringify(w.save()),initial);
});
