import test from 'node:test';
import assert from 'node:assert/strict';
import {createNavigationGestures} from '../src/navigation00/navigation-gestures.mjs';
function fixture(width,height){
 const calls=[];let zoom=7;
 const viewport={snapshot:()=>({frame:{x:96,y:12,width:width-192,height:height-30},zoom}),panPixels:v=>calls.push(['pan',v]),zoomAt:v=>{calls.push(['zoom',v]);zoom=Math.min(14,Math.max(4,zoom*v.factor));}};
 return {calls,viewport,controller:createNavigationGestures({viewport})};
}
for(const [w,h] of [[667,375],[844,390],[932,430]]){
 test(`map gestures respect both thumb rails ${w}x${h}`,()=>{
  const {calls,controller:g}=fixture(w,h);const mid=w/2;
  assert.equal(g.begin(1,mid,100),false,'closed map cannot capture gameplay touches');
  g.open();
  assert.equal(g.begin(1,50,100),false,'left rail remains gameplay-owned');
  assert.equal(g.begin(2,w-30,100),false,'right rail remains gameplay-owned');
  assert.equal(g.begin(3,mid,100),true);
  assert.equal(g.move(3,mid+12,105),true);
  assert.deepEqual(calls,[['pan',{dx:12,dy:5}]]);
  assert.equal(g.move(3,w-20,105),false,'leaving map cancels map gesture');
  assert.equal(g.activePointers,0);
  assert.equal(g.end(3),false);
  g.close();assert.equal(g.begin(4,mid,100),false);
 });
}
test('pinch zoom is bounded by viewport and does not jump when a finger lifts',()=>{
 const {calls,controller:g}=fixture(844,390);g.open();
 assert.equal(g.begin('a',300,180),true);
 assert.equal(g.begin('b',340,180),true);
 assert.equal(g.move('b',360,180),true);
 assert.equal(calls[0][0],'zoom');assert.equal(calls[0][1].factor,1.5);
 assert.equal(g.end('b'),true);
 assert.equal(g.move('a',310,180),true);
 assert.deepEqual(calls.at(-1),['pan',{dx:10,dy:0}]);
 g.close();assert.equal(g.activePointers,0);
});
test('invalid coordinates and duplicate pointers cannot mutate camera',()=>{
 const {calls,controller:g}=fixture(667,375);g.open();
 assert.throws(()=>g.begin(1,NaN,100));
 assert.equal(g.begin(1,300,100),true);
 assert.equal(g.begin(1,310,100),false);
 assert.throws(()=>g.move(1,Infinity,100));
 assert.equal(g.activePointers,1);
 assert.deepEqual(calls,[]);
 g.cancel();assert.equal(g.activePointers,0);
});
