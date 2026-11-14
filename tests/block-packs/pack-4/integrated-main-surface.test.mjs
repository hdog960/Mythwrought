import test from 'node:test';
import assert from 'node:assert/strict';
import {pack4Shape} from '../../../src/block-packs/pack-4/fixture.mjs';
import {loadCheckpoint007} from './current-main-loader.mjs';

// The :12 opt-in prototypeSurfaceMesh source is now included in integration
// checkpoint 007. This tests its integration cost only; this is not a
// production mesher, live registry, WebGL2 run or approval to place assets.
const ids=Array.from({length:23},(_,i)=>159+i);
const descriptor=(id,turns)=>({
 prototypeOnly:true,placeable:false,
 boxes:pack4Shape(id,turns).collision
});

test('all 23 × four rotations produce bounded physical boundary-only geometry with integrated main',async t=>{
 const shared=await loadCheckpoint007(t,{surface:true});
 if(!shared)return;
 const {prototypeSurfaceMesh}=shared;
 let vertexCount=0,maxModel=0,models=0;
 for(const id of ids)for(let rotation=0;rotation<4;rotation++){
  const shape=descriptor(id,rotation);
  const m=prototypeSurfaceMesh(shape);
  assert.equal(m.surfaceOnly,true);
  assert.equal(m.boxes,shape.boxes.length);
  assert.ok(m.positions instanceof Float32Array);
  assert.ok(m.normals instanceof Float32Array);
  assert.ok(m.indices instanceof Uint16Array);
  assert.equal(m.positions.length,m.normals.length);
  assert.equal(m.positions.length%3,0);
  assert.equal(m.indices.length%3,0);
  const count=m.positions.length/3;
  assert.ok(count>0&&count<=1500,
   'integrated opt-in surface mesher above mobile review budget, id '+id+' r '+rotation+' verts '+count);
  assert.ok([...m.positions,...m.normals].every(Number.isFinite));
  assert.ok([...m.indices].every(i=>i>=0&&i<count));
  vertexCount+=count;maxModel=Math.max(maxModel,count);models++;
 }
 assert.equal(models,92);
 assert.ok(vertexCount<=50000);
 assert.ok(maxModel<=1000);
});

test('mesh faces retain unit axis normals and consistently outward-oriented winding',async t=>{
 const shared=await loadCheckpoint007(t,{surface:true});
 if(!shared)return;
 const {prototypeSurfaceMesh}=shared;
 for(const id of ids)for(let r=0;r<4;r++){
  const m=prototypeSurfaceMesh(descriptor(id,r));
  for(let i=0;i<m.indices.length;i+=3){
   const pos=idx=>[...m.positions.slice(idx*3,idx*3+3)];
   const [p,q,t]=[pos(m.indices[i]),pos(m.indices[i+1]),pos(m.indices[i+2])];
   const u=q.map((x,j)=>x-p[j]),v=t.map((x,j)=>x-p[j]);
   const cross=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],
    u[0]*v[1]-u[1]*v[0]];
   const n=[...m.normals.slice(m.indices[i]*3,m.indices[i]*3+3)];
   const area=cross.reduce((sum,x,j)=>sum+x*n[j],0);
   assert.ok(area>1e-9,'nonpositive main surface triangle id '+id+' rotation '+r);
   assert.equal(n.reduce((sum,x)=>sum+x*x,0),1);
  }
 }
});

test('rods, rims, pulley and hollow civic shapes remain bounded despite exposed-face subdivisions',async t=>{
 const shared=await loadCheckpoint007(t,{surface:true});
 if(!shared)return;
 const {prototypeSurfaceMesh}=shared;
 for(const id of [164,170,176,177,178,180,181]){
  const sh=pack4Shape(id,0);
  const m=prototypeSurfaceMesh(descriptor(id,0));
  // Boundary tessellation may legitimately split a box face into several
  // quads; the naive 12-triangles-per-box count is NOT a safe upper bound.
  assert.ok(m.triangles>0&&m.triangles<=450,
   'opt-in surface exceeded explicit mobile QA triangle cap for id '+id);
  assert.ok(sh.collision.length<=32);
 }
 const empty=(id,x,y,z)=>!pack4Shape(id,0).collision.some(b=>
  x>=b[0]&&x<b[3]&&y>=b[1]&&y<b[4]&&z>=b[2]&&z<b[5]);
 assert.equal(empty(176,.5,.5,.5),true);
 assert.equal(empty(178,.63,.32,.63),true);
 assert.equal(empty(181,.5,.41,.5),true);
});
