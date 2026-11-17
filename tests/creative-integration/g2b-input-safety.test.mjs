import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createG2ControlState,enterG2ControlOwnership,dispatchG2Control,
 readG2ControlIntent,clearG2Controls,releaseG2ControlOwnership}
 from '../../src/creative-integration/g2-control-state.mjs';
const src=readFileSync(new URL('../../src/main.mjs',import.meta.url),'utf8');
const html=readFileSync(new URL('../../index.html',import.meta.url),'utf8');
const css=readFileSync(new URL('../../styles.css',import.meta.url),'utf8');
test('G2B preserves original two-thumb MOVE and LOOK pads and world minimap',()=>{
 for(const id of ['movePad','lookPad','miniMapButton','miniMap','explorationOverlay'])
   assert.ok(html.includes('id="'+id+'"'),id);
 assert.ok(css.includes('.viewport>.map-button'));
 assert.ok(!css.includes('.g2b-flight-active .viewport>.map-button{'));
});
test('G2B flight uses original physical button IDs with gated Explore actions',()=>{
 for(const id of ['dig','place','jump'])assert.ok(html.includes('id="'+id+'"'));
 assert.ok(src.includes("bindGameplayAction('dig',()=>edit('mine'))"));
 assert.ok(src.includes("g2BindHold('dig','down')"));
 assert.ok(src.includes("g2BindHold('place','up')"));
 assert.ok(src.includes('g2BindJumpToggle()'));
 assert.ok(src.includes("if(zone==='up'||zone==='down')g2Move(.05)"));
 assert.ok(src.includes('const G2_JUMP_DOUBLE_TAP_MS=650'));
 assert.ok(src.includes('g2JumpTap(e.timeStamp)'));
 assert.ok(src.includes('let lastG2JumpReleaseAt=-Infinity'));
 assert.ok(src.includes('const gap=now-lastG2JumpReleaseAt'));
 assert.ok(src.includes("if(e.type==='pointerup'&&!doubleForTouch)"));
 assert.ok(src.includes("window.addEventListener(kind,finishTouch,true)"));
 assert.ok(src.includes("e.pointerType==='touch'"));
 assert.ok(src.includes('e.timeStamp-lastTouchAt<1500'));
 assert.ok(src.includes('e.timeStamp-lastTouch<1500'));
 assert.ok(!src.includes('if(e.detail!==0&&performance.now()-lastTouchAt<850)'));
 assert.ok(src.includes('if(g2Active())g2Land();else g2Start();'));
 assert.ok(!src.includes("g2BindHold('jump','land')"));
 assert.ok(src.includes('||button.disabled||g2Active()'));
});
test('G2B source uses separate independent pointer ownership and release',()=>{
 assert.ok(src.includes("pointerPad(movementPad"));
 assert.ok(src.includes("},'move');"));
 assert.ok(src.includes("},'look');"));
 assert.ok(src.includes("type:'pointerdown',id:active,zone:g2Zone"));
 assert.ok(src.includes("type:'pointerup',id:active"));
});
test('G2B pure two-thumb dispatch is released separately and does not steal',()=>{
 let s=enterG2ControlOwnership(createG2ControlState(),{featureEnabled:true,flightReady:true});
 s=dispatchG2Control(s,{type:'pointerdown',id:1,zone:'move'});
 s=dispatchG2Control(s,{type:'pointerdown',id:2,zone:'look'});
 s=dispatchG2Control(s,{type:'pointermove',id:1,x:1,y:-1});
 assert.equal(readG2ControlIntent(s).forward,1);
 s=dispatchG2Control(s,{type:'pointerup',id:2});
 assert.equal(readG2ControlIntent(s).forward,1);
 s=dispatchG2Control(s,{type:'pointerup',id:1});
 assert.equal(readG2ControlIntent(s).forward,0);
});
test('G2B source clears flight input on blur, visibility, map, context loss',()=>{
 assert.ok(src.includes('g2Pause(\'Touch interrupted; hover safely\')'));
 assert.ok(src.includes("window.addEventListener('blur',cancelAllPointers)"));
 assert.ok(src.includes("onOpen:()=>cancelAllPointers()"));
 assert.ok(src.includes("canvas.addEventListener('webglcontextlost'"));
 assert.ok(src.includes('frameDriver.pause();cancelAllPointers()'));
});
test('G2B first resumed W or thumb input is safety-checked before capture',()=>{
 assert.ok(src.includes('function g2ResumeControls()'));
 assert.ok(src.includes('!g2Ready(p)||!g2Clear(p)'));
 assert.ok(src.includes("g2ResumeControls();\n      g2Controls=dispatchG2Control(g2Controls,{type:'key'"));
 assert.ok(src.includes("g2ResumeControls();\n        g2Controls=dispatchG2Control(g2Controls,{type:'pointerdown'"));
});
test('G2B LAND tap cannot emit a delayed Explore JUMP or edit after mode flip',()=>{
 assert.ok(src.includes('const g2ConsumedClicks=new Map()'));
 assert.ok(src.includes('g2ConsumedClicks.set(id,lastTouch)'));
 assert.ok(src.includes('g2ConsumedClicks.get(id)'));
 assert.ok(src.includes('g2ConsumedClicks.delete(id)'));
 assert.ok(src.includes('if(consumed!==undefined&&'));
});
test('G2B no unsafe change to walking ownership during failed landing',()=>{
 let s=enterG2ControlOwnership(createG2ControlState(),{featureEnabled:true,flightReady:true});
 s=releaseG2ControlOwnership(s,{landed:false});
 assert.equal(s.owner,'creative-flight');assert.equal(s.paused,true);
 s=clearG2Controls(s);
 assert.equal(readG2ControlIntent(s).vertical,0);
});
test('G2B mode UI is optional, accessible, not persisted, and labels dynamically change',()=>{
 assert.ok(html.includes('id="g2bFlightEnable"'));
 assert.ok(html.includes('id="g2bFlightProfile"'));
 assert.ok(html.includes('id="g2bFlightStatus"'));
 assert.ok(src.includes('g2Toggle.checked=false'));
 assert.ok(src.includes("g2Profile.value='normal'"));
 assert.ok(src.includes("el.setAttribute('aria-label',aria)"));
 assert.ok(!src.includes("localStorage.setItem('g2b"));
});
test('G2B world switches and all restore paths reset airborne state before new spawn',()=>{
 assert.equal(src.split('g2NewWorld();world=candidate;').length-1,4);
 assert.ok(src.includes('g2Epoch++'));
 assert.ok(src.includes('g2Flight=null;g2Controls=createG2ControlState()'));
});
