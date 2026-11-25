// Native-format roster restoration budget regression. No save writes.
import test from 'node:test';
import assert from 'node:assert/strict';
import {serializeRoster,restoreRoster} from '../src/mobs/roster-persistence.mjs';
import {DemoTarget} from '../src/mobs/combat.mjs';
import {speciesRegistry} from '../src/mobs/species.mjs';
import {hostileTactics} from '../src/mobs/hostile-tactics.mjs';
import {LIVE_PROJECTILE_LIMIT} from '../src/mobs/live-projectile-budget.mjs';

function fixture(){
  const world={volume:()=> 'clear',grounded:()=>true,lineOfSight:()=>true};
  const raw=serializeRoster({
    engine:{checkpoint:()=>({seed:179,next:0,maxEntities:32,maxActive:8,entities:[]})},
    companions:{checkpoint:()=>({capacity:2,slots:[]})},
    animals:{checkpoint:()=>[]}
  });
  return {world,raw};
}
function launch(restored){
  const species=speciesRegistry.find(s=>hostileTactics[s.id]?.attack==='ranged');
  const target=new DemoTarget([1,4,0]);
  const mob={id:'ranged-fixture',species,position:[0,4,0],state:'idle'};
  // Drive the original combat callback deterministically without movement.
  restored.behavior.advance=(seconds,context)=>{
    for(let i=0;i<40;i++)context.onAttack(mob,target);
    return 0;
  };
  restored.combat.advance(.03,target);
  return restored.combat.projectiles.length;
}
test('restored live roster receives same bounded combat admission',()=>{
  const {world,raw}=fixture();
  const restored=restoreRoster(raw,world,null,{maxProjectiles:LIVE_PROJECTILE_LIMIT});
  assert.equal(launch(restored),4);
  assert.equal(serializeRoster(restored),raw,'Do not modify persisted roster schema');
  restored.engine.dispose();
});
test('original preview restore preserves default capacity and exact saved bytes',()=>{
  const {world,raw}=fixture(),restored=restoreRoster(raw,world);
  assert.equal(launch(restored),32);
  assert.equal(serializeRoster(restored),raw);
  restored.engine.dispose();
});
test('restore forwards invalid capacity instead of silently discarding the option',()=>{
  const {world,raw}=fixture();
  assert.throws(()=>restoreRoster(raw,world,null,{maxProjectiles:0}),/Invalid projectile capacity/);
});
