import test from 'node:test';
import assert from 'node:assert/strict';
import {createNavigationProjection} from '../src/navigation00/navigation-projection.mjs';
for(const [width,height] of [[667,375],[844,390],[932,430]]){
 test(`same cell projection for discovered cell, player and pin at ${width}x${height}`,()=>{
  const frame={x:96,y:12,width:width-192,height:height-30};
  for(const zoom of [4,7,14])for(const center of [{x:0,z:0},{x:100,z:-80}]){
   const p=createNavigationProjection({frame,zoom,center});
   for(const [x,z] of [[0,0],[8,-12],[403,-317]]){
    const expected=p.cell(Math.floor(x/4),Math.floor(z/4));
    assert.deepEqual(p.world(x,z),expected);
    assert.deepEqual(p.world(x+0.5,z+0.5),expected);
   }
  }
 });
}
test('invalid coordinates fail closed',()=>{
 const p=createNavigationProjection({frame:{x:0,y:0,width:400,height:300},zoom:7,center:{x:0,z:0}});
 assert.throws(()=>p.world(NaN,0));assert.throws(()=>p.cell(0.5,1));
});
