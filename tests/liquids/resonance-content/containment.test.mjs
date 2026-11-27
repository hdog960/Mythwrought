import test from 'node:test';
import assert from 'node:assert/strict';
import {planResonanceContainment as plan,revalidateResonanceContainment as valid} from '../../../src/liquids/liquid-resonance/content/containment.mjs';
const inspect=()=>({loaded:true,empty:true,permitted:true,owner:'chunk-a',generation:'g1'});
const opts={origin:[0,0,0],inspect};
const key=p=>[p.x,p.y,p.z].join(',');
const xyz=(x,y,z)=>({x,y,z});
test('physical twin basin and connecting channel have closed floors and cardinal rims',()=>{
  const p=plan(opts),wet=new Set(p.interior.map(key)),solid=new Set(p.edits.map(key));
  assert.equal(wet.size,21);assert.equal(solid.size,p.edits.length);
  for(const c of p.interior){
    assert(!solid.has(key(c)));assert(solid.has(key(xyz(c.x,c.y-1,c.z))));
    for(const [dx,dz] of [[1,0],[0,1],[-1,0],[0,-1]]){
      const k=key(xyz(c.x+dx,c.y,c.z+dz));assert(wet.has(k)||solid.has(k));
    }
  }
  for(let x=-4;x<=4;x++)assert(wet.has(key(xyz(x,0,0))));
  for(const c of p.edits.filter(c=>c.y===0))assert(solid.has(key(xyz(c.x,-1,c.z))));
  assert.equal(p.edits.filter(c=>c.material==='resonance-containment-keystone').length,2);
  assert.equal(p.deposits.length,0);assert.equal(p.expectedStore,null);
  assert(Object.isFrozen(p)&&Object.isFrozen(p.edits)&&Object.isFrozen(p.edits[0]));
});
test('all four rotations preserve geometry and support negative and upper height',()=>{
  const base=plan(opts);
  for(let rotation=0;rotation<4;rotation++){
    const p=plan({...opts,origin:[-999,256,999],rotation});
    assert.equal(p.edits.length,base.edits.length);assert.equal(p.interior.length,21);
    assert(p.edits.every(c=>c.y===255||c.y===256));
    assert.equal(new Set([...p.edits,...p.interior].map(key)).size,p.edits.length+21);
  }
  assert(plan({...opts,origin:[0,-209,0]}).edits.some(c=>c.y===-210));
  assert.throws(()=>plan({...opts,origin:[0,-210,0]}));
  assert.throws(()=>plan({...opts,origin:[0,257,0]}));
  assert.equal(plan({...opts,origin:[Number.MAX_SAFE_INTEGER,0,0]}),null);
});
test('budget rejection is bounded and occurs before terrain inspection',()=>{
  let calls=0;assert.equal(plan({...opts,maxCells:10,inspect:()=>{calls++;return inspect();}}),null);
  assert.equal(calls,0);
  const p=plan({...opts,inspect:()=>{calls++;return inspect();}});
  assert.equal(calls,p.edits.length+p.interior.length);assert(calls<=128);
});
test('every physical position must be empty, loaded and explicitly permitted',()=>{
  for(const field of ['loaded','empty','permitted']){
    for(const kind of ['solid','interior']){
      assert.equal(plan({...opts,inspect:p=>({...inspect(),[field]:p.kind!==kind})}),null);
    }
  }
  assert.equal(plan({...opts,inspect:()=>({...inspect(),generation:''})}),null);
});
test('changed owner, generation, edit or permission invalidates a previously valid plan',()=>{
  const p=plan(opts);assert(valid(p,opts));
  for(const field of ['owner','generation'])assert(!valid(p,{...opts,inspect:c=>({...inspect(),[field]:c.x===0?'changed':inspect()[field]})}));
  assert(!valid(p,{...opts,inspect:()=>({...inspect(),permitted:false})}));
  assert(!valid({...p,edits:p.edits.slice(1)},opts));
});
test('wet placement refuses absent physics or absent finite store',()=>{
  assert.equal(plan({...opts,fill:4}),null);
  assert.equal(plan({...opts,fill:4,physics:{RESONANCE_ID:'water'}}),null);
  assert.throws(()=>plan({...opts,fill:9}));
});
