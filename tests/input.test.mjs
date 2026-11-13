import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizedStick,safePointerDelta,stickLookDelta,selectedLookMode,isWorldControlTarget} from '../src/input.mjs';

test('touch deadzone prevents resting-finger drift',()=>{
  assert.deepEqual(normalizedStick(0,0,44),{x:0,y:0});
  assert.deepEqual(normalizedStick(2,1,44),{x:0,y:0});
  assert.deepEqual(normalizedStick(-2,0,44),{x:0,y:0});
});
test('stick is radially clamped and never faster diagonally',()=>{
  for(const [x,y] of [[0,100],[100,0],[-100,-100],[23,23],[-37,9]]){
    const v=normalizedStick(x,y,45);
    assert.ok(Math.hypot(v.x,v.y)<=1+1e-12);
  }
  assert.deepEqual(normalizedStick(90,0,40),{x:1,y:0});
  assert.throws(()=>normalizedStick(0,0,0));
});
test('pointer deltas filter jitter and cap sudden focus jumps',()=>{
  assert.deepEqual(safePointerDelta(.1,-.1),{x:0,y:0});
  assert.deepEqual(safePointerDelta(12,-4),{x:12,y:-4});
  const d=safePointerDelta(1000,1200);
  assert.ok(Math.abs(Math.hypot(d.x,d.y)-58)<1e-9);
  assert.throws(()=>safePointerDelta(Infinity,0));
});
test('stick camera rate uses time-based speed with bounded frame delta',()=>{
  const a=stickLookDelta({x:1,y:-1},.016);
  const b=stickLookDelta({x:1,y:-1},.032);
  assert.ok(Math.abs(b.x-2*a.x)<1e-10);
  assert.ok(stickLookDelta({x:1,y:1},10).x<=185*.05);
});
test('look mode and keyboard focus gracefully ignore invalid controls',()=>{
  assert.equal(selectedLookMode('stick'),'stick');
  assert.equal(selectedLookMode('swipe'),'swipe');
  assert.equal(selectedLookMode('bad'),'swipe');
  assert.equal(isWorldControlTarget({tagName:'INPUT'}),false);
  assert.equal(isWorldControlTarget({tagName:'DIV',isContentEditable:true}),false);
  assert.equal(isWorldControlTarget({tagName:'CANVAS'}),true);
});

import {MAX_PITCH,clampLook,forwardVector} from '../src/camera.mjs';
test('builder can aim almost straight down and up without crossing the vertical singularity',()=>{
  assert.ok(MAX_PITCH>1.54&&MAX_PITCH<Math.PI/2);
  const down=clampLook(0,0,0,2000);
  assert.equal(down.pitch,-MAX_PITCH);
  assert.ok(forwardVector(down.yaw,down.pitch)[1]<-.999,'Downward ray should reach blocks directly beneath the player');
  assert.equal(clampLook(0,0,0,-2000).pitch,MAX_PITCH);
  assert.equal(clampLook(0,down.pitch,0,500).pitch,-MAX_PITCH,'Pitch cannot flip after over-drag');
  assert.ok(forwardVector(0,down.pitch).every(Number.isFinite));
});

// Accessible nested controls must not trigger global Jump/WASD shortcuts.
test('keyboard focus in nested interactive controls never leaks into world input',()=>{
  const el=(tagName,parentElement=null,attrs={})=>({tagName,parentElement,isContentEditable:false,getAttribute:name=>attrs[name]??null});
  assert.equal(isWorldControlTarget(el('SPAN',el('BUTTON'))),false);
  assert.equal(isWorldControlTarget(el('SVG',el('A'))),false);
  assert.equal(isWorldControlTarget(el('SPAN',el('DIV',null,{role:'slider'}))),false);
  assert.equal(isWorldControlTarget(el('SPAN',el('DIV',null,{contenteditable:'true'}))),false);
  assert.equal(isWorldControlTarget(el('SUMMARY')),false);
  assert.equal(isWorldControlTarget(el('SPAN',el('CANVAS'))),true);
});

// HTML contenteditable="" and ARIA composite widgets are keyboard-owned surfaces.
test('empty editable attributes and composite widget descendants isolate shortcuts',()=>{
  const el=(tagName,parentElement=null,attrs={})=>({
    tagName,parentElement,isContentEditable:false,
    hasAttribute:name=>Object.prototype.hasOwnProperty.call(attrs,name),
    getAttribute:name=>Object.prototype.hasOwnProperty.call(attrs,name)?attrs[name]:null
  });
  assert.equal(isWorldControlTarget(el('SPAN',el('DIV',null,{contenteditable:''}))),false);
  assert.equal(isWorldControlTarget(el('SPAN',el('DIV',null,{contenteditable:'plaintext-only'}))),false);
  for(const role of ['tab','treeitem','gridcell','menuitemcheckbox','menuitemradio']){
    assert.equal(isWorldControlTarget(el('SPAN',el('DIV',null,{role}))),false,role);
  }
  assert.equal(isWorldControlTarget(el('SPAN',el('CANVAS'))),true);
});

test('ARIA composite containers reserve keyboard shortcuts for nested controls',()=>{
  const el=(tagName,parentElement=null,role=null)=>({
    tagName,parentElement,isContentEditable:false,
    getAttribute:name=>name==='role'?role:null
  });
  for(const role of ['menu','menubar','listbox','tree','grid','tablist','toolbar','radiogroup','dialog','alertdialog']){
    const container=el('DIV',null,role);
    assert.equal(isWorldControlTarget(el('SPAN',container)),false,role+' nested text');
    assert.equal(isWorldControlTarget(el('SVG',el('SPAN',container))),false,role+' nested icon');
  }
  assert.equal(isWorldControlTarget(el('SPAN',el('DIV',null,'presentation'))),true,
    'Presentation-only wrappers must not disable gameplay');
  assert.equal(isWorldControlTarget(el('CANVAS')),true);
});


test('retargeted shadow DOM keyboard shortcuts respect the actual focused widget',()=>{
  const host={tagName:'MY-WIDGET',nodeType:1,parentElement:null,getAttribute:()=>null};
  const inner={tagName:'INPUT',nodeType:1,parentElement:null,getAttribute:()=>null};
  const icon={tagName:'SPAN',nodeType:1,parentElement:null,getAttribute:()=>null};
  const dialog={tagName:'DIV',nodeType:1,parentElement:null,getAttribute:n=>n==='role'?'dialog':null};
  assert.equal(isWorldControlTarget(host,{composedPath:()=>[inner,host]}),false);
  assert.equal(isWorldControlTarget(host,{composedPath:()=>[icon,dialog,host]}),false);
  assert.equal(isWorldControlTarget(host,{composedPath:()=>[icon,host]}),true);
  assert.equal(isWorldControlTarget(host,{composedPath:()=>[]}),true);
  assert.equal(isWorldControlTarget(host),true);
});
