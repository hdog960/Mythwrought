import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validatePhysicalDescriptor,makePack5Fixture,orientedParts} from '../../../src/block-packs/pack-5/fixture.mjs';
import {SHOP_FIXTURES,SHOP_FAMILIES,SHOP_VARIANTS,SHOP_MATERIALS,getShopFixture,shopBoxMesh} from '../../../src/block-packs/pack-5/shop-workshop.mjs';
const manifest=JSON.parse(readFileSync(new URL('../../../src/block-packs/pack-5/manifest.json',import.meta.url)));
const unique=x=>new Set(x).size;
test('M3 starts with precisely two owned symbolic families / four independently authored variants',()=>{
 assert.deepEqual(SHOP_FAMILIES.map(x=>x.symbolicId),['pack5:086','pack5:087']);
 assert.equal(SHOP_FIXTURES.length,4);
 assert.equal(unique(SHOP_FIXTURES.map(x=>JSON.stringify(x.parts))),4);
 assert.equal(unique(SHOP_FIXTURES.map(x=>`${x.symbolicId}/${x.variant}`)),4);
});
test('each shop part is physically bounded, collision-authored, without live IDs or gameplay',()=>{
 for(const d of SHOP_FIXTURES){assert.equal(validatePhysicalDescriptor(d),true);
  assert.equal(d.parts.length,1);assert.deepEqual(d.parts[0].cell,[0,0,0]);
  assert.ok(d.parts[0].boxes.length>=20&&d.parts[0].boxes.length<=64);
  assert.deepEqual(d.parts[0].collisionBoxes,d.parts[0].boxes);
  assert.equal(d.attachment,'floor');assert.equal(d.numericId,undefined);assert.equal(d.integrated,false);
  assert.equal(d.inventory,false);assert.equal(d.trade,false);assert.equal(d.crafting,false);
 }
});
test('market counters have actual front fascia and open vendor rear',()=>{
 for(const variant of SHOP_VARIANTS['pack5:086']){
  const d=getShopFixture('pack5:086',variant),boxes=d.parts[0].boxes;
  assert.ok(boxes.filter(b=>b[2]>=.83&&b[5]>.9).length>=8,variant);
  assert.ok(boxes.some(b=>b[1]>=.69&&b[5]>.93));
  assert.ok(boxes.some(b=>b[1]<.3&&b[2]<.4&&b[5]<.8));
 }
});
test('market service counter and festival heraldic fascia use different genuine volumes',()=>{
 const a=getShopFixture('pack5:086','ledger-service'),b=getShopFixture('pack5:086','festival-fascia');
 assert.notDeepEqual(a.parts,b.parts);assert.ok(a.art[0].details.some(x=>x.material==='marble'));
 assert.ok(b.art[0].details.filter(x=>x.material==='indigo'||x.material==='sage').length>=4);
});
test('product tray fixture has three independently raised, physically bounded tiers',()=>{
 const d=getShopFixture('pack5:087','stepped-market-tray'),boxes=d.parts[0].boxes;
 for(const y of [.23,.46,.69])assert.ok(boxes.some(b=>Math.abs(b[1]-y)<.0001&&b[3]>.8&&b[5]-b[2]>=.24));
});
test('curio arcade has separate open bays and unique decorative plinths',()=>{
 const d=getShopFixture('pack5:087','curio-arcade'),art=d.art[0].details;
 assert.ok(art.filter(x=>x.material==='gold').length>=4);
 assert.ok(art.filter(x=>x.material==='marble').length>=1);
 assert.ok(d.parts[0].boxes.some(b=>b[4]>.97));
});
test('each variant retains original physically colored opaque palette',()=>{
 for(const d of SHOP_FIXTURES)for(const detail of d.art[0].details){
  const c=SHOP_MATERIALS[detail.material];assert.ok(c);assert.equal(c.length,4);assert.equal(c[3],1);
  assert.ok(c.every(v=>Number.isFinite(v)&&v>=0&&v<=1));
 }
});
test('sixteen source-mesh quarter-turn cases use outward bounded triangles and no overdraw budget violation',()=>{
 for(const d of SHOP_FIXTURES)for(let r=0;r<4;r++){
  const m=shopBoxMesh(d,{rotation:r});assert.ok(m.triangles>250&&m.triangles<=768);
  assert.equal(m.indices.length,m.triangles*3);assert.equal(m.positions.length,m.vertexCount*3);
  assert.equal(m.colors.length,m.vertexCount*4);assert.ok(m.positions.every(Number.isFinite));
  assert.ok(m.indices.every(v=>v<m.vertexCount));
  assert.ok(m.positions.every((v,i)=>v>=0&&v<=1));
  assert.ok(orientedParts(d,r)[0].boxes.length>=20);
 }
});
test('floor support is required, removing an unsupported shop is harmless',()=>{
 const f=makePack5Fixture(SHOP_FAMILIES);
 assert.deepEqual(f.place('pack5:086',[5,2,5],0,'ledger-service'),{ok:false,reason:'Missing attachment'});
 assert.equal(f.remove([5,2,5]),false);assert.equal(f.count(),0);
 f.setSupport([5,1,5]);assert.equal(f.place('pack5:086',[5,2,5],0,'ledger-service').ok,true);
});
test('rotated counter has visible selectable physical front facing and is fully removed by ray',()=>{
 const f=makePack5Fixture(SHOP_FAMILIES);f.setSupport([0,-1,0]);
 assert.equal(f.place('pack5:086',[0,0,0],1,'festival-fascia').ok,true);
 assert.equal(f.raycast([3,.5,.5],[-1,0,0],6)?.symbolicId,'pack5:086');
 assert.equal(f.removeRay([3,.5,.5],[-1,0,0],6),true);assert.equal(f.count(),0);
});
test('open fixtures have genuine subcell gaps while supports and headers collide',()=>{
 const f=makePack5Fixture(SHOP_FAMILIES);f.setSupport([0,-1,0]);
 assert.equal(f.place('pack5:087',[0,0,0],0,'stepped-market-tray').ok,true);
 assert.equal(f.collides([.30,.12,.35,.40,.17,.45]),false);
 assert.equal(f.collides([.35,.23,.20,.40,.30,.28]),true);
 assert.equal(f.collides([.35,.96,.25,.50,.99,.40]),false);
});
test('variant fixture snapshots preserve rotation and reject corrupt variants atomically',()=>{
 const f=makePack5Fixture(SHOP_FAMILIES);f.setSupport([0,-1,0]);f.setSupport([3,-1,0]);
 assert.equal(f.place('pack5:086',[0,0,0],0,'ledger-service').ok,true);
 assert.equal(f.place('pack5:087',[3,0,0],2,'curio-arcade').ok,true);
 const before=f.snapshot();assert.equal(before.entries.length,2);assert.equal(before.schema,undefined);
 assert.equal(f.restore(structuredClone(before)),true);assert.deepEqual(f.snapshot(),before);
 assert.throws(()=>f.restore({format:before.format,entries:[[0,0,0,'pack5:087',0,'invented-shop']]}));
 assert.deepEqual(f.snapshot(),before);
});
test('all fixtures have two candidate variants with no duplication of Pack4 benches/tables or Pack5 bookcases',()=>{
 const textSource=readFileSync(new URL('../../../src/block-packs/pack-5/shop-workshop.mjs',import.meta.url),'utf8');
 assert.ok(!/from\s+['"]\.\.\/\.\.\//.test(textSource));
 assert.equal(SHOP_FIXTURES.some(d=>['Beds','Chairs & Stools','Bookshelves','Cabinets & Wardrobes'].includes(d.name)),false);
});
test('manifest preserves original 86 and 87 while 88–90 become independent M3 candidates',()=>{
 for(const roster of [86,87]){const e=manifest.entries.find(x=>x.roster===roster);
  assert.equal(e.status,'CANDIDATE');assert.equal(e.persistentNumericId,null);assert.equal(e.milestone,3);
 }
 for(const roster of [88,89,90])assert.equal(manifest.entries.find(x=>x.roster===roster).status,'CANDIDATE');
});
