import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PACK4_WINDOW_ASSETS,windowShape,windowPreviewMesh}
 from '../../../src/block-packs/pack-4/windows.mjs';
import {PACK4_LIGHT_ASSETS,lightingShape,lightingPreviewMesh}
 from '../../../src/block-packs/pack-4/lighting.mjs';
import {PACK4_FURNISHING_ASSETS,furnishingShape,furnishingPreviewMesh}
 from '../../../src/block-packs/pack-4/furnishings.mjs';
import {PACK4_CIVIC_ASSETS,civicShape,civicPreviewMesh}
 from '../../../src/block-packs/pack-4/hearth-civic.mjs';
import {createPack4Fixture,pack4Shape,pack4State,pack4MountOffset}
 from '../../../src/block-packs/pack-4/fixture.mjs';
const manifest=JSON.parse(readFileSync(
 new URL('../../../src/block-packs/pack-4/manifest.json',import.meta.url),'utf8'));
const all=[...PACK4_WINDOW_ASSETS,...PACK4_LIGHT_ASSETS,
 ...PACK4_FURNISHING_ASSETS,...PACK4_CIVIC_ASSETS];
const boundsGood=b=>Array.isArray(b)&&b.length===6&&
 b.every(v=>Number.isFinite(v)&&v>=0&&v<=1)&&
 b.slice(0,3).every((v,i)=>v<b[i+3]);
function meshFor(id,rotation){
 return id<165?windowPreviewMesh(id,rotation):
  id<169?lightingPreviewMesh(id,rotation):
  id<176?furnishingPreviewMesh(id,rotation):civicPreviewMesh(id,rotation);
}
function sourceShape(id,rotation){
 return id<165?windowShape(id,rotation):
  id<169?lightingShape(id,rotation):
  id<176?furnishingShape(id,rotation):civicShape(id,rotation);
}
test('all 22 assigned families have 23 exactly corresponding independent persistent IDs',()=>{
 const ids=Array.from({length:23},(_,i)=>159+i);
 assert.deepEqual(all.map(x=>x.id),ids);
 assert.deepEqual(manifest.assignedIds,ids);
 assert.equal(new Set(all.map(x=>x.roster)).size,22);
 assert.equal(manifest.entries.length,22);
 assert.equal(manifest.entries.filter(e=>e.status==='candidate').length,22);
 assert.equal(manifest.implementedCandidateFamilies,22);
 assert.equal(manifest.candidateVariants,23);
 assert.deepEqual(manifest.unassignedBand,[182,208]);
 assert.deepEqual(manifest.protectedIds,[0,1,2,3,4,5,6,7,8,255]);
 for(const a of all)assert.ok(manifest.entries.find(e=>
  e.roster===a.roster&&e.status==='candidate'&&e.blockIds.includes(a.id)));
});
test('premium candidate source variants differ in shape+material rather than IDs alone',()=>{
 const signatures=all.map(a=>JSON.stringify(a.parts));
 assert.equal(new Set(signatures).size,23);
 assert.notDeepEqual(PACK4_WINDOW_ASSETS[1].parts,PACK4_WINDOW_ASSETS[2].parts);
 assert.notDeepEqual(PACK4_CIVIC_ASSETS[2].parts,PACK4_CIVIC_ASSETS[5].parts);
 for(const a of all){
  assert.ok(a.parts.length>=2);
  assert.equal(a.occludesWholeCell,false);
  assert.deepEqual(a.availableRotations,[0,1,2,3]);
 }
});
test('23 models × four rotations preserve finite sub-cell physical geometry and GPU budgets',()=>{
 for(const a of all)for(let rotation=0;rotation<4;rotation++){
  const s=sourceShape(a.id,rotation),fixture=pack4Shape(a.id,rotation);
  assert.deepEqual(s,fixture);
  assert.equal(s.id,a.id);assert.equal(s.rotation,rotation);
  assert.equal(s.occludesWholeCell,false);
  assert.ok(s.selection.length>0&&s.collision.length>0);
  for(const b of [...s.selection,...s.collision])
   assert.ok(boundsGood(b),'invalid ID '+a.id+' rotation '+rotation);
  assert.ok(s.collision.every(b=>b.some((n,i)=>i<3&&b[i+3]-n<.97)),
   'false full-cube collider on '+a.id);
  const m=meshFor(a.id,rotation);
  assert.equal(m.stride,10);
  assert.equal((m.opaque.length+m.translucent.length)/10,s.visible.length*36);
  const vertices=(m.opaque.length+m.translucent.length)/10;
  assert.ok(vertices>0&&vertices<=1500,'oversized candidate '+a.id+' vertices '+vertices);
  for(const stream of [m.opaque,m.translucent]){
   assert.equal(stream.length%10,0);
   for(const value of stream)assert.ok(Number.isFinite(value));
  }
 }
});
test('unique physical occupancy, target, removal and atomic save replay for all 23 candidate cells',()=>{
 const placement=all.map((a,i)=>({id:a.id,cell:[i*3,2,0],rotation:i%4}));
 const supports=[];
 for(const item of placement){
  const off=pack4MountOffset(item.id,item.rotation);
  if(off)supports.push(item.cell.map((x,i)=>x+off[i]));
 }
 const f=createPack4Fixture(supports);
 for(const item of placement){
  assert.equal(f.place(item.cell,item.id,item.rotation).ok,true,'ID '+item.id+' placement');
  assert.equal(f.get(item.cell).id,item.id);
  assert.deepEqual(pack4State(item.id,item.rotation),{
   id:item.id,rotation:item.rotation
  });
 }
 assert.equal(f.count(),23);
 const snapshot=JSON.parse(JSON.stringify(f.save()));
 assert.equal(snapshot.schemaVersion,1);
 assert.equal(snapshot.fixture,'mythwrought.pack4.fixture');
 assert.equal(snapshot.cells.length,23);
 const replay=createPack4Fixture(supports);
 assert.equal(replay.restore(snapshot),23);
 assert.deepEqual(replay.save(),f.save());
 const corrupted=JSON.parse(JSON.stringify(snapshot));
 corrupted.cells[8].id=255;
 const before=JSON.stringify(replay.save());
 assert.throws(()=>replay.restore(corrupted));
 assert.equal(JSON.stringify(replay.save()),before,'failed restore stays atomic');
 for(const item of placement){
  assert.equal(replay.remove(item.cell).removed.id,item.id);
 }
 assert.equal(replay.count(),0);
});
test('no visual effect metadata is mislabeled as working fire/water or live lighting',()=>{
 for(const a of PACK4_LIGHT_ASSETS){
  assert.equal(a.light.engineEnabled,false);
  assert.ok(a.light.requires.includes('integration'));
 }
 for(const a of PACK4_CIVIC_ASSETS){
  assert.ok(Object.values(a.engines).every(value=>value===false));
 }
 assert.ok(manifest.productionState.includes('NOT IN LIVE GAME'));
 assert.ok(manifest.restrictions.noMainEdits);
 assert.ok(manifest.restrictions.noWorldPlacement);
 assert.ok(manifest.restrictions.noAutoMerge);
});
