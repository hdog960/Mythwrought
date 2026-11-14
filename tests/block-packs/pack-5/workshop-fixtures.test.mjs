import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validatePhysicalDescriptor,orientedParts,makePack5Fixture} from '../../../src/block-packs/pack-5/fixture.mjs';
import {WORKSHOP_FIXTURES,WORKSHOP_FAMILIES,WORKSHOP_VARIANTS,WORKSHOP_PALETTE,workshopBoxMesh,getWorkshopFixture} from '../../../src/block-packs/pack-5/workshop-fixtures.mjs';
const descriptor=(id,v)=>getWorkshopFixture(id,v);
const geom=d=>JSON.stringify(d.parts.map(p=>p.boxes));
const ids=['pack5:088','pack5:089','pack5:090'];
const all=WORKSHOP_FIXTURES;
test('exactly three new workshop families and six independent geometric variants',()=>{
 assert.deepEqual(WORKSHOP_FAMILIES.map(x=>x.symbolicId),ids);
 assert.equal(all.length,6);
 assert.equal(new Set(all.map(geom)).size,6);
 assert.equal(new Set(all.map(x=>x.symbolicId+':'+x.variant)).size,6);
});
test('all six have independently targetable physical pieces and precise physical colliders',()=>{
 for(const d of all){assert.equal(validatePhysicalDescriptor(d),true);
  assert.equal(d.parts.length,1);
  assert.deepEqual(d.parts[0].cell,[0,0,0]);
  assert.deepEqual(d.parts[0].collisionBoxes,d.parts[0].boxes);
  assert.ok(d.parts[0].boxes.length>=12&&d.parts[0].boxes.length<=64);
  assert.equal(d.attachment,'floor');assert.equal(d.integrated,false);
  assert.equal(d.numericId,undefined);
  for(const capability of ['craft','heat','liquid','inventory'])assert.equal(d[capability],false);
 }
});
test('anvil horn is protruding layered physical steel and separate peen, not a recolored block',()=>{
 for(const variant of WORKSHOP_VARIANTS['pack5:088']){
  const d=descriptor('pack5:088',variant),b=d.parts[0].boxes;
  assert.ok(b.filter(x=>x[0]<.20&&x[1]>.60).length>=3);
  assert.ok(b.some(x=>x[3]>.95&&x[1]>.60));
  assert.ok(b.some(x=>x[4]>.80));
 }
});
test('both anvils have distinct physically authored surface decorations',()=>{
 const a=descriptor('pack5:088','blackiron-horn'),b=descriptor('pack5:088','moonsteel-stake');
 assert.notEqual(geom(a),geom(b));
 assert.ok(b.art[0].details.filter(x=>x.material==='brass').length>=3);
 assert.ok(a.art[0].details.some(x=>x.material==='rivet'));
});
test('cauldron ring is materially hollow above its floor, with a base and two handles',()=>{
 const d=descriptor('pack5:089','iron-tripod-cauldron'),p=d.parts[0].boxes;
 const pointInside=(b,x,y,z)=>b[0]<=x&&x<=b[3]&&b[1]<=y&&y<=b[4]&&b[2]<=z&&z<=b[5];
 assert.ok(!p.some(b=>pointInside(b,.50,.60,.50)),'cauldron must not be filled with fake fluid');
 assert.ok(p.some(b=>pointInside(b,.50,.23,.50)),'cauldron has real base');
 assert.ok(p.some(b=>b[1]>.66&&b[2]<.15));
 assert.ok(p.some(b=>b[1]>.66&&b[5]>.85));
});
test('alchemy rack is distinct open shelving with physical individual flask rests',()=>{
 const d=descriptor('pack5:089','alchemists-spiral-stand'),a=d.art[0].details;
 assert.ok(a.filter(x=>x.material==='porcelain').length>=3);
 assert.ok(a.filter(x=>x.material==='amethyst').length>=3);
 assert.ok(a.some(x=>x.box[4]>.95));
 assert.notEqual(geom(d),geom(descriptor('pack5:089','iron-tripod-cauldron')));
});
test('oven mouth has true empty forward cavity; not a glowing fake fireplace',()=>{
 const d=descriptor('pack5:090','ashstone-bake-oven');
 const boxes=d.parts[0].boxes;
 // Opening at y .40 and z .82 between side jambs; front mouth must stay empty.
 const occupied=(x,y,z)=>boxes.some(b=>b[0]<=x&&x<=b[3]&&b[1]<=y&&y<=b[4]&&b[2]<=z&&z<=b[5]);
 assert.equal(occupied(.5,.50,.85),false);
 assert.equal(occupied(.17,.50,.85),true);
 assert.equal(occupied(.50,.76,.50),true);
});
test('copper range uses four independent physical cooktop discs but never emits heat',()=>{
 const d=descriptor('pack5:090','copper-range-top');
 assert.equal(d.heat,false);assert.equal(d.craft,false);
 assert.ok(d.art[0].details.filter(x=>x.material==='charcoal').length>=4);
 assert.ok(d.art[0].details.filter(x=>x.material==='brass').length>=3);
 assert.ok(d.parts[0].boxes.some(b=>b[4]>.85));
});
test('four rotations preserve finite bounded outward-face mesh geometry and indices',()=>{
 for(const d of all)for(let rotation=0;rotation<4;rotation++){
  const m=workshopBoxMesh(d,{rotation});assert.equal(m.positions.length,m.vertexCount*3);
  assert.equal(m.colors.length,m.vertexCount*4);assert.equal(m.indices.length,m.triangles*3);
  assert.equal(m.triangles,d.parts[0].boxes.length*12);assert.ok(m.vertexCount<=1536);
  assert.ok(m.indices.every(i=>i<m.vertexCount));
  assert.ok(m.positions.every(Number.isFinite));assert.ok(m.positions.every(x=>x>=-1e-6&&x<=1+1e-6));
  assert.ok(m.colors.every(x=>Number.isFinite(x)&&x>=0&&x<=1));
  const o=orientedParts(d,rotation);assert.equal(o[0].boxes.length,d.parts[0].boxes.length);
 }
});
test('rotated AABBs agree with exact hitbox shapes in all four quarter turns',()=>{
 for(const d of all)for(let r=0;r<4;r++){
  const parts=orientedParts(d,r);
  assert.deepEqual(parts[0].boxes,parts[0].collisionBoxes);
  assert.ok(parts[0].boxes.every(b=>b[0]<b[3]&&b[1]<b[4]&&b[2]<b[5]));
 }
});
test('every palette material is original finite opaque numeric channel data',()=>{
 assert.ok(Object.keys(WORKSHOP_PALETTE).length>=12);
 for(const d of all)for(const item of d.art[0].details){const c=WORKSHOP_PALETTE[item.material];
  assert.ok(c);assert.equal(c.length,4);assert.equal(c[3],1);
  assert.ok(c.every(x=>Number.isFinite(x)&&x>=0&&x<=1));
 }
});
test('unsupported placement rejected without orphan occupancy; later supported placement works',()=>{
 const f=makePack5Fixture(WORKSHOP_FAMILIES);
 assert.deepEqual(f.place('pack5:088',[5,1,6],0,'blackiron-horn'),{ok:false,reason:'Missing attachment'});
 assert.equal(f.count(),0);
 f.setSupport([5,0,6]);assert.equal(f.place('pack5:088',[5,1,6],0,'blackiron-horn').ok,true);
 assert.equal(f.count(),1);
});
test('ray selection and removal targets actual parts without touching adjacent fixture',()=>{
 const f=makePack5Fixture(WORKSHOP_FAMILIES);
 f.setSupport([2,-1,0]);f.setSupport([4,-1,0]);
 assert.equal(f.place('pack5:089',[2,0,0],0,'iron-tripod-cauldron').ok,true);
 assert.equal(f.place('pack5:090',[4,0,0],0,'copper-range-top').ok,true);
 assert.equal(f.raycast([4.5,.78,3],[0,0,-1],6)?.symbolicId,'pack5:090');
 assert.equal(f.removeRay([4.5,.78,3],[0,0,-1],6),true);
 assert.equal(f.count(),1);assert.equal(f.cell([2,0,0]).symbolicId,'pack5:089');
});
test('physically hollow cauldron collision leaves intended center free',()=>{
 const f=makePack5Fixture(WORKSHOP_FAMILIES);f.setSupport([0,-1,0]);
 assert.equal(f.place('pack5:089',[0,0,0],0,'iron-tripod-cauldron').ok,true);
 assert.equal(f.collides([.40,.56,.40,.60,.65,.60]),false);
 assert.equal(f.collides([.18,.55,.17,.26,.63,.25]),true);
});
test('candidate-only variant snapshots are deterministic and rejected records roll back atomically',()=>{
 const f=makePack5Fixture(WORKSHOP_FAMILIES);
 for(const [cell,id,variant,r] of [[[0,0,0],'pack5:088','moonsteel-stake',1],[[2,0,0],'pack5:089','alchemists-spiral-stand',2],[[4,0,0],'pack5:090','ashstone-bake-oven',3]]){
  f.setSupport([cell[0],-1,cell[2]]);assert.equal(f.place(id,cell,r,variant).ok,true);
 }
 const before=f.snapshot();assert.equal(before.schema,undefined);assert.equal(before.entries.length,3);
 f.restore(structuredClone(before));assert.deepEqual(f.snapshot(),before);
 assert.throws(()=>f.restore({format:before.format,entries:[[0,0,0,'pack5:088',0,'unknown']]}));
 assert.deepEqual(f.snapshot(),before);
});
test('three new workshop symbols never register numeric IDs or import engine systems',()=>{
 const source=readFileSync(new URL('../../../src/block-packs/pack-5/workshop-fixtures.mjs',import.meta.url),'utf8');
 assert.ok(!source.includes('src/voxel'));assert.ok(!source.includes('src/blocks'));
 for(const d of all){assert.equal(d.numericId,undefined);assert.equal(d.integrated,false);}
});
test('every part remains under 64-box and 768-triangle mobile preview ceiling',()=>{
 for(const d of all)for(const p of d.parts){assert.ok(p.boxes.length<=64);assert.ok(p.boxes.length*12<=768)}
});

test('manifest keeps all 88–90 M3 workshop candidates isolated and 91+ unstarted',()=>{
 const data=JSON.parse(readFileSync(new URL('../../../src/block-packs/pack-5/manifest.json',import.meta.url)));
 for(const d of WORKSHOP_FAMILIES){const entry=data.entries.find(e=>e.symbolicId===d.symbolicId);
  assert.equal(entry.milestone,3);assert.equal(entry.status,'CANDIDATE');assert.equal(entry.persistentNumericId,null);
 }
 for(const e of data.entries.filter(e=>e.roster>=91))assert.equal(e.status,'NOT STARTED');
 assert.equal(data.candidateFamilies,12);assert.equal(data.completedFamilies,0);
});

test('all six material-box faces maintain outward winding through every Y quarter-turn',()=>{
 const axes=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
 for(const d of all)for(let rotation=0;rotation<4;rotation++){
  const m=workshopBoxMesh(d,{rotation});
  for(let i=0;i<m.vertexCount;i+=4){
   const vert=j=>Array.from(m.positions.subarray((i+j)*3,(i+j+1)*3));
   const a=vert(0),b=vert(1),c=vert(2);
   const u=b.map((v,k)=>v-a[k]),v=c.map((x,k)=>x-a[k]);
   const normal=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
   const expected=axes[(i/4)%6];
   assert.ok(normal.reduce((sum,n,k)=>sum+n*expected[k],0)>1e-9,'inward or degenerate physical face');
  }
 }
});

test('refined anvil horn is a long tapered selectable steel silhouette, not merely a surface tint',()=>{
  for(const variant of WORKSHOP_VARIANTS['pack5:088']){
    const a=descriptor('pack5:088',variant).art[0].details;
    const horn=a.filter(x=>x.material==='steel'&&x.box[0]<.34&&x.box[1]>.65);
    assert.ok(horn.length>=5,'Five physical taper tiers are required');
    assert.ok(Math.min(...horn.map(x=>x.box[0]))<.025,'Anvil horn must extend to leftmost edge');
    assert.ok(horn.some(x=>x.box[0]<.1&&x.box[5]-x.box[2]<.15),'A narrow actual nose is required');
  }
});
test('refined iron cauldron has stepped octagonal belly, narrower neck, open top and a solid bottom',()=>{
  const d=descriptor('pack5:089','iron-tripod-cauldron');
  const b=d.parts[0].boxes;
  const frontBands=b.filter(x=>x[1]>.19&&x[1]<.60&&x[3]-x[0]>.1);
  const rows=[.20,.35,.50];
  assert.ok(rows.every(y=>frontBands.some(x=>Math.abs(x[1]-y)<.001)),'Three stepped shell tiers must exist');
  assert.ok(b.filter(x=>x[1]===.64).length>=8,'Physical octagonal top lip is required');
  assert.ok(b.filter(x=>x[1]>=.69&&x[5]<.16).length>0,'Top handles must protrude');
  for(const y of [.42,.58,.72])assert.ok(!b.some(x=>x[0]<=.5&&x[3]>=.5&&x[1]<=y&&x[4]>=y&&x[2]<=.5&&x[5]>=.5),'Basin interior may not be filled');
});
test('refined cauldron targeted vertical ray enters empty vessel and strikes physical bottom, not fake liquid',()=>{
  const f=makePack5Fixture(WORKSHOP_FAMILIES);f.setSupport([1,-1,2]);
  assert.equal(f.place('pack5:089',[1,0,2],0,'iron-tripod-cauldron').ok,true);
  const hit=f.raycast([1.5,1.8,2.5],[0,-1,0],3);
  assert.equal(hit?.symbolicId,'pack5:089');
  assert.ok(hit.distance>1.4,'Ray from above must reach basin bottom below open rim');
  assert.equal(f.collides([1.45,.57,2.45,1.55,.66,2.55]),false);
});
