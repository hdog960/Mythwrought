import test from 'node:test';
import assert from 'node:assert/strict';
import {certifyMountainV8Seam as certify} from '../src/manual-biomes/mountain-v8-seam-certificate.mjs';
const create=(height=(x,z)=>12)=>((x,z,seed)=>({x,z,seed,top:height(x,z),legacyTop:5,
  cap:'slate',biome:'mountain',safeToIntegrate:false,
  generatorIdentityRequired:'v8-new-opt-in'}));
test('five source samples establish connected physical near slopes with strict count',()=>{
  let calls=0;const p=certify(-512,15,179,(x,z,s)=>{calls++;return create()(x,z,s)});
  assert.equal(p.checks,5);assert.equal(calls,5);assert.equal(p.greatestStep,0);
  assert.deepEqual(p.neighbors.map(a=>[a.x,a.z]),[[-511,15],[-513,15],[-512,16],[-512,14]]);
});
test('rejects steep cliff faces without modifying any source or proposing filler',()=>{
  assert.equal(certify(0,0,179,create((x,z)=>x===1?15:12)),null);
  assert.ok(certify(0,0,179,create((x,z)=>x===1?14:12)));
  assert.equal(certify(0,0,179,create(),{maxStep:3}),null);
});
test('source cave and foreign biome veto atomically',()=>{
  assert.equal(certify(0,0,179,(x,z,s)=>x===1?null:create()(x,z,s)),null);
  assert.equal(certify(0,0,179,(x,z,s)=>({...create()(x,z,s),biome:x===-1?'snow':'mountain'})),null);
  assert.equal(certify(0,0,179,(x,z,s)=>({...create()(x,z,s),safeToIntegrate:x===1})),null);
});
test('chunk edges and negative-coordinate seams are independent of traversal',()=>{
  const read=create((x,z)=>12+Math.floor(x/32)*0);
  assert.deepEqual(certify(-16,-1,2026,read),certify(-16,-1,2026,read));
  assert.ok(certify(15,0,2026,read));assert.ok(certify(16,0,2026,read));
});
test('malformed and adversarial source callbacks fail closed',()=>{
  assert.equal(certify(NaN,0,179,create()),null);
  assert.equal(certify(0,0,179.5,create()),null);
  assert.equal(certify(0,0,179,null),null);
  assert.equal(certify(Number.MAX_SAFE_INTEGER,0,179,create()),null);
  assert.equal(certify(0,0,179,(x,z,s)=>({...create()(x,z,s),top:NaN})),null);
});

test('five adjacent sources each require genuine bounded physical support',()=>{
  const read=create();
  let calls=0;
  const physical=p=>{
    calls++;
    return {x:p.x,z:p.z,legacyTop:p.legacyTop,top:p.top,cap:p.cap,
      estimatedCells:p.top-p.legacyTop+1,
      writes:Array.from({length:p.top-p.legacyTop+1},(_,i)=>({
        x:p.x,y:p.legacyTop+i,z:p.z,
        material:p.legacyTop+i===p.top?p.cap:'stone'
      })),
      safeToIntegrate:false,requiresApprovedV8BlockMapping:true};
  };
  const certified=certify(-16,15,179,read,{readSupport:physical});
  assert.ok(certified);
  assert.equal(calls,5);
  assert.equal(certified.physicallyVerified,true);
  assert.equal(certified.verifiedCells,40);
  assert.equal(certify(-16,15,179,read,{readSupport:p=>
    p.x===-15?null:physical(p)}),null);
});
test('malformed or unbounded physical columns cannot certify mountain seams',()=>{
  const original=create(),physical=p=>({
    x:p.x,z:p.z,legacyTop:p.legacyTop,top:p.top,cap:p.cap,
    estimatedCells:p.top-p.legacyTop+1,
    writes:Array.from({length:p.top-p.legacyTop+1},(_,i)=>({
      x:p.x,y:p.legacyTop+i,z:p.z,material:p.legacyTop+i===p.top?p.cap:'stone'
    })),
    safeToIntegrate:false,requiresApprovedV8BlockMapping:true
  });
  for(const broken of [
    p=>({...physical(p),estimatedCells:19}),
    p=>({...physical(p),writes:[]}),
    p=>({...physical(p),safeToIntegrate:true}),
    p=>({...physical(p),writes:[{x:p.x,y:6,z:p.z,material:'stone'}]}),
    p=>({...physical(p),requiresApprovedV8BlockMapping:false})
  ])assert.equal(certify(0,0,179,original,{readSupport:broken}),null);
});

test('rejects forged cap, missing uplift and exposed wrong subsurface material',()=>{
  const proposal=create();
  const good=p=>({x:p.x,z:p.z,top:p.top,cap:p.cap,legacyTop:p.legacyTop,
    estimatedCells:p.top-p.legacyTop+1,
    writes:Array.from({length:p.top-p.legacyTop+1},(_,i)=>({
      x:p.x,y:p.legacyTop+i,z:p.z,
      material:p.legacyTop+i===p.top?p.cap:'stone'})),
    safeToIntegrate:false,requiresApprovedV8BlockMapping:true});
  assert.ok(certify(0,0,179,proposal,{readSupport:good}));
  for(const altered of [
    p=>({...good(p),cap:'snow'}),
    p=>({...good(p),legacyTop:6}),
    p=>({...good(p),writes:good(p).writes.map((w,i)=>i===0?{...w,material:'dirt'}:w)}),
    p=>({...good(p),estimatedCells:7}),
  ])assert.equal(certify(0,0,179,proposal,{readSupport:altered}),null);
});


test('exact physical V8 cliff-face descriptors preserve direction and strata',()=>{
  const source=(x,z,seed)=>({x,z,seed,legacyTop:5,top:x===1?14:12,
    cap:x===1?'alpine-grass':'slate',biome:'mountain',
    safeToIntegrate:false,generatorIdentityRequired:'v8-new-opt-in'});
  const support=p=>({x:p.x,z:p.z,legacyTop:p.legacyTop,top:p.top,cap:p.cap,
    estimatedCells:p.top-p.legacyTop+1,
    writes:Array.from({length:p.top-p.legacyTop+1},(_,i)=>({
      x:p.x,z:p.z,y:p.legacyTop+i,
      material:p.legacyTop+i===p.top?p.cap:
        p.cap==='alpine-grass'&&p.legacyTop+i>=p.top-2?'dirt':'stone'
    })),safeToIntegrate:false,requiresApprovedV8BlockMapping:true});
  const certificate=certify(0,0,179,source,{readSupport:support});
  assert.ok(certificate);
  assert.equal(certificate.greatestStep,2);
  assert.equal(certificate.exposedFaces.length,2);
  assert.deepEqual(certificate.exposedFaces.map(v=>[v.x,v.y,v.z,v.toward,v.material]),[
    [1,13,0,[-1,0],'dirt'],[1,14,0,[-1,0],'alpine-grass']
  ]);
});
test('exposed face provenance refuses a high column without physical cells at contact',()=>{
  const source=(x,z,seed)=>({x,z,seed,legacyTop:x===1?14:5,top:x===1?14:12,
    cap:'slate',biome:'mountain',safeToIntegrate:false,
    generatorIdentityRequired:'v8-new-opt-in'});
  const support=p=>({x:p.x,z:p.z,legacyTop:p.legacyTop,top:p.top,cap:p.cap,
    estimatedCells:p.top-p.legacyTop+1,
    writes:Array.from({length:p.top-p.legacyTop+1},(_,i)=>({
      x:p.x,z:p.z,y:p.legacyTop+i,material:p.legacyTop+i===p.top?'slate':'stone'
    })),safeToIntegrate:false,requiresApprovedV8BlockMapping:true});
  assert.equal(certify(0,0,179,source,{readSupport:support}),null);
});

test('seam veto observer identifies exactly one missing source, unsafe face and steep step',()=>{
  const read=create();
  const report=(f,options={})=>{
    const observed=[];
    const result=certify(0,0,179,f,{...options,onVeto:issue=>observed.push(issue)});
    return {result,observed};
  };
  const missing=report((x,z,s)=>x===1?null:read(x,z,s));
  assert.equal(missing.result,null);
  assert.deepEqual(missing.observed,[{reason:'source-unavailable',x:1,z:0}]);
  const steep=report(create((x,z)=>x===1?15:12));
  assert.equal(steep.result,null);
  assert.deepEqual(steep.observed,[{reason:'too-steep',x:0,z:0}]);
  const noPhysical=report(read,{readSupport:p=>p.x===1?null:{
    x:p.x,z:p.z,top:p.top,legacyTop:p.legacyTop,cap:p.cap,
    estimatedCells:p.top-p.legacyTop+1,
    writes:Array.from({length:p.top-p.legacyTop+1},(_,i)=>({
      x:p.x,z:p.z,y:p.legacyTop+i,
      material:i===p.top-p.legacyTop?p.cap:'stone'
    })),safeToIntegrate:false,requiresApprovedV8BlockMapping:true
  }});
  assert.equal(noPhysical.result,null);
  assert.deepEqual(noPhysical.observed,[{reason:'no-physical-support',x:1,z:0}]);
  const good=report(read);
  assert.ok(good.result);
  assert.deepEqual(good.observed,[]);
  assert.equal(certify(0,0,179,read,{onVeto:123}),null);
});
