import test from 'node:test';
import assert from 'node:assert/strict';
import {layoutNavigationControls} from '../src/navigation00/navigation-safe-controls.mjs';
for (const [width,height] of [[667,375],[844,390],[932,430]]) {
  test(`safe controls stay clear of thumb rails at ${width}x${height}`,()=>{
    const controls=layoutNavigationControls({frame:{x:0,y:0,width,height},thumbRails:{left:110,right:110}});
    assert.ok(controls);
    const boxes=Object.values(controls);
    for (const b of boxes) {
      assert.ok(b.x>=110 && b.x+b.width<=width-110);
      assert.ok(b.y>=0 && b.y+b.height<=height);
      assert.ok(b.width>=44 && b.height>=44);
    }
    for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++)
      assert.ok(boxes[i].x+boxes[i].width<=boxes[j].x || boxes[j].x+boxes[j].width<=boxes[i].x);
  });
}
test('fails closed when rails leave insufficient room',()=>{
  assert.equal(layoutNavigationControls({frame:{x:0,y:0,width:250,height:200},thumbRails:{left:80,right:80}}),null);
});
test('rejects unsafe touch targets and invalid geometry',()=>{
  assert.throws(()=>layoutNavigationControls({frame:{x:0,y:0,width:667,height:375},buttonSize:32}));
  assert.throws(()=>layoutNavigationControls({frame:{x:0,y:0,width:667,height:375},thumbRails:{left:-1,right:0}}));
});
