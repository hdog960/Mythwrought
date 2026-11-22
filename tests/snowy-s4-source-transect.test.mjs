import assert from 'node:assert/strict';
import test from 'node:test';
import {inspectSnowS4Transect} from '../src/manual-biomes/snowy-s4-source-transect.mjs';
const key=(x,y,z)=>x+','+y+','+z;
function makeSource(){
  const seed=179,edits=new Map(),caves=new Map(),plans=new Map([
    ['0,0',new Map([[5,278],[6,272]])],
    ['1,0',new Map([[5,278],[6,276]])],
    ['2,0',new Map([[5,278],[7,279]])],
    ['3,0',new Map()],['4,0',new Map()],['5,0',new Map([[5,278],[6,272]])]
  ]);
  const values=new Map([
    [key(0,6,0),272],[key(1,6,0),276],[key(2,7,0),279],
    [key(0,5,0),278],[key(1,5,0),278],[key(2,6,0),278],
    [key(3,5,0),1],[key(4,5,0),4],[key(5,6,0),272]
  ]);
  const world={seed,generationProfile:{generator:'mythwrought-five-surface-regions-v7'},edits,
    environmentCaves:{get:(...p)=>caves.get(key(...p))},
    _columnPlan:(x,z)=>plans.get(x+','+z)??new Map(),
    get:(...p)=>edits.get(key(...p))??values.get(key(...p))??0,
    save:()=>({schema:1,seed,edits:[...edits]})};
  const deps={biomeAt:(x,z)=>({name:z===9?'desert':'snow',weight:1}),
    terrainHeight:()=>5};
  return {world,plans,values,caves,edits,deps};
}
test('S4 material cliff/ice/rime and retained-grass source transect keeps original identity',()=>{
  const {world,deps}=makeSource();
  const cols=[[0,0],[1,0],[2,0],[3,0],[4,0],[7,9]];
  const before=JSON.stringify(world.save());
  const a=inspectSnowS4Transect(world,cols,deps);
  assert.deepEqual(a,inspectSnowS4Transect(world,cols,deps));
  assert.equal(a.sampled,6);
  assert.equal(a.summary['authored-snow'],3);
  assert.equal(a.summary['retained-legacy-grass'],1);
  assert.equal(a.summary['protected-legacy'],1);
  assert.equal(a.summary['outside-snow'],1);
  assert.ok(a.rows[1].neighbors.some(x=>x.material===279&&x.heightChange===1));
  assert.equal(JSON.stringify(world.save()),before);
  assert.ok(Object.isFrozen(a.rows[0].neighbors));
});
test('S4 source checks distinguish cave AIR, edits, unsupported surface and malformed plan',()=>{
  const {world,deps,caves,edits,plans}=makeSource();
  caves.set(key(0,6,0),0);
  assert.equal(inspectSnowS4Transect(world,[[0,0]],deps).rows[0].status,'protected-cave');
  caves.clear();
  edits.set(key(0,6,0),0);
  assert.equal(inspectSnowS4Transect(world,[[0,0]],deps).rows[0].status,'edited-surface');
  edits.clear();
  // The source below an authored snow cap may be missing in an isolated
  // reader; preserve this as an unsupported physical substrate warning.
  assert.equal(inspectSnowS4Transect(world,[[5,0]],deps).rows[0].status,'authored-unsupported');
  plans.set('0,0',new Map([[5,278],[21,272]]));
  assert.throws(()=>inspectSnowS4Transect(world,[[0,0]],deps),/exceeds/);
  assert.throws(()=>inspectSnowS4Transect(world,[],deps),/required/);
  assert.throws(()=>inspectSnowS4Transect(world,[[1.5,0]],deps),/column/);
  assert.throws(()=>inspectSnowS4Transect({...world,generationProfile:{generator:'legacy'}},[[0,0]],deps),/required/);
});
