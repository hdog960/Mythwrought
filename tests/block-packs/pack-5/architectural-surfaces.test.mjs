import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validatePhysicalDescriptor,orientedParts,makePack5Fixture} from '../../../src/block-packs/pack-5/fixture.mjs';
import {PACK5_SURFACE_MATERIALS,PACK5_SURFACE_VARIANTS,PACK5_SURFACE_FAMILIES,PACK5_SURFACES,getPack5Surface,surfaceBoxMesh} from '../../../src/block-packs/pack-5/architectural-surfaces.mjs';
const manifest=JSON.parse(readFileSync(new URL('../../../src/block-packs/pack-5/manifest.json',import.meta.url)));
const ids=['pack5:079','pack5:080','pack5:081'];
const round=(n)=>Number(n.toFixed(9));
const signature=(d)=>JSON.stringify(d.parts.map(p=>p.boxes.map(b=>b.map(round))));

test('M1 owns three unique families with six truly authored variants',()=>{
 assert.equal(PACK5_SURFACE_FAMILIES.length,3);assert.equal(PACK5_SURFACES.length,6);
 assert.deepEqual(PACK5_SURFACE_FAMILIES.map(x=>x.symbolicId),ids);
 for(const id of ids){assert.equal(PACK5_SURFACE_VARIANTS[id].length,2);assert.notEqual(signature(getPack5Surface(id,PACK5_SURFACE_VARIANTS[id][0])),signature(getPack5Surface(id,PACK5_SURFACE_VARIANTS[id][1])));}
 assert.equal(new Set(PACK5_SURFACES.map(signature)).size,6);
});

test('all six original authored geometric variants satisfy the physical schema, not a renamed cube',()=>{
 for(const d of PACK5_SURFACES){
  assert.equal(validatePhysicalDescriptor(d),true);
  assert.ok(d.parts[0].boxes.length>=6,`${d.symbolicId}:${d.variant} no detail geometry`);
  assert.equal(d.integrated,false);assert.equal(d.numericId,undefined);
  assert.ok(d.parts[0].boxes.some(x=>x[3]-x[0]<1 || x[4]-x[1]<1 || x[5]-x[2]<1));
 }
});

test('M1 names, slots, symbolic identities, and candidate statuses align with manifest',()=>{
 for(const d of PACK5_SURFACE_FAMILIES){let e=manifest.entries.find(x=>x.symbolicId===d.symbolicId);assert.ok(e);assert.equal(d.name,e.name);assert.equal(e.milestone,1);assert.equal(e.status,'CANDIDATE');assert.equal(e.persistentNumericId,null);assert.equal(e.integrated,false);}
 assert.ok(!PACK5_SURFACES.some(x=>Object.hasOwn(x,'persistentNumericId')));
});

test('stucco is a thin real wall facing, not desert adobe masonry or full cube',()=>{
 for(const kind of PACK5_SURFACE_VARIANTS['pack5:079']){
  const d=getPack5Surface('pack5:079',kind);assert.equal(d.attachment,'wall');
  assert.ok(d.parts[0].boxes.every(x=>x[5]<=.17));
  assert.ok(d.parts[0].collisionBoxes.every(x=>x[5]<=.17));
 }
});

test('fired bricks have manufactured courses with multiple distinct relief depths',()=>{
 for(const kind of PACK5_SURFACE_VARIANTS['pack5:080']){
  const d=getPack5Surface('pack5:080',kind);assert.equal(d.attachment,'none');
  const face=d.parts[0].boxes.filter(b=>b[5]===1);assert.ok(face.length>8);
  assert.ok(new Set(face.map(b=>b[1])).size>=3);
  assert.ok(d.parts[0].collisionBoxes.some(b=>b[3]===1&&b[4]===1));
 }
});

test('interior ceramic floor geometry is shallow, walkable, and embossed',()=>{
 for(const kind of PACK5_SURFACE_VARIANTS['pack5:081']){
  const d=getPack5Surface('pack5:081',kind);assert.equal(d.attachment,'floor');
  assert.ok(d.parts[0].boxes.every(b=>b[4]<=.151));
  assert.ok(d.parts[0].collisionBoxes.every(b=>b[4]<=.151));
  assert.ok(new Set(d.parts[0].boxes.map(b=>b[1])).size>=3);
 }
});

test('materials have purposeful named opaque high-fantasy palettes, not a shader alias',()=>{
 assert.ok(Object.keys(PACK5_SURFACE_MATERIALS).length>=12);
 for(const c of Object.values(PACK5_SURFACE_MATERIALS))assert.ok(c.length===4&&c.every(v=>Number.isFinite(v)&&v>=0&&v<=1)&&c[3]===1);
 for(const d of PACK5_SURFACES){
  assert.equal(d.art.length,d.parts[0].boxes.length);
  assert.ok(new Set(d.art.map(p=>p.material)).size>=3);
  for(let i=0;i<d.art.length;i++){
   assert.deepEqual(d.art[i].box,d.parts[0].boxes[i]);assert.ok(PACK5_SURFACE_MATERIALS[d.art[i].material]);
  }
 }
});

test('six meshes are real typed physically derived renderable geometry, nonempty and bounded',()=>{
 for(const d of PACK5_SURFACES){
  const mesh=surfaceBoxMesh(d);
  assert.ok(mesh.vertexCount>0&&mesh.vertexCount<=1536);assert.equal(mesh.vertexCount,d.art.length*24);
  assert.equal(mesh.positions.length,mesh.vertexCount*3);assert.equal(mesh.colors.length,mesh.vertexCount*4);
  assert.equal(mesh.indices.length,mesh.triangles*3);assert.equal(mesh.triangles,d.art.length*12);
  assert.ok(mesh.positions.every(x=>Number.isFinite(x)&&x>=0&&x<=1));
  assert.ok(mesh.colors.every(x=>Number.isFinite(x)&&x>=0&&x<=1));
  assert.ok(mesh.indices.every(n=>n<mesh.vertexCount));
 }
});

test('mesh produces outward-facing triangles on six cube faces',()=>{
 const m=surfaceBoxMesh(PACK5_SURFACES[0]);
 for(let f=0;f<6;f++){
  const off=f*6,idx=m.indices;const a=idx[off],b=idx[off+1],c=idx[off+2];
  const p=i=>Array.from(m.positions.slice(i*3,i*3+3));
  const [x,y,z]=[p(a),p(b),p(c)];
  const cross=[(y[1]-x[1])*(z[2]-x[2])-(y[2]-x[2])*(z[1]-x[1]),(y[2]-x[2])*(z[0]-x[0])-(y[0]-x[0])*(z[2]-x[2]),(y[0]-x[0])*(z[1]-x[1])-(y[1]-x[1])*(z[0]-x[0])];
  const expected=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]][f];
  assert.ok(cross.reduce((sum,n,i)=>sum+n*expected[i],0)>0,`invalid winding face ${f}`);
 }
});

test('bad variant names are rejected rather than silently aliasing another asset',()=>{
 assert.throws(()=>getPack5Surface('pack5:082','chalk-lime'));
 assert.throws(()=>getPack5Surface('pack5:079','desert-adobe'));
 assert.throws(()=>getPack5Surface('pack5:081','sunburst-encaustic2'));
 assert.throws(()=>surfaceBoxMesh({...PACK5_SURFACES[0],art:[]}));
});

test('all 24 family/variant rotations stay bounded and preserve material identity',()=>{
 for(const d of PACK5_SURFACES)for(let rot=0;rot<4;rot++){
  const p=orientedParts(d,rot);assert.deepEqual(p[0].cell,[0,0,0]);
  assert.ok(p[0].boxes.every(b=>b.every((x,i)=>Number.isFinite(x)&&x>=0&&x<=1)));
  assert.equal(p[0].boxes.length,d.art.length);
 }
});

test('wall stucco requires support on facing wall and is ray-selectable, physically removable',()=>{
 const f=makePack5Fixture(PACK5_SURFACE_FAMILIES);
 assert.deepEqual(f.place('pack5:079',[2,2,2],0,'chalk-lime'),{ok:false,reason:'Missing attachment'});
 f.setSupport([2,2,1]);assert.equal(f.place('pack5:079',[2,2,2],0,'chalk-lime').ok,true);
 assert.equal(f.raycast([2.5,2.5,4],[0,0,-1])?.symbolicId,'pack5:079');
 assert.equal(f.collides([2.4,2.4,2.7,2.6,2.6,2.9]),false);
 assert.equal(f.collides([2.4,2.4,2.04,2.6,2.6,2.08]),true);
 assert.equal(f.remove([2,2,2]),true);
});

test('brick requires independent cell, collision and raycast without attachment',()=>{
 const f=makePack5Fixture(PACK5_SURFACE_FAMILIES);
 assert.equal(f.place('pack5:080',[0,0,0],2,'kiln-soldier-course').ok,true);
 assert.equal(f.cell([0,0,0]).variant,'kiln-soldier-course');
 assert.equal(f.collides([.4,.4,.4,.6,.6,.6]),true);
 assert.equal(f.raycast([.5,.5,2],[0,0,-1])?.symbolicId,'pack5:080');
 assert.equal(f.removeRay([.5,.5,2],[0,0,-1]),true);
});

test('floor ceramic tile needs support, permits empty headroom unlike full-cube colliders',()=>{
 const f=makePack5Fixture(PACK5_SURFACE_FAMILIES);
 assert.equal(f.place('pack5:081',[0,0,0],0,'moonwoven-glaze').ok,false);
 f.setSupport([0,-1,0]);assert.equal(f.place('pack5:081',[0,0,0],0,'moonwoven-glaze').ok,true);
 assert.equal(f.raycast([.5,1,.5],[0,-1,0])?.symbolicId,'pack5:081');
 assert.equal(f.collides([.3,.2,.3,.6,.7,.6]),false);
 assert.equal(f.collides([.3,.03,.3,.6,.06,.6]),true);
});

test('two variants under one symbolic ID coexist and persist in isolated fixture snapshot',()=>{
 const f=makePack5Fixture(PACK5_SURFACE_FAMILIES);
 f.setSupport([0,0,-1]);f.setSupport([2,0,-1]);
 assert.equal(f.place('pack5:079',[0,0,0],0,'chalk-lime').ok,true);
 assert.equal(f.place('pack5:079',[2,0,0],0,'hand-troweled').ok,true);
 assert.equal(f.cell([0,0,0]).variant,'chalk-lime');assert.equal(f.cell([2,0,0]).variant,'hand-troweled');
 const before=f.snapshot();assert.ok(before.entries.every(e=>e.length===6));
 assert.equal('schema' in before,false);
 assert.ok(f.restore(JSON.parse(JSON.stringify(before))));assert.deepEqual(f.snapshot(),before);
});

test('invalid saved variant/rotation rejects atomically without destroying other cells',()=>{
 const f=makePack5Fixture(PACK5_SURFACE_FAMILIES);f.setSupport([0,-1,0]);
 f.place('pack5:081',[0,0,0],0,'sunburst-encaustic');const prior=f.snapshot();
 const bad=JSON.parse(JSON.stringify(prior));bad.entries.push([1,0,0,'pack5:081',1,'not-a-variant']);
 assert.throws(()=>f.restore(bad));assert.deepEqual(f.snapshot(),prior);
 assert.throws(()=>f.place('pack5:081',[4,4,4],0,'not-a-variant'));
 assert.equal(f.cell([0,0,0]).variant,'sunburst-encaustic');
});

test('original fixture 5-column save rows still round-trip for legacy fixture test compatibility',()=>{
 const f=makePack5Fixture(PACK5_SURFACE_FAMILIES);f.place('pack5:080',[0,0,0]);
 const snap=f.snapshot();assert.equal(snap.entries[0].length,5);assert.equal(f.restore(snap),true);
});

test('fired brick wraps independently visible courses onto every lateral face for all four orientations',()=>{
 for(const kind of PACK5_SURFACE_VARIANTS['pack5:080']){
  const d=getPack5Surface('pack5:080',kind);
  assert.ok(d.art.length<=64);
  for(const rotation of [0,1,2,3]){
   const rotated=orientedParts(d,rotation)[0].boxes;
   assert.ok(rotated.filter(b=>b[2]===0&&b[5]<=.12).length>=8,kind+' back face unbricked at rotation '+rotation);
   assert.ok(rotated.filter(b=>b[0]===0&&b[3]<=.12).length>=8,kind+' left face unbricked at rotation '+rotation);
   assert.ok(rotated.filter(b=>b[3]===1&&b[0]>=.88).length>=8,kind+' right face unbricked at rotation '+rotation);
  }
 }
});

test('no extra runtime systems, active gameplay IDs, or chunk/world placement were imported',()=>{
 const src=readFileSync(new URL('../../../src/block-packs/pack-5/architectural-surfaces.mjs',import.meta.url),'utf8');
 assert.ok(!/from\s+['"]\.{1,2}\/(?:\.\.\/)*?(?:voxel|blocks|main|physics|persistence)/.test(src));
 assert.equal(Object.hasOwn(PACK5_SURFACES[0],'persistentNumericId'),false);
});
