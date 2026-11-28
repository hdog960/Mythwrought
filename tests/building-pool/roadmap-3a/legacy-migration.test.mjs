import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,mkdirSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {BIOMES,SIZES,slotId} from '../../../src/building-pool/roadmap-3a/roster.mjs';
import {createLegacyBlacksmith,createLegacyBlacksmithPool} from '../../../src/building-pool/roadmap-3a/legacy-blacksmiths.mjs';
import {geometryFingerprint as newFingerprint,serializeBlueprint as newSerialize,validatePool} from '../../../src/building-pool/roadmap-3a/legacy-validation.mjs';
import {ASSET_CATALOG} from '../../../src/building-pool/roadmap-3a/legacy-assets.mjs';
const ledger=JSON.parse(readFileSync(new URL('../../../docs/building-pool/roadmap-3a/LEGACY_BLACKSMITHS.json',import.meta.url),'utf8'));
const manifest=JSON.parse(readFileSync(new URL('../../../docs/building-pool/roadmap-3a/LEGACY_M1_SOURCE_MANIFEST.json',import.meta.url),'utf8'));
const repository=process.cwd();
const git=(...args)=>execFileSync('git',args,{cwd:repository,encoding:'utf8',maxBuffer:4e6,timeout:45000});
const blobId=(s)=>createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0').update(s).digest('hex');
function originalFiles(){
  // actions/checkout uses fetch-depth: 0, but request exactly the pinned PR
  // commit if it was not among locally fetched remote refs.
  try{git('cat-file','-e',ledger.sourcePRHead+'^{commit}');}
  catch{git('fetch','--no-tags','--depth=1','origin','refs/pull/122/head');}
  git('cat-file','-e',ledger.sourcePRHead+'^{commit}');
  const files={};
  for(const name of ['roster.mjs','assets.mjs','contract.mjs','m1.mjs']){
    files[name]=git('show',ledger.sourcePRHead+':src/building-pool/roadmap-3/'+name);
  }
  assert.equal(blobId(files['m1.mjs']),ledger.sourceM1Blob,'pinned original generator Git blob');
  assert.equal(blobId(files['assets.mjs']),ledger.assetSourceBlob,'pinned original assets Git blob');
  assert.equal(blobId(files['contract.mjs']),ledger.validatorSourceBlob,'pinned original validator Git blob');
  return files;
}
function originalRuntime(files){
  const root=mkdtempSync(join(tmpdir(),'mythwrought-r3a-parity-'));
  writeFileSync(join(root,'package.json'),'{"type":"module"}');
  for(const [name,src] of Object.entries(files))writeFileSync(join(root,name),src);
  return {root,promise:import(pathToFileURL(join(root,'m1.mjs')).href)};
}
test('15 migrated native coordinate models retain full material/structural validation',()=>{
 const built=createLegacyBlacksmithPool();
 assert.equal(built.length,15);
 assert.equal(validatePool(built,ASSET_CATALOG).authored,15);
 assert.deepEqual(new Set(built.map(b=>b.id)),new Set(ledger.candidates.map(b=>b.originalId)));
 const expected=new Map(manifest.designs.filter(x=>x.type==='blacksmith').map(x=>[x.id,x]));
 for(const model of built){
   const entry=expected.get(model.id);
   assert.ok(entry,'source manifest contains '+model.id);
   assert.deepEqual(model.envelope,entry.envelope);
   assert.equal(model.modules.flatMap(m=>m.cells).length,entry.occupiedCoordinates);
   assert.equal(model.architecture.roofStyle,entry.roofStyle);
   assert.ok(model.features.some(f=>f.name==='forge-mouth'));
   assert.ok(model.features.some(f=>f.name==='anvil'));
   assert.ok(model.features.some(f=>f.name==='chimney ventilation'));
   assert.ok(model.spaces.some(s=>s.kind==='forge')&&model.spaces.some(s=>s.kind==='storage'));
   assert.ok(model.navigation.nodes.length>=3);
   assert.equal(model.activated,false);
   assert.equal(model.status,'theoretical');
 }
});
test('byte/source-exact blacksmith extraction and 15 real old-vs-new geometry fingerprints',async()=>{
 const originals=originalFiles();
 const migrated=readFileSync(new URL('../../../src/building-pool/roadmap-3a/legacy-blacksmiths.mjs',import.meta.url),'utf8');
 const boundary=originals['m1.mjs'].indexOf('function buildWatchtower(');
 assert.ok(boundary>9000);
 const preserved=originals['m1.mjs'].slice(0,boundary)
  .replace("from './assets.mjs'","from './legacy-assets.mjs'")
  .replace("from './contract.mjs'","from './legacy-validation.mjs'");
 assert.ok(migrated.startsWith(preserved),'the ORIGINAL entire blacksmith source prefix must be unchanged except imports');
 assert.equal(readFileSync(new URL('../../../src/building-pool/roadmap-3a/legacy-assets.mjs',import.meta.url),'utf8'),originals['assets.mjs']);
 assert.equal(readFileSync(new URL('../../../src/building-pool/roadmap-3a/legacy-validation.mjs',import.meta.url),'utf8'),originals['contract.mjs']);
 const runtime=originalRuntime(originals);
 try{
  const old=await runtime.promise;
  const newPool=createLegacyBlacksmithPool();
  const oldPool=BIOMES.flatMap(biome=>SIZES.map(size=>old.createM1Blueprint('blacksmith',biome,size)));
  const oldFingerprint=(await import(pathToFileURL(join(runtime.root,'contract.mjs')).href)).geometryFingerprint;
  assert.equal(oldPool.length,15);
  const evidence=[];
  for(let i=0;i<15;i++){
   const original=oldPool[i],copied=newPool[i];
   assert.equal(copied.id,slotId('blacksmith',copied.biome,copied.size,1));
   assert.equal(copied.id,original.id);
   assert.equal(newFingerprint(copied),oldFingerprint(original),'geometry '+original.id);
   assert.deepEqual(copied,original,'full exact-source generated coordinate blueprint '+original.id);
   assert.equal(newSerialize(copied),JSON.stringify(stable(original)),'canonical full model '+original.id);
   evidence.push({id:original.id,oldPR:122,oldPRHead:ledger.sourcePRHead,
     originalSourceBlob:ledger.sourceM1Blob,
     newOwnedModule:ledger.migrationSource,
     sourceExact:true,
     originalGeometryFingerprintSha256:createHash('sha256').update(oldFingerprint(original)).digest('hex'),
     migratedGeometryFingerprintSha256:createHash('sha256').update(newFingerprint(copied)).digest('hex'),
     fullBlueprintSHA256:createHash('sha256').update(newSerialize(copied)).digest('hex'),
     physicalCoordinateSlots:copied.modules.reduce((n,m)=>n+m.cells.length,0),
     creatorApproved:false,worldPlaced:false});
  }
  const evidenceDir=join(repository,'artifacts','building-roadmap-3a-m0');
  mkdirSync(evidenceDir,{recursive:true});
  writeFileSync(join(evidenceDir,'source-exact-parity.json'),JSON.stringify({
   schema:'mythwrought.builder3a.source-exact-parity.v1',runHead:process.env.GITHUB_SHA??null,
   originalPRHead:ledger.sourcePRHead,compared:15,parity:true,
   classification:'Native Node 22 original PR generator vs selectively migrated builder generator',
   notBrowserEvidence:true,notPhysicalIPhoneEvidence:true,designs:evidence
  },null,2)+'\n');
  console.log('Builder 3A source-exact parity: 15/15 complete model objects, 15/15 geometry fingerprints; 15 SHA-256 records emitted');
 }finally{rmSync(runtime.root,{force:true,recursive:true});}
});
function stable(obj){
 if(Array.isArray(obj))return obj.map(stable);
 if(obj&&typeof obj==='object')return Object.fromEntries(Object.keys(obj).sort().map(k=>[k,stable(obj[k])]));
 return obj;
}
