// Native M1 provenance and manual five-pack physical contract audit.
// All outputs stay as CI artifacts; nothing is registered, saved, or placed.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,copyFileSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {createLegacyBlacksmithPool} from '../../../src/building-pool/roadmap-3a/legacy-blacksmiths.mjs';
import {createM1OriginalWorkshopPool} from '../../../src/building-pool/roadmap-3a/m1-workshop-exemplars.mjs';
import {createM1RegionalPool} from '../../../src/building-pool/roadmap-3a/m1-regional-workshops.mjs';
import {createM1CompletionPool} from '../../../src/building-pool/roadmap-3a/m1-coverage-workshops.mjs';
import {
 MANUAL_FIVE_PACK_COUNTS,MANUAL_FIVE_PACK_FAMILY_SYMBOLS,
 manualFivePackVariants,resolveManualFivePackAsset
} from '../../../src/builder-assets/manual-five-pack.mjs';
import {PACK5_BUILDER_CATALOG} from '../../../src/pack5-integration/catalog.mjs';
import {BIOME130_REGISTERED_SYMBOLS,biome130Block} from '../../../src/biome130-registry.mjs';

const root=process.cwd(),base=join(root,'artifacts/building-roadmap-3a-source-review');
const generated=[];
const originalRefs=[...new Set([...createLegacyBlacksmithPool(),...createM1OriginalWorkshopPool(),...createM1RegionalPool(),...createM1CompletionPool()].flatMap(b=>
 b.modules.flatMap(m=>m.cells.map(c=>c[3]))))].sort();
function uniqueRefs() {return originalRefs;}
function physicalSummary(ref){
 if(ref.startsWith('builtin:'))return {ref,source:'builtin-original',classification:'existing-legacy',physicalShapeVerification:'original full cell; real runtime mapping required'};
 if(ref.startsWith('biome130:')){
   const registered=BIOME130_REGISTERED_SYMBOLS.includes(ref);
   const r=registered?biome130Block(ref):null;
   return {ref,source:'automated-biome130',classification:registered?'registered-definition':'unregistered-symbolic-dependency',
    blockId:r?.blockId??null,boxCount:r?.boxes.length??null,collision:r?.solid??null,
    releaseCaution:'Theoretical PR may reference missing ordinal; never install/replace it in 3A'};
 }
 if(/^pack[1-5]:\d{3}$/.test(ref)){
   const listed=MANUAL_FIVE_PACK_FAMILY_SYMBOLS.includes(ref);
   if(!listed)return {ref,source:'manual-five-pack',classification:'symbol-not-in-integrated-96-family-catalog'};
   const variants=manualFivePackVariants(ref);
   const pack5=PACK5_BUILDER_CATALOG.find(x=>x.symbolicId===ref);
   const inputs=pack5?{variant:pack5.variants[0]}:{};
   try{
     const physical=resolveManualFivePackAsset(ref,inputs);
     return {ref,source:'manual-five-pack',classification:'source-physical-resolvable',
      variantCount:variants.length,sourcePack:physical.sourcePack,chosenVariant:physical.variant,
      persistentCandidateId:physical.numericId,visibleBoxes:physical.visibleBoxes.length,
      selectionBoxes:physical.selectionBoxes.length,collisionBoxes:physical.collisionBoxes.length,
      occupiedOffsets:physical.occupiedOffsets,requiredSupportOffsets:physical.supportOffsets,
      supportPolicy:physical.supportPolicy,orientation:'north',
      worldPlaced:false,livePlaceable:physical.livePlaceable,saveWritten:physical.saveWritten};
   }catch(error){
     return {ref,source:'manual-five-pack',classification:'source-physical-resolution-blocked',
      variantCount:variants.length,reason:String(error.message),variantRequired:pack5?.variants??null};
   }
 }
 return {ref,classification:'unknown-unplanned'};
}
const assets=originalRefs.map(physicalSummary);
test('integrated five-pack ABI has exact source catalog 96 families and 106 physical variants',()=>{
 assert.equal(MANUAL_FIVE_PACK_COUNTS.families,96);
 assert.equal(MANUAL_FIVE_PACK_COUNTS.numericVariants,106);
 assert.equal(MANUAL_FIVE_PACK_COUNTS.productionRegistered,false);
 assert.equal(MANUAL_FIVE_PACK_COUNTS.worldPlaced,false);
 assert.ok(originalRefs.length>10);
 const unknown=assets.filter(a=>a.classification==='unknown-unplanned'||a.classification==='symbol-not-in-integrated-96-family-catalog');
 assert.deepEqual(unknown,[], 'No speculative or invalid manual-pack family references');
 const pack5=assets.find(x=>x.ref==='pack5:088');
 assert.ok(pack5&&pack5.source==='manual-five-pack');
});
test('biome130 unresolved futures remain explicitly symbolic, not invented live IDs',()=>{
 const unresolved=assets.filter(a=>a.classification==='unregistered-symbolic-dependency');
 assert.ok(unresolved.length>0);
 assert.ok(unresolved.every(a=>a.blockId===null));
 const registered=assets.filter(a=>a.source==='automated-biome130'&&a.classification==='registered-definition');
 assert.ok(registered.length>0);
 assert.ok(registered.every(a=>a.blockId>255));
});
test('emit byte-identical M1 candidate source bundle for independent real local Chromium review',()=>{
 const paths=[
  'src/building-pool/roadmap-3a/roster.mjs',
  'src/building-pool/roadmap-3a/legacy-blacksmiths.mjs',
  'src/building-pool/roadmap-3a/legacy-assets.mjs',
  'src/building-pool/roadmap-3a/legacy-validation.mjs',
  'src/building-pool/roadmap-3a/contract.mjs',
  'src/building-pool/roadmap-3a/m1-workshop-exemplars.mjs',
  'src/building-pool/roadmap-3a/m1-regional-workshops.mjs',
  'src/building-pool/roadmap-3a/m1-coverage-specs.mjs',
  'src/building-pool/roadmap-3a/m1-coverage-workshops.mjs',
  'src/building-pool/roadmap-3a/legacy-mount-repair-options.mjs',
  'src/building-pool/roadmap-3a/legacy-physical-support-audit.mjs',
  'tests/building-pool/roadmap-3a/preview.html',
  'tests/building-pool/roadmap-3a/preview.mjs',
  'tests/building-pool/roadmap-3a/preview-mesh.mjs',
  'tests/building-pool/roadmap-3a/preview-camera.mjs',
  'tests/building-pool/roadmap-3a/preview-browser.mjs',
  'tests/building-pool/roadmap-3a/preview-new.html',
  'tests/building-pool/roadmap-3a/preview-new.mjs',
  'tests/building-pool/roadmap-3a/preview-new-browser.mjs',
  'tests/building-pool/roadmap-3a/preview-regional.html',
  'tests/building-pool/roadmap-3a/preview-regional.mjs',
  'tests/building-pool/roadmap-3a/preview-regional-mesh.mjs',
  'tests/building-pool/roadmap-3a/preview-regional-browser.mjs',
  'tests/building-pool/roadmap-3a/preview-coverage.html',
  'tests/building-pool/roadmap-3a/preview-coverage.mjs',
  'tests/building-pool/roadmap-3a/preview-coverage-mesh.mjs',
  'tests/building-pool/roadmap-3a/preview-coverage-browser.mjs'
 ];
 const manifest=[];
 for(const p of paths){
   if(!/^(src|tests)\/building-pool\/roadmap-3a\//.test(p))throw Error('Cross-lane export forbidden '+p);
   const src=resolve(root,p),dest=resolve(base,p);
   const buf=readFileSync(src);
   mkdirSync(dirname(dest),{recursive:true});
   copyFileSync(src,dest);
   const copied=readFileSync(dest);
   assert.deepEqual(copied,buf);
   manifest.push({path:p,size:buf.length,sha256:createHash('sha256').update(buf).digest('hex')});
 }
 const out={schema:'mythwrought.3a.source-review.v1',repo:'hdog960/Mythwrought',
   candidateHead:process.env.GITHUB_SHA??null,sourcePR:183,sourcePR122:'e35b8eca644f6de06e76ab946103ce64a6b7fb91',
   exactByteCopy:true,files:manifest,manualAssetDefinitions:assets,
   caveat:'Files are candidate diagnostic sources, not deployed world or physical iPhone evidence'};
 mkdirSync(base,{recursive:true});
 writeFileSync(join(base,'MANIFEST.json'),JSON.stringify(out,null,2)+'\n');
 assert.equal(manifest.length,27);
 assert.equal(assets.length,originalRefs.length);
});
