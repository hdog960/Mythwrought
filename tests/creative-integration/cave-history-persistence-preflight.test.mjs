// Preflight for admitting the historical explicit cave profile to Creative history.
// Use the real cave source, profile owner, wrapper and durable reader. No fake
// geometry or production slot changes. This is intentionally NOT a UI gate.
import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,worldKey} from '../../src/voxel.mjs';
import {worldSlotKey} from '../../src/seeds.mjs';
import {CaveVoxelWorld} from '../../src/manual-caves/cave-voxel-world.mjs';
import {prepareExplicitCaveWorld,saveExplicitCaveWorld} from '../../src/manual-caves/game-startup-contract.mjs';
import {caveProfileStorageKey} from '../../src/manual-caves/profile-store.mjs';
import {createCreativeHistory} from '../../src/creative-integration/creative-history.mjs';
import {descentRoute} from '../../src/underground-switchback-descent.mjs';

function store(){
 const records=new Map(),denied=new Set();
 return {records,denied,getItem:k=>records.get(k)??null,
   setItem(k,v){if(denied.has(k))throw Error('Injected primary write refusal');records.set(k,v);},
   removeItem:k=>records.delete(k),key:i=>[...records.keys()][i]??null,
   get length(){return records.size;}};
}
const approved={approved:true};
const seed=179;
const create=s=>prepareExplicitCaveWorld(s,seed,{action:'create',...approved});
const load=s=>prepareExplicitCaveWorld(s,seed,{action:'load',...approved});

test('historical cave entrance edit equal to pre-portal terrain must survive actual durable reload',()=>{
 const s=store(),other=worldSlotKey(2026),old=worldSlotKey(seed);
 s.setItem(other,'UNRELATED HISTORICAL SAVE');
 const chosen=create(s),world=chosen.world;
 const beforePortal=new CaveVoxelWorld(seed,approved);
 // Choose genuine authored air whose old terrain was a solid core block.
 // Exclude the declared entry walk cells, so this is not intentionally
 // blocking the route. Never invent portal coordinates or a replacement ID.
 const walk=new Set();
 for(const entry of chosen.runtime.entrancePlan.entrances)
   for(const p of entry.route)
     for(let dy=0;dy<=4;dy++)walk.add(worldKey(p.x,p.floor+dy,p.z));
 const candidate=[...world.base.cavePortalCells].find(([key,id])=>{
   if(id!==BLOCK.AIR||walk.has(key))return false;
   const c=key.split(',').map(Number),prior=beforePortal.get(...c);
   return prior===BLOCK.STONE||prior===BLOCK.DEEPSTONE;
 });
 assert.ok(candidate,'Fixture needs a real off-route excavated stone cell');
 const cell=candidate[0].split(',').map(Number),replacement=beforePortal.get(...cell);
 assert.equal(world.get(...cell),BLOCK.AIR);
 assert.equal(world.set(...cell,replacement),true);
 assert.equal(world.get(...cell),replacement);
 const expected=world.save();
 assert.ok(expected.edits.some(row=>worldKey(...row.slice(0,3))===candidate[0]&&row[3]===replacement));
 assert.equal(saveExplicitCaveWorld(s,chosen,approved).ok,true);
 const loaded=load(s);
 assert.equal(loaded.world.get(...cell),replacement,'Cave restore dropped edit against incomplete baseline');
 assert.deepEqual(loaded.world.save(),expected,'Cave restore changed schema-1 edits');
 assert.equal(s.getItem(old),null);
 assert.equal(s.getItem(other),'UNRELATED HISTORICAL SAVE');
});

test('deep cave history may advance only after actual cave save and retains recoverable journal on refusal',()=>{
 const s=store(),chosen=create(s),world=chosen.world,history=createCreativeHistory();
 const p=descentRoute().find(q=>q.floor===-80);
 assert.ok(p);
 const cell=[p.x,p.feet,p.z],token='explicit-cave:'+seed;
 const read=()=>world.get(...cell);
 const save=()=>{try{return saveExplicitCaveWorld(s,chosen,approved).ok===true;}catch{return false;}};
 assert.equal(read(),BLOCK.AIR);
 assert.equal(world.set(...cell,BLOCK.DEEPSTONE),true);
 assert.equal(save(),true);
 assert.equal(history.record({worldToken:token,owner:'voxel',target:cell,before:BLOCK.AIR,after:BLOCK.DEEPSTONE}),true);
 const adapter={worldToken:token,read:()=>read(),apply:(_entry,desired)=>world.set(...cell,desired)&&save()};
 assert.equal(history.undo(adapter).ok,true);
 assert.equal(load(s).world.get(...cell),BLOCK.AIR);
 assert.equal(history.redo(adapter).ok,true);
 assert.equal(load(s).world.get(...cell),BLOCK.DEEPSTONE);
 const key=caveProfileStorageKey(seed),previous=s.getItem(key);
 s.denied.add(key);
 assert.equal(history.undo(adapter).ok,false,'Failed durable undo must not be reported successful');
 assert.equal(s.getItem(key),previous);
 assert.ok(s.getItem(key+'.journal'),'Recoverable pending cave edit must remain');
 assert.equal(load(s).world.get(...cell),BLOCK.AIR);
 assert.equal(history.status().undo,0,'Unverified changed owner must clear history');
 assert.equal(history.status().redo,0);
 assert.equal(s.getItem(worldSlotKey(seed)),null);
});
