import test from 'node:test';import assert from 'node:assert/strict';
import {VoxelWorld,meshChunk,chunkWindow} from '../src/voxel.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {planHeightStream} from '../src/world-height-stream.mjs';
import {physicalBodyRegions,runtimeMeshKey} from '../src/world-height.mjs';
import {admitUpperGpuBatch,upperGpuStats,UPPER_SECTION_BYTES,UPPER_STAGE_BYTES,UPPER_RESIDENT_BYTES} from '../src/world-height-budget.mjs';
import {validateUpperNaturalProvider} from '../src/world-height-natural-contract.mjs';
const zero=new Float32Array(),mesh=n=>new Float32Array(n/4),item=(key,bytes)=>({key,section:1,vertices:mesh(bytes),water:zero});
test('exact inherited section and aggregate budgets reject before allocation',()=>{
 assert.equal(UPPER_SECTION_BYTES,884736);assert.equal(UPPER_STAGE_BYTES,2097152);
 const resident=new Map([['a',{section:1,count:UPPER_SECTION_BYTES/36,waterCount:0}]]);
 assert.equal(admitUpperGpuBatch(resident,[item('a',UPPER_SECTION_BYTES)]).peak,2*UPPER_SECTION_BYTES);
 assert.throws(()=>admitUpperGpuBatch(resident,[item('a',UPPER_SECTION_BYTES+36)]),/864 KiB/);
 assert.throws(()=>admitUpperGpuBatch(resident,['a','b','c'].map(k=>item(k,UPPER_SECTION_BYTES))),/aggregate/);
 const eight=new Map(Array.from({length:8},(_,i)=>['k'+i,{section:1,count:UPPER_SECTION_BYTES/36,waterCount:0}]));
 assert.equal(upperGpuStats(eight).bytes,UPPER_RESIDENT_BYTES);
 assert.throws(()=>admitUpperGpuBatch(eight,[item('ninth',36)]),/aggregate/);
 assert.equal(admitUpperGpuBatch(eight,[item('k0',0),item('ninth',36)]).owners,8);
});
test('body owners outrank distant dense upper occupancy at every signed seam',()=>{
 const w=new Pack2LiveWorld(new VoxelWorld(179));
 for(let s=0;s<15;s++)for(let x=-32;x<=32;x+=16)for(let z=-32;z<=32;z+=16)w.set(x,20+s*16,z,3);
 for(let s=0;s<15;s++)for(const [x,z] of [[0,0],[-16,-16],[15.9,-.1]]){
  const feet=20+s*16-.1,pose={x,feet,z},legacy=chunkWindow(x,z,2).map(c=>({...c,section:0}));
  const plan=planHeightStream(w,pose,legacy),keys=new Set(plan.map(c=>runtimeMeshKey(c.cx,c.cz,c.section)));
  assert.ok(plan.length<=25);assert.ok(plan.filter(c=>c.occupied).length<=8);
  for(const r of physicalBodyRegions(pose))assert.ok(keys.has(r.key),r.key);
 }
});
test('original upper dense checkerboard reaches but does not exceed inherited cap',()=>{
 const w=new VoxelWorld(179);
 for(let x=0;x<16;x++)for(let z=0;z<16;z++)for(let y=20;y<36;y++)if((x+y+z)%2===0)w.set(x,y,z,3);
 assert.throws(()=>meshChunk(w,0,0,1),/budget/);
});
test('future natural provider identity cannot alias other generator or seed',()=>{
 const p={seed:179,generator:'future',sourceVersion:'1',get:()=>0,occupied:()=>false,revision:()=>0};
 assert.equal(validateUpperNaturalProvider(p,{seed:179,generator:'future'}),p);
 assert.throws(()=>validateUpperNaturalProvider(p,{seed:180,generator:'future'}));
 assert.throws(()=>validateUpperNaturalProvider(p,{seed:179,generator:'historical'}));
});
