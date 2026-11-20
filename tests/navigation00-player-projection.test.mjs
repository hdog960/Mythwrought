import test from 'node:test';
import assert from 'node:assert/strict';
import {createNavigationAdapter} from '../src/navigation00/navigation-adapter.mjs';

const makeDiscovery=()=>({
  seen:new Set(['0,0','1,0','2,0','0,1','-1,0','-2,0']),
  has(x,z){return this.seen.has(Math.floor(x/4)+','+Math.floor(z/4));}
});
for(const [width,height] of [[667,375],[844,390],[932,430]]){
  test('player marker follows actual discovered cell, not raw world units: '+width+'x'+height,()=>{
    const d=makeDiscovery(),seenBefore=[...d.seen].sort();
    const a=createNavigationAdapter({seed:31,discovery:d,width,height,
      safeArea:{left:96,right:96,top:12,bottom:18},
      player:{x:9,y:-18,z:1,yaw:Math.PI/2}});
    let f=a.frame();
    assert.equal(f.player.screenX,f.frame.x+f.frame.width/2);
    assert.equal(f.player.screenY,f.frame.y+f.frame.height/2);
    assert.equal(f.player.worldX,9);
    assert.equal(f.player.worldY,-18);
    assert.equal(f.player.bearing,90);
    a.updatePlayer({x:4,z:0,yaw:0});
    f=a.frame();
    assert.equal(f.player.worldY,-18,'horizontal updates must retain depth');
    assert.equal(f.player.screenX,f.frame.x+f.frame.width/2);
    assert.equal(f.player.screenY,f.frame.y+f.frame.height/2);
    assert.deepEqual([...d.seen].sort(),seenBefore,'navigation must not reveal terrain');
    assert.ok(f.cells.every(c=>d.seen.has(c.x+','+c.z)));
  });
}
test('panning changes player screen position without changing player world coordinates',()=>{
  const a=createNavigationAdapter({seed:32,discovery:makeDiscovery(),width:667,height:375,
    player:{x:8,y:-2,z:0,yaw:0}});
  const before=a.frame();
  a.viewport.panPixels({dx:14,dy:0});
  const after=a.frame();
  assert.equal(after.player.worldX,before.player.worldX);
  assert.equal(after.player.worldY,before.player.worldY);
  assert.notEqual(after.player.screenX,before.player.screenX);
});
