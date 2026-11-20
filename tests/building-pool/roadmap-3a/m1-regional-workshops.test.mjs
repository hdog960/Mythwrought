import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {M1_REGIONAL_SPECS,createM1RegionalWorkshop,createM1RegionalPool} from '../../../src/building-pool/roadmap-3a/m1-regional-workshops.mjs';
import {createM1OriginalWorkshopPool} from '../../../src/building-pool/roadmap-3a/m1-workshop-exemplars.mjs';
import {createLegacyBlacksmithPool} from '../../../src/building-pool/roadmap-3a/legacy-blacksmiths.mjs';
import {validateBlueprint,validateAuthoredPool} from '../../../src/building-pool/roadmap-3a/contract.mjs';
import {resolveManualFivePackAsset} from '../../../src/builder-assets/manual-five-pack.mjs';
import {createPreviewMesh} from './preview-mesh.mjs';
import {fitPreviewCamera} from './preview-camera.mjs';
const models=createM1RegionalPool();
const key=c=>c.slice(0,3).join(',');
function canonicalMass(b){
 // Translation, rotations (0, 90, 180, 270 degrees) and all mirrors cannot
 // manufacture independently authored architecture.
 const points=b.modules.flatMap(m=>m.cells.map(c=>c.slice(0,3)));
 const sym=[];
 for(let rotation=0;rotation<4;rotation++)for(const mirror of [false,true]){
  const xyz=points.map(([x,y,z])=>{
   if(mirror)x=-x;
   for(let i=0;i<rotation;i++){const nx=-z;z=x;x=nx;}
   return [x,y,z];
  });
  const min=[0,1,2].map(i=>Math.min(...xyz.map(v=>v[i])));
  const normalized=xyz.map(v=>v.map((n,i)=>n-min[i]).join(',')).sort();
  sym.push(createHash('sha256').update(normalized.join('|')).digest('hex'));
 }
 return sym.sort()[0];
}
test('exactly 12 NEW region-specific M1 models with 4 categories and all four new biomes',()=>{
 assert.equal(M1_REGIONAL_SPECS.length,12);
 assert.equal(models.length,12);
 assert.equal(validateAuthoredPool(models).authored,12);
 for(const type of ['armorer','carpenter','stonemason','mining-workshop'])
  assert.equal(models.filter(b=>b.type===type).length,3);
 for(const biome of ['desert','snow','enchanted-forest','mountain'])
  assert.ok(models.some(b=>b.biome===biome));
 assert.ok(models.some(b=>b.size==='medium')&&models.some(b=>b.size==='large'));
 assert.equal(new Set(models.map(b=>b.id)).size,12);
 assert.equal(new Set(models.map(b=>b.architecture.roofStyle)).size,12);
 for(const q of M1_REGIONAL_SPECS)
  assert.equal(createM1RegionalWorkshop(q.type,q.biome,q.size).id,
   'r3a:'+q.type+':'+q.biome+':'+q.size+':1');
 assert.throws(()=>createM1RegionalWorkshop('armorer','temperate','small'),RangeError);
});
test('all 12 have real 2-wide/3-high occupied-free access and a fully placed floor',()=>{
 for(const b of models){
  const occupied=new Set(b.modules.flatMap(m=>m.cells.map(key)));
  assert.equal(occupied.size,b.modules.reduce((n,m)=>n+m.cells.length,0));
  assert.equal(b.worldPlaced,false);
  assert.equal(b.architecture.weatherTightApproved,false);
  assert.equal(b.architecture.roofLoadApproved,false);
  const n=b.navigation.nodes[0],e=b.envelope;
  for(let z=2;z<e.depth;z++)for(let x=n.x;x<n.x+2;x++){
   assert.ok(occupied.has([x,1,z].join(',')),b.id+' missing floor '+x+','+z);
   for(let y=2;y<=4;y++)
    assert.ok(!occupied.has([x,y,z].join(',')),b.id+' blocked passage '+[x,y,z]);
  }
  for(const s of b.spaces){
   assert.ok(b.navigation.nodes.some(n=>n.id===s.accessNode),'room is not a label-only placeholder');
  }
  assert.ok(b.modules.find(m=>m.role==='roof').cells.length>100);
  assert.ok(b.modules.find(m=>m.role==='support-pier').cells.length>30);
  assert.ok(b.modules.find(m=>m.role==='fixture').cells.length===2);
  assert.ok(validateBlueprint(b).coordinateCells>1200);
 }
});
test('19 prior authored models plus 12 new are unique under all geometric mirrors/rotations',()=>{
 const old=[...createLegacyBlacksmithPool(),...createM1OriginalWorkshopPool()];
 assert.equal(old.length,19);
 const signatures=new Map();
 for(const b of [...old,...models]){
  const sig=canonicalMass(b);
  assert.ok(!signatures.has(sig),'duplicate or mirrored/rotated physical geometry '+b.id+' vs '+signatures.get(sig));
  signatures.set(sig,b.id);
 }
 assert.equal(signatures.size,31);
});
test('physical-family fixtures have required explicit orientation / variant and authored supports',()=>{
 for(const b of models){
  const cells=b.modules.flatMap(m=>m.cells);
  const occupied=new Set(cells.map(key));
  const fixtures=b.modules.find(m=>m.role==='fixture').cells;
  for(const c of fixtures){
   const [, , ,symbol,meta]=c;
   assert.ok(meta&&meta.orientation==='north',b.id+' untyped '+symbol);
   const physical=resolveManualFivePackAsset(symbol,meta.variant?{orientation:meta.orientation,variant:meta.variant}:{orientation:meta.orientation});
   assert.equal(physical.builderResolvable,true);
   assert.equal(physical.livePlaceable,false);
   assert.ok(physical.visibleBoxes.length>0);
   assert.ok(physical.selectionBoxes.length>0);
   for(const offset of physical.supportOffsets){
    const p=[c[0]+offset[0],c[1]+offset[1],c[2]+offset[2]].join(',');
    assert.ok(occupied.has(p),b.id+' missing required '+symbol+' support '+p);
   }
  }
 }
});
test('72 real-source mesh/camera diagnostic inputs are finite and framed across 3 landscape sizes',()=>{
 let count=0;
 for(const b of models)for(const cutaway of [false,true]){
  const mesh=createPreviewMesh(b,{cutaway});
  assert.ok(mesh.vertices instanceof Float32Array);
  assert.ok(mesh.vertices.every(Number.isFinite));
  assert.ok(mesh.triangleCount>100&&mesh.triangleCount<30000);
  assert.equal(mesh.isDiagnosticEnvelope,true);
  assert.equal(mesh.notAssetShapeProof,true);
  for(const [w,h] of [[667,375],[844,390],[932,430]]){
   const c=fitPreviewCamera(b.envelope,mesh.vertices,w,h);
   assert.ok(c.projectedHalfWidth<1&&c.projectedHalfHeight<1);
   count++;
  }
 }
 assert.equal(count,72);
});
test('export actual audited M1 geometry census without counting future quota slots as authored',()=>{
 const all=[...createLegacyBlacksmithPool(),...createM1OriginalWorkshopPool(),...models];
 assert.equal(all.length,31);
 const data=all.map(b=>({id:b.id,biome:b.biome,size:b.size,type:b.type,
  cellCount:b.modules.reduce((n,m)=>n+m.cells.length,0),
  geometrySha256:createHash('sha256').update(canonicalMass(b)).digest('hex'),
  sourceVerified:b.type==='blacksmith',
  status:'THEORETICAL_UNMERGED',worldPlaced:false}));
 const out=join(process.cwd(),'artifacts/building-roadmap-3a-regional');
 mkdirSync(out,{recursive:true});
 writeFileSync(join(out,'CENSUS.json'),JSON.stringify({schema:'mythwrought.3a.M1.31-source-census.v1',
  knownCandidates:31,legacyBlacksmiths:15,originalWorkshopTypes:4,regionalExemplars:12,
  remaining:345-31,models:data},null,2)+'\n');
});
