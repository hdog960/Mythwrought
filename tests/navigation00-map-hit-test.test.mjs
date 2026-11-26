import test from 'node:test';
import assert from 'node:assert/strict';
import {hitTestNavigationMapControl} from '../src/navigation00/navigation-map-hit-test.mjs';
import {createNavigationMapSession,transitionNavigationMapSession} from '../src/navigation00/navigation-map-session.mjs';
const geometry=(width,height)=>{
 const session=transitionNavigationMapSession(createNavigationMapSession({width,height,insets:{top:12,right:34,bottom:21,left:47},thumbRails:{left:105,right:105}}),{type:'open'});
 assert.equal(session.open,true);
 return session;
};
for(const [w,h] of [[667,375],[844,390],[932,430]]) {
 test('hit targets and edges at '+w+'x'+h,()=>{
  const s=geometry(w,h);
  for(const c of Object.values(s.layout.controls)) {
   assert.equal(hitTestNavigationMapControl(s,{x:c.x+22,y:c.y+22}),c.action);
   assert.equal(hitTestNavigationMapControl(s,{x:c.x+43.99,y:c.y+43.99}),c.action);
   assert.notEqual(hitTestNavigationMapControl(s,{x:c.x+44,y:c.y+44}),c.action);
  }
 });
}
test('closed and unavailable controls never dispatch',()=>{
 const s=geometry(844,390),c=s.layout.controls.close;
 assert.equal(hitTestNavigationMapControl({...s,open:false},{x:c.x+1,y:c.y+1}),null);
 assert.equal(hitTestNavigationMapControl({...s,layout:{...s.layout,controls:null}},{x:c.x+1,y:c.y+1}),null);
});
test('outside frame and control gaps do not dispatch',()=>{
 const s=geometry(844,390);
 assert.equal(hitTestNavigationMapControl(s,{x:0,y:0}),null);
 assert.equal(hitTestNavigationMapControl(s,{x:100,y:100}),null);
});
test('nonfinite pointer and invalid session fail closed',()=>{
 const s=geometry(844,390);
 assert.throws(()=>hitTestNavigationMapControl(s,{x:NaN,y:30}));
 assert.throws(()=>hitTestNavigationMapControl(s,{x:Infinity,y:30}));
 assert.throws(()=>hitTestNavigationMapControl({...s,zoom:Infinity},{x:100,y:100}));
});
test('overlapping hit targets are rejected',()=>{
 const s=geometry(844,390),c=s.layout.controls.close;
 const bad={...s,layout:{...s.layout,controls:{...s.layout.controls,zoomIn:{...c,action:'zoom-in'}}}};
 assert.throws(()=>hitTestNavigationMapControl(bad,{x:c.x+1,y:c.y+1}),/Overlapping/);
});
test('schema-1 save fixture remains byte-identical',()=>{
 const save='{"schema":1,"seed":1937,"edits":[[1,2,3,4]],"player":{"x":11,"y":-25,"z":3}}';
 const s=geometry(844,390);
 hitTestNavigationMapControl(s,{x:s.layout.controls.close.x+1,y:s.layout.controls.close.y+1});
 assert.equal(save,'{"schema":1,"seed":1937,"edits":[[1,2,3,4]],"player":{"x":11,"y":-25,"z":3}}');
});
