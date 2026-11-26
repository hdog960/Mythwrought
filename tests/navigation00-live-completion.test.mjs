import test from 'node:test';
import assert from 'node:assert/strict';
import {createObservedNavigator} from '../src/navigation00/observed-navigation.mjs';
import {createNavigationAdapter} from '../src/navigation00/navigation-adapter.mjs';
import {navigationPose,observeNavigationSurface,eligibleSurfaceDiscovery} from '../src/navigation00/navigation-live-observation.mjs';
const d=()=>({seen:new Set(['0,0','-1,-1']),has(x,z){return this.seen.has(Math.floor(x/4)+','+Math.floor(z/4));}});
const store=()=>{const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};};
test('waypoint rename/remove/undo persists through cold reopen and stays seed scoped',()=>{
 const storage=store(),discovery=d(),open=seed=>createObservedNavigator({seed,discovery,storage});
 let n=open(4);assert.ok(n.pin({id:'a',x:-1.25,z:-.2,label:'Home'}));assert.ok(n.rename('a','Camp'));
 assert.ok(n.unpin('a'));n=open(4);assert.ok(n.undo());assert.equal(n.visiblePins()[0].label,'Camp');
 assert.ok(n.undo());assert.equal(n.visiblePins()[0].label,'Home');assert.equal(open(5).visiblePins().length,0);
 assert.ok(n.undo());assert.equal(n.visiblePins().length,0);assert.equal(n.undo(),false);
});
test('read-only stale session cannot replace newer sidecar or undo state',()=>{
 const storage=store(),discovery=d(),a=createObservedNavigator({seed:1,discovery,storage}),b=createObservedNavigator({seed:1,discovery,storage});
 assert.ok(a.pin({id:'a',x:0,z:0,label:'Home'}));const raw=storage.getItem(a.key);
 assert.equal(b.pin({id:'b',x:0,z:0,label:'Other'}),false);assert.equal(b.readOnly,true);assert.equal(storage.getItem(a.key),raw);
});
test('legacy record retains pins and supports transactional edits',()=>{
 const storage=store(),discovery=d();storage.setItem('mythwrought-navigation00-v1-2',JSON.stringify({version:1,seed:2,pins:[{id:'a',x:0,z:0,label:'Old'}]}));
 const n=createObservedNavigator({seed:2,discovery,storage});assert.ok(n.rename('a','New'));assert.ok(n.undo());assert.equal(n.visiblePins()[0].label,'Old');
});
test('exact world projection roundtrips negative fractional target and player center',()=>{
 const a=createNavigationAdapter({seed:1,discovery:d(),width:320,height:320,player:{x:-1.25,z:-.2,yaw:0,y:-20},exact:true});
 let f=a.frame();assert.equal(f.player.screenX,160);assert.equal(f.player.screenY,160);
 a.viewport.panPixels({dx:12.3,dy:-7.4});a.viewport.zoomAt({factor:1.3,screenX:170,screenY:160});f=a.frame();
 const p=f.projection.world(-.9,-.1),q=f.projection.atScreen(p.screenX,p.screenY);
 assert.ok(Math.abs(q.x+.9)<1e-9&&Math.abs(q.z+.1)<1e-9);
});
test('live feet normalization and underground/unresident discovery fails closed',()=>{
 const p={x:0,z:0,feet:6,yaw:0};let reads=0;const world={get(x,y,z){reads++;return y<=5?3:0;}};
 const observe=(player,residentAt=()=>true,maxY=19)=>observeNavigationSurface({world,player,residentAt,minSurfaceY:-3,maxY});
 assert.equal(navigationPose(p).y,6);assert.ok(eligibleSurfaceDiscovery(observe(p),p));
 let before=reads;const deep={...p,feet:-40};assert.equal(observe(deep).kind,'underground');assert.equal(reads,before);
 assert.equal(observe(p,()=>false).kind,'unknown');assert.equal(reads,before);
 assert.equal(observe({...p,feet:2}).kind,'covered');assert.equal(eligibleSurfaceDiscovery(observe({...p,feet:2}),p),false);
 assert.equal(observe({...p,feet:240},()=>true,256).kind,'surface');
});
