import test from 'node:test';
import assert from 'node:assert/strict';
import {createNavigationAdapter} from '../src/navigation00/navigation-adapter.mjs';
import {createNavigationGestures} from '../src/navigation00/navigation-gestures.mjs';
import {paintNavigationFrame} from '../src/navigation00/navigation-paint.mjs';
import {createNavigationViewport} from '../src/navigation00/navigation-viewport.mjs';

const discovery=()=>({seen:new Set(['0,0','1,0']),has(x,z){return this.seen.has(Math.floor(x/4)+','+Math.floor(z/4));}});
test('production painter samples only projected discovered cells; zero yaw faces south',()=>{
 const d=discovery(),a=createNavigationAdapter({seed:5,discovery:d,width:320,height:320,player:{x:0,y:-80,z:0,yaw:0}});
 const calls=[],ctx={save(){},restore(){},beginPath(){},rect(){},clip(){},fillRect(){},moveTo(...v){calls.push(v)},lineTo(){},closePath(){},fill(){}};
 const canvas={width:320,height:320,getContext:()=>ctx};
 const sampled=[];
 paintNavigationFrame(canvas,a.frame(),{cellInk:c=>{sampled.push(c.x+','+c.z);return '#fff';}});
 assert.deepEqual(sampled.sort(),['0,0','1,0']);
 assert.deepEqual(calls[0],[160,168]);
 a.updatePlayer({x:0,y:240,z:0,yaw:Math.PI});
 paintNavigationFrame(canvas,a.frame());
 assert.deepEqual(calls[1],[160,152]);
 assert.equal(a.frame().player.worldY,240);
});
test('pinch with simultaneous midpoint translation preserves the world anchor',()=>{
 const viewport=createNavigationViewport({width:320,height:320});
 const gesture=createNavigationGestures({viewport,initiallyOpen:true});
 const worldAt=(x,y)=>{const s=viewport.snapshot();return [s.panX+(x-160)*4/s.zoom,s.panZ+(y-160)*4/s.zoom];};
 gesture.begin(1,100,120);gesture.begin(2,180,120);
 const before=worldAt(140,120);
 gesture.move(2,220,160);
 const after=worldAt(160,140);
 assert.ok(Math.abs(before[0]-after[0])<1e-9);
 assert.ok(Math.abs(before[1]-after[1])<1e-9);
 gesture.cancel();assert.equal(gesture.activePointers,0);
});
