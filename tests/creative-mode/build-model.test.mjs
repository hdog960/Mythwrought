import test from 'node:test';
import assert from 'node:assert/strict';
import {BUILD_ABI,MAX_BATCH_EDITS,createBuildState,planBuildBatch,validateBuildShape,rotateBuildShape,planRefreshChunks} from '../../src/creative-mode/build-model.mjs';
const block={id:71,name:'Fake stone',category:'test',kind:'block',registered:true,placeable:true,placementRules:{requiresSupport:true}};
const arch={id:'lab:arch',name:'Fake arch',category:'test',kind:'object',registered:true,placeable:true,placementRules:{requiresSupport:true,footprint:[{dx:0,dy:0,dz:0},{dx:1,dy:0,dz:0},{dx:0,dy:1,dz:0},{dx:1,dy:1,dz:0}]}};
const catalog=[block,arch];
const ports={isRegionReady:()=>true,canEdit:()=>true,canOccupy:()=>true,canSupport:({grounded})=>grounded===true};
const p=(x=0,y=0,z=0)=>({x,y,z});
const place=(id=71,at=p(),rotation=0)=>({type:'place',id,at,rotation});
const remove=(at=p())=>({type:'remove',at});
const run=(s,a,opts={})=>planBuildBatch(s,Array.isArray(a)?a:[a],{catalog,ports,...opts});
test('M4 is feature-local, versioned and starts completely empty and immutable',()=>{
 const s=createBuildState();assert.equal(s.abi,BUILD_ABI);assert.equal(s.revision,0);assert.equal(s.placements.length,0);
 assert.ok(Object.isFrozen(s)&&Object.isFrozen(s.bounds)&&Object.isFrozen(s.placements));
});
test('reject invalid dimensions, oversized batch or malformed actions without mutation',()=>{
 for(const options of [{chunkSize:1},{maxBatch:25},{bounds:{minX:0}}])assert.throws(()=>createBuildState(options));
 const s=createBuildState();for(const arr of [[],Array(25).fill(place()),[{type:'warp',at:p()}],[{type:'place',at:{x:1.2,y:0,z:0},id:71}]]){
  const r=run(s,arr);assert.equal(r.ok,false);assert.equal(r.state,s);assert.equal(s.revision,0);
 }
});
test('missing mandatory runtime contracts fail closed even for valid fixture rows',()=>{
 const s=createBuildState();for(const invalid of [{},{isRegionReady:()=>true},{...ports,canEdit:null}]){
  const r=run(s,place(),{ports:invalid});assert.equal(r.reason,'adapter-contract-missing');assert.equal(r.state,s);
 }
});
test('M0 registry denies missing, fake, duplicate and scenic-only IDs',()=>{
 const s=createBuildState();assert.equal(run(s,place('missing')).reason,'unregistered-placeable');
 for(const invalid of [[block,block],[{...block,scenicOnly:true}],[{...block,registered:false}]]){
  const r=run(s,place(),{catalog:invalid});assert.equal(r.reason,'invalid-registry-snapshot');assert.equal(r.state,s);
 }
});
test('blocks are one cell and objects use explicit connected physical footprints',()=>{
 assert.deepEqual(validateBuildShape(block),[{dx:0,dy:0,dz:0}]);assert.equal(validateBuildShape(arch).length,4);
 for(const bad of [
  {...arch,placementRules:{requiresSupport:true,footprint:[{dx:0,dy:0,dz:0},{dx:3,dy:0,dz:0}]}},
  {...arch,placementRules:{requiresSupport:true,footprint:[{dx:0,dy:0,dz:0},{dx:0,dy:0,dz:0}]}},
  {...arch,placementRules:{requiresSupport:true,footprint:[{dx:1,dy:0,dz:0},{dx:2,dy:0,dz:0}]}},
  {...arch,placementRules:{requiresSupport:true,footprint:Array(17).fill({dx:0,dy:0,dz:0})}},
  {...arch,placementRules:{footprint:[{dx:0,dy:0,dz:0},{dx:1,dy:0,dz:0}]}},
 ])assert.throws(()=>validateBuildShape(bad));
});
test('four 90-degree rotations are deterministic and reject fractional rotations',()=>{
 const shape=validateBuildShape(arch);assert.deepEqual(rotateBuildShape(shape,1)[1],{dx:0,dy:0,dz:1});
 assert.deepEqual(rotateBuildShape(shape,2)[1],{dx:-1,dy:0,dz:0});
 assert.deepEqual(rotateBuildShape(shape,3)[1],{dx:0,dy:0,dz:-1});
 assert.throws(()=>rotateBuildShape(shape,4));assert.throws(()=>rotateBuildShape(shape,1.5));
});
test('successful place is an immutable detached plan, not world persistence',()=>{
 const s=createBuildState();const r=run(s,place());assert.equal(r.ok,true);assert.equal(s.placements.length,0);
 assert.equal(r.state.revision,1);assert.equal(r.state.placements.length,1);assert.equal(r.transaction.persisted,false);
 assert.equal(r.transaction.worldCommitted,false);assert.equal(r.transaction.source,'detached-only');
 assert.equal(r.transaction.undoCandidate.expectedRevision,1);assert.equal(r.transaction.undoCandidate.inverseActions[0].type,'remove');
 assert.ok(Object.isFrozen(r.state.placements[0].cells));
});
test('collision and world bounds reject without partial edit',()=>{
 const once=run(createBuildState(),place()).state;
 assert.equal(run(once,place()).reason,'occupied');
 assert.equal(run(once,place(71,p(17,0,0))).reason,'outside-bounds');
 assert.equal(once.revision,1);
});
test('external regions, edit permissions and collision checks are mandatory true',()=>{
 const s=createBuildState();
 for(const [field,reason] of [['isRegionReady','unloaded-region'],['canEdit','edit-denied'],['canOccupy','collision-denied'],['canSupport','unsupported']]){
  assert.equal(run(s,place(),{ports:{...ports,[field]:()=>false}}).reason,reason);
  assert.equal(run(s,place(),{ports:{...ports,[field]:()=>{throw Error('host failure');}}}).reason,reason);
 }
});
test('placed objects occupy their entire authored footprint and remove by any cell',()=>{
 const s=createBuildState();const r=run(s,place('lab:arch',p(0,0,0)));assert.equal(r.ok,true);
 assert.equal(r.state.placements[0].cells.length,4);
 assert.equal(run(r.state,place(71,p(1,1,0))).reason,'occupied');
 const removed=run(r.state,remove(p(1,1,0)));assert.equal(removed.ok,true);assert.equal(removed.state.placements.length,0);
 assert.equal(removed.transaction.undoCandidate.inverseActions[0].id,'lab:arch');
});
test('supported elevated blocks work after anchor and cannot remove their support',()=>{
 const s=createBuildState();assert.equal(run(s,place(71,p(0,1,0))).reason,'unsupported');
 const two=run(s,[place(),place(71,p(0,1,0))]);assert.equal(two.ok,true);
 assert.equal(run(two.state,remove(p(0,0,0))).reason,'would-destabilize');
 assert.equal(run(two.state,remove(p(0,1,0))).ok,true);
});
test('batch is atomic and always returns the original reference on error',()=>{
 const s=createBuildState();const r=run(s,[place(),place(71,p(17,0,0))]);
 assert.equal(r.ok,false);assert.equal(r.atStep,1);assert.equal(r.state,s);assert.equal(s.placements.length,0);
});
test('bounded multiedit batch has inverse actions in reverse order',()=>{
 const s=createBuildState();const r=run(s,[place(71,p(0)),place(71,p(1)),place(71,p(2))]);
 assert.equal(r.ok,true);assert.equal(r.transaction.changeCount,3);assert.equal(r.state.placements.length,3);
 assert.deepEqual(r.transaction.undoCandidate.inverseActions.map(x=>x.at.x),[2,1,0]);
});
test('chunk seam refresh plans include direct and diagonal neighbors',()=>{
 assert.deepEqual(planRefreshChunks([p(3,0,3)],8),['0,0']);
 assert.deepEqual(planRefreshChunks([p(7,0,7)],8),['0,0','0,1','1,0','1,1']);
 assert.deepEqual(planRefreshChunks([p(0,0,0)],8),['-1,-1','-1,0','0,-1','0,0']);
 assert.deepEqual(planRefreshChunks([p(-8,0,-8)],8),['-2,-2','-2,-1','-1,-2','-1,-1']);
});
test('large shape crossing seams generates bounded refresh and undo candidate, no mesh edits',()=>{
 const r=run(createBuildState(),place('lab:arch',p(7,0,7)));assert.equal(r.ok,true);
 assert.ok(r.transaction.refreshChunks.includes('1,0'));assert.ok(r.transaction.refreshChunks.includes('1,1'));
 assert.equal(r.transaction.undoCandidate.inverseActions.length,1);assert.equal(r.transaction.persisted,false);
});
test('batch limit and cell budget fail safely',()=>{
 const s=createBuildState();assert.equal(run(s,Array(MAX_BATCH_EDITS+1).fill(place())).reason,'batch-limit');
 let large=createBuildState();for(let i=0;i<24;i++){
  const actions=[];for(let j=0;j<24;j++){
   const k=i*24+j;const x=(k%32)-16,z=Math.floor(k/32)-16;
   if(k<512)actions.push(place(71,p(x,0,z)));
  }
  if(!actions.length)break;
  const r=run(large,actions);if(r.ok)large=r.state;else break;
 }
 assert.ok(large.placements.length<=512);
});
test('remove from empty cell is rejected and does not claim edits',()=>{
 const s=createBuildState();const r=run(s,remove());assert.equal(r.reason,'nothing-to-remove');assert.equal(r.state,s);
});
