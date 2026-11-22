import test from 'node:test';
import assert from 'node:assert/strict';
import {ORIGINAL_NATURAL_ACTIVE_RADIUS,verifyOriginalNaturalMobAdmission}
  from '../src/mobs/ecosystem-natural-admission.mjs';
const species=Object.freeze({id:'deer',combat:Object.freeze({health:12})});
const regionKey='0,0,0',spawnedId='mob-4z-1';
const candidate=(point=[10,4,8])=>({species,point:Object.freeze([...point])});
function entity(proposal,{state='idle'}={}){
  return {id:spawnedId,species,homeChunk:regionKey,important:false,
    juvenile:false,motionMode:'walk',yaw:0,health:species.combat.health,
    grounded:true,state,position:[...proposal.point],origin:[...proposal.point],
    velocity:[0,0,0]};
}
const verify=(record,proposal=candidate(),observer=[8,4,8])=>
  verifyOriginalNaturalMobAdmission({entity:record,proposal,observer,regionKey,spawnedId});
const refuse=(record,proposal=candidate(),observer=[8,4,8])=>
  assert.throws(()=>verify(record,proposal,observer),/Original natural spawn admission state mismatch/);

test('original active radius is exactly 18 and near idle admission passes',()=>{
  assert.equal(ORIGINAL_NATURAL_ACTIVE_RADIUS,18);
  const proposal=candidate();assert.equal(verify(entity(proposal),proposal),true);
});
test('near dormant at original engine awake cap remains legal',()=>{
  const proposal=candidate();assert.equal(verify(entity(proposal,{state:'dormant'}),proposal),true);
});
test('far original natural spawn MUST be dormant; boundary exactly 18 is not far',()=>{
  const far=candidate([27,4,8]);refuse(entity(far),far);
  assert.equal(verify(entity(far,{state:'dormant'}),far),true);
  const boundary=candidate([26,4,8]);
  assert.equal(verify(entity(boundary),boundary),true);
});
test('original natural birth must never be juvenile or already important',()=>{
  const proposal=candidate();
  refuse({...entity(proposal),juvenile:true},proposal);
  refuse({...entity(proposal),important:true},proposal);
});
test('original newborn health, yaw, movement state and mode must be initial',()=>{
  const proposal=candidate(),normal=entity(proposal);
  for(const changed of [{health:11},{yaw:.2},{motionMode:'swim'},
    {state:'active'},{state:'downed'},{state:'removed'},{grounded:'yes'}])
    refuse({...normal,...changed},proposal);
});
test('source origin, current position, and velocity must be unchanged since spawn',()=>{
  const proposal=candidate(),normal=entity(proposal);
  for(const changed of [{origin:[11,4,8]},{position:[11,4,8]},
    {velocity:[0,-.1,0]},{origin:null},{velocity:[0,0]}])
    refuse({...normal,...changed},proposal);
});
test('only exact canonical species, original chunk and actual engine ID may settle',()=>{
  const proposal=candidate(),normal=entity(proposal);
  for(const changed of [{species:{...species}},{homeChunk:'1,0,0'},
    {id:'mob-4z-other'}])refuse({...normal,...changed},proposal);
});
test('invalid and absent source witnesses fail closed',()=>{
  const proposal=candidate();
  for(const options of [undefined,{}, {entity:entity(proposal),proposal,
    observer:[8,4,8],regionKey,spawnedId:null},
    {entity:entity(proposal),proposal,observer:[NaN,4,8],regionKey,spawnedId}])
    assert.throws(()=>verifyOriginalNaturalMobAdmission(options),/Invalid original natural admission witness/);
});
