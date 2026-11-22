// Focused OFFLINE source-contract tests for the isolated C6 candidate planner.
// These do not claim live WebGL2, cave screenshot, iPhone or release acceptance.
import test from 'node:test';
import assert from 'node:assert/strict';
import { affectedFarSourceKeys, planFarWallEditRetention, FAR_RETENTION_LIMITS } from './far-buffer-retention.mjs';

// Import the ACTUAL exact-main source contracts from src/, not reimplemented
// seam/coordinate logic. The local sandbox has byte-for-byte originals:
// git blob chunks.mjs e35a3fe7bdea34a8fad4eaa0c58aee4969aa86ad
// git blob depth.mjs b54b7fd8c422699a328b60135178f97508e277c8
import {editAffectedChunks} from '../../src/chunks.mjs';
import {verticalEditSections,depthMeshKey} from '../../src/depth.mjs';
const deps = {editAffectedChunks, verticalEditSections, depthMeshKey};
const edited = (x, y, z) => affectedFarSourceKeys({x, y, z}, deps);
const source = (cx, cz, section, extras = {}) => ({key: depthMeshKey(cx, cz, section), cx, cz, section, ...extras});
const A = source(2, 0, -5), B = source(3, 0, -5), C = source(4, 0, -5), D = source(5, 0, -5);
const selected = [A, B, C, D];
const residents = selected.map((p, i) => ({key: p.key, bytes: (i + 1) * 1000}));
const plan = (overrides = {}) => planFarWallEditRetention({
  beforeSelected: selected, afterSelected: selected, resident: residents,
  affectedKeys: edited(1, -78, 1), nearReady: true, depthMeshKey, ...overrides
});

// Physical dependencies are conservative and seam aware.
test('interior changes affect only the current source section', () => {
  assert.deepEqual([...edited(1, -78, 1)], ['0,0,-5']);
});
test('vertical seams rebuild both touched real source sections', () => {
  assert.deepEqual([...edited(1, -83, 1)].sort(), ['0,0,-5','0,0,-6']);
  assert.deepEqual([...edited(1, -84, 1)].sort(), ['0,0,-5','0,0,-6']);
  assert.deepEqual([...edited(1, -99, 1)].sort(), ['0,0,-6','0,0,-7']);
  assert.deepEqual([...edited(1, -100, 1)].sort(), ['0,0,-6','0,0,-7']);
});
test('x and z exact seams include neighboring source chunks', () => {
  const s = edited(32,-78,16);
  for(const k of ['2,1,-5','1,1,-5','2,0,-5']) assert.ok(s.has(k));
  assert.equal(s.size,3);
});
test('negative horizontal seam extends to true previous chunk', () => {
  const s = edited(-16,-78,1);
  assert.deepEqual([...s].sort(), ['-1,0,-5','-2,0,-5']);
});
test('non-integer edits fail closed rather than fabricating dependencies', () => {
  assert.throws(() => edited(1.5,-78,1), /INVALID_EDIT/);
  assert.throws(() => affectedFarSourceKeys({x:1,y:-78,z:1},{}), /INVALID_EDIT/);
});
test('current identical plan retains all unaffected resident buffers', () => {
  const p=plan();assert.equal(p.mode,'retain-all');
  assert.deepEqual(p.retainKeys,selected.map(x=>x.key));
  assert.deepEqual(p.releaseKeys,[]);assert.equal(p.requiresFreshSourceRayPlan,true);
});
test('edit of last resident source retains first three in original draw order', () => {
  const p=plan({affectedKeys:edited(81,-78,1)});
  assert.equal(p.mode,'retain-prefix');assert.deepEqual(p.retainKeys,[A.key,B.key,C.key]);
  assert.deepEqual(p.releaseKeys,[D.key]);
});
test('edit of middle resident source evicts it and later residents', () => {
  const p=plan({affectedKeys:edited(49,-78,1)});
  assert.equal(p.mode,'retain-prefix');assert.deepEqual(p.retainKeys,[A.key]);
  assert.deepEqual(p.releaseKeys,[B.key,C.key,D.key]);
});
test('edit of first source invalidates all to preserve re-upload order', () => {
  const p=plan({affectedKeys:edited(32,-78,1)});
  assert.equal(p.mode,'invalidate-all');assert.deepEqual(p.releaseKeys,selected.map(x=>x.key));
});
test('touching joined companion invalidates its owner and later buffers', () => {
  const x=source(2,0,-5,{companion:source(2,0,-6)});
  const before=[x,B,C,D];const p=plan({beforeSelected:before,afterSelected:before,
   affectedKeys:edited(32,-83,1)});
  assert.equal(p.mode,'invalidate-all');
});
test('touching seam companion retains only preceding unmodified owners', () => {
  const x=source(3,0,-5,{seamCompanion:source(3,0,-6)});
  const before=[A,x,C,D];const p=plan({beforeSelected:before,afterSelected:before,
   affectedKeys:edited(49,-83,1)});
  assert.equal(p.mode,'retain-prefix');assert.deepEqual(p.retainKeys,[A.key]);
});
test('touching wide witness source invalidates the matching owner and suffix', () => {
  const x=source(4,0,-5,{wideWitnessCompanion:source(4,0,-6)});
  const before=[A,B,x,D];const p=plan({beforeSelected:before,afterSelected:before,
   affectedKeys:edited(65,-83,1)});
  assert.deepEqual(p.retainKeys,[A.key,B.key]);assert.deepEqual(p.releaseKeys,[C.key,D.key]);
});
test('source-ray selection changes always invalidate every original resident', () => {
  const changed=[A,C,B,D];
  const p=plan({afterSelected:changed});
  assert.equal(p.mode,'invalidate-all');assert.match(p.reason,/ray-plan/);
});
test('new or removed source companions invalidate all buffers', () => {
  const changed=[source(2,0,-5,{companion:source(2,0,-6)}),B,C,D];
  assert.equal(plan({afterSelected:changed}).mode,'invalidate-all');
});
test('new source plan with identical source geometries permits retention even if ray rank changes', () => {
  const changed=selected.map((x,i)=>({...x,hits:10+i,nearest:i+1,source:[i,-79,1]}));
  assert.equal(plan({afterSelected:changed}).mode,'retain-all');
});
test('missing ray plan fails closed and refuses retention', () => {
  const p=plan({afterSelected:null});assert.equal(p.mode,'invalidate-all');
  assert.equal(p.safeForIntegration,false);assert.equal(p.requiresFreshSourceRayPlan,true);
});
test('near stream incomplete forces all far buffers to be released', () => {
  const p=plan({nearReady:false});assert.equal(p.mode,'invalidate-all');
  assert.match(p.reason,/near-mesh/);
});
test('old live Map order not prefix of selected ray plan invalidates all', () => {
  assert.equal(plan({resident:[residents[1],residents[0]]}).mode,'invalidate-all');
});
test('interrupted/partial resident prefix remains resumable without extra GL calls', () => {
  const p=plan({resident:residents.slice(0,2)});
  assert.equal(p.mode,'retain-all');assert.deepEqual(p.retainKeys,[A.key,B.key]);
});
test('invalid resident budget fails closed', () => {
  assert.equal(plan({resident:[{key:A.key,bytes:FAR_RETENTION_LIMITS.maxBytes+1}]}).mode,'invalidate-all');
});
test('overlarge plan, duplicate keys and malformed companion all fail closed', () => {
  assert.equal(plan({afterSelected:[...selected,source(6,0,-5)]}).mode,'invalidate-all');
  assert.equal(plan({afterSelected:[A,A,C,D]}).mode,'invalidate-all');
  assert.equal(plan({afterSelected:[source(2,0,-5,{companion:{key:'bad'}}),B,C,D]}).mode,'invalidate-all');
});
test('duplicate within original descriptor fails closed', () => {
  const invalid=[source(2,0,-5,{companion:source(2,0,-5)}),B,C,D];
  assert.equal(plan({beforeSelected:invalid,afterSelected:invalid}).mode,'invalidate-all');
});
test('not a WebGL executable path: planner never touches GPU, shaders, saves or fault queues', () => {
  const fakeGl={getError(){throw Error('should never be called')},deleteBuffer(){throw Error('should never be called')}};
  const p=plan({gl:fakeGl});assert.equal(p.noWebGLCallExecuted,true);
  assert.equal(p.safeForIntegration,false);
});
test('bounded deterministic property: retained residents are always original prefix and untouched', () => {
  for(let mask=0;mask<16;mask++){
   const keys=new Set(selected.filter((_,i)=>(mask>>i)&1).map(x=>x.key));
   const p=plan({affectedKeys:keys});
   const expected=selected.findIndex(x=>keys.has(x.key));
   const end=expected===-1?4:expected;
   assert.deepEqual(p.retainKeys,selected.slice(0,end).map(x=>x.key));
   assert.deepEqual(p.releaseKeys,selected.slice(end).map(x=>x.key));
  }
});

test('outside original world bounds is rejected instead of trusting an empty affected set', () => {
  for(const y of [-211,20])
   assert.throws(() => edited(1,y,1), /INVALID_SOURCE_SEAM_PLAN/);
});
test('malformed source key whose coordinates disagree with original engine fails closed', () => {
  const bad=[{...A,key:'not-the-original-key'},B,C,D];
  assert.equal(plan({beforeSelected:bad,afterSelected:bad}).mode,'invalidate-all');
});
test('all cache safety logic uses exactly the original source bounds and never expands GPU capacity', () => {
  assert.deepEqual(FAR_RETENTION_LIMITS,{maxChunks:4,maxBytes:1048576});
  assert.equal(plan({maxChunks:5}).mode,'invalidate-all');
  assert.equal(plan({maxBytes:1048577}).mode,'invalidate-all');
});

test('invalid source vertical section is rejected without escaping a WebGL draw', () => {
  const bad=[{...A,section:1,key:'2,0,1'},B,C,D];
  assert.equal(plan({beforeSelected:bad,afterSelected:bad}).mode,'invalidate-all');
});
test('any unsupported original selected source shape fails without an exception', () => {
  const bad=[{key:A.key,cx:A.cx,cz:A.cz,section:A.section,companion:[]},B,C,D];
  assert.equal(plan({beforeSelected:bad,afterSelected:bad}).mode,'invalidate-all');
});
