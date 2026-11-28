import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,collides} from '../src/voxel.mjs';
import {resolveDodgeDisplacement as resolve} from '../src/movement12/dodge-displacement.mjs';
function fixture({wall=false,edge=100,feet=1}={}){
 const w={get(x,y,z){return y===feet-1&&x<edge||wall&&x===2&&y>=feet&&y<feet+2?BLOCK.STONE:BLOCK.AIR;}};
 const start={x:.5,feet,z:.5};
 return {world:w,start,desired:{x:3,z:0},regionReady:()=>true,geometryReady:()=>true};
}
test('clear displacement does not mutate player or terrain',()=>{
 const a=fixture(),r=resolve(a);assert.equal(r.status,'accepted');assert.equal(r.pose.x,3.5);
 assert.equal(a.start.x,.5);assert.equal(collides(a.world,r.pose.x,r.pose.feet,r.pose.z),false);
});
test('destination-only movement would cross a wall; candidate stops short',()=>{
 const a=fixture({wall:true});assert.equal(collides(a.world,3.5,1,.5),false);
 const r=resolve(a);assert.equal(r.status,'partial');assert.equal(r.reason,'collision');
 assert.ok(r.pose.x<1.73);assert.equal(collides(a.world,r.pose.x,1,.5),false);
});
test('ledge, unknown region and unknown geometry stop motion',()=>{
 const a=fixture({edge:2});assert.equal(resolve(a).reason,'unsupported');
 assert.equal(resolve({...a,regionReady:()=>false}).status,'blocked');
 assert.equal(resolve({...a,geometryReady:()=>false}).reason,'geometry-unverified');
});
test('authority failure rolls back even a partial proposal',()=>{
 const a=fixture();let n=0;
 const r=resolve({...a,regionReady:()=>{if(++n>4)throw Error('unavailable');return true;}});
 assert.equal(r.reason,'authority-error');assert.deepEqual(r.pose,a.start);
});
test('shared height, bounded requests and no vertical bypass',()=>{
 const a=fixture({feet:200});assert.equal(resolve(a).status,'accepted');
 assert.equal(resolve(fixture({feet:256})).reason,'height-bound');
 assert.throws(()=>resolve({...a,desired:{x:5,z:0}}));
 assert.throws(()=>resolve({...a,desired:{x:1,z:0,feet:1}}));
});
test('diagonal path is bounded and deterministic',()=>{
 const a=fixture({wall:true});a.desired={x:2,z:2};
 const r=resolve(a);assert.deepEqual(resolve(a),r);assert.equal(r.status,'partial');
 assert.ok(r.queries<=2+4*Math.ceil(Math.hypot(2,2)/.05));
 assert.equal(collides(a.world,r.pose.x,r.pose.feet,r.pose.z),false);
});
