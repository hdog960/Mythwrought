import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validatePhysicalDescriptor,makePack5Fixture,orientedParts} from '../../../src/block-packs/pack-5/fixture.mjs';
import {CIVIC_INTERIORS,CIVIC_FAMILIES,CIVIC_VARIANTS,CIVIC_PALETTE,getCivicInterior,civicBoxMesh} from '../../../src/block-packs/pack-5/civic-interiors.mjs';
const d=(id,v)=>getCivicInterior(id,v);
const ids=['pack5:091','pack5:092','pack5:093'];
const manifest=JSON.parse(readFileSync(new URL('../../../src/block-packs/pack-5/manifest.json',import.meta.url)));

test('M4 uses exactly three source-owned families and six unique geometric variants',()=>{
 assert.deepEqual(CIVIC_FAMILIES.map(x=>x.symbolicId),ids);
 assert.equal(CIVIC_INTERIORS.length,6);
 assert.equal(new Set(CIVIC_INTERIORS.map(x=>JSON.stringify(x.parts))).size,6);
});
test('all six actual physical candidates have individually accurate collision volumes and no gameplay hooks',()=>{
 for(const p of CIVIC_INTERIORS){assert.equal(validatePhysicalDescriptor(p),true);
  assert.equal(p.numericId,undefined);assert.equal(p.integrated,false);assert.equal(p.inventory,false);assert.equal(p.magic,false);
  assert.equal(p.trade,false);assert.equal(p.interaction,false);
  assert.ok(p.parts.every(x=>x.boxes.length>=12&&x.boxes.length<=64&&JSON.stringify(x.boxes)===JSON.stringify(x.collisionBoxes)));
 }
});
test('cartographer desk is a raised real work surface, with real open knee air behind',()=>{
 const p=d('pack5:091','cartographers-oak-desk');
 assert.ok(p.parts[0].boxes.some(x=>x[1]>.7&&x[4]<.9));
 assert.ok(p.art[0].details.filter(x=>x.material==='azure'||x.material==='red').length>=5);
 const f=makePack5Fixture(CIVIC_FAMILIES);f.setSupport([0,-1,0]);assert.equal(f.place('pack5:091',[0,0,0],0,'cartographers-oak-desk').ok,true);
 assert.equal(f.collides([.32,.2,.36,.45,.55,.58]),false);
 assert.equal(f.collides([.34,.74,.36,.47,.79,.59]),true);
});
test('raised manuscript lectern is structurally unlike seated desk and has tiered page support',()=>{
 const p=d('pack5:091','moonstone-lectern');
 assert.ok(p.parts[0].boxes.filter(x=>x[1]>.55&&x[4]>.65).length>=5);
 assert.ok(p.art[0].details.some(x=>x.material==='parchment'));
 assert.notDeepEqual(p.parts,d('pack5:091','cartographers-oak-desk').parts);
});
test('hearth runner occupies two true connected floor cells and sigil rug occupies one',()=>{
 const runner=d('pack5:092','hearthwoven-runner'),sigil=d('pack5:092','starlace-sigil-rug');
 assert.deepEqual(runner.parts.map(x=>x.cell),[[0,0,0],[0,0,1]]);
 assert.deepEqual(sigil.parts.map(x=>x.cell),[[0,0,0]]);
 assert.ok(runner.parts.every(x=>x.boxes.every(b=>b[4]<.12)));
 assert.ok(sigil.parts[0].boxes.every(b=>b[4]<.12));
});
test('two-cell rug cannot levitate without support beneath the far segment',()=>{
 const f=makePack5Fixture(CIVIC_FAMILIES);f.setSupport([2,-1,3]);
 assert.deepEqual(f.place('pack5:092',[2,0,3],0,'hearthwoven-runner'),{ok:false,reason:'Missing attachment'});
 assert.equal(f.count(),0);f.setSupport([2,-1,4]);assert.equal(f.place('pack5:092',[2,0,3],0,'hearthwoven-runner').ok,true);
 assert.equal(f.cell([2,0,4]).symbolicId,'pack5:092');
});
test('two-cell rug can be rotated and removed atomically from its second cell',()=>{
 const f=makePack5Fixture(CIVIC_FAMILIES);f.setSupport([4,-1,4]);f.setSupport([3,-1,4]);
 assert.equal(f.place('pack5:092',[4,0,4],1,'hearthwoven-runner').ok,true);
 assert.equal(f.cell([3,0,4]).rotation,1);
 assert.equal(f.remove([3,0,4]),true);assert.equal(f.count(),0);assert.equal(f.cell([4,0,4]),null);
});
test('carpet low-relief embroidered threads are actually physical, not painted texture',()=>{
 for(const v of CIVIC_VARIANTS['pack5:092']){const p=d('pack5:092',v);
  assert.ok(p.art.flatMap(x=>x.details).filter(x=>['gold','cream','sage','azure'].includes(x.material)).length>=9);
  assert.ok(p.parts.every(x=>x.boxes.some(b=>b[4]>.08)));
 }
});
test('runesworn altar has a broad top and physical inset while no ritual effect is installed',()=>{
 const p=d('pack5:093','runesworn-stone-altar');
 assert.ok(p.parts[0].boxes.some(x=>x[1]>=.68&&x[3]-x[0]>.8));
 assert.ok(p.art[0].details.filter(x=>x.material==='amethyst').length>=3);
 assert.equal(p.magic,false);
});
test('reliquary pedestal has actual elevated empty niche, not solid ceiling-filling block',()=>{
 const p=d('pack5:093','sunspire-reliquary-plinth');
 assert.ok(p.parts[0].boxes.some(x=>x[4]>.98));
 assert.ok(p.art[0].details.filter(x=>x.material==='brass').length>=4);
 const f=makePack5Fixture(CIVIC_FAMILIES);f.setSupport([0,-1,0]);f.place('pack5:093',[0,0,0],0,'sunspire-reliquary-plinth');
 assert.equal(f.collides([.42,.952,.43,.56,.98,.57]),false);
 assert.equal(f.collides([.17,.95,.30,.23,.98,.40]),true);
});
test('24 variant-quarter-turn source meshes have coherent positions and bounded preview resources',()=>{
 for(const p of CIVIC_INTERIORS)for(let rotation=0;rotation<4;rotation++){
  const m=civicBoxMesh(p,{rotation});const n=p.parts.reduce((a,x)=>a+x.boxes.length,0);
  assert.equal(m.triangles,n*12);assert.ok(m.vertexCount<=6144);assert.equal(m.positions.length,m.vertexCount*3);
  assert.equal(m.colors.length,m.vertexCount*4);assert.ok(m.positions.every(Number.isFinite));
  assert.ok(m.indices.every(x=>x<m.vertexCount));assert.ok(m.colors.every(x=>x>=0&&x<=1));
  assert.deepEqual(orientedParts(p,rotation).map(x=>x.collisionBoxes.length),p.parts.map(x=>x.boxes.length));
 }
});
test('material palettes are finite opaque and specific to original interior props',()=>{
 assert.ok(Object.keys(CIVIC_PALETTE).length>=12);
 for(const p of CIVIC_INTERIORS)for(const art of p.art)for(const x of art.details){const c=CIVIC_PALETTE[x.material];
  assert.ok(c);assert.equal(c.length,4);assert.equal(c[3],1);assert.ok(c.every(x=>Number.isFinite(x)&&x>=0&&x<=1));
 }
});
test('real ray selection/removal on a supported altar preserves a separate lectern',()=>{
 const f=makePack5Fixture(CIVIC_FAMILIES);f.setSupport([0,-1,0]);f.setSupport([3,-1,0]);
 assert.equal(f.place('pack5:091',[0,0,0],0,'moonstone-lectern').ok,true);
 assert.equal(f.place('pack5:093',[3,0,0],0,'runesworn-stone-altar').ok,true);
 assert.equal(f.raycast([3.50,.77,3],[0,0,-1],5)?.symbolicId,'pack5:093');
 assert.equal(f.removeRay([3.50,.77,3],[0,0,-1],5),true);
 assert.equal(f.count(),1);assert.equal(f.cell([0,0,0]).symbolicId,'pack5:091');
});
test('candidate-only snapshot and corrupt-variant rollback preserve 91–93 rotation and metadata',()=>{
 const f=makePack5Fixture(CIVIC_FAMILIES);
 for(const [id,v,cell,r] of [['pack5:091','cartographers-oak-desk',[0,0,0],0],['pack5:092','hearthwoven-runner',[2,0,0],1],['pack5:093','sunspire-reliquary-plinth',[5,0,0],2]]){
  f.setSupport([cell[0],-1,cell[2]]);if(id==='pack5:092')f.setSupport([1,-1,0]);
  assert.equal(f.place(id,cell,r,v).ok,true);
 }
 const before=f.snapshot();assert.equal(before.schema,undefined);assert.equal(before.entries.length,3);
 f.restore(structuredClone(before));assert.deepEqual(f.snapshot(),before);
 assert.throws(()=>f.restore({format:before.format,entries:[[0,0,0,'pack5:091',0,'fake-lectern']]}));
 assert.deepEqual(f.snapshot(),before);
});
test('91–93 M4 symbols are candidates without IDs, 94–96 are untouched future work',()=>{
 const e=manifest.entries;assert.equal(manifest.candidateFamilies,15);assert.equal(e.filter(x=>x.status==='CANDIDATE').length,15);
 for(const id of [91,92,93]){const x=e.find(x=>x.roster===id);assert.equal(x.milestone,4);assert.equal(x.status,'CANDIDATE');assert.equal(x.persistentNumericId,null);}
 for(const id of [94,95,96]){const x=e.find(x=>x.roster===id);assert.equal(x.status,'NOT STARTED');assert.equal(x.persistentNumericId,null);}
});
