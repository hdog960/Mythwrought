import test from 'node:test';
import assert from 'node:assert/strict';
import {previewSourceEcologyRegion,SOURCE_ECOLOGY_MAX_REGIONS,
  SOURCE_ECOLOGY_REPLENISH_SECONDS}
  from '../src/mobs/ecosystem-selection-preview.mjs';
const loc=i=>({cx:i,cz:0,section:0,feet:4});
const valid=r=>r&&Number.isSafeInteger(r.cx)&&
  Number.isSafeInteger(r.cz)&&r.section===0&&r.feet===4;
const preview=(regions,cursor=0,records=[],time=.5)=>
  previewSourceEcologyRegion({regions,cursor,records,time,isValidRegion:valid});

test('source first 64 only: cursor wraps and ignores 65th candidate',()=>{
  assert.equal(SOURCE_ECOLOGY_MAX_REGIONS,64);
  assert.equal(SOURCE_ECOLOGY_REPLENISH_SECONDS,12);
  const regions=Array.from({length:65},(_,i)=>loc(i));
  for(const cursor of [0,16,63,64,127]){
    const p=preview(regions,cursor);
    assert.equal(p.key,(cursor%64)+',0,0');
    assert.equal(p.nextCursor,cursor+1);
  }
  assert.equal(preview(regions,64).key,'0,0,0');
});

test('source empty/invalid slots respect cursor without consuming clocks',()=>{
  const empty=preview([],7);
  assert.deepEqual(empty,{reason:'empty',nextCursor:7,key:null,
    region:null,record:null,evictKey:null});
  const invalid=preview([{...loc(3),section:-2}],7);
  assert.equal(invalid.reason,'invalid-region');
  assert.equal(invalid.nextCursor,8);
  assert.equal(Object.isFrozen(invalid),true);
});

test('known records are selected by key without reordering or eviction',()=>{
  const record=Object.freeze({next:100,serial:3});
  const records=[['1,0,0',{next:0}],['2,0,0',record]];
  const before=JSON.stringify(records);
  const out=preview([loc(2)],8,records,5);
  assert.equal(out.reason,'selected');
  assert.equal(out.record,record);
  assert.equal(out.evictKey,null);
  assert.equal(Object.isFrozen(out.region),true);
  assert.equal(JSON.stringify(records),before);
});

test('full source ledger evicts first stale record in insertion order',()=>{
  const records=Array.from({length:64},(_,i)=>[
    i+',0,0',Object.freeze({next:i===0?40:i===1?18:1})
  ]);
  const selected=preview([loc(90)],0,records,31);
  assert.equal(selected.reason,'selected');
  assert.equal(selected.evictKey,'1,0,0');
  assert.equal(records.length,64,'Preview cannot delete source records');
  assert.equal(records[0][0],'0,0,0');
});

test('full non-stale ledger refuses admission without minting record',()=>{
  const records=Array.from({length:64},(_,i)=>[
    i+',0,0',Object.freeze({next:100})
  ]);
  const out=preview([loc(90)],0,records,5);
  assert.equal(out.reason,'capacity');
  assert.equal(out.nextCursor,1);
  assert.equal(out.key,null);
  assert.equal(out.record,null);
});

test('preview never mutates caller region and is repeatable',()=>{
  const region=loc(10),regions=[region];
  const one=preview(regions),two=preview(regions);
  assert.deepEqual(one,two);
  assert.notEqual(one,two);
  region.feet=12;
  assert.equal(one.region.feet,4);
});

test('unverified validity, overflow, malformed source input fail closed',()=>{
  assert.throws(()=>previewSourceEcologyRegion({
    regions:[loc(1)],cursor:0,records:[],time:.5,
    isValidRegion:()=>undefined
  }),/Unverified/);
  assert.throws(()=>preview([loc(1)],Number.MAX_SAFE_INTEGER),/cursor overflow/);
  assert.throws(()=>preview([loc(1)],-1),/Invalid original regional/);
  assert.throws(()=>previewSourceEcologyRegion({
    regions:[loc(1)],cursor:0,records:[],time:NaN,isValidRegion:valid
  }),/Invalid original regional/);
  assert.throws(()=>preview([loc(1)],0,Array.from({length:65},()=>['a',{next:2}])),/Invalid original regional/);
});
