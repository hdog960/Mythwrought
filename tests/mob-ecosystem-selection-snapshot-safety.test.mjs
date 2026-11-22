import test from 'node:test';
import assert from 'node:assert/strict';
import {previewSourceEcologyRegion} from '../src/mobs/ecosystem-selection-preview.mjs';
const stable=()=>({cx:0,cz:0,section:0,feet:4});
const validate=r=>[r?.cx,r?.cz,r?.section].every(Number.isSafeInteger)&&
  Math.abs(r.cx)<2**22&&Math.abs(r.cz)<2**22&&
  r.section===0&&r.feet===4;
const select=(region,records=[],isValidRegion=validate)=>
  previewSourceEcologyRegion({regions:[region],cursor:0,records,
    time:.5,isValidRegion});

test('changing chunk getter cannot validate one chunk but return another',()=>{
  let reads=0;
  const region={get cx(){return ++reads===1?0:1},cz:0,section:0,feet:4};
  assert.throws(()=>select(region),/Original source region changed during selection/);
  assert.equal(reads,2);
});
test('previous four-read periodic getter cannot split source key and region',()=>{
  let reads=0;
  const region={get cx(){return (++reads%4)===0?1:0},cz:0,section:0,feet:4};
  const p=select(region);
  assert.equal(p.key,'0,0,0');
  assert.equal(p.region.cx,0);
  assert.equal(p.key,[p.region.cx,p.region.cz,p.region.section].join(','));
  assert.equal(reads,3,'reuses a single captured source region');
});
test('changing feet getter cannot validate another physical height',()=>{
  let reads=0;
  const region={cx:0,cz:0,section:0,get feet(){return ++reads===1?4:999}};
  assert.throws(()=>select(region),/Original source region changed during selection/);
});
test('selection protects source-region identity across stale-ledger callbacks',()=>{
  const region=stable();
  const records=Array.from({length:64},(_,i)=>[`${i+1},0,0`,{next:100}]);
  Object.defineProperty(records[0][1],'next',{get(){region.cx=1;return 0}});
  assert.throws(()=>select(region,records),/Original source region changed during selection/);
});
test('selection refuses changed inputs even on capacity rejection',()=>{
  const region=stable();
  const records=Array.from({length:64},(_,i)=>[`${i+1},0,0`,{next:100}]);
  Object.defineProperty(records[0][1],'next',{get(){region.feet=12;return 100}});
  assert.throws(()=>select(region,records),/Original source region changed during selection/);
});
test('validator cannot mutate caller-owned region after frozen capture',()=>{
  const region=stable();
  assert.throws(()=>select(region,[],r=>{
    region.cz=5; return validate(r);
  }),/Original source region changed during selection/);
});
test('normal selection key and returned 4 fields are derived from same snapshot',()=>{
  const region=stable();
  let cxReads=0;
  Object.defineProperty(region,'cx',{get(){cxReads++;return 0}});
  const out=select(region);
  assert.equal(out.reason,'selected');
  assert.equal(out.key,[out.region.cx,out.region.cz,out.region.section].join(','));
  assert.deepEqual(out.region,{cx:0,cz:0,section:0,feet:4});
  assert.equal(cxReads,3,'one source capture and two consistency barriers');
  assert.ok(Object.isFrozen(out.region));
});
test('unverified original validator result remains a hard error',()=>{
  assert.throws(()=>select(stable(),[],()=>undefined),/Unverified original region validity/);
});
test('stable invalid and empty selections preserve original cursor semantics',()=>{
  const invalid=select({...stable(),section:-2});
  assert.equal(invalid.reason,'invalid-region');
  const empty=previewSourceEcologyRegion({regions:[],cursor:12,time:.5,records:[],isValidRegion:validate});
  assert.equal(empty.nextCursor,12);
  assert.equal(empty.reason,'empty');
});
