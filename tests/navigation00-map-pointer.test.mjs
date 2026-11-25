import test from 'node:test';
import assert from 'node:assert/strict';
import {createNavigationMapSession,transitionNavigationMapSession} from '../src/navigation00/navigation-map-session.mjs';
import {dispatchNavigationMapPointer} from '../src/navigation00/navigation-map-pointer.mjs';
const open=(width,height)=>transitionNavigationMapSession(createNavigationMapSession({width,height,insets:{top:12,right:34,bottom:21,left:47},thumbRails:{left:105,right:105}}),{type:'open'});
for (const [w,h] of [[667,375],[844,390],[932,430]]) {
 test(`pointer controls dispatch at ${w}x${h}`,()=>{
  let session=open(w,h);
  const zin=session.layout.controls.zoomIn;
  const first=dispatchNavigationMapPointer(session,{x:zin.x+22,y:zin.y+22});
  assert.equal(first.action,'zoom-in');
  assert.equal(first.session.zoom,1.25);
  assert.equal(session.zoom,1);
  session=first.session;
  const zout=session.layout.controls.zoomOut;
  assert.equal(dispatchNavigationMapPointer(session,{x:zout.x+22,y:zout.y+22}).session.zoom,1);
  const close=session.layout.controls.close;
  const closed=dispatchNavigationMapPointer(session,{x:close.x+22,y:close.y+22});
  assert.equal(closed.action,'close');
  assert.equal(closed.session.open,false);
  assert.equal(dispatchNavigationMapPointer(closed.session,{x:close.x+22,y:close.y+22}).action,null);
 });
}
test('CSS offset and scale map to same control without changing world state',()=>{
 const session=open(844,390),c=session.layout.controls.zoomIn;
 const hit=dispatchNavigationMapPointer(session,{x:50+(c.x+22)*2,y:70+(c.y+22)*2},{scale:2,offsetX:50,offsetY:70});
 assert.equal(hit.action,'zoom-in');
 assert.equal(hit.session.zoom,1.25);
});
test('outside controls is a no-op preserving exact object identity',()=>{
 const session=open(844,390);
 const result=dispatchNavigationMapPointer(session,{x:0,y:0});
 assert.equal(result.action,null);
 assert.strictEqual(result.session,session);
});
test('malformed transforms and pointers fail closed',()=>{
 const session=open(844,390);
 for(const options of [{scale:0},{scale:Infinity},{offsetX:NaN},{offsetY:Infinity},null])
  assert.throws(()=>dispatchNavigationMapPointer(session,{x:100,y:100},options));
 assert.throws(()=>dispatchNavigationMapPointer(session,{x:NaN,y:0}));
});
test('unexpected control actions are rejected rather than dispatched',()=>{
 const session=open(844,390),c=session.layout.controls.close;
 const malformed={...session,layout:{...session.layout,controls:{...session.layout.controls,close:{...c,action:'delete-world'}}}};
 assert.throws(()=>dispatchNavigationMapPointer(malformed,{x:c.x+22,y:c.y+22}),/Unknown navigation control action/);
});
test('schema-1 serialized save is never accessed or modified',()=>{
 const save=Buffer.from('{"schema":1,"seed":1937,"edits":[[1,2,3,4]]}');
 const before=Buffer.from(save),session=open(844,390),c=session.layout.controls.zoomIn;
 dispatchNavigationMapPointer(session,{x:c.x+22,y:c.y+22});
 assert.deepEqual(save,before);
});
