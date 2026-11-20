import test from 'node:test';
import assert from 'node:assert/strict';
import {createNavigationViewport} from '../src/navigation00/navigation-viewport.mjs';
for (const [width,height] of [[667,375],[844,390],[932,430]]) {
  test(`landscape ${width}x${height} preserves thumb rails and map viewport`,()=>{
    const c=createNavigationViewport({width,height,safeArea:{left:90,right:90,top:16,bottom:20}});
    const s=c.snapshot();
    assert.deepEqual(s.frame,{x:90,y:16,width:width-180,height:height-36});
    assert.equal(c.zoomAt({factor:2,screenX:30,screenY:100}).zoom,7);
    assert.equal(c.zoomAt({factor:2,screenX:width/2,screenY:height/2}).zoom,14);
    assert.equal(c.zoomAt({factor:5,screenX:width/2,screenY:height/2}).zoom,14);
    assert.equal(c.projectOptions({x:0,z:0,yaw:0}).width,width-180);
  });
}
test('zoom focal point remains fixed in world space; panning uses world units',()=>{
 const c=createNavigationViewport({width:667,height:375});
 const x=430,y=210,centerX=333.5,centerY=187.5;
 const before=c.snapshot();
 const worldX=before.panX+(x-centerX)*4/before.zoom;
 const worldZ=before.panZ+(y-centerY)*4/before.zoom;
 const after=c.zoomAt({factor:1.5,screenX:x,screenY:y});
 assert.ok(Math.abs(worldX-(after.panX+(x-centerX)*4/after.zoom))<1e-9);
 assert.ok(Math.abs(worldZ-(after.panZ+(y-centerY)*4/after.zoom))<1e-9);
 const pan=c.panPixels({dx:21,dy:-7});
 assert.ok(Math.abs(pan.panX-(after.panX-21*4/after.zoom))<1e-9);
 assert.ok(Math.abs(pan.panZ-(after.panZ+7*4/after.zoom))<1e-9);
});
test('malformed gestures and invalid safe areas fail without changing state',()=>{
 const c=createNavigationViewport({width:667,height:375});const old=c.snapshot();
 assert.throws(()=>c.zoomAt({factor:Infinity,screenX:20,screenY:20}));
 assert.throws(()=>c.panPixels({dx:NaN,dy:0}));
 assert.throws(()=>c.resize({width:667,height:375,safeArea:{left:400,right:400,top:0,bottom:0}}));
 assert.deepEqual(c.snapshot(),old);
});
