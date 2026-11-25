// Native-format combat + original live-render integration contract.
// Mock GL records real renderer allocations and instanced draw counts;
// it is not a WebGL2 device benchmark.
import test from 'node:test';
import assert from 'node:assert/strict';
import {MobCombat,DemoTarget} from '../src/mobs/combat.mjs';
import {createLiveMobRenderer} from '../src/mobs/live-render.mjs';
import {speciesRegistry} from '../src/mobs/species.mjs';
import {hostileTactics} from '../src/mobs/hostile-tactics.mjs';
import {LIVE_PROJECTILE_LIMIT,LIVE_PROJECTILE_IDS} from '../src/mobs/live-projectile-budget.mjs';

function combatFixture(options){
  const species=speciesRegistry.find(s=>hostileTactics[s.id]?.attack==='ranged');
  assert.ok(species);
  const mob={id:'ranged-fixture',species,position:[0,4,0],state:'active'};
  const target=new DemoTarget([1,4,0]);
  const behavior={advance(seconds,context){
    for(let i=0;i<40;i++)context.onAttack(mob,target);
    return 0;
  }};
  const world={lineOfSight:()=>true};
  const combat=new MobCombat({get:()=>mob},world,behavior,null,options);
  return {combat,target};
}
test('live cap refuses excess damaging bolts before admission',()=>{
  const {combat,target}=combatFixture({maxProjectiles:LIVE_PROJECTILE_LIMIT});
  combat.advance(.03,target);
  assert.equal(combat.projectiles.length,4);
  assert.equal(combat.events.filter(e=>e.type==='projectile').length,4);
  combat.advance(.03,target);
  assert.equal(combat.projectiles.length,4);
  assert.equal(combat.events.filter(e=>e.type==='projectile').length,0);
});
test('preview default retains original 32-projectile simulation cap',()=>{
  const {combat,target}=combatFixture(undefined);
  combat.advance(.03,target);
  assert.equal(combat.projectiles.length,32);
});
test('cleared projectiles free live admission slots',()=>{
  const {combat,target}=combatFixture({maxProjectiles:LIVE_PROJECTILE_LIMIT});
  combat.advance(.03,target);combat.clearProjectiles();
  assert.equal(combat.projectiles.length,0);
  combat.advance(.03,target);assert.equal(combat.projectiles.length,4);
});
test('invalid projectile caps are rejected at construction',()=>{
  for(const maxProjectiles of [0,33,-1,1.5,NaN,'4'])
    assert.throws(()=>combatFixture({maxProjectiles}),/Invalid projectile capacity/);
});
function fakeGL(){
  const draws=[],uploads=[];
  let id=0;
  const alloc=()=>({id:++id}),noop=()=>{};
  const gl={VERTEX_SHADER:1,FRAGMENT_SHADER:2,COMPILE_STATUS:3,LINK_STATUS:4,
    ARRAY_BUFFER:5,STATIC_DRAW:6,DYNAMIC_DRAW:7,FLOAT:8,TRIANGLES:9,
    createShader:alloc,createProgram:alloc,createVertexArray:alloc,createBuffer:alloc,
    shaderSource:noop,compileShader:noop,getShaderParameter:()=>true,attachShader:noop,
    linkProgram:noop,getProgramParameter:()=>true,deleteShader:noop,deleteProgram:noop,
    deleteBuffer:noop,deleteVertexArray:noop,getUniformLocation:alloc,bindVertexArray:noop,
    bindBuffer:noop,bufferData:noop,enableVertexAttribArray:noop,vertexAttribPointer:noop,
    vertexAttribDivisor:noop,useProgram:noop,uniform3fv:noop,uniform1f:noop,
    isContextLost:()=>false,
    bufferSubData(target,offset,array,start,length){uploads.push([...array.slice(start,start+length)]);},
    drawArraysInstanced(mode,start,count,n){draws.push(n);}
  };
  return {gl,draws,uploads};
}
const camera={eye:[0,4,0],forward:[0,0,1],right:[1,0,0],up:[0,1,0],
  aspect:2,light:[1,1,1],fog:[0,0,0],time:0};
const entity=(id,species,x)=>({id,species:{id:species},position:[x,4,1],
  velocity:[0,0,0],state:'idle',yaw:0});
function renderFixture(creatureCount=8,shotCount=4,shotsNear=false){
  const {gl,draws,uploads}=fakeGL(),renderer=createLiveMobRenderer(gl);
  const creatures=Array.from({length:creatureCount},(_,i)=>
    entity('mob-'+i,speciesRegistry[i%40].id,(shotsNear?6:1)+i*.1));
  const shots=Array.from({length:shotCount},(_,i)=>
    entity('bolt-'+i,LIVE_PROJECTILE_IDS[i%4],(shotsNear?1:6)+i*.1));
  const result=renderer.render([...creatures,...shots],camera);
  const positions=uploads.flatMap(array=>array.filter((_,i)=>i%8===0));
  renderer.dispose();
  return {result,draws,positions};
}
test('original render submits eight closer creatures and all four projectiles',()=>{
  const {result,draws,positions}=renderFixture();
  assert.equal(result.actors,12);
  assert.equal(draws.reduce((a,b)=>a+b,0),12);
  assert.equal(positions.filter(x=>x>=6).length,4);
  assert.equal(result.models,12);
  assert.ok(result.bytes<=1_000_000);
});
test('four closer projectiles do not displace eight creatures',()=>{
  const {result,positions}=renderFixture(8,4,true);
  assert.equal(result.actors,12);
  assert.equal(positions.filter(x=>x>=6).length,8);
});
test('renderer remains independently bounded under excessive candidate inputs',()=>{
  const {result,positions}=renderFixture(16,12);
  assert.equal(result.actors,12);
  assert.equal(positions.filter(x=>x>=6).length,4);
  assert.ok(result.models<=12);
});
test('original eight-creature draw cap is retained when no shots exist',()=>{
  const {result}=renderFixture(16,0);
  assert.equal(result.actors,8);
  assert.ok(result.models<=8);
});
