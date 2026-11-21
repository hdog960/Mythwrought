import assert from 'node:assert/strict';
import test from 'node:test';
import {createEnchantedFungus,ENCHANTED_FUNGI_IDS} from '../src/nonblock-scene48/enchanted-fungi.mjs';

test('the ten new enchanted families have seeded, distinct and bounded source meshes',()=>{
  assert.equal(ENCHANTED_FUNGI_IDS.length,10);
  assert.equal(new Set(ENCHANTED_FUNGI_IDS).size,10);
  const shapes=new Set();
  for(const id of ENCHANTED_FUNGI_IDS){
    for(const variant of [0,1,2,3]){
      const options={seed:-179,anchor:[-3,2,8],variant};
      const result=createEnchantedFungus(id,options);
      assert.deepEqual(result,createEnchantedFungus(id,options));
      const {positions,materials,triangleCount}=result.mesh;
      assert.ok(triangleCount>=18&&triangleCount<=256,id);
      assert.ok(positions.every(Number.isFinite),id);
      assert.ok(materials.every(value=>value<result.palette.length),id);
      assert.equal(positions.length,triangleCount*9,id);
      assert.equal(materials.length,triangleCount,id);
      for(let i=0;i<positions.length;i+=9){
        const a=[0,1,2].map(k=>positions[i+3+k]-positions[i+k]);
        const b=[0,1,2].map(k=>positions[i+6+k]-positions[i+k]);
        assert.ok(Math.hypot(a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])>1e-7,id);
      }
      shapes.add(positions.join());
      assert.equal(result.attachment,['scene48:shelf-fungus','scene48:glowing-vine'].includes(id)?'wall':'ground');
    }
  }
  assert.equal(shapes.size,40);
  assert.throws(()=>createEnchantedFungus('scene48:shelf-fungus',{seed:1,anchor:[0,0,0],variant:8}));
});

test('fungal placement reaches the shared stage and preserves rotated wall identities',async()=>{
  const {createCandidateScene,describeCandidateObject}=await import('../src/nonblock/candidate-scene.mjs');
  const walls=new Set(['scene48:shelf-fungus','scene48:glowing-vine']);
  const layout=ENCHANTED_FUNGI_IDS.map((sceneId,index)=>({
    sceneId,anchor:[index*3,1,0],variant:index%4,orientation:walls.has(sceneId)?2:0
  }));
  const backing=new Set(layout.filter(o=>walls.has(o.sceneId)).flatMap(({anchor:[x,y,z]})=>
    [[x,y,z+1].join(','),[x,y+1,z+1].join(',')]));
  const scene=createCandidateScene(179,'legacy',layout,{
    storage:{getItem:()=>null},blockAt:(x,y,z)=>y===0||backing.has([x,y,z].join(',')),voxelPick:()=>null
  });
  assert.equal(scene.visible().length,10);
  for(const placement of layout.filter(o=>walls.has(o.sceneId)))
    assert.match(describeCandidateObject(179,placement).instanceKey,/:r2$/);
});
