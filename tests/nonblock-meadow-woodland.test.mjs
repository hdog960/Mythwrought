import assert from 'node:assert/strict';
import test from 'node:test';
import {createMeadowWoodland} from '../src/nonblock-scene48/meadow-woodland.mjs';

const names=[
  'grass-plume','meadow-fescue','buttercup-bunch','seedhead-meadow-mix',
  'crawling-ivy','trail-vine','forest-leaf-litter','woodland-horsetail'
];
test('meadow and woodland shapes use bounded, unique meshes with four deterministic variants',()=>{
  const digests=new Set();
  for(const name of names){
    const id='scene48:'+name;
    for(let variant=0;variant<4;variant++){
      const options={seed:179,anchor:[3,4,5],variant};
      const object=createMeadowWoodland(id,options);
      assert.deepEqual(object,createMeadowWoodland(id,options));
      const {positions,materials,triangleCount}=object.mesh;
      assert.ok(triangleCount>=16 && triangleCount<=256,id);
      assert.equal(positions.length,triangleCount*9,id);
      assert.equal(materials.length,triangleCount,id);
      assert.ok(positions.every(Number.isFinite),id);
      assert.ok(materials.every(value=>value<object.palette.length),id);
      for(let i=0;i<positions.length;i+=9){
        const u=[0,1,2].map(j=>positions[i+3+j]-positions[i+j]);
        const v=[0,1,2].map(j=>positions[i+6+j]-positions[i+j]);
        assert.ok(Math.hypot(u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0])>1e-7,
          id+' emitted a degenerate triangle');
      }
      digests.add(positions.join());
    }
  }
  assert.equal(digests.size,32);
});

test('ivy and vine have deliberate shallow wall profiles and no geometry extends below a ground anchor',()=>{
  for(const name of names){
    const object=createMeadowWoodland('scene48:'+name,{seed:179,anchor:[0,0,0],variant:1});
    const isWall=name==='crawling-ivy'||name==='trail-vine';
    assert.equal(object.attachment,isWall?'wall':'ground');
    const positions=object.mesh.positions;
    const vertical=positions.filter((_,i)=>i%3===1);
    const depth=positions.filter((_,i)=>i%3===2);
    assert.ok(Math.min(...vertical)>=0);
    if(isWall)assert.ok(Math.max(...depth)-Math.min(...depth)<.25);
  }
  assert.throws(()=>createMeadowWoodland('scene48:crawling-ivy',{seed:1,anchor:[0,0,0],variant:4}));
});

test('ground and wall woodland fixtures keep their mounting and orientation identities',async()=>{
  const {createCandidateScene,describeCandidateObject}=await import('../src/nonblock/candidate-scene.mjs');
  const layout=names.map((name,i)=>({
    sceneId:'scene48:'+name,anchor:[i*2,1,0],variant:3,orientation:name==='trail-vine'?1:0
  }));
  const support=new Set(layout.flatMap(({sceneId,anchor:[x,y,z],orientation})=>{
    if(sceneId.endsWith('crawling-ivy'))return [[x,y,z-1],[x,y+1,z-1]];
    if(orientation===1)return [[x+1,y,z],[x+1,y+1,z]];
    return [[x,y-1,z]];
  }).map(cell=>cell.join(',')));
  const scene=createCandidateScene(179,'legacy',layout,{
    storage:{getItem:()=>null},blockAt:(...cell)=>support.has(cell.join(',')),voxelPick:()=>null
  });
  assert.equal(scene.visible().length,8);
  const vine=layout.find(object=>object.orientation===1);
  assert.match(describeCandidateObject(179,vine).instanceKey,/:3:r1$/);
  support.delete('11,2,0');
  assert.ok(!scene.visible().find(object=>object.sceneId===vine.sceneId));
});
