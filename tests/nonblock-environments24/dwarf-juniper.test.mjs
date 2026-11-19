import test from 'node:test';
import assert from 'node:assert/strict';
import {makeDwarfJuniper,validateDwarfJuniper} from '../../src/nonblock-environments24/dwarf-juniper.mjs';
test('four distinct deterministic shaped juniper variants with bounded triangles',()=>{
 const ids=new Set();
 for(let variant=0;variant<4;variant++){
  const a=makeDwarfJuniper({seed:179,anchor:[12,80,14],variant}),b=makeDwarfJuniper({seed:179,anchor:[12,80,14],variant});
  assert.deepEqual(a,b);assert.equal(validateDwarfJuniper(a),true);ids.add(a.instanceKey);
  assert.ok(a.mesh.triangleCount>30&&a.mesh.triangleCount<=160);
  assert.equal(a.mesh.positions.length,a.mesh.triangleCount*9);
  for(const p of a.mesh.positions)assert.ok(Number.isFinite(p));
  const bounds=a.selectionAabbs[0];
  for(let i=0;i<a.mesh.positions.length;i+=3)for(let k=0;k<3;k++){
   assert.ok(a.mesh.positions[i+k]>=bounds.min[k]-1e-9);
   assert.ok(a.mesh.positions[i+k]<=bounds.max[k]+1e-9);
  }
 }
 assert.equal(ids.size,4);
});
test('identity and removal contract are stable and anchored',()=>{
 const a=makeDwarfJuniper({seed:2,anchor:[1,2,3]});
 assert.notEqual(a.instanceKey,makeDwarfJuniper({seed:3,anchor:[1,2,3]}).instanceKey);
 assert.equal(a.breakIntent.targetKey,a.persistence.key);
 assert.equal(a.spawn,'explicit-opt-in-only');assert.equal(a.collisionIntent,'pass-through');
 assert.equal(a.attachment.supportOffset[1],-1);
});
test('reject malformed identities and forged canonical descriptors',()=>{
 for(const args of [{seed:NaN,anchor:[0,0,0]},{seed:1,anchor:[1.5,0,0]},{seed:1,anchor:[0,0,0],variant:4}])
  assert.throws(()=>makeDwarfJuniper(args),TypeError);
 const a=makeDwarfJuniper({seed:1,anchor:[0,0,0]});
 assert.throws(()=>validateDwarfJuniper({...a,breakIntent:{action:'none'}}),/noncanonical/);
 assert.throws(()=>validateDwarfJuniper({...a,mesh:{...a.mesh,positions:[]}}),/noncanonical/);
});
