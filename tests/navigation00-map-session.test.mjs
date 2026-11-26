import test from 'node:test';
import assert from 'node:assert/strict';
import {createNavigationMapSession,transitionNavigationMapSession} from '../src/navigation00/navigation-map-session.mjs';
for(const [width,height] of [[667,375],[844,390],[932,430]]) {
 test(`opt-in expanded map controls stay clear of rails at ${width}x${height}`,()=>{
  const config={width,height,insets:{top:12,bottom:21,left:47,right:34},thumbRails:{left:105,right:105}};
  const session=createNavigationMapSession(config);
  assert.equal(session.open,false);
  assert.ok(session.layout.controls);
  const opened=transitionNavigationMapSession(session,{type:'open'});
  assert.equal(opened.open,true);
  for(const control of Object.values(opened.layout.controls)) {
   assert.ok(control.x>=47+105);
   assert.ok(control.x+control.width<=width-34-105);
   assert.ok(control.y>=12 && control.y+control.height<=height-21);
   assert.ok(control.width>=44 && control.height>=44);
  }
  assert.equal(transitionNavigationMapSession(opened,{type:'close'}).open,false);
 });
}
test('closed map ignores zoom and zoom clamps deterministically',()=>{
 let s=createNavigationMapSession({width:844,height:390});
 assert.strictEqual(transitionNavigationMapSession(s,{type:'zoom-in'}),s);
 s=transitionNavigationMapSession(s,{type:'open'});
 for(let i=0;i<40;i++)s=transitionNavigationMapSession(s,{type:'zoom-in'});
 assert.equal(s.zoom,4);
 for(let i=0;i<40;i++)s=transitionNavigationMapSession(s,{type:'zoom-out'});
 assert.equal(s.zoom,0.5);
});
test('fails closed when rails consume space',()=>{
 const s=createNavigationMapSession({width:667,height:375,thumbRails:{left:300,right:300}});
 assert.equal(s.layout.controls,null);
 assert.strictEqual(transitionNavigationMapSession(s,{type:'open'}),s);
});
test('session never changes input world or schema-1 save bytes',()=>{
 const save=JSON.stringify({schema:1,seed:1937,edits:[[1,2,3,4]],player:{x:11,y:-25,z:3}});
 const before=save;
 let s=createNavigationMapSession({width:932,height:430});
 for(const type of ['open','zoom-in','zoom-out','close'])s=transitionNavigationMapSession(s,{type});
 assert.equal(save,before);
 assert.equal(s.open,false);
 assert.equal(Object.hasOwn(s,'save'),false);
});
test('rejects malformed actions and nonfinite zoom',()=>{
 assert.throws(()=>createNavigationMapSession({width:844,height:390,zoom:NaN}));
 const s=createNavigationMapSession({width:844,height:390});
 assert.throws(()=>transitionNavigationMapSession(s,{type:'erase-save'}));
});
