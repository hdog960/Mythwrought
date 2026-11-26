import test from 'node:test';
import assert from 'node:assert/strict';
import {layoutNavigationSafeArea} from '../src/navigation00/navigation-safe-area.mjs';
for (const [width,height] of [[667,375],[844,390],[932,430]]) {
  test(`safe-area insets and thumb rails at ${width}x${height}`,()=>{
    const insets={left:47,right:34,top:12,bottom:21};
    const {frame,controls}=layoutNavigationSafeArea({width,height,insets,thumbRails:{left:105,right:105}});
    assert.deepEqual(frame,{x:47,y:12,width:width-81,height:height-33});
    assert.ok(controls);
    for(const b of Object.values(controls)) {
      assert.ok(b.x>=frame.x+105);
      assert.ok(b.x+b.width<=frame.x+frame.width-105);
      assert.ok(b.y>=insets.top);
      assert.ok(b.y+b.height<=height-insets.bottom);
    }
  });
}
test('rejects unsafe or nonfinite inset geometry',()=>{
  for(const insets of [{left:-1,right:0,top:0,bottom:0},{left:NaN,right:0,top:0,bottom:0},{left:300,right:400,top:0,bottom:0},{left:0,right:0,top:200,bottom:200}])
    assert.throws(()=>layoutNavigationSafeArea({width:667,height:375,insets}));
});
test('fails closed rather than placing controls over rails',()=>{
  const result=layoutNavigationSafeArea({width:667,height:375,insets:{left:40,right:40,top:0,bottom:0},thumbRails:{left:250,right:250}});
  assert.equal(result.controls,null);
});
