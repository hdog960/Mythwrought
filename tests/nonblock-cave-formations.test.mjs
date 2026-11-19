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
