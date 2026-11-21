import test from 'node:test';
import assert from 'node:assert/strict';
import {createNavigationMapSession,transitionNavigationMapSession} from '../src/navigation00/navigation-map-session.mjs';
import {reflowNavigationMapSession} from '../src/navigation00/navigation-map-reflow.mjs';
const insets={top:12,right:34,bottom:21,left:47};
for(const [width,height] of [[667,375],[844,390],[932,430]]) {
 test(`reflow retains usable close/zoom controls at ${width}x${height}`,()=>{
  let session=transitionNavigationMapSession(createNavigationMapSession({width:844,height:390}),{type:'open'});
  session=transitionNavigationMapSession(session,{type:'zoom-in'});
  const original=session;
  const updated=reflowNavigationMapSession(session,{width,height,insets,thumbRails:{left:105,right:105}});
  assert.equal(updated.open,true);
  assert.equal(updated.zoom,1.25);
  assert.equal(original.layout.frame.width,844);
  for(const control of Object.values(updated.layout.controls)) {
   assert.ok(control.x>=insets.left+105);
   assert.ok(control.x+control.width<=width-insets.right-105);
   assert.ok(control.y>=insets.top);
   assert.ok(control.y+control.height<=height-insets.bottom);
   assert.ok(control.width>=44 && control.height>=44);
  }
 });
}
test('reflow fails closed when thumb rails consume the screen',()=>{
 const s=transitionNavigationMapSession(createNavigationMapSession({width:844,height:390}),{type:'open'});
 const reflowed=reflowNavigationMapSession(s,{width:667,height:375,thumbRails:{left:300,right:300}});
 assert.equal(reflowed.open,false);
 assert.equal(reflowed.layout.controls,null);
 assert.equal(reflowed.zoom,s.zoom);
});
test('reflow cannot reopen a map closed by its user',()=>{
 const s=createNavigationMapSession({width:844,height:390});
 assert.equal(reflowNavigationMapSession(s,{width:932,height:430}).open,false);
});
test('invalid geometry rejects without changing the prior session',()=>{
 const s=transitionNavigationMapSession(createNavigationMapSession({width:844,height:390}),{type:'open'});
 assert.throws(()=>reflowNavigationMapSession(s,{width:0,height:390}));
 assert.equal(s.open,true);
});
test('reflow does not read or mutate a schema-1 world save',()=>{
 const save=JSON.stringify({schema:1,seed:1937,edits:[[1,2,3,4]],player:{x:11,y:-25,z:3}});
 const s=createNavigationMapSession({width:844,height:390});
 reflowNavigationMapSession(s,{width:932,height:430});
 assert.equal(save,JSON.stringify({schema:1,seed:1937,edits:[[1,2,3,4]],player:{x:11,y:-25,z:3}}));
});
