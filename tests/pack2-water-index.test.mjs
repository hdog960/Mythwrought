import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {pack2NormalizeState,pack2WaterSectionVertices} from '../src/pack2-integration.mjs';

// The original renderer's global scan remains a byte-for-byte oracle for
// the indexed production path, including neighbor-side water triangles.
const scan=(world,cx,cz,section)=>pack2WaterSectionVertices({
  pack2Cells:world.pack2Cells,
  getPack2State:world.getPack2State.bind(world)
},cx,cz,section);
const drawn=(world,cx,cz,section)=>[
  ...pack2WaterSectionVertices(world,cx,cz,section)
];
test('Pack 2 water index visits only its actual chunk and never changes authored vertices',()=>{
  const base=new VoxelWorld(179),world=new Pack2LiveWorld(base);
  const first=[500,19,500],second=[501,19,500],distant=[540,19,540];
  for(const p of [first,second,distant])assert.equal(base.get(...p),BLOCK.AIR);
  for(let i=0;i<128;i++){
    const p=[600+(i%16),19,600+Math.floor(i/16)];
    if(base.get(...p)===BLOCK.AIR)assert.equal(world.set(...p,59),true);
  }
  assert.equal(world.placePack2(...first,76,pack2NormalizeState(76)),true);
  assert.equal(world.placePack2(...second,76,pack2NormalizeState(76)),true);
  assert.equal(world.placePack2(...distant,76,
    pack2NormalizeState(76,{level:3,flow:'north'})),true);
  assert.equal([...world.pack2WaterSectionEntries(31,31,0)].length,2);
  assert.equal([...world.pack2WaterSectionEntries(33,33,0)].length,1);
  assert.equal([...world.pack2WaterSectionEntries(40,40,0)].length,0);
  for(const [cx,cz] of [[31,31],[33,33],[40,40]]){
    assert.deepEqual(drawn(world,cx,cz,0),[...scan(world,cx,cz,0)]);
  }
  // A large dry overlay must not be scanned by the indexed renderer.
  const original=world.pack2Cells;
  world.pack2Cells=new Proxy(original,{get(target,key){
    if(key===Symbol.iterator)throw Error('Unexpected global Pack 2 scan');
    const value=Reflect.get(target,key,target);
    return typeof value==='function'?value.bind(target):value;
  }});
  try{
    assert.ok(drawn(world,31,31,0).length>0);
    assert.deepEqual(drawn(world,40,40,0),[]);
  }finally{world.pack2Cells=original;}
});
test('water buckets stay exact through level changes, removal, solid replacement and reload',()=>{
  const base=new VoxelWorld(179),world=new Pack2LiveWorld(base);
  const a=[500,19,501],b=[501,19,501],deep=[500,-4,501];
  for(const p of [a,b])assert.equal(base.get(...p),BLOCK.AIR);
  assert.equal(base.set(...deep,BLOCK.AIR),true,'explicitly mined deep cell');
  assert.equal(world.set(...a,76),true);
  assert.equal(world.set(...b,76),true);
  assert.equal(world.set(...deep,76),true);
  assert.equal([...world.pack2WaterSectionEntries(31,31,0)].length,2);
  assert.equal([...world.pack2WaterSectionEntries(31,31,-1)].length,1);
  const revised=pack2NormalizeState(76,{level:4,flow:'west'});
  assert.equal(world.updatePack2State(...a,revised),true);
  assert.deepEqual(drawn(world,31,31,0),[...scan(world,31,31,0)]);
  assert.equal(world.set(...b,BLOCK.AIR),true);
  assert.equal([...world.pack2WaterSectionEntries(31,31,0)].length,1);
  assert.equal(world.set(...a,59),true);
  assert.equal([...world.pack2WaterSectionEntries(31,31,0)].length,0);
  assert.deepEqual(drawn(world,31,31,0),[]);
  const saved=world.pack2Snapshot();
  const restored=new Pack2LiveWorld(VoxelWorld.restore(base.save()),saved.cells);
  assert.deepEqual(restored.pack2Snapshot(),saved);
  assert.equal([...restored.pack2WaterSectionEntries(31,31,0)].length,0);
  assert.equal([...restored.pack2WaterSectionEntries(31,31,-1)].length,1);
  assert.deepEqual(drawn(restored,31,31,-1),[...scan(restored,31,31,-1)]);
});
