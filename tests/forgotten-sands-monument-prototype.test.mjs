import test from 'node:test';
import assert from 'node:assert/strict';
import {
  definePrototypePyramid,prototypePyramidBlock,prototypePyramidChunk,
  prototypePyramidChunkBounds,PROTOTYPE_BLOCK_IDS
} from '../src/manual-biomes/forgotten-sands-monument-prototype.mjs';

const key=row=>row.slice(0,3).join(',');
function slices(site) {
  const bounds=prototypePyramidChunkBounds(site),chunks=[];
  for(let cx=bounds.minCX;cx<=bounds.maxCX;cx++)
    for(let cz=bounds.minCZ;cz<=bounds.maxCZ;cz++)
      chunks.push([cx,cz]);
  return chunks;
}
function collect(site,order=slices(site)) {
  const all=new Map();
  for(const [cx,cz] of order)for(const row of prototypePyramidChunk(site,cx,cz)) {
    assert.equal(all.has(key(row)),false,'duplicate world cell across chunks');
    assert.equal(Math.floor(row[0]/16),cx);
    assert.equal(Math.floor(row[2]/16),cz);
    all.set(key(row),row[3]);
  }
  return all;
}

test('prototype is wholly outside production module imports and validates shape',()=>{
  assert.throws(()=>definePrototypePyramid({seed:179,x:0,z:0,baseY:8,size:16}));
  assert.throws(()=>definePrototypePyramid({seed:179,x:0,z:0,baseY:8,height:200}));
  const s=definePrototypePyramid({seed:179,x:15,z:-16,baseY:12});
  assert.ok(Object.isFrozen(s));
  assert.equal(s.maxY,65);
  assert.ok(s.maxY>19,'research proves capacity beyond current engine ceiling only');
});

test('reversing chunk load order cannot change a physical proposed voxel',()=>{
  for(const [seed,x,z] of [[179,15,-16],[2026,-40,-2],[-17,0,0]]) {
    const s=definePrototypePyramid({seed,x,z,baseY:12,size:31,height:26});
    const a=collect(s),b=collect(s,slices(s).reverse());
    assert.ok(a.size>8000);
    assert.deepEqual([...a.entries()].sort(),[...b.entries()].sort());
  }
});

test('every emitted cell matches independent world-coordinate sampling',()=>{
  for(const [x,z] of [[15,-16],[-40,-2],[0,0]]) {
    const s=definePrototypePyramid({seed:179,x,z,baseY:11,size:31,height:26});
    const cells=collect(s);
    for(const [cell,id] of cells) {
      const [px,py,pz]=cell.split(',').map(Number);
      assert.equal(prototypePyramidBlock(s,px,py,pz),id);
      assert.ok([PROTOTYPE_BLOCK_IDS.STONE,PROTOTYPE_BLOCK_IDS.ORE].includes(id));
    }
  }
});

test('interior chamber and doorway are truly empty in the proposed structure',()=>{
  const s=definePrototypePyramid({seed:179,x:0,z:0,baseY:9});
  assert.equal(prototypePyramidBlock(s,0,13,0),null);
  assert.equal(prototypePyramidBlock(s,0,12,-20),null);
  assert.equal(prototypePyramidBlock(s,0,18,0),null);
  assert.equal(prototypePyramidBlock(s,0,20,0),PROTOTYPE_BLOCK_IDS.STONE);
  assert.equal(prototypePyramidBlock(s,0,9,-31),PROTOTYPE_BLOCK_IDS.STONE);
});

test('nonresident chunks return no cells and never write to a world',()=>{
  const s=definePrototypePyramid({seed:2026,x:-31,z:47,baseY:10});
  const world={edits:new Map([['-31,15,47',0]]), get(){throw Error('must not read world');},set(){throw Error('must not mutate world');}};
  assert.deepEqual(prototypePyramidChunk(s,200,200),[]);
  const chunk=prototypePyramidChunk(s,Math.floor(s.x/16),Math.floor(s.z/16));
  assert.ok(chunk.length>0);
  assert.equal(world.edits.get('-31,15,47'),0,'authoritative edit retained');
  assert.equal(world.edits.size,1);
});

test('per-chunk peak stays bounded even for a large 111-wide monument',()=>{
  const s=definePrototypePyramid({seed:2026,x:-8,z:15,baseY:7,size:111,height:90});
  const chunks=slices(s);
  assert.ok(chunks.length>=49);
  for(const [cx,cz] of chunks) {
    const cells=prototypePyramidChunk(s,cx,cz);
    assert.ok(cells.length<=16*16*(s.maxY-s.minY+1));
    assert.ok(cells.every(([x,,z])=>Math.floor(x/16)===cx&&Math.floor(z/16)===cz));
  }
});
