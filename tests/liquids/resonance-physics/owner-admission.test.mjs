import test from 'node:test';
import assert from 'node:assert/strict';
import {createResonanceOwnerAuthorization as create} from '../../../src/liquids/liquid-resonance/physics/owner-admission.mjs';
const store=Object.freeze({storeId:'s',anchor:'a'}),descriptor=Object.freeze({store,point:Object.freeze([16,20,0])});
const anchor=Object.freeze({...store,point:Object.freeze([15,19,0])});
const region=(x,y,z)=>({key:`${Math.floor(x/16)},${y<20?'lower':'upper'},${Math.floor(z/16)}`});
const options=(extra={})=>({physicalRegionAt:region,isOwnerLoaded:()=>true,isLoaded:()=>true,resolveAnchor:()=>anchor,canDischarge:()=>true,...extra});
test('both physical owners and cells must be ready before permission evaluation',()=>{
  let allowed=0,unloaded='0,lower,0';
  const auth=create(options({isOwnerLoaded:o=>o.key!==unloaded,canDischarge:()=>{allowed++;return true;}}));
  assert.equal(auth(descriptor,store),false);unloaded='1,upper,0';assert.equal(auth(descriptor,store),false);
  unloaded='none';assert.equal(auth(descriptor,store),true);assert.equal(allowed,1);
  assert.equal(create(options({isLoaded:x=>x!==15}))(descriptor,store),false);
  assert.equal(create(options({isLoaded:x=>x!==16}))(descriptor,store),false);
});
test('unknown, aliased and out-of-height anchors fail closed',()=>{
  for(const a of [null,{...anchor,storeId:'other'},{...anchor,anchor:'other'},{...anchor,point:[15,257,0]},{...anchor,point:[15,-211,0]}])
    assert.equal(create(options({resolveAnchor:()=>a}))(descriptor,store),false);
  assert.equal(create(options())(descriptor,{...store,anchor:'other'}),false);
  assert.equal(create(options({physicalRegionAt:()=>null}))(descriptor,store),false);
});
test('permission sees exact identities and immutable coordinates; literal true only',()=>{
  let observed;
  const auth=create(options({canDischarge:x=>{observed=x;return true;}}));
  assert.equal(auth(descriptor,store),true);assert.equal(observed.store,store);
  assert.deepEqual(observed.source,[15,19,0]);assert.deepEqual(observed.outlet,[16,20,0]);
  assert.ok(Object.isFrozen(observed)&&Object.isFrozen(observed.source)&&Object.isFrozen(observed.outlet));
  assert.equal(create(options({canDischarge:()=>1}))(descriptor,store),false);
  assert.equal(create(options({isOwnerLoaded:()=>1}))(descriptor,store),false);
  assert.throws(()=>create(options({resolveAnchor:null})),TypeError);
});
test('host failures propagate to the scheduler instead of granting admission',()=>{
  const failure=Object.freeze(new Error('anchor unavailable'));
  assert.throws(()=>create(options({resolveAnchor:()=>{throw failure;}}))(descriptor,store),e=>e===failure);
});
