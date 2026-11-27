import test from 'node:test';
import assert from 'node:assert/strict';
import {buildLiquidMesh as mesh,expandLiquidDirty as dirty,PRESENTATION_IDS} from '../../../src/liquids/presentation/mesh.mjs';
import {WATER_MATERIAL} from '../../../src/liquids/water/content/material.mjs';
const cell=(x,y,z,units=8,id='water')=>({x,y,z,units,id,quantities:{}});
function fixture(records,opts={}){
  const m=new Map(records.map(c=>[[c.x,c.y,c.z].join(','),c]));
  return mesh({engine:{getCell:(...p)=>m.get(p.join(','))??null},isLoaded:()=>true,isOpen:()=>true,
    cells:records.map(c=>[c.x,c.y,c.z]),origin:[0,0,0],...opts});
}
const quads=m=>m.groups.flatMap(g=>Array.from({length:g.indices.length/6},(_,i)=>({id:g.id,p:Array.from(g.positions.slice(i*12,i*12+12)),n:Array.from(g.normals.slice(i*12,i*12+3))})));
const faces=(m,n)=>quads(m).filter(q=>q.n.join(',')===n.join(','));
test('fractional height and typed indexed geometry',()=>{const m=fixture([cell(0,0,0,3)]);assert.equal(m.faceCount,6);assert.ok(m.groups[0].indices instanceof Uint32Array);assert.ok(m.groups[0].positions instanceof Float32Array);assert.equal(faces(m,[0,1,0])[0].p[1],3/8);});
test('winding agrees with outward normals on every face',()=>{for(const q of quads(fixture([cell(0,0,0)]))){const a=q.p.slice(0,3),b=q.p.slice(3,6).map((v,i)=>v-a[i]),c=q.p.slice(6,9).map((v,i)=>v-a[i]);const cross=[b[1]*c[2]-b[2]*c[1],b[2]*c[0]-b[0]*c[2],b[0]*c[1]-b[1]*c[0]];assert.ok(cross.reduce((s,v,i)=>s+v*q.n[i],0)>0);}});
test('same-liquid shared faces disappear',()=>{assert.equal(fixture([cell(0,0,0),cell(1,0,0)]).faceCount,10);assert.equal(fixture([cell(0,0,0),cell(0,1,0)]).faceCount,10);});
test('unequal fill emits only exposed side strip',()=>{const m=fixture([cell(0,0,0,8),cell(1,0,0,3)]);const q=faces(m,[1,0,0]).find(q=>q.p[0]===1);assert.equal(q.p[1],3/8);assert.equal(q.p[4],1);assert.equal(faces(m,[-1,0,0]).filter(q=>q.p[0]===1).length,0);});
test('different liquids share exactly one coplanar interface across separate owners',()=>{const c=[cell(0,0,0,8,'water'),cell(1,0,0,4,'lava')];const a=fixture(c,{cells:[[0,0,0]]}),b=fixture(c,{cells:[[1,0,0]]});const seam=[...quads(a),...quads(b)].filter(q=>Math.abs(q.n[0])===1&&q.p[0]===1);assert.deepEqual(seam.map(q=>[q.id,q.p[1],q.p[4]]),[['water',0.5,1],['lava',0,0.5]]);});
test('vertical different-liquid interface also has one owner',()=>{const m=fixture([cell(0,0,0,8,'water'),cell(0,1,0,8,'lava')]);const seam=quads(m).filter(q=>Math.abs(q.n[1])===1&&q.p[1]===1);assert.equal(seam.length,1);assert.equal(seam[0].id,'lava');});
test('partial lower liquid leaves a visible air gap',()=>{const m=fixture([cell(0,0,0,4),cell(0,1,0,4)]);assert.equal(m.faceCount,12);});
test('unloaded and solid neighbors never read or emit boundary sides',()=>{let reads=0;const m=fixture([cell(0,0,0,4)],{isLoaded:x=>x===0,isOpen:(x,y,z)=>y===0&&z===0,engine:{getCell:()=>{reads++;return cell(0,0,0,4);}}});assert.equal(reads,1);assert.equal(m.faceCount,1);});
test('dirty expansion deduplicates and clips physical height',()=>{assert.equal(dirty([[0,256,0],[0,256,0]]).length,6);assert.equal(dirty([[0,-210,0]]).length,6);assert.throws(()=>dirty([[0,0,0]],{maxDirty:6}),RangeError);});
test('budgets fail closed and duplicate owner positions are suppressed',()=>{const c=[cell(0,0,0)];assert.equal(fixture(c,{cells:[[0,0,0],[0,0,0]]}).faceCount,6);assert.throws(()=>fixture(c,{maxFaces:5}),RangeError);assert.throws(()=>fixture(c,{cells:[[0,0,0],[1,0,0]],maxCells:1}),RangeError);});
test('large coordinates preserve exact local eighths',()=>{const x=2**40,m=fixture([cell(x,256,-x,7)],{origin:[x,256,-x]});assert.equal(faces(m,[0,1,0])[0].p[1],7/8);assert.throws(()=>fixture([cell(x,0,0)]),RangeError);});
test('all five IDs, deterministic groups and water material hook',()=>{const m=fixture([...PRESENTATION_IDS].reverse().map((id,i)=>cell(i*3,0,0,8,id)));assert.deepEqual(m.groups.map(g=>g.id),PRESENTATION_IDS);assert.equal(WATER_MATERIAL.depthWrite,false);assert.equal(WATER_MATERIAL.depthTest,true);assert.equal(WATER_MATERIAL.cull,false);assert.throws(()=>fixture([cell(0,0,0,9)]),TypeError);});
