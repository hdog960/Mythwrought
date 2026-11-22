import test from 'node:test';
import assert from 'node:assert/strict';
import {stageSkyIslandGpuTransaction} from '../../src/floating-islands/sky-gpu-transaction.mjs';
const s=(key,n=36)=>({key,cx:0,cz:0,section:0,vertices:new Float32Array(n*9),vertexCount:n});
function mockGpu({failAt=0}={}){
  const deleted=[],uploaded=[];let calls=0;
  const gl={deleteBuffer:b=>deleted.push(b)};
  const uploadBuffer=(ctx,vertices)=>{
    assert.equal(ctx,gl);assert.ok(vertices instanceof Float32Array);
    calls++;if(calls===failAt)throw Error('WebGL2 OUT_OF_MEMORY');
    const b={id:calls};uploaded.push(b);return b;
  };
  return {gl,uploadBuffer,deleted,uploaded,calls:()=>calls};
}

test('all real sky buffers stage before any published chunks are touched',()=>{
  const g=mockGpu(),old={buffer:{id:900},count:42};
  const chunks=new Map([['ground:0,0',old]]),a=s('sky:0,0,0');
  const t=stageSkyIslandGpuTransaction({...g,existingChunks:chunks,
    desiredKeys:['ground:0,0','sky:0,0,0'],batch:{meshes:[a]}});
  assert.equal(g.calls(),1);
  assert.equal(chunks.size,1);assert.equal(chunks.has('sky:0,0,0'),false);
  assert.equal(t.nextChunks.size,2);
  assert.equal(t.nextChunks.get('ground:0,0'),old);
  assert.equal(t.nextChunks.get('sky:0,0,0').count,36);
  assert.equal(t.committed,false);assert.equal(g.deleted.length,0);
});

test('second GPU upload failure deletes first fresh buffer and preserves old 25 slots',()=>{
  const g=mockGpu({failAt:2}),chunks=new Map();
  for(let i=0;i<25;i++)chunks.set(`ground:${i}`,{buffer:{id:i}});
  const before=[...chunks.entries()];
  assert.throws(()=>stageSkyIslandGpuTransaction({...g,existingChunks:chunks,
    desiredKeys:['ground:0','sky:0,0,0','sky:0,0,1'],
    batch:{meshes:[s('sky:0,0,0'),s('sky:0,0,1')]}}),/OUT_OF_MEMORY/);
  assert.deepEqual([...chunks.entries()],before);
  assert.deepEqual(g.deleted,g.uploaded.slice(0,1));
});

test('renderer gets obsolete sky buffers ONLY after successful staging',()=>{
  const g=mockGpu(),oldSky={buffer:{id:100},count:50},oldGround={buffer:{id:101}};
  const existing=new Map([['sky:0,0,0',oldSky],['ground:0,0',oldGround]]);
  const t=stageSkyIslandGpuTransaction({...g,existingChunks:existing,
    desiredKeys:['ground:0,0','sky:0,0,0'],batch:{meshes:[s('sky:0,0,0')]}});
  assert.deepEqual(t.obsoleteBuffers,[oldSky.buffer]);
  assert.equal(t.nextChunks.get('ground:0,0'),oldGround);
  assert.equal(existing.get('sky:0,0,0'),oldSky);
  assert.equal(g.deleted.length,0);
});

test('invalid budget, non-sky uploads or missing planned keys fail before GPU actions',()=>{
  const g=mockGpu(),existingChunks=new Map();
  assert.throws(()=>stageSkyIslandGpuTransaction({...g,existingChunks,
    desiredKeys:new Array(26).fill(0).map((_,i)=>String(i)),batch:{meshes:[]}}),/bounded/);
  assert.throws(()=>stageSkyIslandGpuTransaction({...g,existingChunks,
    desiredKeys:['sky:0,0,0'],batch:{meshes:[s('ground:0,0')]}}),/staged/);
  assert.throws(()=>stageSkyIslandGpuTransaction({...g,existingChunks,
    desiredKeys:['ground:0,0'],batch:{meshes:[s('sky:0,0,0')]}}),/staged/);
  assert.equal(g.calls(),0);assert.equal(g.deleted.length,0);
});

test('no host persistence mutation or unverified live WebGL deployment',()=>{
  const g=mockGpu(),existingChunks=new Map();
  const t=stageSkyIslandGpuTransaction({...g,existingChunks,
    desiredKeys:['sky:0,0,0'],batch:{meshes:[s('sky:0,0,0')]}});
  assert.equal(t.nextChunks.get('sky:0,0,0').sky,true);
  assert.equal(existingChunks.size,0);
  assert.ok(!Object.hasOwn(t,'save'));
  assert.ok(!Object.hasOwn(t,'deployed'));
});
