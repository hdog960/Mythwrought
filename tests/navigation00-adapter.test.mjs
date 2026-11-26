import test from 'node:test';
import assert from 'node:assert/strict';
import {createNavigationAdapter} from '../src/navigation00/navigation-adapter.mjs';
const discovery=()=>({
 seen:new Set(['0,0','1,0','0,1','-1,0']),
 has(x,z){return this.seen.has(Math.floor(x/4)+','+Math.floor(z/4));}
});
for(const [width,height] of [[667,375],[844,390],[932,430]]){
 test('navigation adapter projects only visited tiles with safe rails '+width+'x'+height,()=>{
  const d=discovery();
  const a=createNavigationAdapter({seed:17,discovery:d,width,height,
    safeArea:{left:90,right:90,top:16,bottom:20},player:{x:1,y:8,z:1,yaw:Math.PI/2}});
  assert.equal(a.navigator.pin({id:'near',x:4,z:0,label:'Near'}),true);
  assert.equal(a.navigator.pin({id:'hidden',x:40,z:40,label:'Hidden'}),false);
  const f=a.frame();
  assert.equal(f.frame.x,90);
  assert.equal(f.frame.width,width-180);
  assert.equal(f.cells.length,4);
  assert.ok(f.cells.every(c=>d.seen.has(c.x+','+c.z)));
  assert.equal(f.pins.length,1);
  assert.equal(f.pins[0].worldX,4);
  assert.equal(f.pins[0].worldZ,0);
  assert.equal(f.pins[0].screenX,90+f.frame.width/2+7);
  assert.equal(f.player.worldY,8);
  assert.ok(Math.abs(f.player.bearing-90)<1e-9);
  assert.equal(f.undiscoveredCount,null);
 });
}
test('camera pan and zoom never add fog cells or change world save',()=>{
 const d=discovery();const before=[...d.seen].sort();
 const a=createNavigationAdapter({seed:9,discovery:d,width:667,height:375,player:{x:0,z:0,yaw:0}});
 a.viewport.panPixels({dx:21,dy:-7});
 a.viewport.zoomAt({factor:1.5,screenX:330,screenY:180});
 a.updatePlayer({x:5,z:1,yaw:Math.PI,y:-10});
 const f=a.frame();
 assert.equal(f.player.worldY,-10);
 assert.ok(Math.abs(f.player.bearing-180)<1e-9);
 assert.deepEqual([...d.seen].sort(),before);
 assert.throws(()=>a.updatePlayer({x:NaN,z:0,yaw:0}));
 assert.equal(a.frame().player.worldX,5);
});
test('seed-specific pins and malformed player coordinates fail closed',()=>{
 assert.throws(()=>createNavigationAdapter({seed:1,discovery:discovery(),width:667,height:375,player:{x:NaN,z:0,yaw:0}}));
 const d=discovery(),store=new Map();
 const storage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)};
 const a=createNavigationAdapter({seed:10,discovery:d,storage,width:667,height:375,player:{x:0,z:0,yaw:0}});
 assert.equal(a.navigator.pin({id:'p',x:0,z:0,label:'Here'}),true);
 const b=createNavigationAdapter({seed:11,discovery:d,storage,width:667,height:375,player:{x:0,z:0,yaw:0}});
 assert.equal(b.frame().pins.length,0);
 assert.equal(a.frame().pins.length,1);
});
