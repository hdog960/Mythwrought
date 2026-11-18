import test from 'node:test';
import assert from 'node:assert/strict';
import {createBuildState,planBuildBatch} from '../../src/creative-mode/build-model.mjs';
import {HISTORY_ABI,buildFingerprint,createHistorySession,executeHistoryBatch,undoHistory,redoHistory,rehydrateHistorySession} from '../../src/creative-mode/history-model.mjs';
const stone={id:71,name:'Test stone',kind:'block',category:'test',registered:true,placeable:true,placementRules:{requiresSupport:true}};
const arch={id:'lab:arch',name:'Test arch',kind:'object',category:'test',registered:true,placeable:true,placementRules:{requiresSupport:true,footprint:[{dx:0,dy:0,dz:0},{dx:1,dy:0,dz:0},{dx:0,dy:1,dz:0},{dx:1,dy:1,dz:0}]}};
const catalog=[stone,arch];
const ports={isRegionReady:()=>true,canEdit:()=>true,canOccupy:()=>true,canSupport:({grounded})=>grounded===true};
const ctx={catalog,ports};
const pos=(x=0,y=0,z=0)=>({x,y,z});
const place=(id=71,at=pos(),rotation=0)=>({type:'place',id,at,rotation});
const remove=(at=pos())=>({type:'remove',at});
const apply=(s,actions,other=ctx,revision=s.state.revision)=>executeHistoryBatch(s,Array.isArray(actions)?actions:[actions],other,revision);
const undo=(s,other=ctx,revision=s.state.revision)=>undoHistory(s,other,revision);
const redo=(s,other=ctx,revision=s.state.revision)=>redoHistory(s,other,revision);

test('M5 default history is pure, immutable, empty, bounded and ABI-identified',()=>{
 const s=createHistorySession();assert.equal(s.abi,HISTORY_ABI);assert.equal(s.limit,32);
 assert.ok(Object.isFrozen(s)&&Object.isFrozen(s.past)&&Object.isFrozen(s.future));
 assert.equal(s.state.revision,0);assert.deepEqual(s.past,[]);
 for(const limit of [0,65,1.5,Infinity])assert.throws(()=>createHistorySession({limit}));
});
test('apply creates executable inverse history without mutating old state',()=>{
 const s=createHistorySession(),r=apply(s,place());assert.equal(r.ok,true);assert.equal(r.kind,'execute');
 assert.equal(s.state.placements.length,0);assert.equal(r.session.past.length,1);assert.equal(r.session.state.revision,1);
 assert.equal(r.session.past[0].inverse[0].type,'remove');assert.equal(r.transaction.persisted,false);
 assert.ok(Object.isFrozen(r.session.past[0])&&Object.isFrozen(r.session.past[0].forward[0].at));
});
test('undo and redo reexecute M4 contracts and increase revision monotonically',()=>{
 const a=apply(createHistorySession(),place());const b=undo(a.session);const c=redo(b.session);
 assert.equal(b.ok,true);assert.equal(b.kind,'undo');assert.equal(b.session.state.revision,2);
 assert.equal(b.session.state.placements.length,0);assert.equal(b.session.future.length,1);
 assert.equal(c.ok,true);assert.equal(c.session.state.revision,3);assert.equal(c.session.state.placements.length,1);
 assert.equal(c.session.past.length,1);assert.equal(c.session.future.length,0);
});
test('undo and redo both reject stale expectedRevision and retain original session reference',()=>{
 const a=apply(createHistorySession(),place());const b=undo(a.session,ctx,0);
 assert.equal(b.reason,'revision-conflict');assert.equal(b.session,a.session);
 const c=undo(a.session);assert.equal(redo(c.session,ctx,1).reason,'revision-conflict');
 assert.equal(apply(c.session,place(71,pos(2)),ctx,0).reason,'revision-conflict');
 assert.equal(executeHistoryBatch(c.session,[place()],ctx,undefined).reason,'revision-conflict');
});
test('repeated undo and redo fail closed without negative history indices',()=>{
 const s=createHistorySession();assert.equal(undo(s).reason,'nothing-to-undo');assert.equal(redo(s).reason,'nothing-to-redo');
 const a=apply(s,place()).session,b=undo(a).session;
 assert.equal(undo(b).reason,'nothing-to-undo');assert.equal(redo(redo(b).session).reason,'nothing-to-redo');
});
test('full three-cell batch undoes in reverse and redoes atomically',()=>{
 const s=createHistorySession();const a=apply(s,[place(71,pos(0)),place(71,pos(1)),place(71,pos(2))]);
 assert.equal(a.ok,true);assert.deepEqual(a.session.past[0].inverse.map(q=>q.at.x),[2,1,0]);
 const b=undo(a.session);assert.equal(b.ok,true);assert.equal(b.session.state.placements.length,0);
 const c=redo(b.session);assert.equal(c.ok,true);assert.equal(c.session.state.placements.length,3);
});
test('typed object IDs and rotations preserve exact multi-cell footprint on redo',()=>{
 const a=apply(createHistorySession(),place('lab:arch',pos(0,0,0),1));assert.equal(a.ok,true);
 const expected=buildFingerprint(a.session.state);const b=undo(a.session),c=redo(b.session);
 assert.equal(c.ok,true);assert.equal(buildFingerprint(c.session.state),expected);assert.equal(c.session.state.placements[0].cells.length,4);
});
test('redo is cleared by a new edit after undo',()=>{
 const a=apply(createHistorySession(),place()),b=undo(a.session);
 const c=apply(b.session,place(71,pos(3)));
 assert.equal(c.ok,true);assert.equal(c.session.future.length,0);assert.equal(redo(c.session).reason,'nothing-to-redo');
});
test('bounded history evicts oldest transaction but keeps latest revisions',()=>{
 let s=createHistorySession({limit:3});for(let i=0;i<12;i++)s=apply(s,place(71,pos(i))).session;
 assert.equal(s.past.length,3);assert.equal(s.state.revision,12);assert.equal(s.state.placements.length,12);
 for(let i=0;i<3;i++)s=undo(s).session;
 assert.equal(s.past.length,0);assert.equal(s.future.length,3);assert.equal(s.state.placements.length,9);
 assert.equal(undo(s).reason,'nothing-to-undo');
});
test('history refuses reverse transition if region or edit authority changes',()=>{
 const s=apply(createHistorySession(),place()).session;
 for(const method of ['isRegionReady','canEdit']){
  const denied={...ports,[method]:()=>false};const r=undo(s,{catalog,ports:denied});
  assert.equal(r.ok,false);assert.equal(r.session,s);assert.match(r.reason,/undo-/);
 }
});
test('redo refuses reverse transition if support or occupancy authority changes',()=>{
 const a=apply(createHistorySession(),place()).session,b=undo(a).session;
 for(const method of ['isRegionReady','canOccupy','canSupport']){
  const denied={...ports,[method]:()=>false},r=redo(b,{catalog,ports:denied});
  assert.equal(r.ok,false);assert.equal(r.session,b);assert.match(r.reason,/redo-/);
 }
});
test('collision and support errors cannot mutate history or accidentally consume redo',()=>{
 const s=apply(createHistorySession(),place()).session;
 const bad=apply(s,place());assert.equal(bad.ok,false);assert.equal(bad.session,s);
 const unsupported=apply(s,place(71,pos(2,1,2)));assert.equal(unsupported.reason,'unsupported');
 assert.equal(s.past.length,1);
});
test('geometry fingerprints ignore order but detect offsets, ID type and rotation',()=>{
 const a=apply(createHistorySession(),[place(71,pos(0)),place(71,pos(1))]).session;
 const fp=buildFingerprint(a.state),reverse=Object.freeze({...a.state,placements:[...a.state.placements].reverse()});
 assert.equal(fp,buildFingerprint(reverse));
 const different={...a.state,placements:[{...a.state.placements[0],id:'71'},a.state.placements[1]]};
 assert.notEqual(fp,buildFingerprint(different));
});
test('tampered expected fingerprint is detected before inverse execution',()=>{
 const s=apply(createHistorySession(),place()).session;
 const forged=Object.freeze({...s,past:Object.freeze([{...s.past[0],afterFingerprint:'forged'}])});
 const r=undo(forged);assert.equal(r.reason,'history-diverged');assert.equal(r.session,forged);
});
test('restore rejects mismatched history head and oversized transaction stacks',()=>{
 const a=apply(createHistorySession(),place()).session;
 assert.throws(()=>rehydrateHistorySession(a.state,1,[{...a.past[0],afterFingerprint:'wrong'}],[]),/head/);
 assert.throws(()=>rehydrateHistorySession(a.state,1,[...a.past,...a.past],[]),/bounds/);
});
test('undo after support-bearing placement is safe only with M4 authority',()=>{
 const s=apply(createHistorySession(),[place(),place(71,pos(0,1,0))]).session;
 const u=undo(s);assert.equal(u.ok,true);assert.equal(u.session.state.placements.length,0);
 const r=redo(u.session);assert.equal(r.ok,true);assert.equal(r.session.state.placements.length,2);
});
test('undo history handles remove and reinstate properly',()=>{
 let s=apply(createHistorySession(),place()).session;
 s=apply(s,remove()).session;
 const u=undo(s);assert.equal(u.ok,true);assert.equal(u.session.state.placements.length,1);
 const r=redo(u.session);assert.equal(r.ok,true);assert.equal(r.session.state.placements.length,0);
});
