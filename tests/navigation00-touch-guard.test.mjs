import test from 'node:test';
import assert from 'node:assert/strict';
import {createNavigationMapSession,transitionNavigationMapSession} from '../src/navigation00/navigation-map-session.mjs';
import {dispatchNavigationMapTouch} from '../src/navigation00/navigation-touch-guard.mjs';
const make=(width,height)=>transitionNavigationMapSession(createNavigationMapSession({width,height,insets:{top:12,right:34,bottom:21,left:47},thumbRails:{left:105,right:105}}),{type:'open'});
const touch=(x,y,overrides={})=>({x,y,phase:'end',activeTouches:0,movementTouchActive:false,...overrides});
for(const [w,h] of [[667,375],[844,390],[932,430]]) test(`single completed map tap at ${w}x${h}`,()=>{
 const s=make(w,h), c=s.layout.controls.zoomIn;
 const r=dispatchNavigationMapTouch(s,touch(c.x+22,c.y+22));
 assert.equal(r.action,'zoom-in'); assert.equal(r.session.zoom,1.25); assert.equal(s.zoom,1);
});
test('movement thumb and remaining fingers block map control',()=>{
 const s=make(844,390),c=s.layout.controls.zoomIn;
 for(const changes of [{movementTouchActive:true},{activeTouches:1},{activeTouches:2}]){
  const r=dispatchNavigationMapTouch(s,touch(c.x+22,c.y+22,changes));
  assert.equal(r.action,null); assert.strictEqual(r.session,s);
 }
});
test('start move and cancel never trigger a map action',()=>{
 const s=make(844,390),c=s.layout.controls.close;
 for(const phase of ['start','move','cancel']) assert.strictEqual(dispatchNavigationMapTouch(s,touch(c.x+22,c.y+22,{phase})).session,s);
});
test('closed map cannot consume a gameplay touch',()=>{
 const s=createNavigationMapSession({width:844,height:390,insets:{top:12,right:34,bottom:21,left:47},thumbRails:{left:105,right:105}});
 const r=dispatchNavigationMapTouch(s,touch(300,100)); assert.equal(r.action,null);assert.strictEqual(r.session,s);
});
test('malformed metadata rejects rather than interpreting as tap',()=>{
 const s=make(844,390);
 for(const changes of [{activeTouches:-1},{activeTouches:0.5},{phase:'hold'},{movementTouchActive:1},{x:NaN}]) assert.throws(()=>dispatchNavigationMapTouch(s,touch(300,100,changes)));
});
test('CSS scaling is forwarded without moving player or changing saves',()=>{
 const s=make(844,390),c=s.layout.controls.zoomOut;
 const save=Buffer.from('{"schema":1,"seed":1937,"edits":[[1,2,3,4]]}');const original=Buffer.from(save);
 const r=dispatchNavigationMapTouch(s,touch(50+2*(c.x+22),70+2*(c.y+22)),{scale:2,offsetX:50,offsetY:70});
 assert.equal(r.action,'zoom-out'); assert.equal(r.session.zoom,0.75);assert.deepEqual(save,original);
});
