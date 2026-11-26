import test from 'node:test';
import assert from 'node:assert/strict';
import {createObservedNavigator} from '../src/navigation00/observed-navigation.mjs';
const discovery={seen:new Set(['-1,-1','0,0']),has(x,z){return this.seen.has(Math.floor(x/4)+','+Math.floor(z/4));}};
for(const [width,height] of [[667,375],[844,390],[932,430]]){
 test('projected pins retain original world coordinates at '+width+'x'+height,()=>{
  const n=createObservedNavigator({seed:987,discovery});
  assert.equal(n.pin({id:'west',x:-2,z:-3,label:'West'}),true);
  const projected=n.project({player:{x:0,z:0,yaw:0},width,height,zoom:7});
  const p=projected.pins[0];
  assert.equal(p.x,-2);assert.equal(p.z,-3);
  assert.equal(p.worldX,-2);assert.equal(p.worldZ,-3);
  assert.equal(p.screenX,width/2-7);assert.equal(p.screenY,height/2-7);
  assert.deepEqual(n.visiblePins()[0],{id:'west',x:-2,z:-3,label:'West'});
 });
}
