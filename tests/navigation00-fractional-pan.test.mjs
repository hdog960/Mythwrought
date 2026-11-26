import test from 'node:test';
import assert from 'node:assert/strict';
import {createObservedNavigator} from '../src/navigation00/observed-navigation.mjs';
import {createNavigationProjection} from '../src/navigation00/navigation-projection.mjs';

test('fractional pan projects continuously without revealing new discovery',()=>{
 const discovery={seen:new Set(['0,0','1,0','-1,-1']),has(x,z){return this.seen.has(Math.floor(x/4)+','+Math.floor(z/4));}};
 const n=createObservedNavigator({seed:99,discovery});
 for(const [width,height] of [[667,375],[844,390],[932,430]]){
  const base=n.project({player:{x:0,z:0,yaw:0},width,height});
  const moved=n.project({player:{x:0,z:0,yaw:0},panX:1,panZ:-0.5,width,height});
  assert.deepEqual(moved.cells.map(c=>[c.x,c.z]),base.cells.map(c=>[c.x,c.z]));
  assert.equal(moved.cells.find(c=>c.x===0&&c.z===0).screenX,base.cells.find(c=>c.x===0&&c.z===0).screenX-7/4);
  assert.equal(moved.cells.find(c=>c.x===0&&c.z===0).screenY,base.cells.find(c=>c.x===0&&c.z===0).screenY+7/8);
  const projection=createNavigationProjection({frame:{x:0,y:0,width,height},zoom:7,center:moved.center});
  for(const cell of moved.cells)assert.deepEqual(projection.cell(cell.x,cell.z),{screenX:cell.screenX,screenY:cell.screenY});
 }
 assert.equal(discovery.seen.size,3);
});
