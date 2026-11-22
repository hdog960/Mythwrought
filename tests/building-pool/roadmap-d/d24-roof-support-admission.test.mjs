import test from 'node:test';
import assert from 'node:assert/strict';
import {auditRoofAdmission,admitLiveWoodTruss} from '../../../src/building-pool/roadmap-d/d24-roof-support-admission.mjs';
const line=n=>Array.from({length:n},(_,x)=>({x,z:0}));
test('one true wall anchor gives exact four-neighbor distances without importing prototype spans',()=>{
 const r=auditRoofAdmission({roofCells:line(12),verifiedWallAnchors:[{x:0,z:0}],walkColumns:line(12).slice(1),maxPlanningDistance:8});
 assert.equal(r.roofCount,12);assert.equal(r.withinDistance,9);assert.equal(r.unresolved.length,3);
 assert.equal(r.maxDistance,11);assert.equal(r.candidateFullHeightPiers.length,0);
 assert.equal(r.status,'NOT_STRUCTURALLY_CERTIFIED');assert.equal(r.mutations,0);
});
test('nonwalked unoccupied overhead column remains a proposal only',()=>{
 const r=auditRoofAdmission({roofCells:line(3),verifiedWallAnchors:[{x:0,z:0}],walkColumns:[{x:1,z:0}]});
 assert.deepEqual(r.candidateFullHeightPiers,[{x:2,z:0}]);
});
test('occupied columns veto piers independently of navigation',()=>{
 const r=auditRoofAdmission({roofCells:line(3),verifiedWallAnchors:[{x:0,z:0}],walkColumns:[],occupiedColumns:[{x:1,z:0}]});
 assert.deepEqual(r.candidateFullHeightPiers,[{x:2,z:0}]);
});
test('disconnected roof components fail closed with unreachable distance',()=>{
 const r=auditRoofAdmission({roofCells:[{x:0,z:0},{x:5,z:0}],verifiedWallAnchors:[{x:0,z:0}],walkColumns:[]});
 assert.equal(r.unreachable,1);assert.equal(r.maxDistance,null);assert.equal(r.unresolved[0].distance,null);
});
test('invalid or forged roof inputs are rejected',()=>{
 assert.throws(()=>auditRoofAdmission({roofCells:line(2),verifiedWallAnchors:[{x:5,z:0}],walkColumns:[]}));
 assert.throws(()=>auditRoofAdmission({roofCells:line(2),verifiedWallAnchors:[],walkColumns:[{x:3,z:0}]}));
 assert.throws(()=>auditRoofAdmission({roofCells:line(2),verifiedWallAnchors:[],walkColumns:[],maxPlanningDistance:-1}));
 assert.throws(()=>auditRoofAdmission({roofCells:[{x:0,z:0},{x:0,z:0}],verifiedWallAnchors:[],walkColumns:[]}));
});
test('actual live:wood truss cannot be certified by Pack3 joint or absent numerical capacity',()=>{
 const r=admitLiveWoodTruss({roofMaterial:'live:wood', verifiedWoodJoint:false,sourceLoadPath:true,playerClearance:true,span:8,verifiedSpanLimit:8});
 assert.equal(r.admitted,false);assert.ok(r.failures.some(s=>s.includes('wood roof')));
 assert.ok(r.failures.some(s=>s.includes('capacity')));
});
test('explicit complete input is necessary but not an original-game proof',()=>{
 const args={roofMaterial:'live:wood',verifiedWoodJoint:true,sourceLoadPath:true,playerClearance:true,memberCapacity:200,appliedLoad:150,span:4,verifiedSpanLimit:4};
 assert.equal(admitLiveWoodTruss(args).admitted,true);
 assert.equal(admitLiveWoodTruss({...args,appliedLoad:250}).admitted,false);
 assert.equal(admitLiveWoodTruss({...args,span:5}).admitted,false);
 assert.equal(admitLiveWoodTruss({...args,roofMaterial:'pack3:109'}).admitted,false);
});
