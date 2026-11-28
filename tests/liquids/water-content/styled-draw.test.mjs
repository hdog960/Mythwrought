import test from 'node:test';
import assert from 'node:assert/strict';
import {buildLiquidMesh} from '../../../src/liquids/presentation/mesh.mjs';
import {planLiquidDraws} from '../../../src/liquids/presentation/draw-plan.mjs';
import {prepareLiquidFaceStyles,admitStyledLiquidDraws} from '../../../src/liquids/presentation/styled-draw.mjs';
import {prepareWaterBatchStyles,expandWaterStyleDirty} from '../../../src/liquids/water/content/water-face-styles.mjs';
import {WATER_MATERIAL} from '../../../src/liquids/water/content/material.mjs';
const materials={water:WATER_MATERIAL,lava:{id:'lava',pass:'opaque',depthTest:true,depthWrite:true,cull:false}};
const cell=(x,y,z,units=8,id='water')=>({x,y,z,units,id});
function fixture(rows,origin=[0,0,0],isOpen=()=>true){
  const map=new Map(rows.map(c=>[[c.x,c.y,c.z].join(','),c]));
  const engine={getCell:(...p)=>map.get(p.join(','))??null},isLoaded=()=>true;
  const mesh=buildLiquidMesh({engine,isLoaded,isOpen,origin,cells:rows.map(c=>[c.x,c.y,c.z])});
  return {batch:{id:'a',revision:1,mesh},engine,isLoaded,isOpen,map};
}
function options(fixtures){
  const batches=fixtures.map(f=>f.batch),styleBindings=fixtures.map(f=>prepareWaterBatchStyles(f));
  const handles=new Map(batches.map(b=>[b.id,{id:b.id,revision:b.revision,origin:b.mesh.origin,groups:b.mesh.groups.map(g=>({id:g.id,indexCount:g.indices.length}))}]));
  return {batches,styleBindings,gpu:{get:id=>handles.get(id)},handles,materials,camera:[0,0,0],forward:[0,1,0]};
}
const flatten=r=>r.flatMap(c=>Array.from({length:c.indexCount/6},(_,i)=>[c.batchId,c.revision,c.liquid,c.firstIndex+i*6]));
test('actual mesh owner recovery handles full and fractional cells at negative and high coordinates',()=>{
  for(const [x,y,z] of [[-19,-210,-3],[9000000000000,256,5]]){
    for(const units of [1,4,8]){
      const f=fixture([cell(x,y,z,units)],[x,y,z]);const seen=[];
      const token=prepareLiquidFaceStyles({batch:f.batch,styleForFace:p=>{seen.push(p);return null;}});
      assert.equal(token.faces,f.batch.mesh.faceCount);assert(seen.length>0);assert(seen.every(p=>p.cell.join(',')===[x,y,z].join(',')));
    }
  }
});
test('clipped sides and unlike interfaces recover their actual producing cell',()=>{
  const f=fixture([cell(0,0,0,8),cell(1,0,0,3),cell(0,0,1,2,'lava')]);const seen=[];
  prepareLiquidFaceStyles({batch:f.batch,styleForFace:p=>{seen.push(p);return null;}});
  assert(seen.some(p=>p.cell.join(',')==='0,0,0'&&p.normal.join(',')==='1,0,0'));
  assert(seen.some(p=>p.cell.join(',')==='0,0,1'&&p.liquid==='lava'&&p.normal.join(',')==='0,0,-1'));
  assert(seen.every(p=>f.map.get(p.cell.join(',')).id===p.liquid));
});
test('real water material and surface hints bind to matching top/side ranges',()=>{
  const f=fixture([cell(0,0,0,4),cell(0,-1,0,8)],[0,0,0],(x,y,z)=>!(x===-1&&y===0&&z===0));
  const o=options([f]),r=admitStyledLiquidDraws(o);assert.equal(r.status,'admitted');
  const ranges=r.plan.transparent;assert(ranges.some(c=>c.style[4]===1&&c.style[5]&4));
  assert(ranges.some(c=>c.style[4]===0.82&&c.style[8]===0.16));
  assert(ranges.every(c=>c.style[3]===WATER_MATERIAL.alpha));
  assert(ranges.every(c=>Object.isFrozen(c.style)));
});
test('mixed-material two-batch order exactly matches shared draw plan, including ties',()=>{
  const a=fixture([cell(0,0,0,8),cell(1,0,0,4,'lava')]);
  const b=fixture([cell(0,0,1,3),cell(1,0,1,8,'lava')]);b.batch.id='b';
  const o=options([a,b]);const original=planLiquidDraws(o),r=admitStyledLiquidDraws(o);
  assert.equal(r.status,'admitted');assert.deepEqual(flatten(r.plan.opaque),flatten(original.opaque));
  assert.deepEqual(flatten(r.plan.transparent),flatten(original.transparent));
  assert(r.plan.opaque.every(c=>c.style===null));assert.equal(r.plan.faces,original.faces);
});
test('equal adjacent styles coalesce, different styles split, and tight budget rejects whole frame',()=>{
  const f=fixture([cell(0,0,0,4)]);const o=options([f]);
  o.styleBindings=[prepareLiquidFaceStyles({batch:f.batch,styleForFace:()=>[1]})];
  const base=planLiquidDraws(o),same=admitStyledLiquidDraws(o);
  assert.equal(same.plan.drawCalls,base.transparent.length);
  let i=0;o.styleBindings=[prepareLiquidFaceStyles({batch:f.batch,styleForFace:()=>[++i]})];
  const split=admitStyledLiquidDraws(o);assert.equal(split.plan.drawCalls,f.batch.mesh.faceCount);
  assert.deepEqual(admitStyledLiquidDraws({...o,maxDrawCalls:split.plan.drawCalls-1}),{status:'draw-budget',plan:null});
  assert.equal(admitStyledLiquidDraws({...o,maxDrawCalls:split.plan.drawCalls}).status,'admitted');
});
test('stale mesh identity, forged binding and missing or wrong GPU publication fail closed',()=>{
  const f=fixture([cell(0,0,0)]);const o=options([f]);
  assert.deepEqual(admitStyledLiquidDraws({...o,batches:[{...f.batch,mesh:{...f.batch.mesh}}]}),{status:'stale-style',plan:null});
  assert.equal(admitStyledLiquidDraws({...o,styleBindings:[{...o.styleBindings[0]}]}).status,'stale-style');
  const gpu=o.handles.get('a');gpu.revision=2;assert.equal(admitStyledLiquidDraws(o).status,'stale-gpu');
  gpu.revision=1;gpu.groups[0].indexCount--;assert.equal(admitStyledLiquidDraws(o).status,'stale-gpu');
  o.handles.clear();assert.equal(admitStyledLiquidDraws(o).status,'stale-gpu');
});
test('style preparation rejects stale water owners, malformed normals and face caps',()=>{
  const f=fixture([cell(0,0,0)]);f.map.clear();assert.throws(()=>prepareWaterBatchStyles(f),/loaded water owner/);
  assert.throws(()=>prepareLiquidFaceStyles({batch:f.batch,styleForFace:()=>null,maxFaces:1}));
  f.batch.mesh.groups[0].normals[0]=0.5;
  assert.throws(()=>prepareLiquidFaceStyles({batch:f.batch,styleForFace:()=>null}),/face normal/);
});
test('water dirty reverse stencil includes diagonal-up owners, deduplicates and respects height and caps',()=>{
  const dirty=expandWaterStyleDirty([[15,0,0],[15,0,0]]);assert.equal(dirty.length,11);
  assert(dirty.some(p=>p.join(',')==='16,1,0'));assert(dirty.some(p=>p.join(',')==='15,1,-1'));
  const top=expandWaterStyleDirty([[0,256,0]]);assert.equal(top.length,6);assert(top.every(p=>p[1]<=256));
  assert.throws(()=>expandWaterStyleDirty([[0,0,0]],{maxDirty:10}));
  assert.throws(()=>expandWaterStyleDirty([[0,-211,0]]));
});
