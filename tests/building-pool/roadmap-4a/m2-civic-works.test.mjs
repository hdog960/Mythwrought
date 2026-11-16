import test from 'node:test';
import assert from 'node:assert/strict';
import {allM1} from '../../../src/building-pool/roadmap-4a/m1-blueprints.mjs';
import {allM2Exemplars} from '../../../src/building-pool/roadmap-4a/m2-blueprints.mjs';
import {allM2Additional} from '../../../src/building-pool/roadmap-4a/m2-additional.mjs';
import {allM2Regional} from '../../../src/building-pool/roadmap-4a/m2-regional.mjs';
import {allM2Expansion} from '../../../src/building-pool/roadmap-4a/m2-expansion.mjs';
import {allM2Tranche} from '../../../src/building-pool/roadmap-4a/m2-tranche.mjs';
import {allM2Next} from '../../../src/building-pool/roadmap-4a/m2-next.mjs';
import {allM2Silhouettes} from '../../../src/building-pool/roadmap-4a/m2-silhouettes.mjs';
import {allM2Profiles} from '../../../src/building-pool/roadmap-4a/m2-profile-architecture.mjs';
import {allM2Courtyards} from '../../../src/building-pool/roadmap-4a/m2-courtyard-architecture.mjs';
import {allM2Districts} from '../../../src/building-pool/roadmap-4a/m2-district-architecture.mjs';
import {allM2CivicWorks,buildM2CivicWorks,M2_CIVIC_WORKS_IDS} from '../../../src/building-pool/roadmap-4a/m2-civic-works.mjs';
import {MANUAL_FIVE_PACK_COUNTS} from '../../../src/builder-assets/manual-five-pack.mjs';
import {validateBlueprint,validateCollection,geometrySignature,serializeBlueprint} from '../../../src/building-pool/roadmap-4a/schema.mjs';
import {auditBlueprintMaterials} from '../../../src/building-pool/roadmap-4a/m1-material-audit.mjs';
import manifest from '../../../src/building-pool/roadmap-4a/manifest.json' with {type:'json'};
const EXPECTED_IDS=["r4:civic-hall:enchanted-forest:large:03","r4:civic-hall:mountain:large:03","r4:civic-hall:snow:large:04","r4:civic-hall:temperate:medium:04","r4:guildhall:enchanted-forest:small:02","r4:guildhall:snow:small:02","r4:guildhall:desert:large:03","r4:guildhall:mountain:medium:03"];
const old=()=>[...allM1(),...allM2Exemplars(),...allM2Additional(),...allM2Regional(),...allM2Expansion(),...allM2Tranche(),...allM2Next(),...allM2Silhouettes(),...allM2Profiles(),...allM2Courtyards(),...allM2Districts()];
const fresh=()=>allM2CivicWorks();
const xyz=arr=>arr.join(',');
const map=b=>new Map(b.cells.map(c=>[xyz(c.at),c]));
function d4(b){
 const cells=b.cells.map(({at:[x,y,z],role})=>[x,z,y,role]),choices=[];
 for(let flip=0;flip<=1;flip++)for(let turn=0;turn<4;turn++){
  const transformed=cells.map(([ix,iz,y,role])=>{
   let x=flip?-ix:ix,z=iz;
   for(let i=0;i<turn;i++){const prev=x;x=-z;z=prev;}
   return [x,z,y,role];
  });
  const lowX=Math.min(...transformed.map(c=>c[0])),lowZ=Math.min(...transformed.map(c=>c[1]));
  choices.push(transformed.map(([x,z,y,role])=>[x-lowX,z-lowZ,y,role].join('/')).sort().join('|'));
 }
 return choices.sort()[0];
}
test('all eight source-specific new IDs occupy unused 4A quota slots; inherited 30 and earlier 62 M2 designs are retained',()=>{
 const current=fresh(),all=[...old(),...current];
 assert.deepEqual(M2_CIVIC_WORKS_IDS,EXPECTED_IDS);
 assert.equal(old().length,92);
 assert.equal(current.length,8);
 assert.equal(all.length,100);
 assert.equal(validateCollection(all).verified,100);
 assert.equal(new Set(all.map(x=>x.id)).size,100);
 assert.equal(new Set(all.map(geometrySignature)).size,100);
 assert.equal(manifest.counts.legacyAuthored,30);
 assert.equal(manifest.counts.newlyAuthored,86);
 assert.equal(manifest.counts.totalAuthored,116);
 assert.equal(manifest.counts.remaining,199);
 assert.equal(manifest.counts.creatorAccepted,0);
 assert.equal(manifest.counts.integratedBuildings,0);
 assert.equal(manifest.categories.find(c=>c.type==='civic-hall').remaining,17);
 assert.equal(manifest.categories.find(c=>c.type==='guildhall').remaining,17);
});
test('all 100 whole-volume source fingerprints are unique under 90-degree rotation, reflection and translation',()=>{
 const signatures=new Map();
 for(const b of [...old(),...fresh()]){
  const fingerprint=d4(b);
  assert.ok(!signatures.has(fingerprint),b.id+' duplicates '+signatures.get(fingerprint));
  signatures.set(fingerprint,b.id);
 }
 assert.equal(signatures.size,100);
});
test('new region-specific civic halls and guild workshops are occupied 3D rooms with two-cell head clearance and navigable public circulation',()=>{
 const all=fresh();
 assert.equal(all.reduce((n,b)=>n+b.cells.length,0),51708);
 assert.equal(all.reduce((n,b)=>n+b.navigation.length,0),10947);
 assert.equal(all.reduce((n,b)=>n+b.spaces.length,0),40);
 for(const b of all){
  const v=validateBlueprint(b),cells=map(b);
  assert.equal(v.theoreticalOnly,true);
  assert.ok(v.occupiedCells>1000&&v.walkableCells>200&&v.rooms>=3);
  assert.ok(b.openings.filter(o=>o.kind==='window').length>=6);
  assert.equal(b.openings.filter(o=>o.kind==='entrance').length,1);
  for(const s of b.spaces){
   assert.ok(s.footprint.length>=12,b.id+' '+s.id);
   assert.equal(cells.get(xyz([s.access[0],0,s.access[2]]))?.role,'floor');
  }
  assert.ok(b.cells.some(c=>c.role==='fixture'));
  assert.ok(b.navigation.some(n=>n.at[2]===b.openings.find(o=>o.kind==='entrance').at[2]-1));
 }
});
test('real exterior windows occupy masonry sockets and each doorway retains supported two-cell head clearance',()=>{
 const move={north:[0,1],south:[0,-1],west:[-1,0],east:[1,0]};
 for(const b of fresh()){
  const cells=map(b);
  for(const o of b.openings){
   if(o.kind==='window'){
    assert.equal(cells.get(xyz(o.at))?.role,'window',b.id+' '+xyz(o.at));
    const [dx,dz]=move[o.facing],beyond=cells.get(xyz([o.at[0]+dx,2,o.at[2]+dz]));
    assert.ok(!beyond||!['wall','partition','window'].includes(beyond.role),b.id+' facing into masonry '+xyz(o.at));
   }else{
    assert.ok(!cells.has(xyz(o.at)));
    assert.ok(!cells.has(xyz([o.at[0],2,o.at[2]])));
    assert.equal(cells.get(xyz([o.at[0],0,o.at[2]]))?.role,'floor');
    assert.ok(b.navigation.some(n=>xyz(n.at)===xyz(o.at)),b.id+' disconnected door '+xyz(o.at));
   }
  }
 }
});
test('every raised roof tile has authored support immediately below; main roofs have short purlin bearing spans',()=>{
 for(const b of fresh()){
  const cells=map(b);
  for(const c of b.cells.filter(c=>c.role==='roof')){
   const [x,y,z]=c.at;
   if(y===6){
    assert.equal(cells.get(xyz([x,5,z]))?.role,'beam',b.id+' roof ridge '+xyz(c.at));
    let grounded=false;
    for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){
     if(Math.abs(dx)+Math.abs(dz)>2)continue;
     if(['beam','wall','column'].includes(cells.get(xyz([x+dx,4,z+dz]))?.role))grounded=true;
    }
    assert.ok(grounded,b.id+' raised roof beam exceeds two-cell bearing span '+xyz(c.at));
   }else if(y===5){
    let bearing=false;
    for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){
     if(Math.abs(dx)+Math.abs(dz)>2)continue;
     if(['beam','wall','column'].includes(cells.get(xyz([x+dx,4,z+dz]))?.role))bearing=true;
    }
    assert.ok(bearing,b.id+' unsupported roof span '+xyz(c.at));
   }
  }
 }
});

test('genuinely authored regional roof slopes have multiple different profiles with supported bearing and no invented habitable upper story',()=>{
 for(const b of fresh()){
  const mapCells=map(b),forms=b.architecturalNotes.roofProfiles;
  assert.ok(Array.isArray(forms)&&forms.length>=4,b.id);
  assert.ok(new Set(forms.map(p=>p.profile)).size>=3,b.id+' repetitive roof-only design');
  assert.ok(forms.every(p=>p.count>=12&&p.high>=7&&p.high<b.bounds[1]));
  assert.equal(b.architecturalNotes.storyCount,1);
  assert.ok(b.cells.some(c=>c.role==='roof'&&c.at[1]>=8),b.id+' no visible elevated roof pitch');
  for(const c of b.cells.filter(c=>c.role==='roof'&&c.at[1]>5)){
   const [x,y,z]=c.at;
   assert.equal(mapCells.get(xyz([x,y-1,z]))?.role,'beam',b.id+' upper roof missing purlin '+xyz(c.at));
   assert.equal(mapCells.get(xyz([x,5,z]))?.role,'beam',b.id+' upper roof missing source-bearing base '+xyz(c.at));
  }
  assert.ok(!b.navigation.some(n=>n.at[1]>1),b.id+' roof tier falsely marked accessible');
 }
});
function normalizedPlanForms(b){
 const floor=b.cells.filter(c=>c.role==='floor'&&c.at[1]===0).map(c=>[c.at[0],c.at[2]]);
 const choices=[];
 for(let flip=0;flip<2;flip++)for(let turn=0;turn<4;turn++){
  const coords=floor.map(([ix,iz])=>{
   let x=flip?-ix:ix,z=iz;
   for(let i=0;i<turn;i++){const prev=x;x=-z;z=prev;}
   return [x,z];
  });
  const lowX=Math.min(...coords.map(c=>c[0])),lowZ=Math.min(...coords.map(c=>c[1]));
  choices.push(new Set(coords.map(([x,z])=>(x-lowX)+','+(z-lowZ))));
 }
 return choices;
}
function overlapIoU(a,b){
 let maximum=0;
 for(const one of a)for(const two of b){
  const small=one.size<=two.size?one:two,large=one.size<=two.size?two:one;
  let intersection=0;for(const k of small)if(large.has(k))intersection++;
  maximum=Math.max(maximum,intersection/(one.size+two.size-intersection));
 }
 return maximum;
}
test('eight distinct floor programs are not near-repeated older civic/guild plans under any D4 reflection or translation',()=>{
 const previous=old().map(b=>({id:b.id,type:b.type,forms:normalizedPlanForms(b)}));
 for(const b of fresh()){
  const f=normalizedPlanForms(b);
  const matches=previous.filter(p=>p.type===b.type)
    .map(p=>({id:p.id,iou:overlapIoU(f,p.forms)}))
    .sort((a,z)=>z.iou-a.iou);
  assert.ok(matches[0].iou<0.85,b.id+' near-duplicate of '+matches[0].id+
    ': normalized D4 footprint IoU '+matches[0].iou.toFixed(4));
 }
});


test('new civic/guild plans also reject same-cohort near-duplicates under D4',()=>{
 const candidate=fresh(),p=candidate.map(b=>({id:b.id,type:b.type,forms:normalizedPlanForms(b)}));
 for(let i=0;i<p.length;i++)for(let j=i+1;j<p.length;j++){
  if(p[i].type!==p[j].type)continue;
  const similarity=overlapIoU(p[i].forms,p[j].forms);
  assert.ok(similarity<0.85,p[i].id+' versus '+p[j].id+
   ' normalized D4 footprint IoU '+similarity.toFixed(5));
 }
});
test('merged producer physical-family counts and source-backed review remain read-only and fail closed',()=>{
 assert.equal(MANUAL_FIVE_PACK_COUNTS.families,96);
 assert.equal(MANUAL_FIVE_PACK_COUNTS.numericVariants,106);
 for(const b of fresh()){
  const report=auditBlueprintMaterials(b);
  assert.equal(report.productionReady,false);
  assert.equal(report.worldPlaced,false);
  assert.equal(report.saveWritten,false);
  assert.ok(report.symbolicCells>50);
  assert.ok(report.entries.every(e=>e.chosenNumericId===null&&e.blockedBy.length>0));
  assert.ok(report.entries.every(e=>e.status==='source-shape-resolved-for-review' ||
    e.status==='numeric-variant-choice-required' || e.status==='authored-variant-choice-required' ||
    e.status==='source-shape-resolution-failed' || e.status==='unregistered-biome130-symbol'));
 }
});

test('merged physical five-pack geometry remains read-only, explicit yaw and support requirements remain unresolved',()=>{
 for(const b of fresh()){
  const audit=auditBlueprintMaterials(b);
  assert.ok(audit.symbolicCells>50&&audit.entries.length>=3);
  assert.equal(audit.productionReady,false);
  assert.equal(audit.worldPlaced,false);
  assert.equal(audit.saveWritten,false);
  assert.equal(audit.realIphoneTested,false);
  assert.ok(audit.entries.every(e=>e.chosenNumericId===null&&e.blockedBy.length>0));
  assert.ok(b.dependencies.every(d=>d.unresolved.length>0&&!Object.hasOwn(d,'numericId')));
 }
});
test('all authored structures are deterministic and lack any world writer, save mutation or fictional approval',()=>{
 for(const b of fresh()){
  assert.equal(serializeBlueprint(b),serializeBlueprint(buildM2CivicWorks(b.id)));
  assert.equal(b.architecturalNotes.worldPlacement,false);
  assert.equal(b.architecturalNotes.creatorAccepted,false);
  assert.ok(!('savedPlayer' in b)&&!('worldEdits' in b));
 }
});
