import test from 'node:test';
import assert from 'node:assert/strict';
import {LIVE_CREATURE_DRAW_LIMIT,LIVE_PROJECTILE_LIMIT,LIVE_PROJECTILE_IDS,
  isLiveProjectileId,selectLiveDrawEntries} from '../src/mobs/live-projectile-budget.mjs';
const creature = n => ({e:{id:'mob-'+n,species:{id:'deer'}},d:n});
const shot = n => ({e:{id:'bolt-'+n,species:{id:LIVE_PROJECTILE_IDS[n%4]}},d:n});
const creatures = n => Array.from({length:n},(_,i)=>creature(i));
const shots = n => Array.from({length:n},(_,i)=>shot(i));
test('preserve eight creature slots and four dedicated projectile slots',()=>{
  assert.equal(LIVE_CREATURE_DRAW_LIMIT,8);assert.equal(LIVE_PROJECTILE_LIMIT,4);
  assert.equal(selectLiveDrawEntries([...creatures(8),...shots(4)]).length,12);
});
test('eight closer creatures cannot hide four admitted projectiles',()=>{
  const c=creatures(8),p=shots(4);
  assert.deepEqual(selectLiveDrawEntries([...c,...p]),[...c,...p]);
});
test('nearby projectiles cannot displace eight original creature slots',()=>{
  const c=creatures(8),p=shots(4);
  assert.deepEqual(selectLiveDrawEntries([...p,...c]),[...p,...c]);
});
test('oversubscribed categories remain independently bounded',()=>{
  const c=creatures(32),p=shots(32);
  assert.deepEqual(selectLiveDrawEntries([...c,...p]),[...c.slice(0,8),...p.slice(0,4)]);
});
test('all authored projectile IDs are recognized, not arbitrary species IDs',()=>{
  assert.equal(new Set(LIVE_PROJECTILE_IDS).size,4);
  for(const id of LIVE_PROJECTILE_IDS)assert.equal(isLiveProjectileId(id),true);
  assert.equal(isLiveProjectileId('deer'),false);assert.equal(isLiveProjectileId('unknown'),false);
  assert.ok(Object.isFrozen(LIVE_PROJECTILE_IDS));
});
test('empty and single-category selection remain valid',()=>{
  assert.deepEqual(selectLiveDrawEntries([]),[]);
  assert.deepEqual(selectLiveDrawEntries(creatures(1)),creatures(1));
  assert.deepEqual(selectLiveDrawEntries(shots(1)),shots(1));
});
test('distance-sorted interleaving retains input order and does not mutate it',()=>{
  const c=creatures(9),p=shots(5),input=[];
  for(let i=0;i<9;i++){input.push(c[i]);if(i<5)input.push(p[i]);}
  const before=JSON.stringify(input);Object.freeze(input);
  const chosen=selectLiveDrawEntries(input);
  assert.deepEqual(chosen,input.filter(x=>x!==c[8]&&x!==p[4]));
  assert.equal(JSON.stringify(input),before);
});
