import test from 'node:test';
import assert from 'node:assert/strict';
import {createNavigationAdapter} from '../src/navigation00/navigation-adapter.mjs';
import {paintNavigationFrame} from '../src/navigation00/navigation-paint.mjs';
const discovery=()=>({seen:new Set(['0,0','1,0']),has(x,z){return this.seen.has(Math.floor(x/4)+','+Math.floor(z/4));}});
function canvas(width,height){
 const calls=[],ctx={save(){calls.push('save')},restore(){calls.push('restore')},beginPath(){},rect(...v){calls.push(['cliprect',...v])},clip(){},fillRect(...v){calls.push(['fillrect',...v])},moveTo(){},lineTo(){},closePath(){},fill(){}};
 return {width,height,calls,getContext:t=>t==='2d'?ctx:null};
}
for(const [width,height] of [[667,375],[844,390],[932,430]]){
 test('opt-in paint clips discovery and keeps thumb rails '+width,()=>{
  const d=discovery(),a=createNavigationAdapter({seed:3,discovery:d,width,height,safeArea:{left:96,right:96,top:12,bottom:18},player:{x:0,z:0,yaw:0}});
  const c=canvas(width,height),f=a.frame(),before=[...d.seen];
  const result=paintNavigationFrame(c,f);
  assert.equal(result.cells,2);assert.deepEqual([...d.seen],before);
  assert.deepEqual(c.calls.find(v=>Array.isArray(v)&&v[0]==='cliprect'),['cliprect',96,12,width-192,height-30]);
  assert.equal(c.calls.at(-1),'restore');
 });
}
test('malformed frame is rejected before canvas mutation',()=>{
 const a=createNavigationAdapter({seed:3,discovery:discovery(),width:667,height:375,player:{x:0,z:0,yaw:0}});
 const f=a.frame(),c=canvas(667,375);
 assert.throws(()=>paintNavigationFrame(c,{...f,cells:[{x:0,z:0,screenX:NaN,screenY:0}]}));
 assert.deepEqual(c.calls,[]);
});
