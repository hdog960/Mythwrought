/** M6 Pack 5-only readiness matrix. Deliberately never imports live game or save modules. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {makePack5Fixture, validatePhysicalDescriptor, orientedParts, rotateCellOffset, PACK5_FIXTURE_FORMAT} from '../../../src/block-packs/pack-5/fixture.mjs';
import {PACK5_SURFACE_FAMILIES, PACK5_SURFACES, surfaceBoxMesh} from '../../../src/block-packs/pack-5/architectural-surfaces.mjs';
import {RESIDENTIAL_FAMILIES, RESIDENTIAL_FURNITURE, furnitureBoxMesh} from '../../../src/block-packs/pack-5/residential-furnishings.mjs';
import {SHOP_FAMILIES, SHOP_FIXTURES, shopBoxMesh} from '../../../src/block-packs/pack-5/shop-workshop.mjs';
import {WORKSHOP_FAMILIES, WORKSHOP_FIXTURES, workshopBoxMesh} from '../../../src/block-packs/pack-5/workshop-fixtures.mjs';
import {CIVIC_FAMILIES, CIVIC_INTERIORS, civicBoxMesh} from '../../../src/block-packs/pack-5/civic-interiors.mjs';
import {SPECIALTY_FAMILIES, SPECIALTY_FIXTURES, specialtyBoxMesh} from '../../../src/block-packs/pack-5/fortified-specialties.mjs';

const manifest=JSON.parse(readFileSync(new URL('../../../src/block-packs/pack-5/manifest.json',import.meta.url)));
const groups=[
  [PACK5_SURFACE_FAMILIES,PACK5_SURFACES,surfaceBoxMesh],
  [RESIDENTIAL_FAMILIES,RESIDENTIAL_FURNITURE,furnitureBoxMesh],
  [SHOP_FAMILIES,SHOP_FIXTURES,shopBoxMesh],
  [WORKSHOP_FAMILIES,WORKSHOP_FIXTURES,workshopBoxMesh],
  [CIVIC_FAMILIES,CIVIC_INTERIORS,civicBoxMesh],
  [SPECIALTY_FAMILIES,SPECIALTY_FIXTURES,specialtyBoxMesh]
];
const families=groups.flatMap(([fs])=>fs);
const variants=groups.flatMap(([,vs])=>vs);
const fixture=()=>makePack5Fixture(families);
const k=cell=>cell.join(',');
const supportFor=(f,d,anchor,rotation=0,enabled=true)=>{
  const parts=orientedParts(d,rotation);
  if(d.attachment==='floor')for(const part of parts){
    const [x,y,z]=part.cell;f.setSupport([anchor[0]+x,anchor[1]+y-1,anchor[2]+z],enabled);
  }else if(d.attachment==='ceiling')f.setSupport([anchor[0],anchor[1]+1,anchor[2]],enabled);
  else if(d.attachment==='wall'){
    const side=rotateCellOffset([0,0,-1],rotation);
    f.setSupport(anchor.map((v,i)=>v+side[i]),enabled);
  }
};
const aabb=(b,cell)=>[b[0]+cell[0],b[1]+cell[1],b[2]+cell[2],b[3]+cell[0],b[4]+cell[1],b[5]+cell[2]];
const intersects=(a,b)=>a[0]<b[3]&&a[3]>b[0]&&a[1]<b[4]&&a[4]>b[1]&&a[2]<b[5]&&a[5]>b[2];
const id=(n)=>`pack5:${String(n).padStart(3,'0')}`;
const desc=n=>families.find(f=>f.symbolicId===id(n));

// 1: the integrated *test-only* registry must be complete and truly cross-category.
test('M6 registry contains all and only 18 unique Pack 5 symbolic families',()=>{
  assert.equal(families.length,18);assert.deepEqual(families.map(x=>x.symbolicId),Array.from({length:18},(_,i)=>id(79+i)));
  assert.deepEqual(families.map(x=>x.name),manifest.entries.map(x=>x.name));
  assert.ok(families.every(validatePhysicalDescriptor));assert.doesNotThrow(fixture);
});
test('M6 enforces two authored variants per family and all 36 distinct variant names per family',()=>{
  assert.equal(variants.length,36);
  assert.equal(new Set(variants.map(x=>`${x.symbolicId}:${x.variant}`)).size,36);
  for(const f of families){const ours=variants.filter(x=>x.symbolicId===f.symbolicId);
    assert.equal(ours.length,2);assert.equal(f.variants.length,1);
    assert.deepEqual(ours.map(v=>v.variant),[f.variant,f.variants[0].variant]);
    assert.notDeepEqual(ours[0].parts,ours[1].parts);
  }
});
test('M6 manifest/source dependency contract never grants persistent IDs, saved-game writes or approval',()=>{
  assert.equal(manifest.candidateFamilies,18);assert.equal(manifest.completedFamilies,0);
  assert.equal(manifest.numericIdAllocation,null);assert.equal(manifest.integrated,false);
  assert.deepEqual(manifest.ownPaths,['src/block-packs/pack-5/','tests/block-packs/pack-5/']);
  assert.deepEqual(manifest.coordinationIssues,[109,117]);
  for(const entry of manifest.entries){
    assert.equal(entry.status,'CANDIDATE');assert.equal(entry.integrated,false);
    assert.equal(entry.persistentNumericId,null);assert.equal(entry.roster,Number(entry.symbolicId.slice(-3)));
    assert.ok(/^src\/block-packs\/pack-5\/[\w-]+\.mjs$/.test(entry.source));
    assert.ok(entry.variants.length===2);
    assert.deepEqual(entry.variants,variants.filter(v=>v.symbolicId===entry.symbolicId).map(v=>v.variant));
  }
});
test('M6 no future system or other pack is imported by any Pack 5 candidate model',()=>{
  for(const source of ['architectural-surfaces','residential-furnishings','shop-workshop','workshop-fixtures','civic-interiors','fortified-specialties']){
    const body=readFileSync(new URL(`../../../src/block-packs/pack-5/${source}.mjs`,import.meta.url),'utf8');
    assert.ok(!body.includes('localStorage')&&!body.includes('indexedDB')&&!body.includes('fetch('));
    for(const m of body.matchAll(/from\s+['"]([^'"]+)['"]/g))assert.equal(m[1],'./fixture.mjs');
  }
});

test('M6 each family can coexist on one shared 18-family fixture without alias collisions',()=>{
  const f=fixture(),placements=[];
  for(let n=0;n<18;n++){
    const d=families[n],anchor=[n*5,0,0],rotation=n%4,v=d.variants?.[0]?.variant??d.variant;
    supportFor(f,d,anchor,rotation);
    const p=f.place(d.symbolicId,anchor,rotation,v);
    assert.equal(p.ok,true,`${d.symbolicId}: ${p.reason}`);
    placements.push({d,anchor,rotation,v,cells:p.cells});
  }
  assert.equal(f.count(),18);
  for(const p of placements)for(const cell of p.cells){const q=f.cell(cell);
    assert.equal(q.symbolicId,p.d.symbolicId);assert.equal(q.rotation,p.rotation);
    assert.equal(q.variant,p.v);assert.deepEqual(q.anchor,p.anchor);
  }
  const snapshot=f.snapshot();assert.equal(snapshot.entries.length,18);assert.equal(snapshot.schema,undefined);
  assert.equal(f.restore(structuredClone(snapshot)),true);assert.deepEqual(f.snapshot(),snapshot);
});
test('M6 adjacent different one-cell families share edges without false overlap',()=>{
  const f=fixture(),a=desc(83),b=desc(84);
  supportFor(f,a,[0,0,0]);supportFor(f,b,[1,0,0]);
  assert.equal(f.place(a.symbolicId,[0,0,0]).ok,true);
  assert.equal(f.place(b.symbolicId,[1,0,0]).ok,true);
  assert.equal(f.count(),2);
  assert.deepEqual(f.cell([1,0,0]).anchor,[1,0,0]);
});
test('M6 reserved far end of real bed rejects different desk without any partial placement',()=>{
  const f=fixture(),bed=desc(82),desk=desc(91);
  supportFor(f,bed,[0,0,0]);supportFor(f,desk,[0,0,1]);
  assert.equal(f.place(bed.symbolicId,[0,0,0]).ok,true);
  const prior=f.snapshot();assert.deepEqual(f.place(desk.symbolicId,[0,0,1]),{ok:false,reason:'Occupied cell'});
  assert.deepEqual(f.snapshot(),prior);
  assert.equal(f.remove([0,0,1]),true);
  assert.equal(f.place(desk.symbolicId,[0,0,1]).ok,true);
});
test('M6 shared floor support is not enough for two-cell rug mixed with an adjacent bed',()=>{
  const f=fixture(),rug=desc(92),bed=desc(82);
  f.setSupport([0,-1,0]);
  assert.deepEqual(f.place(rug.symbolicId,[0,0,0],0,'hearthwoven-runner'),{ok:false,reason:'Missing attachment'});
  supportFor(f,rug,[0,0,0]);assert.equal(f.place(rug.symbolicId,[0,0,0],0,'hearthwoven-runner').ok,true);
  const state=f.snapshot();supportFor(f,bed,[1,0,0]);
  assert.equal(f.place(bed.symbolicId,[1,0,0]).ok,true);
  assert.equal(f.count(),2);assert.deepEqual(f.cell([0,0,1]).anchor,[0,0,0]);
  assert.equal(f.remove([0,0,1]),true);assert.equal(f.count(),1);
  assert.deepEqual(f.cell([1,0,0]).anchor,[1,0,0]);
});
test('M6 two-cell gate cannot overlap rotated stable partition',()=>{
  const f=fixture(),gate=desc(94),stable=desc(96);
  supportFor(f,gate,[0,0,0]);assert.equal(f.place(gate.symbolicId,[0,0,0]).ok,true);
  supportFor(f,stable,[1,0,0],1);
  const prior=f.snapshot();assert.deepEqual(f.place(stable.symbolicId,[1,0,0],1,'oak-stall-divider'),{ok:false,reason:'Occupied cell'});
  assert.deepEqual(f.snapshot(),prior);assert.equal(f.remove([1,0,0]),true);
  assert.equal(f.place(stable.symbolicId,[1,0,0],1,'oak-stall-divider').ok,true);
});
test('M6 ceiling chandelier and floor counter coexist in separate vertical cells',()=>{
  const f=fixture(),lamp=desc(95),counter=desc(86),above=[0,1,0];
  supportFor(f,counter,[0,0,0]);f.setSupport([0,2,0]);
  assert.equal(f.place(counter.symbolicId,[0,0,0]).ok,true);
  assert.equal(f.place(lamp.symbolicId,above,0,'suncrown-eightarm').ok,true);
  assert.equal(f.count(),2);
  assert.equal(f.cell([0,1,0]).symbolicId,lamp.symbolicId);
  assert.equal(f.remove([0,1,0]),true);assert.equal(f.cell([0,0,0]).symbolicId,counter.symbolicId);
});
test('M6 a floor-supported object cannot substitute for ceiling fixture support',()=>{
  const f=fixture(),lamp=desc(95);f.setSupport([1,-1,1]);
  assert.deepEqual(f.place(lamp.symbolicId,[1,0,1]),{ok:false,reason:'Missing attachment'});
  f.setSupport([1,1,1]);assert.equal(f.place(lamp.symbolicId,[1,0,1]).ok,true);
});
test('M6 wall plaster requires rotated directional backing even surrounded by floor candidates',()=>{
  const f=fixture(),wall=desc(79),tile=desc(81);
  supportFor(f,tile,[0,-1,0]);assert.equal(f.place(tile.symbolicId,[0,-1,0]).ok,true);
  assert.deepEqual(f.place(wall.symbolicId,[0,0,0],1),{ok:false,reason:'Missing attachment'});
  supportFor(f,wall,[0,0,0],1);assert.equal(f.place(wall.symbolicId,[0,0,0],1).ok,true);
  assert.equal(f.count(),2);
});
test('M6 three different physical furniture classes retain exact fixture collision gaps',()=>{
  const f=fixture();const ids=[83,89,96],points=[[0,0,0],[2,0,0],[4,0,0]];
  for(let i=0;i<ids.length;i++){const d=desc(ids[i]);supportFor(f,d,points[i]);
    const variant=ids[i]===96?'stone-feed-trough':ids[i]===89?'iron-tripod-cauldron':d.variant;
    assert.equal(f.place(d.symbolicId,points[i],0,variant).ok,true);
  }
  assert.equal(f.collides([2.41,.56,.41,2.59,.64,.59]),false,'hollow cauldron center');
  assert.equal(f.collides([4.41,.39,.42,4.59,.49,.58]),false,'dry trough center');
  assert.equal(f.collides([0.1,.4,.1,.2,.5,.2]),true,'chair solid leg');
});

test('M6 36 variants retain bounded genuine physical collision without phantom full cubes',()=>{
  for(const d of variants)for(const p of d.parts){
    assert.ok(p.boxes.length>=1&&p.boxes.length<=64);
    assert.ok(p.collisionBoxes.length<=64);
    assert.ok(p.collisionBoxes.every(b=>b.slice(0,3).every((v,i)=>v<b[i+3])));
    assert.ok(p.boxes.every(b=>b.every(Number.isFinite)));
  }
});
test('M6 ray targeting from an actual occupied shape remains correct in mixed layout',()=>{
  const f=fixture(),loc=[];
  for(let n=0;n<18;n++){
    const d=families[n],anchor=[n*5,0,0],rotation=n%4;supportFor(f,d,anchor,rotation);
    assert.equal(f.place(d.symbolicId,anchor,rotation,d.variant).ok,true);loc.push({d,anchor,rotation});
  }
  for(const {d,anchor,rotation} of loc){
    const first=orientedParts(d,rotation).flatMap(p=>p.boxes.map(b=>aabb(b,p.cell.map((v,i)=>v+anchor[i]))))[0];
    const cx=(first[0]+first[3])/2,cy=(first[1]+first[4])/2,cz=(first[2]+first[5])/2;
    const ray=f.raycast([cx,cy+1,cz],[0,-1,0],3);
    assert.equal(ray?.symbolicId,d.symbolicId,`${d.symbolicId}: targeted actual top surface`);
  }
});
test('M6 clearing a targeted mixed model never damages neighboring family',()=>{
  const f=fixture();for(const [n,x] of [[83,0],[84,2],[91,4]]){const d=desc(n);supportFor(f,d,[x,0,0]);assert.equal(f.place(d.symbolicId,[x,0,0]).ok,true);}
  assert.equal(f.removeRay([2.5,2,.5],[0,-1,0],3),true);
  assert.equal(f.count(),2);assert.equal(f.cell([0,0,0]).symbolicId,id(83));assert.equal(f.cell([4,0,0]).symbolicId,id(91));
});
test('M6 mixed four-rotation snapshots restore deterministically and preserve far-cell occupancy',()=>{
  const f=fixture(),selections=[[82,[0,0,0],1,'moonwatch-canopy'],[92,[3,0,0],3,'hearthwoven-runner'],[94,[7,0,0],2,'falling-portcullis-grille'],[95,[11,0,0],3,'prismatic-starrack'],[96,[15,0,0],1,'oak-stall-divider']];
  for(const [n,cell,rotation,variant] of selections){const d=desc(n);supportFor(f,d,cell,rotation);
    assert.equal(f.place(d.symbolicId,cell,rotation,variant).ok,true);
  }
  const snap=f.snapshot();assert.equal(snap.format,PACK5_FIXTURE_FORMAT);
  assert.equal(snap.entries.length,5);assert.equal('schema' in snap,false);
  assert.equal(f.restore(structuredClone(snap)),true);
  assert.deepEqual(f.snapshot(),snap);
  for(const [n,anchor,r] of selections)for(const p of orientedParts(desc(n),r)){
    const cell=p.cell.map((v,i)=>v+anchor[i]);assert.deepEqual(f.cell(cell).anchor,anchor);
  }
});
test('M6 overlapping mixed-family snapshot fails atomically after earlier valid row',()=>{
  const f=fixture(),d=desc(82);supportFor(f,d,[0,0,0]);supportFor(f,desc(83),[4,0,0]);
  assert.equal(f.place(id(82),[0,0,0]).ok,true);assert.equal(f.place(id(83),[4,0,0]).ok,true);
  const before=f.snapshot(),bad={format:PACK5_FIXTURE_FORMAT,entries:[...before.entries,[0,0,1,id(84),0]]};
  assert.throws(()=>f.restore(bad),/Invalid snapshot entry/);assert.deepEqual(f.snapshot(),before);
});
test('M6 invalid mixed variant after valid rows restores original placement exactly',()=>{
  const f=fixture();for(const [n,x] of [[83,0],[84,2],[95,4]]){const d=desc(n),cell=[x,0,0];supportFor(f,d,cell);assert.equal(f.place(d.symbolicId,cell).ok,true);}
  const prior=f.snapshot(),broken=structuredClone(prior);
  broken.entries[1][5]='invented-variant';
  assert.throws(()=>f.restore(broken));assert.deepEqual(f.snapshot(),prior);
});
test('M6 production schema-1-shaped snapshot cannot be accepted as an isolated candidate fixture save',()=>{
  const f=fixture(),d=desc(82);supportFor(f,d,[0,0,0]);f.place(d.symbolicId,[0,0,0]);
  const before=f.snapshot();assert.throws(()=>f.restore({schema:1,seed:0,blocks:[]}));
  assert.throws(()=>f.restore({...before,schema:1}));assert.deepEqual(f.snapshot(),before);
});
test('M6 all variants have safe source-preview triangle and box budgets in every rotation',()=>{
  for(const [,list,makeMesh] of groups)for(const d of list){
    const total=d.parts.reduce((n,p)=>n+p.boxes.length,0);
    assert.ok(d.parts.every(p=>p.boxes.length<=64));
    for(let r=0;r<4;r++){
      const mesh=makeMesh(d,{rotation:r});
      assert.equal(mesh.triangles,total*12,`${d.symbolicId}/${d.variant}`);
      assert.equal(mesh.vertexCount,total*24);
      assert.equal(mesh.positions.length,mesh.vertexCount*3);
      assert.equal(mesh.indices.length,mesh.triangles*3);
      assert.ok(mesh.positions.every(Number.isFinite));
    }
  }
});
test('M6 physically adjacent geometry does not overlap across occupied unit-cell boundary',()=>{
  const a=orientedParts(desc(83),0),b=orientedParts(desc(84),0);
  for(const p of a)for(const q of b){
    const aa=p.collisionBoxes.map(x=>aabb(x,p.cell)),bb=q.collisionBoxes.map(x=>aabb(x,[q.cell[0]+1,q.cell[1],q.cell[2]]));
    for(const x of aa)for(const y of bb)assert.equal(intersects(x,y),false);
  }
});


// Post-M6 demonstrated defect: non-unit directions previously shrank reach limits.
test('M6 physically measured ray reach is invariant to finite direction-vector scaling',()=>{
  const f=fixture(),counter=desc(86),anchor=[0,0,0];
  supportFor(f,counter,anchor);
  assert.equal(f.place(counter.symbolicId,anchor,0,'ledger-service').ok,true);
  const origin=[.5,2,.5];
  const unit=f.raycast(origin,[0,-1,0],4);
  assert.equal(unit?.symbolicId,counter.symbolicId);
  assert.ok(unit.distance>1,'Counter is over one actual world unit below the ray origin');
  for(const dir of [[0,-3,0],[0,-.2,0],[0,-200,0]]){
    assert.equal(f.raycast(origin,dir,1),null,'Scaled direction must not bypass a one-unit reach cap');
    const scaled=f.raycast(origin,dir,4);
    assert.equal(scaled?.symbolicId,counter.symbolicId);
    assert.ok(Math.abs(scaled.distance-unit.distance)<1e-9,'Physical hit distance must not depend on direction length');
  }
});
test('M6 removeRay cannot delete a distant neighboring asset via oversized direction',()=>{
  const f=fixture(),counter=desc(86),anchor=[0,0,0];
  supportFor(f,counter,anchor);assert.equal(f.place(counter.symbolicId,anchor,0,'ledger-service').ok,true);
  const prior=f.snapshot();
  assert.equal(f.removeRay([.5,2,.5],[0,-3,0],.5),false);
  assert.deepEqual(f.snapshot(),prior);
  assert.equal(f.removeRay([.5,2,.5],[0,-3,0],2),true);
  assert.equal(f.count(),0);
});
test('M6 scaled mixed-stack rays select the nearest physical part in world units',()=>{
  const f=fixture(),counter=desc(86),lamp=desc(95);
  supportFor(f,counter,[0,0,0]);supportFor(f,lamp,[0,1,0]);
  assert.equal(f.place(counter.symbolicId,[0,0,0],0,'ledger-service').ok,true);
  assert.equal(f.place(lamp.symbolicId,[0,1,0],0,'suncrown-eightarm').ok,true);
  const origin=[.5,3,.5];
  for(const scale of [1,2,.25]){
    assert.equal(f.raycast(origin,[0,-scale,0],4)?.symbolicId,lamp.symbolicId);
    assert.equal(f.raycast(origin,[0,-scale,0],.8),null);
  }
  assert.equal(f.remove([0,1,0]),true);
  assert.equal(f.raycast(origin,[0,-5,0],4)?.symbolicId,counter.symbolicId);
});
test('M6 rejects nonfinite direction norms despite finite individual vector components',()=>{
  const f=fixture();
  assert.throws(()=>f.raycast([0,0,0],[1.7e308,1.7e308,0],10),/Invalid ray direction length/);
});
