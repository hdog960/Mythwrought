import assert from 'node:assert/strict';
import test from 'node:test';
import {createCitizen} from '../src/citizens/entity.mjs';
import {createCitizenSimulation} from '../src/citizens/simulation.mjs';
import {createWorldQuery} from '../src/mobs/world-query.mjs';
import {BLOCK} from '../src/voxel.mjs';

function fixture() {
  let loaded=true;
  const voxel = {get(x,y,z) {
    if (y < 0 && x < 7) return BLOCK.STONE;
    if (x === 0 && z >= -1 && z <= 2 && y < 3) return BLOCK.STONE;
    return BLOCK.AIR;
  }};
  const query = createWorldQuery(voxel,{resident:()=>loaded,observe:()=>({hazard:false})});
  const settlement = {id:'hamlet',regions:[{minX:-5,maxX:6,minZ:-5,maxZ:5}],gathering:[[2.5,0,-3.5]],
    workplaces:[{id:'forge',settlementId:'hamlet',tags:['forge'],position:[3.5,0,.5]}]};
  const simulation = createCitizenSimulation({query,settlement});
  const make = (slot,profession=null) => createCitizen({worldSeed:179,settlementId:'hamlet',
    slot,race:'human',biome:'plains',style:'village',profession});
  return {simulation,make,query,unload:()=>{loaded=false;}};
}

test('ordinary citizen wanders on real voxel support without leaving its settlement region', () => {
  const {simulation,make,query} = fixture();
  const citizen = make(0);
  simulation.add(citizen,[-2.5,0,.5]);
  const visited=new Set();
  for (let tick=0;tick<600;tick++) {
    const {position,state}=simulation.step(.1)[0];
    assert(position[0]>=-5 && position[0]<=6 && position[2]>=-5 && position[2]<=5);
    assert(query.grounded(position,{radius:.29,height:1.95}));
    assert(['idle','wander'].includes(state));
    visited.add(position.map(value=>value.toFixed(1)).join(','));
  }
  assert(visited.size>12);
});

test('a blacksmith can route around a real wall to an assigned workplace and retains its career on removal', () => {
  const {simulation,make} = fixture();
  const smith=make(1,'blacksmith');
  simulation.add(smith,[-2.5,0,.5]);
  simulation.assign(smith.id,'forge');
  let visitedOpening=false;
  let worker;
  for (let tick=0;tick<450;tick++) {
    [worker]=simulation.step(.1);
    if (worker.position[0] > -.25 && worker.position[0] < 1.25) {
      assert(worker.position[2]<-.2-1 || worker.position[2]>3.2);
      visitedOpening=true;
    }
    if (worker.state==='perform-job') break;
  }
  assert(visitedOpening);
  assert.equal(worker.state,'perform-job');
  assert(Math.hypot(worker.position[0]-3.5,worker.position[2]-.5)<.22);
  simulation.assign(smith.id,null);
  [worker]=simulation.step(.1);
  assert.equal(worker.citizen.profession,'blacksmith');
  assert.equal(worker.citizen.workplaceId,null);
  assert.notEqual(worker.state,'perform-job');
});

test('unloaded, obstructed and displaced positions refuse unsafe movement and can be removed', () => {
  const {simulation,make,unload} = fixture();
  const citizen=make(2);
  assert.throws(()=>simulation.add(citizen,[.5,0,.5]),/spawn/i);
  assert.throws(()=>simulation.add(citizen,[7.5,0,.5]),/spawn/i);
  simulation.add(citizen,[-2.5,0,.5]);
  assert.throws(()=>simulation.add(citizen,[-2.5,0,.5]),/duplicate/i);
  simulation.relocate(citizen.id,[-6.5,0,-3.5]);
  let worker;
  for(let tick=0;tick<100;tick++) [worker]=simulation.step(.1);
  assert(worker.position[0]>=-5);
  unload();
  const [before]=simulation.step(.1);
  for(let tick=0;tick<100;tick++) assert.deepEqual(simulation.step(.1)[0],before);
  assert.equal(simulation.navigationWork,0);
  simulation.remove(citizen.id);
  assert.deepEqual(simulation.step(.1),[]);
});

test('an unassigned worker selects compatible local work and safely loses a missing workstation', () => {
  const {simulation,make} = fixture();
  const smith=make(3,'blacksmith');
  simulation.add(smith,[2.5,0,.5]);
  let state;
  for(let tick=0;tick<40;tick++) {
    [state]=simulation.step(.1);
    if (state.state==='perform-job') break;
  }
  assert.equal(state.state,'perform-job');
  assert.equal(state.citizen.workplaceId,'forge');
  simulation.removeWorkplace('forge');
  [state]=simulation.step(.1);
  assert.equal(state.citizen.profession,'blacksmith');
  assert.equal(state.citizen.workplaceId,null);
  assert.notEqual(state.state,'perform-job');
});
