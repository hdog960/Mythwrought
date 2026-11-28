import test from 'node:test';
import assert from 'node:assert/strict';
import {speciesRegistry} from '../../src/mobs/species.mjs';
import {legacyIndex} from '../../src/mobs/age-of-beasts/catalog-index.mjs';
import {plainsCandidate,PLAINS_CANDIDATE_IDS} from '../../src/mobs/age-of-beasts/plains-candidates.mjs';
import {nextPlainsIntent} from '../../src/mobs/age-of-beasts/plains-intents.mjs';
import {buildPlainsModel} from '../../src/mobs/age-of-beasts/plains-models.mjs';
import {uprightMotionEnvelope} from '../../src/mobs/age-of-beasts/motion-envelope.mjs';
test('ten real mesh-bound candidate definitions preserve legacy catalog and habitats',()=>{
 for(const id of PLAINS_CANDIDATE_IDS){
  const {record,capability}=plainsCandidate(id),env=uprightMotionEnvelope(buildPlainsModel(id));
  assert.equal(record.id,id);assert.equal(record.body,capability.body);
  assert.ok(env.radius<=record.body.radius&&env.maxY<=record.body.height);
  assert.equal(legacyIndex.get(id),undefined);assert.equal(record.render.model,id);
 }
 for(const b of ['wetland','volcanic'])assert.deepEqual(legacyIndex.byBiome(b),speciesRegistry.filter(s=>s.habitat.biomes.includes(b)));
 assert.equal(speciesRegistry.length,40);
});
test('distinct plains intent decisions and guarded attack windup',()=>{
 const o={ready:true,dayPhase:'night',targetDistance:.5,threatDistance:20,targetVisible:true,cooldownRemaining:0,windupElapsed:2,darkness:true,emerged:true};
 const call=(id,extra={})=>nextPlainsIntent(plainsCandidate(id),{...o,...extra}).action;
 for(const [id,extra,expected] of [
 ['bison',{threatDistance:1},'defend'],['badger',{threatDistance:1,burrowSite:true},'burrow'],
 ['meadowlark',{grounded:true},'peck'],['honeybee',{flowerNearby:true},'pollinate'],['golden-antelope',{threatDistance:1},'evade'],
 ['werewolf',{},'claw'],['scarefiend',{targetVisible:false},'disguise'],['headless-knight',{},'heavy-melee'],
 ['dire-hound',{targetDistance:4,packNearby:true},'pack-flank'],['gravehand',{emerged:false,emergenceSite:true},'emerge']])assert.equal(call(id,extra),expected);
 assert.equal(call('werewolf',{windupElapsed:0}),'prepare-attack');assert.equal(call('werewolf',{cooldownRemaining:1}),'recover');
 assert.equal(call('werewolf',{dayPhase:'day'}),'idle');assert.equal(call('gravehand',{darkness:false}),'idle');
 assert.equal(call('bison',{ready:false}),'idle');
});
