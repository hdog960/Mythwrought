import test from 'node:test';
import assert from 'node:assert/strict';
import {createUnderpassReaderCellCensus} from '../src/living-underworld/source-role-coordinate-census.mjs';
const roles=['naturalAt','authoredAt','editedAt','protectedAt'];
const p=(x,y,z)=>({x,y,z});
const fill=(c,stage,points)=>{for(const {x,y,z} of points)for(const role of roles)c.record(stage,role,x,y,z)};
const audit=(bridge,pad)=>{
 const c=createUnderpassReaderCellCensus();fill(c,'bridge',bridge);c.enterPad();fill(c,'pad',pad);
 return c.audit({bridgeCells:bridge.length,padCells:pad.length});
};
test('four original source roles cover identical coordinates in each stage without extra queries',()=>{
 const r=audit([p(1,-10,2),p(2,-10,2)],[p(2,-10,2),p(3,-10,2)]);
 assert.equal(r.ok,true);assert.equal(r.bridgeDistinctCells,2);assert.equal(r.padDistinctCells,2);
 assert.equal(r.bridgePadOverlapCells,1);assert.equal(r.combinedDistinctCells,3);
 assert.deepEqual(r.stageRoleDistinctCells.bridge,{naturalAt:2,authoredAt:2,editedAt:2,protectedAt:2});
 assert.equal(r.sourceReaderIdentityCallerOnly,true);assert.equal(r.worldChanged,false);
});
test('different stage overlap does not falsely count as a duplicate source read',()=>{
 const r=audit([p(0,-60,0)],[p(0,-60,0)]);
 assert.equal(r.ok,true);assert.equal(r.bridgePadOverlapCells,1);
 assert.equal(r.combinedDistinctCells,1);
 assert.equal(r.stageRoleDuplicateCalls.bridge.naturalAt,0);
 assert.equal(r.stageRoleDuplicateCalls.pad.naturalAt,0);
});
test('two original role calls at the same coordinate in one stage refuse',()=>{
 const c=createUnderpassReaderCellCensus();fill(c,'bridge',[p(1,-10,2)]);
 c.record('bridge','naturalAt',1,-10,2);c.enterPad();fill(c,'pad',[p(3,-10,4)]);
 const r=c.audit({bridgeCells:1,padCells:1});assert.equal(r.ok,false);
 assert.equal(r.reason,'DUPLICATE_SOURCE_ROLE_CELL_READ');
 assert.equal(r.stageRoleDuplicateCalls.bridge.naturalAt,1);
});
test('equal aggregate counts cannot conceal different exact source-cell coordinates',()=>{
 const c=createUnderpassReaderCellCensus();
 c.record('bridge','naturalAt',0,-10,0);
 c.record('bridge','authoredAt',1,-10,0);
 c.record('bridge','editedAt',0,-10,0);
 c.record('bridge','protectedAt',0,-10,0);
 c.enterPad();fill(c,'pad',[p(0,-10,1)]);
 const r=c.audit({bridgeCells:1,padCells:1});assert.equal(r.ok,false);
 assert.equal(r.reason,'SOURCE_ROLE_COORDINATE_SET_MISMATCH');
 assert.equal(r.stageRoleCalls.bridge.authoredAt,1);
});
test('missing naturalAt read is rejected even when other role counts match',()=>{
 const c=createUnderpassReaderCellCensus();
 for(const role of roles.filter(r=>r!=='naturalAt'))c.record('bridge',role,0,-10,0);
 c.enterPad();fill(c,'pad',[p(0,-10,1)]);
 const r=c.audit({bridgeCells:1,padCells:1});assert.equal(r.ok,false);
 assert.equal(r.reason,'SOURCE_ROLE_CELL_COUNT_MISMATCH');
});
test('bridge-to-pad transition is strictly one way and source roles must match stage',()=>{
 const c=createUnderpassReaderCellCensus();
 assert.throws(()=>c.record('pad','naturalAt',0,-10,0),/Invalid underpass reader/);
 fill(c,'bridge',[p(0,-10,0)]);c.enterPad();
 assert.throws(()=>c.enterPad(),/stage transition/);
 assert.throws(()=>c.record('bridge','editedAt',0,-10,0),/Invalid underpass reader/);
 fill(c,'pad',[p(0,-10,1)]);
 assert.equal(c.audit({bridgeCells:1,padCells:1}).ok,true);
 assert.throws(()=>c.record('pad','naturalAt',0,-10,1),/Invalid underpass reader/);
});
test('unexpected roles, non-integer coordinates and invalid budgets refuse',()=>{
 assert.throws(()=>createUnderpassReaderCellCensus({maxCellsPerStage:0}),/census budget/);
 assert.throws(()=>createUnderpassReaderCellCensus({maxCellsPerStage:20001}),/census budget/);
 const c=createUnderpassReaderCellCensus({maxCellsPerStage:1});
 assert.throws(()=>c.record('bridge','unsafe',0,-10,0),/Invalid underpass reader/);
 assert.throws(()=>c.record('bridge','naturalAt',.5,-10,0),/Invalid underpass reader/);
 fill(c,'bridge',[p(0,-10,0)]);
 assert.throws(()=>c.record('bridge','naturalAt',1,-10,0),/census budget exceeded/);
 c.enterPad();fill(c,'pad',[p(0,-10,1)]);
 assert.equal(c.audit({bridgeCells:1,padCells:1}).ok,true);
});
test('completed census is immutable snapshot, and cannot be recomputed or mutated',()=>{
 const c=createUnderpassReaderCellCensus();fill(c,'bridge',[p(1,-20,2)]);
 c.enterPad();fill(c,'pad',[p(1,-20,3)]);
 const r=c.audit({bridgeCells:1,padCells:1});
 assert.equal(r.ok,true);assert.equal(Object.isFrozen(r),true);
 assert.equal(Object.isFrozen(r.stageRoleCalls.bridge),true);
 assert.throws(()=>{r.stageRoleCalls.bridge.naturalAt=999},TypeError);
 assert.throws(()=>c.audit({bridgeCells:1,padCells:1}),/Invalid completed/);
});


test('Phase26 independent geometric truth approves exact original four-role coordinates',()=>{
 const manifest={bridge:['1,-10,0','2,-10,0'],pad:['2,-10,0','3,-10,0']};
 const c=createUnderpassReaderCellCensus({expectedStageCoordinates:manifest});
 fill(c,'bridge',[p(1,-10,0),p(2,-10,0)]);
 c.enterPad();fill(c,'pad',[p(2,-10,0),p(3,-10,0)]);
 const r=c.audit({bridgeCells:2,padCells:2});
 assert.equal(r.ok,true);
 assert.equal(r.independentGeometryFootprintProvided,true);
 assert.equal(r.independentGeometryFootprintPassed,true);
 assert.deepEqual(r.expectedStageDistinctCells,{bridge:2,pad:2});
});
test('Phase26 all four roles can agree on the SAME WRONG voxel and must still refuse',()=>{
 const c=createUnderpassReaderCellCensus({expectedStageCoordinates:{
  bridge:['0,-10,0'],pad:['0,-10,1']
 }});
 fill(c,'bridge',[p(9,-10,0)]);
 c.enterPad();fill(c,'pad',[p(0,-10,1)]);
 const r=c.audit({bridgeCells:1,padCells:1});
 assert.equal(r.ok,false);
 assert.equal(r.reason,'SOURCE_ROLE_INDEPENDENT_FOOTPRINT_MISMATCH');
 assert.equal(r.independentGeometryFootprintPassed,false);
 assert.equal(r.stageRoleDuplicateCalls.bridge.editedAt,0);
});
test('Phase26 expected stage geometry is snapshotted, not retargetable by caller',()=>{
 const bridge=['1,-10,0'],pad=['2,-10,0'];
 const c=createUnderpassReaderCellCensus({expectedStageCoordinates:{bridge,pad}});
 bridge[0]='9,-10,0';pad.push('3,-10,0');
 fill(c,'bridge',[p(1,-10,0)]);
 c.enterPad();fill(c,'pad',[p(2,-10,0)]);
 const r=c.audit({bridgeCells:1,padCells:1});
 assert.equal(r.ok,true);
 assert.equal(r.independentGeometryFootprintPassed,true);
});
test('Phase26 invalid and duplicated geometric witness coordinates refuse up front',()=>{
 for(const m of [
  {bridge:[],pad:['1,-10,0']},
  {bridge:['1,-10,0','1,-10,0'],pad:['2,-10,0']},
  {bridge:['1.5,-10,0'],pad:['2,-10,0']},
  {bridge:['-0,-10,0'],pad:['2,-10,0']},
  {bridge:['1,-10,0'],pad:['99999999999999999999,-10,0']}
 ]){
  assert.throws(()=>createUnderpassReaderCellCensus({
   expectedStageCoordinates:m
  }),/Invalid independent|Duplicate independent/);
 }
});
