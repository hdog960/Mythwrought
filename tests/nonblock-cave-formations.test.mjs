import assert from 'node:assert/strict';
import test from 'node:test';
import {createCaveFormation} from '../src/nonblock-environments24/cave-formations.mjs';

const forms=[
  ['nonblock:e:giant-stalagmite-spire','ground'],
  ['nonblock:e:clustered-dripstone','ceiling'],
  ['nonblock:e:limestone-cave-column','span'],
  ['nonblock:e:flowstone-curtain','ceiling']
];
test('four authored cave shapes are distinct and use the full deterministic eight-variant range',()=>{
  const sourceOptions={seed:179,anchor:[3,4,5]};
  const distinct=new Set();
  for(const [id,attachment] of forms){
    const variants=new Set();
    for(let variant=0;variant<=7;variant++){
      const options={...sourceOptions,variant};
      const form=createCaveFormation(id,options);
      assert.deepEqual(form,createCaveFormation(id,options));
      assert.equal(form.attachment,attachment);
      assert.equal(form.sceneId,id);
      assert.ok(form.mesh.triangleCount>=24 && form.mesh.triangleCount<=256,id);
      const p=form.mesh.positions;
      for(let i=0;i<p.length;i+=9){
        const ab=[0,1,2].map(k=>p[i+3+k]-p[i+k]);
        const ac=[0,1,2].map(k=>p[i+6+k]-p[i+k]);
        const area=Math.hypot(ab[1]*ac[2]-ab[2]*ac[1],ab[2]*ac[0]-ab[0]*ac[2],ab[0]*ac[1]-ab[1]*ac[0]);
        assert.ok(area>1e-7,id+' degenerate triangle');
      }
      variants.add(p.join());
      distinct.add(p.join());
    }
    assert.equal(variants.size,8);
  }
  assert.equal(distinct.size,32);
});

test('solid profiles follow the footprint and reject invalid scene identity',()=>{
  const options={seed:179,anchor:[3,4,5],variant:1};
  const spire=createCaveFormation(forms[0][0],options);
  const column=createCaveFormation(forms[2][0],options);
  assert.equal(spire.collision,'solid');
  assert.equal(column.collision,'solid');
  assert.ok(spire.colliders[0][3]-spire.colliders[0][0]>spire.colliders.at(-1)[3]-spire.colliders.at(-1)[0]);
  assert.equal(column.colliders.at(-1)[4],3);
  assert.equal(Math.max(...column.mesh.positions.filter((_,i)=>i%3===1)),3);
  assert.throws(()=>createCaveFormation(forms[0][0],{...options,variant:8}));
  assert.throws(()=>createCaveFormation('__proto__',options));
});

test('cave stage admits floor, ceiling and spanning mounts and removes solid collision on mining',async()=>{
  const {createCandidateScene}=await import('../src/nonblock/candidate-scene.mjs');
  const {collides}=await import('../src/voxel.mjs');
  const layout=forms.map(([sceneId,attachment],i)=>({
    sceneId,variant:7,anchor:[i*3,attachment==='ceiling'?3:1,0]
  }));
  const records=new Map();
  const storage={
    getItem:key=>records.get(key)??null,
    setItem:(key,value)=>records.set(key,value),
    removeItem:key=>records.delete(key)
  };
  const cells=new Set(['0,0,0','3,4,0','6,0,0','6,4,0','9,4,0']);
  const blockAt=(...p)=>Number(cells.has(p.join(',')));
  const deps={storage,blockAt,voxelPick:()=>null};
  const scene=createCandidateScene(179,'legacy',layout,deps);
  assert.equal(scene.visible().length,4);
  const world={get:blockAt,stagedNonblockCollision:scene.bodyIntersects};
  assert.equal(collides(world,.5,1,.5),true);
  assert.equal(collides(world,6.5,1,.5),true);
  assert.equal(collides(world,3.5,2,.5),false);
  cells.delete('6,4,0');
  assert.equal(collides(world,6.5,1,.5),false);
  assert.equal(scene.visible().length,3);
  const eye=[.5,1.28,-1.5], direction=[0,0,1];
  const hit=scene.pick(eye,direction);
  assert.equal(hit?.sceneId,forms[0][0]);
  assert.equal(scene.breakHit(hit,eye,direction),true);
  const key='mythwrought:nonblock-stage:v1:legacy:179';
  assert.equal(storage.getItem(key),storage.getItem(key+':previous-good'));
  assert.equal(collides(world,.5,1,.5),false);
  assert.equal(createCandidateScene(179,'legacy',layout,deps).visible().some(
    item=>item.instanceKey===hit.instanceKey),false);
});
