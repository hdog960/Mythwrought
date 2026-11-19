import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,worldKey,VoxelWorld} from '../../src/voxel.mjs';
import {descentCells,descentRoute,descentWorld} from '../../src/underground-switchback-descent.mjs';

// Source-exact older refuge clearance is an immutable reservation for later
// deepest-band caverns. Check the entire sampled route, not one screenshot.
for(const seed of [179,1,2026,-77])test('refuge upper headroom survives newer fault floor '+seed,()=>{
  const world=new VoxelWorld(seed),before=JSON.stringify(world.save());
  const reader=descentWorld(world),anchor=descentRoute().find(p=>p.floor===-195);
  assert.ok(anchor);
  const lx=anchor.x-192,lz=anchor.z-192;
  const outward=lz===0?[0,-1]:lz===28?[0,1]:lx===0?[-1,0]:[1,0];
  const tangent=[outward[1],-outward[0]];
  const at=(d,t,y)=>reader.get(anchor.x+outward[0]*d+tangent[0]*t,y,
    anchor.z+outward[1]*d+tangent[1]*t);
  for(let d=0;d<=30;d++){
    assert.equal(at(d,0,-195),BLOCK.DEEPSTONE,'refuge support '+d);
    for(let y=-194;y<=-190;y++)assert.equal(at(d,0,y),BLOCK.AIR,'refuge clearance '+d+'/'+y);
  }
  for(const [d,t] of [[31,0],[40,10],[39,5]])
    for(let y=-194;y<=-190;y++)assert.equal(at(d,t,y),BLOCK.AIR,'vault clearance '+d+'/'+t+'/'+y);
  const [x,z]=[anchor.x+outward[0]*31,anchor.z+outward[1]*31];
  world.edits.set(worldKey(x,-190,z),BLOCK.STONE);
  assert.equal(reader.get(x,-190,z),BLOCK.STONE,'saved edits remain authoritative');
  world.edits.delete(worldKey(x,-190,z));
  assert.equal(reader.get(x,-190,z),BLOCK.AIR);
  assert.equal(JSON.stringify(world.save()),before);
});
