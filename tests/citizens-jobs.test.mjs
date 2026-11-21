import assert from 'node:assert/strict';
import test from 'node:test';
import {createCitizen} from '../src/citizens/entity.mjs';
import {createCitizenSimulation} from '../src/citizens/simulation.mjs';
import {createWorldQuery} from '../src/mobs/world-query.mjs';
import {BLOCK} from '../src/voxel.mjs';
import {PROFESSIONS} from '../src/citizens/registry.mjs';
import {citizenInteraction, citizenJob, useCitizenService} from '../src/citizens/jobs.mjs';

const citizenOf = profession => createCitizen({worldSeed:179,settlementId:'gate-town',
  slot:0,race:'elf',biome:'mountain',style:'town',profession});
const at = (tag, label='Test workshop') => ({id:'station',settlementId:'gate-town',tags:[tag],label});
const settlement = {id:'gate-town', name:'Gate Town', type:'town'};

for (const role of Object.values(PROFESSIONS)) test(`${role.name} has a compatible independent job and an offline player response`, () => {
  const citizen=citizenOf(role.id);
  const station=at(role.workplaceTags[0]);
  const job=citizenJob(citizen,station);
  assert.equal(job.activity,role.activity);
  assert.notEqual(job.availability,'absent');
  assert.equal(citizenJob(citizen,at('unrelated')).availability,'absent');
  assert.equal(citizenJob(citizen,null).availability,'absent');
  const query=createWorldQuery({get:(_x,y)=>y<0?BLOCK.STONE:BLOCK.AIR},{
    resident:()=>true,observe:()=>({hazard:false}),
  });
  const simulation=createCitizenSimulation({query,settlement:{...settlement,
    regions:[{minX:-3,maxX:4,minZ:-3,maxZ:4}],
    workplaces:[{...station,position:[1.5,0,.5]}],
  }});
  simulation.add(citizen,[.5,0,.5]);
  let actor;
  for(let tick=0;tick<35;tick++) {
    [actor]=simulation.step(.1);
    if (actor.state==='perform-job') break;
  }
  assert.equal(actor.state,'perform-job');
  assert.equal(actor.citizen.workplaceId,station.id);
  assert(actor.position[0]>1.2);

  const interaction=citizenInteraction(citizen,{settlement,workplace:station});
  assert.equal(interaction.profession,role.name);
  assert(interaction.message.includes(settlement.name));
  if (role.dependency) {
    assert.equal(interaction.service.available,false);
    assert.equal(interaction.service.dependency,role.dependency);
    assert.throws(()=>useCitizenService(citizen,{settlement,workplace:station}),/unavailable/i);
  } else {
    assert.equal(interaction.service,null);
  }
});

test('ordinary citizens introduce themselves without a job or service', () => {
  const citizen=citizenOf(null);
  const description=citizenInteraction(citizen,{settlement});
  assert.equal(description.profession,null);
  assert.equal(description.service,null);
  assert.match(description.message,/Gate Town/);
  assert.equal(citizenJob(citizen,null),null);
});

test('astronomer shares actual clock context and mayor shares real settlement information', () => {
  assert.match(citizenInteraction(citizenOf('astronomer'),{
    settlement,workplace:at('telescope','North Observatory'),sky:{time:'21:10',phase:'night'},
  }).message,/21:10.*night/);
  assert.match(citizenInteraction(citizenOf('mayor'),{
    settlement,workplace:at('mayor-desk','Civic Hall'),
  }).message,/Gate Town.*Civic Hall/);
});

test('services are executed only for the right anchored career with an actual host transaction', () => {
  const patient={health:7,max:20};
  const host={services:{'heal-player': {
    label:'Heal',
    execute({player}) {
      if (player.health >= player.max) return false;
      player.health=Math.min(player.max,player.health+6);
      return {health:player.health};
    },
  }}};
  const citizen=citizenOf('healer');
  const context={settlement,workplace:at('infirmary'),host,player:patient};
  assert.equal(citizenInteraction(citizen,context).service.available,true);
  assert.deepEqual(useCitizenService(citizen,context),{health:13});
  assert.equal(patient.health,13);
  assert.throws(()=>useCitizenService(citizen,{...context,workplace:at('forge')}),/unavailable/i);
  assert.equal(patient.health,13);
});
