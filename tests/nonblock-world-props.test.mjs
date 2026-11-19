import assert from 'node:assert/strict';
import test from 'node:test';
import {createWorldProp,WORLD_PROP_IDS} from '../src/nonblock-fittings36/world-props.mjs';

test('new fitting and prop emit distinct finite source geometry with deterministic variants',()=>{
  assert.equal(WORLD_PROP_IDS.length,7);
  const unique=new Set();
  for(const id of WORLD_PROP_IDS){
    for(const variant of [0,1,2,3]){
      const options={seed:107,anchor:[1,9,20],variant};
      const prop=createWorldProp(id,options);
      assert.deepEqual(prop,createWorldProp(id,options));
      const {positions,triangleCount,materials}=prop.mesh;
      assert.ok(triangleCount>=20&&triangleCount<=256,id);
      assert.equal(positions.length,triangleCount*9,id);
      assert.equal(materials.length,triangleCount,id);
      assert.ok(positions.every(Number.isFinite),id);
      assert.ok(materials.every(value=>value<prop.palette.length),id);
      for(let offset=0;offset<positions.length;offset+=9){
        const [a,b,c,d,e,f,g,h,i]=positions.slice(offset,offset+9);
        const u=[d-a,e-b,f-c],v=[g-a,h-b,i-c];
        assert.ok(Math.hypot(u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0])>1e-7,id);
      }
      unique.add(positions.join());
    }
  }
  assert.equal(unique.size,WORLD_PROP_IDS.length*4);
});

test('ladder assemblies distinguish rigid wall holds from the ceiling-mounted rope ladder',()=>{
  const options={seed:1,anchor:[0,4,0],variant:2};
  const wall=createWorldProp('scene36:ladder-assembly',options);
  const rope=createWorldProp('scene36:rope-ladder',options);
  assert.equal(wall.attachment,'wall');
  assert.equal(rope.attachment,'ceiling');
  assert.equal(wall.climbable,true);
  assert.equal(rope.climbable,true);
  assert.throws(()=>createWorldProp('scene36:hanging-bell',{...options,variant:4}));
});
