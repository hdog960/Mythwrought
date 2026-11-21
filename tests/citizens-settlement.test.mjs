import assert from 'node:assert/strict';
import test from 'node:test';
import {BLOCK} from '../src/voxel.mjs';
import {createWorldQuery} from '../src/mobs/world-query.mjs';
import {planSettlementCitizens} from '../src/citizens/population.mjs';
import {loadCitizenState,saveCitizenState} from '../src/citizens/state.mjs';

const worldSeed=179;
const settlement={
  id:'highglen',type:'village',biome:'mountain',regions:[{minX:0,maxX:8,minZ:0,maxZ:8}],
  populationLimit:4,
  housing:[
    {id:'closed',position:[1.5,0,1.5]},
    {id:'glen-a',position:[2.5,0,1.5]},
    {id:'glen-b',position:[3.5,0,1.5]},
  ],
  workplaces:[{id:'forge',settlementId:'highglen',tags:['anvil'],position:[4.5,0,1.5]}],
};
const query=createWorldQuery({get(x,y){return y<0||x===1&&y<3?BLOCK.STONE:BLOCK.AIR;}},{
  resident:()=>true,observe:()=>({hazard:false}),
});
const requests=[{slot:0,race:'elf',profession:'blacksmith'},{slot:1,race:'glassborn',profession:null}];
const plan = (options={}) => planSettlementCitizens({worldSeed,settlement,query,requests,...options});

class MemoryStorage {
  #values=new Map();
  getItem(key) { return this.#values.get(key)??null; }
  setItem(key,value) { this.#values.set(key,String(value)); }
}

test('a settlement supplies safe, unique homes and mandatory compatible work anchors', () => {
  const result=plan();
  assert.deepEqual(result,plan({requests:[...requests].reverse()}));
  assert.equal(result.length,2);
  assert.deepEqual(result.map(row=>row.position),[[2.5,0,1.5],[3.5,0,1.5]]);
  assert.deepEqual(result.map(row=>row.citizen.workplaceId),['forge',null]);
  assert.throws(()=>plan({requests:[{slot:0,race:'elf',profession:'baker'}]}),/workplace/i);
  assert.throws(()=>plan({requests:[requests[0],requests[0]]}),/duplicate/i);
  assert.throws(()=>plan({settlement:{...settlement,populationLimit:1}}),/population/i);
  assert.throws(()=>plan({settlement:{...settlement,housing:[settlement.housing[0]]}}),/safe/i);
});

test('sidecar roundtrip and previous-good recovery preserve citizens and terrain bytes', () => {
  const storage=new MemoryStorage();
  storage.setItem('mythwrought-v002-world-179','{"schema":1,"seed":179,"edits":[[0,0,0,2]]}');
  const terrain=storage.getItem('mythwrought-v002-world-179');
  const before=plan().map(row=>({...row,health:24}));
  const after=before.map((row,index)=>({...row,health:index===0?12:24}));
  const scope={worldSeed,settlementId:settlement.id};
  assert.deepEqual(loadCitizenState(storage,scope),{source:'new',citizens:[]});
  saveCitizenState(storage,scope,before);
  const {key}=saveCitizenState(storage,scope,after);
  assert.deepEqual(loadCitizenState(storage,scope),{source:'primary',citizens:after});
  storage.setItem(key,'damaged');
  assert.deepEqual(loadCitizenState(storage,scope),{source:'previous',citizens:before});
  assert.equal(storage.getItem('mythwrought-v002-world-179'),terrain);
});

test('existing identity cannot change profession and irrecoverable malformed state stays intact', () => {
  const storage=new MemoryStorage();
  const scope={worldSeed,settlementId:settlement.id};
  const rows=plan().map(row=>({...row,health:24}));
  const {key}=saveCitizenState(storage,scope,rows);
  const bytes=storage.getItem(key);
  const changed=[{...rows[0],citizen:{...rows[0].citizen,profession:'baker'}}];
  assert.throws(()=>saveCitizenState(storage,scope,changed),/citizen|appearance|profession/i);
  assert.equal(storage.getItem(key),bytes);
  storage.setItem(key,'damaged');
  assert.throws(()=>loadCitizenState(storage,scope),/corrupt/i);
  assert.throws(()=>saveCitizenState(storage,scope,rows),/corrupt/i);
  assert.equal(storage.getItem(key),'damaged');
});
