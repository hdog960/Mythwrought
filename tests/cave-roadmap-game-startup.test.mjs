import test from 'node:test';
import assert from 'node:assert/strict';
import {worldSlotKey} from '../src/seeds.mjs';
import {BLOCK,VoxelWorld,worldKey} from '../src/voxel.mjs';
import {descentRoute} from '../src/underground-switchback-descent.mjs';
import {caveProfileStorageKey} from '../src/manual-caves/profile-store.mjs';
import {rejectLegacyWorldWhereCaveExists,prepareExplicitCaveWorld,
 saveExplicitCaveWorld,existingWorldNeedsSaveBeforeCaveSwitch} from '../src/manual-caves/game-startup-contract.mjs';

function store(){
 const m=new Map();
 return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v),
 removeItem:k=>m.delete(k),key:i=>[...m.keys()][i]??null,
 get length(){return m.size},m};
}
test('no cave creation or load unless action and approval are explicit',()=>{
 const s=store();
 assert.throws(()=>prepareExplicitCaveWorld(s,1371,{action:'create'}),/Explicit player/);
 assert.throws(()=>prepareExplicitCaveWorld(s,1371,{approved:true}),/Choose CREATE/);
 assert.equal(s.m.size,0);
 assert.equal(rejectLegacyWorldWhereCaveExists(s,1371),true);
});
test('existing main save or unrelated backup wins even with cave button',()=>{
 const s=store(),original='HISTORICAL SAVED WORLD DATA',seed=4321;
 s.setItem(worldSlotKey(seed),original);
 assert.throws(()=>prepareExplicitCaveWorld(s,seed,{action:'create',approved:true}),/existing world/i);
 assert.equal(s.getItem(worldSlotKey(seed)),original);
 assert.equal(s.getItem(caveProfileStorageKey(seed)),null);
});
for(const seed of [179,1,2026,-77]){
 test('game startup selection and separate verified cave save/reload for seed '+seed,()=>{
  const s=store(),oldKey=worldSlotKey(seed),caveKey=caveProfileStorageKey(seed);
  const first=prepareExplicitCaveWorld(s,seed,{action:'create',approved:true});
  assert.equal(first.created,true);
  assert.equal(first.world.seed,seed);
  assert.equal(s.getItem(oldKey),null);
  assert.ok(s.getItem(caveKey));
  assert.throws(()=>rejectLegacyWorldWhereCaveExists(s,seed),/protected Cave World/);
  const p=descentRoute().find(p=>p.floor===-80);
  assert.ok(p);
  assert.equal(first.world.get(p.x,p.feet,p.z),BLOCK.AIR);
  assert.ok(first.world.set(p.x,p.feet,p.z,BLOCK.DEEPSTONE));
  assert.throws(()=>saveExplicitCaveWorld(s,first),/Explicit cave save/);
  const result=saveExplicitCaveWorld(s,first,{approved:true});
  assert.equal(result.canonicalSlotUnchanged,true);
  assert.equal(s.getItem(oldKey),null);
  const loaded=prepareExplicitCaveWorld(s,seed,{action:'load',approved:true});
  assert.equal(loaded.world.get(p.x,p.feet,p.z),BLOCK.DEEPSTONE);
  assert.ok(loaded.world.set(p.x,p.feet,p.z,BLOCK.AIR));
  saveExplicitCaveWorld(s,loaded,{approved:true});
  const final=prepareExplicitCaveWorld(s,seed,{action:'load',approved:true});
  assert.equal(final.world.get(p.x,p.feet,p.z),BLOCK.AIR);
  assert.equal(final.world.base.edits.has(worldKey(p.x,p.feet,p.z)),false);
  assert.equal(s.getItem(oldKey),null);
 });
}
test('a cave selected world cannot be saved into a normal world or mixed with Pack2',()=>{
 const s=store(),chosen=prepareExplicitCaveWorld(s,66677,{action:'create',approved:true});
 assert.throws(()=>saveExplicitCaveWorld(s,{world:new VoxelWorld(66677),profile:'normal'},{approved:true}),/Refusing/);
 const {world}=chosen,old=s.getItem(caveProfileStorageKey(66677));
 world.pack2Cells.set('1,1,1',{id:59});
 assert.throws(()=>saveExplicitCaveWorld(s,chosen,{approved:true}),/cannot yet persist Pack2/);
 assert.equal(s.getItem(caveProfileStorageKey(66677)),old);
});

test('cave selection does not create canonical save for untouched starter world',()=>{
 const s=store(),normal=new VoxelWorld(179);
 assert.equal(existingWorldNeedsSaveBeforeCaveSwitch(s,normal),false);
 assert.equal(s.getItem(worldSlotKey(179)),null);
 const cave=prepareExplicitCaveWorld(s,314159,{action:'create',approved:true});
 assert.equal(cave.world.seed,314159);
 assert.equal(s.getItem(worldSlotKey(179)),null);
 normal.set(0,2,0,BLOCK.STONE);
 assert.equal(existingWorldNeedsSaveBeforeCaveSwitch(s,normal),true);
 const existing='{"schema":1,"seed":179,"edits":[]}';
 s.setItem(worldSlotKey(179),existing);
 assert.equal(existingWorldNeedsSaveBeforeCaveSwitch(s,new VoxelWorld(179)),true);
 assert.equal(s.getItem(worldSlotKey(179)),existing);
});
