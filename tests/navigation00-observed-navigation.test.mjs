import test from 'node:test';
import assert from 'node:assert/strict';
import {createObservedNavigator} from '../src/navigation00/observed-navigation.mjs';
const discovery=()=>({seen:new Set(['0,0','1,0','-1,-1']),has(x,z){return this.seen.has(Math.floor(x/4)+','+Math.floor(z/4));}});
const store=()=>{const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v),dump:()=>new Map(m)};};
test('fog camera exposes only real visited cells, with correct bearing and zoom',()=>{
 const d=discovery(),n=createObservedNavigator({seed:42,discovery:d});
 const v=n.project({player:{x:0,z:0,yaw:Math.PI/2},width:667,height:375});
 assert.deepEqual(v.cells.map(c=>c.x+','+c.z).sort(),['-1,-1','0,0','1,0']);
 assert.equal(v.player.bearing,90);
 assert.throws(()=>n.project({player:{x:0,z:0,yaw:0},width:667,height:375,zoom:100}));
 d.seen.add('2,0');
 assert.equal(n.project({player:{x:0,z:0,yaw:0},width:844,height:390}).cells.length,4);
});
test('markers require visited coordinates, are seed-scoped and reload without touching exploration bytes',()=>{
 const d=discovery(),s=store();s.setItem('mythwrought-exploration-v1-42','legacy-byte-identical');
 const n=createObservedNavigator({seed:42,discovery:d,storage:s});
 assert.equal(n.pin({id:'hidden',x:80,z:80,label:'No'}),false);
 assert.equal(n.pin({id:'home',x:2,z:1,label:'Home'}),true);
 assert.equal(n.pin({id:'home',x:2,z:1,label:'Duplicate'}),false);
 assert.equal(createObservedNavigator({seed:42,discovery:d,storage:s}).visiblePins().length,1);
 assert.equal(createObservedNavigator({seed:43,discovery:d,storage:s}).visiblePins().length,0);
 assert.equal(s.getItem('mythwrought-exploration-v1-42'),'legacy-byte-identical');
 d.seen.delete('0,0');
 assert.equal(n.visiblePins().length,0);
 assert.equal(n.unpin('home'),true);
});
test('corrupt record fails closed without rewriting original bytes',()=>{
 const s=store(),key='mythwrought-navigation00-v1-5';
 s.setItem(key,'{bad');
 const n=createObservedNavigator({seed:5,discovery:discovery(),storage:s});
 assert.equal(n.readOnly,true);
 assert.equal(n.pin({id:'a',x:0,z:0,label:'A'}),false);
 assert.equal(s.getItem(key),'{bad');
});
test('storage readback failure cannot expose uncommitted pin',()=>{
 const d=discovery();let value=null;
 const s={getItem:()=>value,setItem:(_k,v)=>{value=v.includes('"pins":[]')?v:'tampered';}};
 const n=createObservedNavigator({seed:7,discovery:d,storage:s});
 assert.equal(n.pin({id:'a',x:0,z:0,label:'A'}),false);
 assert.deepEqual(n.visiblePins(),[]);
});
test('viewport projections remain bounded across phone landscape sizes',()=>{
 const n=createObservedNavigator({seed:2,discovery:discovery()});
 for(const [width,height] of [[667,375],[844,390],[932,430]]){
  const r=n.project({player:{x:2,z:2,yaw:0},width,height,zoom:7});
  assert.equal(r.cells.length,3);assert.equal(r.player.x,width/2);assert.equal(r.player.y,height/2);
 }
});

test('bounded viewport refuses excessive projection work without reading hidden terrain',()=>{
 const d=discovery(),n=createObservedNavigator({seed:2,discovery:d});
 assert.throws(()=>n.project({player:{x:0,z:0,yaw:0},width:4096,height:4096,zoom:4}),/bounded discovery scan/);
 assert.throws(()=>n.project({player:{x:0,z:0,yaw:0},width:5000,height:375,zoom:7}),/Invalid map camera/);
 assert.equal(d.seen.size,3);
});
test('offscreen waypoints stay persisted but are not rendered or revealed',()=>{
 const d=discovery(),s=store(),n=createObservedNavigator({seed:2,discovery:d,storage:s});
 assert.equal(n.pin({id:'west',x:-2,z:-2,label:'West'}),true);
 const near=n.project({player:{x:0,z:0,yaw:0},width:667,height:375});
 assert.equal(near.pins.length,1);
 const far=n.project({player:{x:20000,z:20000,yaw:0},width:667,height:375});
 assert.equal(far.pins.length,0);
 assert.equal(createObservedNavigator({seed:2,discovery:d,storage:s}).visiblePins().length,1);
});
