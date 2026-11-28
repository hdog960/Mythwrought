import test from 'node:test';
import assert from 'node:assert/strict';
import {createSapRetentionPolicy} from '../../../src/liquids/amber-sap/physics/retention.mjs';

const cell=(units=8,x=0,y=0,z=0)=>Object.freeze({id:'amber-sap',x,y,z,units,quantities:Object.freeze({})});
const host=(opts={})=>({enabled:true,isLoaded:()=>true,isOpen:()=>true,isSolid:()=>false,isAdhesive:()=>true,...opts});
const solid=(...positions)=>{const keys=new Set(positions.map(p=>p.join(',')));return (...p)=>keys.has(p.join(','));};

test('disabled policy never consults terrain or changes eligible transfer',()=>{
  const fail=()=>{throw Error('unexpected read');};
  const p=createSapRetentionPolicy(host({enabled:false,isLoaded:fail,isOpen:fail,isSolid:fail,isAdhesive:fail}));
  assert.equal(p.limitTransfer(cell(4),3),3);assert.equal(p.limitTransfer(cell(4),8),4);
  assert.deepEqual(p.describe(cell(4)),{faces:[],reservedUnits:0,movableUnits:4});
});
test('side film retains one unit but releases the rest without creating a separate store',()=>{
  const p=createSapRetentionPolicy(host({isSolid:solid([1,0,0])}));
  assert.deepEqual(p.describe(cell(8)),{faces:['east'],reservedUnits:1,movableUnits:7});
  assert.equal(p.limitTransfer(cell(1),1),0);assert.equal(p.limitTransfer(cell(2),1),1);
  assert.equal(p.limitTransfer(cell(8),8),7);
});
test('ceiling reserve never applies to partial fill; full fill alone contacts top',()=>{
  const p=createSapRetentionPolicy(host({isSolid:solid([0,1,0]),topReserve:3}));
  for(let units=1;units<8;units++){assert.equal(p.limitTransfer(cell(units),8),units);assert.deepEqual(p.describe(cell(units)).faces,[]);}
  assert.equal(p.limitTransfer(cell(8),8),5);assert.deepEqual(p.describe(cell(8)).faces,['top']);
});
test('corner reserves take maximum rather than summing or multiplying volume',()=>{
  const p=createSapRetentionPolicy(host({isSolid:solid([0,-1,0],[1,0,0],[0,0,1],[0,1,0]),bottomReserve:2,sideReserve:3,topReserve:4}));
  assert.deepEqual(p.describe(cell(8)),{faces:['bottom','east','south','top'],reservedUnits:4,movableUnits:4});
  assert.equal(p.limitTransfer(cell(2),8),0);
});
test('support removal and material change release the reserve without state reset',()=>{
  let support=true,adhesive=true;
  const p=createSapRetentionPolicy(host({isSolid:x=>x===1&&support,isAdhesive:()=>adhesive}));
  const c=cell(1);assert.equal(p.limitTransfer(c,1),0);adhesive=false;assert.equal(p.limitTransfer(c,1),1);
  adhesive=true;support=false;assert.equal(p.limitTransfer(c,1),1);support=true;assert.equal(p.limitTransfer(c,1),0);
});
test('unloaded/blocked origins defer and unloaded faces are never queried as solids',()=>{
  let loaded=false,open=true,reads=0;
  const p=createSapRetentionPolicy(host({isLoaded:x=>x===0&&loaded,isOpen:()=>open,isSolid:x=>{assert.equal(x,0);reads++;return false;}}));
  assert.equal(p.limitTransfer(cell(),8),0);assert.equal(reads,0);
  loaded=true;open=false;assert.equal(p.describe(cell()),null);assert.equal(reads,0);
  open=true;assert.equal(p.limitTransfer(cell(),8),8);assert.equal(reads,4);
});
test('physical height and safe integer edges do not query nonexistent neighbors',()=>{
  const p=createSapRetentionPolicy(host({isSolid:(x,y,z)=>{assert.ok(Number.isSafeInteger(x)&&Number.isSafeInteger(z)&&y>=-210&&y<=256);return true;}}));
  assert.deepEqual(p.describe(cell(8,0,256,0)).faces,['bottom','east','south','west','north']);
  assert.deepEqual(p.describe(cell(8,Number.MAX_SAFE_INTEGER,-210,0)).faces,['south','west','north','top']);
});
test('nonliteral host truth and invalid policies fail closed',()=>{
  const p=createSapRetentionPolicy(host({isSolid:()=>1}));assert.equal(p.limitTransfer(cell(),8),8);
  assert.throws(()=>createSapRetentionPolicy(host({sideReserve:9})),RangeError);
  assert.throws(()=>createSapRetentionPolicy(host({isAdhesive:null})),TypeError);
  assert.throws(()=>p.limitTransfer({...cell(),id:'water'},1),TypeError);
  assert.throws(()=>p.limitTransfer(cell(),-1),RangeError);
  assert.throws(()=>p.limitTransfer(cell(0),1),TypeError);
});
test('integer transfer limits are conservative for every fill, reserve and request',()=>{
  for(let reserve=0;reserve<=8;reserve++){
    const p=createSapRetentionPolicy(host({sideReserve:reserve,isSolid:solid([1,0,0])}));
    for(let units=1;units<=8;units++)for(let n=0;n<=8;n++){
      const c=cell(units),before=JSON.stringify(c),m=p.limitTransfer(c,n);
      assert.equal(m,Math.min(n,Math.max(0,units-reserve)));
      assert.equal(m+(units-m),units);assert.equal(JSON.stringify(c),before);
    }
  }
});
test('bottom reserve defaults to zero and may be explicitly configured',()=>{
  const opts=host({isSolid:solid([0,-1,0])});
  assert.equal(createSapRetentionPolicy(opts).limitTransfer(cell(2),8),2);
  const p=createSapRetentionPolicy({...opts,bottomReserve:1});
  assert.equal(p.limitTransfer(cell(2),8),1);assert.ok(Object.isFrozen(p.policy));
  assert.ok(Object.isFrozen(p.describe(cell(2)).faces));
});
