import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {rotateLocalBox,makePack5Fixture,orientedParts} from '../../../src/block-packs/pack-5/fixture.mjs';
import {PACK5_SURFACES,PACK5_SURFACE_FAMILIES,surfaceBoxMesh} from '../../../src/block-packs/pack-5/architectural-surfaces.mjs';
const approx=(a,b)=>Math.abs(a-b)<1e-5;
const vec=(positions,i)=>Array.from(positions.slice(i*3,i*3+3));
const normal=(a,b,c)=>[(b[1]-a[1])*(c[2]-a[2])-(b[2]-a[2])*(c[1]-a[1]),(b[2]-a[2])*(c[0]-a[0])-(b[0]-a[0])*(c[2]-a[2]),(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])];
const faceNormals=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];

test('all six variants × four rotations preserve outward triangle winding and manifold cuboid faces',()=>{
 for(const d of PACK5_SURFACES)for(let r=0;r<4;r++){
  const m=surfaceBoxMesh(d,{rotation:r});
  assert.equal(m.triangles,d.art.length*12);
  for(let i=0;i<m.indices.length;i+=3){
   const n=normal(vec(m.positions,m.indices[i]),vec(m.positions,m.indices[i+1]),vec(m.positions,m.indices[i+2]));
   const face=Math.floor(i/6)%6;
   assert.ok(n.reduce((v,x,j)=>v+x*faceNormals[face][j],0)>1e-8,`${d.variant} rot ${r} triangle ${i/3}`);
  }
 }
});

test('all 24 rotated physical preview vertex bounds equal exact rotated art-box bounds',()=>{
 for(const d of PACK5_SURFACES)for(let r=0;r<4;r++){
  const m=surfaceBoxMesh(d,{rotation:r});
  const expected=d.art.flatMap(part=>rotateLocalBox(part.box,r));
  for(let axis=0;axis<3;axis++){
   const actual=Array.from(m.positions).filter((_,i)=>i%3===axis);
   const expectedMin=Math.min(...d.art.map(part=>rotateLocalBox(part.box,r)[axis]));
   const expectedMax=Math.max(...d.art.map(part=>rotateLocalBox(part.box,r)[axis+3]));
   assert.ok(approx(Math.min(...actual),expectedMin)&&approx(Math.max(...actual),expectedMax),`${d.variant} rot ${r} axis ${axis}`);
  }
  assert.equal(expected.length,d.art.length*6);
 }
});

test('unit-cell authored mesh stays within a strict preview-only 240 triangle budget',()=>{
 for(const d of PACK5_SURFACES){
  const mesh=surfaceBoxMesh(d);
  assert.ok(mesh.triangles<=240);
  assert.ok(mesh.vertexCount<=480);
  assert.ok(mesh.positions.every(Number.isFinite));
  assert.ok(mesh.colors.every(Number.isFinite));
 }
});

test('all six variant color + geometry signatures differ, no recolor-only aliases',()=>{
 const signatures=PACK5_SURFACES.map(d=>JSON.stringify(d.art));
 assert.equal(new Set(signatures).size,6);
 const shapeSignatures=PACK5_SURFACES.map(d=>JSON.stringify(d.parts[0].boxes));
 assert.equal(new Set(shapeSignatures).size,6);
});

test('wall support rotates on all compass faces for plaster, not independent of backing',()=>{
 for(let r=0;r<4;r++){
  const dir=[[0,0,-1],[1,0,0],[0,0,1],[-1,0,0]][r];
  const f=makePack5Fixture(PACK5_SURFACE_FAMILIES);
  assert.equal(f.place('pack5:079',[0,0,0],r,'hand-troweled').ok,false);
  f.setSupport(dir);assert.equal(f.place('pack5:079',[0,0,0],r,'hand-troweled').ok,true);
  assert.equal(f.remove([0,0,0]),true);
 }
});

test('two tile variants have physical shallow colliders with both overhead clearance and floor support',()=>{
 const f=makePack5Fixture(PACK5_SURFACE_FAMILIES);
 for(let i=0;i<2;i++){
  const a=[i*2,0,0];f.setSupport([a[0],-1,0]);
  assert.equal(f.place('pack5:081',a,i,['sunburst-encaustic','moonwoven-glaze'][i]).ok,true);
  assert.equal(f.collides([a[0]+.1,.30,.1,a[0]+.9,.9,.9]),false);
  assert.equal(f.collides([a[0]+.1,.05,.1,a[0]+.9,.08,.9]),true);
 }
});

test('rotation changes oriented plaster bounds and preserves fixture-only variant snapshot',()=>{
 const a=PACK5_SURFACE_FAMILIES[0];
 assert.notDeepEqual(orientedParts(a,0)[0].boxes,orientedParts(a,1)[0].boxes);
 const f=makePack5Fixture(PACK5_SURFACE_FAMILIES);f.setSupport([1,0,0]);
 assert.equal(f.place('pack5:079',[0,0,0],1,'hand-troweled').ok,true);
 const snap=f.snapshot();assert.equal(snap.entries[0].length,6);
 assert.equal(f.restore(JSON.parse(JSON.stringify(snap))),true);
 assert.deepEqual(f.snapshot(),snap);assert.ok(!Object.hasOwn(snap,'schema'));
});

test('bad mesh rotations reject rather than silently changing shape state',()=>{
 for(const v of [-1,4,1.5,NaN,Infinity])assert.throws(()=>surfaceBoxMesh(PACK5_SURFACES[0],{rotation:v}));
});

test('source review gallery is explicitly marked Canvas2D and not WebGL2 certification',()=>{
 const src=readFileSync(new URL('./canvas-gallery.mjs',import.meta.url),'utf8');
 assert.match(src,/Canvas2D fallback/);assert.match(src,/NOT WebGL2/);
 const html=readFileSync(new URL('./canvas-gallery.html',import.meta.url),'utf8');
 assert.match(html,/NOT WebGL2/);
});
