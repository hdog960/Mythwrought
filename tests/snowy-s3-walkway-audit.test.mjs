import assert from 'node:assert/strict';
import test from 'node:test';
import {proposedSnowTree} from '../src/manual-biomes/snowy-s3-tree-prototypes.mjs';
import {auditSnowS3Walkway} from '../src/manual-biomes/snowy-s3-walkway-audit.mjs';
const key=(x,y,z)=>x+','+y+','+z;
const FLOOR=6;
function fixture(x=0,z=0){
  const shape=proposedSnowTree('compact-fir',x,FLOOR,z);
  const candidate=Object.freeze({kind:'detached-s3-physically-checked-proposal',
    key:x+','+z,x,z,floor:FLOOR,style:'compact-fir',
    voxelCount:shape.cells.length,
    cells:Object.freeze(shape.cells.map(row=>Object.freeze([...row])))});
  const blocks=new Map(),edits=new Map(),caves=new Map();
  const get=(a,b,c)=>blocks.get(key(a,b,c))??(b<=FLOOR?272:0);
  const world={get,edits,environmentCaves:{get:(...p)=>caves.get(key(...p))},
    save:()=>({schema:1,seed:179,edits:[...edits]})};
  return {world,candidate,blocks,caves,edits};
}
test('read-only original-voxel walking proxy preserves existing open cardinal detours',()=>{
  for(const x of [-16,0,17]){
    const {world,candidate}=fixture(x,-33),before=JSON.stringify(world.save());
    const a=auditSnowS3Walkway(world,candidate);
    assert.equal(a.safe,true,JSON.stringify(a));
    assert.equal(a.baselineConnectedPairs,6);
    assert.equal(a.preservedConnectedPairs,6);
    assert.deepEqual(a,auditSnowS3Walkway(world,candidate));
    assert.equal(JSON.stringify(world.save()),before);
  }
});
test('reject a narrow preserved north-south lane severed by proposed trunk',()=>{
  const {world,candidate,blocks}=fixture();
  // Original source is a narrow bridge between impassable head-high walls:
  // before tree placement the central line supports a genuine 2-high path.
  for(let dz=-4;dz<=4;dz++)for(let dx=-4;dx<=4;dx++)
    if(dx!==0)for(const y of [FLOOR+1,FLOOR+2,FLOOR+3])
      blocks.set(key(dx,y,dz),3);
  const p=auditSnowS3Walkway(world,candidate);
  assert.equal(p.safe,false);
  assert.equal(p.reason,'severs-original-cardinal-passage');
  assert.deepEqual(p.portals,[2,3]);
});
test('reject explicit protected old cave AIR and existing player edit in clearance ring',()=>{
  const {world,candidate,caves,edits}=fixture();
  caves.set(key(2,FLOOR,0),0);
  assert.equal(auditSnowS3Walkway(world,candidate).reason,'near-original-cave-override');
  caves.clear();
  edits.set(key(1,FLOOR+1,0),0);
  assert.equal(auditSnowS3Walkway(world,candidate).reason,'near-existing-player-edit');
  edits.clear();
  assert.equal(auditSnowS3Walkway(world,{...candidate,style:'unregistered'}).safe,false);
  assert.equal(auditSnowS3Walkway({},candidate).safe,false);
});
