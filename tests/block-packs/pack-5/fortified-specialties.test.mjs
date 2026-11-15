import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {makePack5Fixture,validatePhysicalDescriptor,orientedParts,rotateCellOffset} from '../../../src/block-packs/pack-5/fixture.mjs';
import {SPECIALTY_VARIANTS,SPECIALTY_PALETTE,SPECIALTY_FIXTURES,SPECIALTY_FAMILIES,getSpecialtyFixture,specialtyBoxMesh} from '../../../src/block-packs/pack-5/fortified-specialties.mjs';
const d=(id,v)=>getSpecialtyFixture(id,v);
const sig=x=>JSON.stringify(x.parts.map(p=>p.boxes));
const palette=x=>x.art.flatMap(p=>p.details).map(a=>a.material);
const ids=['pack5:094','pack5:095','pack5:096'];
const manifest=JSON.parse(readFileSync(new URL('../../../src/block-packs/pack-5/manifest.json',import.meta.url)));

test('M5 owns three roster identities and exactly six truly different authored geometry variants',()=>{
 assert.deepEqual(SPECIALTY_FAMILIES.map(p=>p.symbolicId),ids);
 assert.equal(SPECIALTY_FIXTURES.length,6);
 assert.equal(new Set(SPECIALTY_FIXTURES.map(sig)).size,6);
 assert.equal(new Set(SPECIALTY_FIXTURES.map(p=>p.symbolicId+'|'+p.variant)).size,6);
});
test('all M5 materials are original finite opaque physical colors',()=>{
 assert.ok(Object.keys(SPECIALTY_PALETTE).length>=12);
 for(const p of SPECIALTY_FIXTURES)for(const m of palette(p)){
  assert.ok(SPECIALTY_PALETTE[m]);assert.equal(SPECIALTY_PALETTE[m].length,4);
  assert.equal(SPECIALTY_PALETTE[m][3],1);assert.ok(SPECIALTY_PALETTE[m].every(x=>Number.isFinite(x)&&x>=0&&x<=1));
 }
});
test('six candidates are strictly physical and cannot consume a persistent block ID or gameplay mechanics',()=>{
 for(const p of SPECIALTY_FIXTURES){assert.equal(validatePhysicalDescriptor(p),true);
  assert.equal(p.numericId,undefined);assert.equal(p.integrated,false);assert.equal(p.sourceOnly,true);
  for(const key of ['opening','lighting','water','inventory','animals'])assert.equal(p[key],false);
  assert.ok(p.parts.every(x=>x.boxes.length>=9&&x.boxes.length<=64&&JSON.stringify(x.collisionBoxes)===JSON.stringify(x.boxes)));
 }
});
test('heavy fortress gates genuinely occupy two adjacent side-by-side cells, not a fence-gate alias',()=>{
 for(const v of SPECIALTY_VARIANTS['pack5:094']){
  const p=d('pack5:094',v);
  assert.deepEqual(p.parts.map(x=>x.cell),[[0,0,0],[1,0,0]]);
  assert.equal(p.attachment,'floor');assert.ok(p.parts.every(x=>x.boxes.some(b=>b[4]>.95)));
 }
});
test('ironbound gate has full opaque solid planks while portcullis includes physical open gaps',()=>{
 const a=d('pack5:094','citadel-ironbound-leaves'),b=d('pack5:094','falling-portcullis-grille');
 assert.ok(a.art[0].details.filter(x=>x.material==='oak'||x.material==='cedar').length>=5);
 assert.ok(b.art[0].details.filter(x=>x.material==='steel').length>=5);
 assert.ok(b.art[0].details.filter(x=>x.material==='iron').length>=5);
 assert.notEqual(sig(a),sig(b));
});
test('both gate panels require independent floor support, even after rotation',()=>{
 const f=makePack5Fixture(SPECIALTY_FAMILIES);f.setSupport([3,-1,3]);
 assert.deepEqual(f.place('pack5:094',[3,0,3],0,'citadel-ironbound-leaves'),{ok:false,reason:'Missing attachment'});
 assert.equal(f.count(),0);f.setSupport([4,-1,3]);
 assert.equal(f.place('pack5:094',[3,0,3],0,'citadel-ironbound-leaves').ok,true);
 assert.equal(f.cell([4,0,3]).symbolicId,'pack5:094');
 assert.equal(f.remove([4,0,3]),true);assert.equal(f.count(),0);
 const q=makePack5Fixture(SPECIALTY_FAMILIES);q.setSupport([3,-1,3]);
 assert.equal(q.place('pack5:094',[3,0,3],1,'falling-portcullis-grille').ok,false);
 q.setSupport([3,-1,4]);assert.equal(q.place('pack5:094',[3,0,3],1,'falling-portcullis-grille').ok,true);
 assert.deepEqual(q.cell([3,0,4]).anchor,[3,0,3]);
});
test('portcullis has real collision in vertical iron and truly open side slots',()=>{
 const f=makePack5Fixture(SPECIALTY_FAMILIES);f.setSupport([0,-1,0]);f.setSupport([1,-1,0]);
 assert.equal(f.place('pack5:094',[0,0,0],0,'falling-portcullis-grille').ok,true);
 assert.equal(f.collides([.115,.43,.45,.15,.54,.54]),true);
 assert.equal(f.collides([.35,.44,.45,.39,.50,.53]),false);
 assert.equal(f.collides([.35,.64,.45,.39,.69,.53]),true);
});
test('solid keep gate has actual blocking panel in otherwise open portcullis slot',()=>{
 const f=makePack5Fixture(SPECIALTY_FAMILIES);f.setSupport([0,-1,0]);f.setSupport([1,-1,0]);
 f.place('pack5:094',[0,0,0],0,'citadel-ironbound-leaves');
 assert.equal(f.collides([.35,.44,.45,.39,.50,.53]),true);
});
test('gate target/removal from either side removes both occupied cells atomically',()=>{
 const f=makePack5Fixture(SPECIALTY_FAMILIES);f.setSupport([2,-1,4]);f.setSupport([3,-1,4]);
 f.place('pack5:094',[2,0,4],0,'citadel-ironbound-leaves');
 assert.equal(f.raycast([3.5,.50,6],[0,0,-1],3)?.symbolicId,'pack5:094');
 assert.equal(f.removeRay([3.5,.50,6],[0,0,-1],3),true);
 assert.equal(f.count(),0);assert.equal(f.cell([2,0,4]),null);
});
test('both chandeliers are ceiling attached and genuinely lack floor support requirement',()=>{
 const f=makePack5Fixture(SPECIALTY_FAMILIES);
 assert.deepEqual(f.place('pack5:095',[4,2,6],0,'suncrown-eightarm'),{ok:false,reason:'Missing attachment'});
 f.setSupport([4,1,6]);assert.deepEqual(f.place('pack5:095',[4,2,6],0,'suncrown-eightarm'),{ok:false,reason:'Missing attachment'});
 f.setSupport([4,3,6]);assert.equal(f.place('pack5:095',[4,2,6],0,'suncrown-eightarm').ok,true);
});
test('chandelier is physically suspended from upper collar and exposes targetable lower arms',()=>{
 const f=makePack5Fixture(SPECIALTY_FAMILIES);f.setSupport([2,4,3]);
 assert.equal(f.place('pack5:095',[2,3,3],2,'prismatic-starrack').ok,true);
 assert.equal(f.raycast([2.5,4.8,3.5],[0,-1,0],4)?.symbolicId,'pack5:095');
 assert.equal(f.raycast([2.5,4.8,3.5],[0,-1,0],4)?.distance>0,true);
 assert.equal(f.remove([2,3,3]),true);assert.equal(f.count(),0);
});
test('two chandelier variants have different original physical arm topology',()=>{
 const a=d('pack5:095','suncrown-eightarm'),b=d('pack5:095','prismatic-starrack');
 assert.ok(palette(a).filter(x=>x==='linen').length>=6);
 assert.ok(palette(b).filter(x=>x==='crystal').length>=4);
 assert.equal(a.lighting,false);assert.equal(b.lighting,false);
});
test('two-cell stable stall partition requires support under both separate cells',()=>{
 const f=makePack5Fixture(SPECIALTY_FAMILIES);f.setSupport([0,-1,0]);
 assert.deepEqual(f.place('pack5:096',[0,0,0],0,'oak-stall-divider'),{ok:false,reason:'Missing attachment'});
 f.setSupport([0,-1,1]);assert.equal(f.place('pack5:096',[0,0,0],0,'oak-stall-divider').ok,true);
 assert.deepEqual(f.cell([0,0,1]).anchor,[0,0,0]);
 assert.equal(f.remove([0,0,1]),true);assert.equal(f.count(),0);
});
test('stable partition has solid posts and upper rails but open spacing between them',()=>{
 const f=makePack5Fixture(SPECIALTY_FAMILIES);f.setSupport([0,-1,0]);f.setSupport([0,-1,1]);
 f.place('pack5:096',[0,0,0],0,'oak-stall-divider');
 assert.equal(f.collides([.45,.50,.09,.51,.58,.13]),true);
 assert.equal(f.collides([.20,.50,.35,.30,.56,.50]),false);
 assert.equal(f.collides([.45,.59,.38,.52,.64,.48]),true);
});
test('trough has true unfilled top air and physical walls/bottom; not a water block',()=>{
 const p=d('pack5:096','stone-feed-trough'),parts=p.parts[0].boxes;
 assert.ok(parts.some(b=>b[4]>.64));
 const occupied=(x,y,z)=>parts.some(b=>b[0]<=x&&x<=b[3]&&b[1]<=y&&y<=b[4]&&b[2]<=z&&z<=b[5]);
 assert.equal(occupied(.5,.4,.5),false);assert.equal(occupied(.5,.13,.5),true);
 assert.equal(occupied(.2,.4,.5),true);assert.equal(p.water,false);
});
test('trough ray from top reaches real bottom through empty cavity',()=>{
 const f=makePack5Fixture(SPECIALTY_FAMILIES);f.setSupport([0,-1,0]);
 assert.equal(f.place('pack5:096',[0,0,0],0,'stone-feed-trough').ok,true);
 const hit=f.raycast([.5,1.8,.5],[0,-1,0],3);
 assert.equal(hit?.symbolicId,'pack5:096');assert.ok(hit.distance>1.55);
 assert.equal(f.collides([.4,.4,.4,.6,.55,.6]),false);
});
test('all six source meshes preserve finite geometry, four rotations and face-outward winding',()=>{
 const expected=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
 for(const p of SPECIALTY_FIXTURES)for(let rotation=0;rotation<4;rotation++){
  const m=specialtyBoxMesh(p,{rotation}),boxes=p.parts.reduce((sum,x)=>sum+x.boxes.length,0);
  assert.equal(m.triangles,boxes*12);assert.ok(m.vertexCount<=6144);
  assert.equal(m.positions.length,m.vertexCount*3);assert.equal(m.colors.length,m.vertexCount*4);
  assert.ok(m.positions.every(Number.isFinite));assert.ok(m.colors.every(Number.isFinite));
  assert.ok(m.indices.every(x=>x<m.vertexCount));
  assert.deepEqual(orientedParts(p,rotation).map(x=>x.boxes.length),p.parts.map(x=>x.boxes.length));
  for(let v=0;v<m.vertexCount;v+=4){
   const a=Array.from(m.positions.subarray(v*3,v*3+3)),b=Array.from(m.positions.subarray((v+1)*3,(v+1)*3+3)),c=Array.from(m.positions.subarray((v+2)*3,(v+2)*3+3));
   const u=b.map((x,k)=>x-a[k]),w=c.map((x,k)=>x-a[k]);
   const n=[u[1]*w[2]-u[2]*w[1],u[2]*w[0]-u[0]*w[2],u[0]*w[1]-u[1]*w[0]];
   assert.ok(n.reduce((sum,x,k)=>sum+x*expected[(v/4)%6][k],0)>1e-10,'Degenerate or inward-facing triangle');
  }
 }
});
test('per-cell source budgets stay within 64 physical boxes / 768 triangles',()=>{
 for(const p of SPECIALTY_FIXTURES)for(const part of p.parts){assert.ok(part.boxes.length<=64);assert.ok(part.boxes.length*12<=768);}
});
test('all three M5 family variants preserve rotation and are reversible via fixture-only snapshots',()=>{
 const f=makePack5Fixture(SPECIALTY_FAMILIES);
 const jobs=[['pack5:094','falling-portcullis-grille',[0,0,0],1],['pack5:095','suncrown-eightarm',[4,0,0],3],['pack5:096','stone-feed-trough',[7,0,0],2]];
 for(const [id,v,cell,rot] of jobs){if(id==='pack5:095')f.setSupport([4,1,0]);else f.setSupport([cell[0],-1,cell[2]]);
  if(id==='pack5:094')f.setSupport([0,-1,1]);assert.equal(f.place(id,cell,rot,v).ok,true);}
 const before=f.snapshot();assert.equal(before.entries.length,3);assert.equal(before.schema,undefined);
 assert.equal(f.restore(structuredClone(before)),true);assert.deepEqual(f.snapshot(),before);
 assert.throws(()=>f.restore({format:before.format,entries:[[0,0,0,'pack5:095',0,'invalid-candle']]}));
 assert.deepEqual(f.snapshot(),before);
});
test('invalid numeric ID / variant / attachment rejection cannot contaminate live registry',()=>{
 assert.throws(()=>d('pack5:095','fake'));
 assert.throws(()=>d('pack5:094','fake'));
 assert.throws(()=>d('pack5:096','fake'));
 assert.throws(()=>validatePhysicalDescriptor({...SPECIALTY_FIXTURES[0],numericId:183}));
 assert.ok(SPECIALTY_FIXTURES.every(x=>x.numericId===undefined&&x.integrated===false));
});
test('M5 candidate ledger 94-96 preserves 18 symbolic families without integration',()=>{
 const ids=[94,95,96];
 assert.equal(manifest.entries.length,18);assert.equal(manifest.candidateFamilies,18);assert.equal(manifest.completedFamilies,0);
 for(const n of ids){const p=manifest.entries.find(x=>x.roster===n);assert.equal(p.status,'CANDIDATE');assert.equal(p.persistentNumericId,null);assert.equal(p.milestone,5);}
 assert.ok(manifest.entries.every(x=>x.integrated===false&&x.persistentNumericId===null));
});
test('stable divider physically contains three lower kickboard planks per occupied cell, distinct from fence rails',()=>{
 const p=d('pack5:096','oak-stall-divider');
 for(const x of p.parts){
  assert.ok(x.boxes.filter(b=>b[1]>=.13&&b[4]<=.41&&b[5]-b[2]>.2).length>=3);
  assert.ok(x.boxes.filter(b=>b[1]>.38&&b[4]>.50&&b[5]-b[2]<.12).length>=3);
 }
 const f=makePack5Fixture(SPECIALTY_FAMILIES);f.setSupport([0,-1,0]);f.setSupport([0,-1,1]);
 assert.equal(f.place('pack5:096',[0,0,0],0,'oak-stall-divider').ok,true);
 assert.equal(f.collides([.45,.2,.30,.55,.29,.39]),true); // physical lower board
 assert.equal(f.collides([.2,.55,.3,.3,.64,.39]),false); // open side above it
});
test('dry trough has four physical weatherboard pairs, not a generic open well or water material',()=>{
 const p=d('pack5:096','stone-feed-trough');
 assert.ok(p.art[0].details.filter(x=>x.material==='cedar').length>=8);
 assert.ok(p.art[0].details.filter(x=>x.material==='bronze').length>=8);
 assert.ok(p.parts[0].boxes.length<=64);
 assert.ok(p.art[0].details.every(x=>x.material!=='water'));
 const f=makePack5Fixture(SPECIALTY_FAMILIES);f.setSupport([1,-1,1]);
 assert.equal(f.place('pack5:096',[1,0,1],0,'stone-feed-trough').ok,true);
 assert.equal(f.collides([1.12,.26,1.39,1.185,.35,1.45]),true); // side weatherboard
 assert.equal(f.collides([1.40,.38,1.40,1.60,.50,1.60]),false); // still empty interior
});
test('every authored M5 box face is planar and both triangles share outward normal',()=>{
 const expected=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
 for(const p of SPECIALTY_FIXTURES)for(let rotation=0;rotation<4;rotation++){
  const m=specialtyBoxMesh(p,{rotation});
  const P=(v)=>Array.from(m.positions.subarray(v*3,v*3+3));
  for(let i=0;i<m.vertexCount;i+=4){
   const q=[P(i),P(i+1),P(i+2),P(i+3)],axis=expected[(i/4)%6];
   const n=(a,b,c)=>{const u=q[b].map((x,k)=>x-q[a][k]),v=q[c].map((x,k)=>x-q[a][k]);return [u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]]};
   assert.ok(n(0,1,2).reduce((s,x,k)=>s+x*axis[k],0)>1e-10,'Triangle 1 wrong');
   assert.ok(n(0,2,3).reduce((s,x,k)=>s+x*axis[k],0)>1e-10,'Triangle 2 wrong / twisted quad');
   const axisIdx=axis.findIndex(v=>v!==0);
   assert.ok(q.every(v=>Math.abs(v[axisIdx]-q[0][axisIdx])<1e-6),'Face must be planar');
  }
 }
});

test('suncrown eight-arm variant has eight physical perimeter sockets and candle stems',()=>{
  const p=d('pack5:095','suncrown-eightarm');
  const sockets=p.art[0].details.filter(x=>x.material==='gold'&&Math.abs(x.box[1]-.36)<1e-9&&Math.abs(x.box[4]-.43)<1e-9);
  const candles=p.art[0].details.filter(x=>x.material==='linen');
  const coords=[[.205,.205],[.47,.205],[.735,.205],[.205,.47],[.735,.47],[.205,.735],[.47,.735],[.735,.735]];
  assert.equal(sockets.length,8,'An eight-arm chandelier needs eight raised physical sockets');
  assert.equal(candles.length,8,'Each socket needs its own unlit physical candle stem');
  for(const [x,z] of coords){
    assert.ok(sockets.some(s=>Math.abs(s.box[0]-x)<1e-9&&Math.abs(s.box[2]-z)<1e-9),'Missing socket at '+x+','+z);
    assert.ok(candles.some(s=>Math.abs(s.box[0]-(x+.016))<1e-9&&Math.abs(s.box[2]-(z+.016))<1e-9),'Missing candle stem at '+x+','+z);
  }
  assert.equal(p.parts[0].boxes.length,29);
  assert.deepEqual(p.parts[0].collisionBoxes,p.parts[0].boxes);
  for(let rotation=0;rotation<4;rotation++){
    const mesh=specialtyBoxMesh(p,{rotation});
    assert.equal(mesh.triangles,29*12);
    assert.ok(mesh.positions.every(Number.isFinite));
  }
  assert.equal(p.lighting,false,'Candles must remain decorative only');
});
