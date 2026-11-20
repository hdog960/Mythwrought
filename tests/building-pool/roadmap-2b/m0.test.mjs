import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {BIOMES,SIZES,CATEGORIES,plannedSlots,inventory} from '../../../src/building-pool/roadmap-2b/catalog.mjs';
import {validateBlueprint,structuralFingerprint,validateSymbol} from '../../../src/building-pool/roadmap-2b/schema.mjs';
import {LEGACY_TEMPLES,M0_COUNTS,checkTempleArchitectures} from '../../../src/building-pool/roadmap-2b/legacy-temples.mjs';

const manifest=JSON.parse(readFileSync(new URL('../../../src/building-pool/roadmap-2b/manifest.json',import.meta.url),'utf8'));
const legacyHead='07c45d27bd36f4f3aa3197bba0e4f49ce2a58c68';
const sourceBlobs={
 'catalog.mjs':'f52488952aa9dd805847de1b65f7b207627f16ad',
 'schema.mjs':'253ad26a8fb3537a1cb6776d6b86dd89909d69f1',
 'temperate-store.mjs':'7211223b2cc51290b89f5f886c1cbb59cc495747',
 'm1-representatives.mjs':'4cc1ccc4cedfb927f510c6a85c8c4aa11290eccc'
};
test('2B is the precise, isolated 420-slot category x biome x size reservation',()=>{
 const expected={'market-square':60,tailor:60,butcher:60,jeweler:60,bookshop:60,temple:75,theater:45};
 assert.deepEqual(inventory().byCategory,expected);
 assert.equal(inventory().target,420);
 assert.equal(plannedSlots().length,420);
 assert.equal(new Set(plannedSlots().map(x=>x.id)).size,420);
 assert.equal(CATEGORIES.length,7);
 assert.deepEqual(CATEGORIES.map(c=>c.key),Object.keys(expected));
 for(const c of CATEGORIES)for(const b of BIOMES)for(const s of SIZES)
   assert.equal(plannedSlots().filter(p=>p.category===c.key&&p.biome===b&&p.size===s).length,c.variants);
 assert(plannedSlots().every(p=>!['general-store','pet-shop','magic-shop','potion-shop','bakery','bank'].includes(p.category)));
});
test('15 exact inherited temple identities only: do not double count sibling shops',()=>{
 assert.deepEqual(M0_COUNTS,{authored:15,temples:15});
 assert.equal(LEGACY_TEMPLES.length,15);
 assert.equal(new Set(LEGACY_TEMPLES.map(b=>b.id)).size,15);
 assert.equal(manifest.inherited.length,15);
 assert.equal(manifest.authored,15);
 assert.equal(manifest.newlyAuthored,0);
 assert.equal(manifest.unbuilt,405);
 assert.equal(manifest.creatorAccepted,0);
 assert.equal(manifest.integrated,0);
 for(const biome of BIOMES)for(const size of SIZES){
   const id=`r2:temple:${biome}:${size}:01`;
   const model=LEGACY_TEMPLES.find(b=>b.id===id);
   assert(model,id);
   const provenance=manifest.inherited.find(m=>m.originalId===id);
   assert(provenance&&provenance.newId===id&&provenance.originalSourceBlob===sourceBlobs['m1-representatives.mjs']);
   assert.equal(model.category,'temple');
   assert.equal(model.status,'authored-candidate');
   assert.equal(model.worldPlaced,false);
   assert.equal(model.numericIdsAssigned,false);
 }
});
test('each temple validates complete native coordinate voxels and exact window records',()=>{
 for(const b of LEGACY_TEMPLES){
   assert(validateBlueprint(b).valid,b.id);
   assert(b.voxels.length>=600,b.id);
   assert(b.rooms.length>=2&&b.circulation.length>=2,b.id);
   assert(b.unresolvedDependencies.length>0,b.id);
   assert(b.unresolvedDependencies.every(d=>validateSymbol(d.ref)),b.id);
   const voxels=new Map(b.voxels.map(v=>[[v.x,v.y,v.z].join(','),v]));
   assert.equal(voxels.size,b.voxels.length,b.id);
   for(const o of b.openings.filter(o=>o.type==='window'))
     assert.equal(voxels.get([o.x,o.y,o.z].join(','))?.material,o.material,b.id);
   assert.equal(b.openings.filter(o=>o.type==='window').length,b.voxels.filter(v=>v.kind==='window').length,b.id);
   assert.equal(b.voxels.filter(v=>v.material==='pack1:008'&&v.intendedFacing==='+z').length,2,b.id);
 }
 assert.deepEqual(checkTempleArchitectures(),{authored:15,distinctArchitectures:15});
 assert.equal(new Set(LEGACY_TEMPLES.map(structuralFingerprint)).size,15);
});
test('exact legacy PR #124 native Node module parity, original source blobs and entire temple geometry',async()=>{
 // actions/checkout fetch-depth:0 includes PR #124's still-open branch.
 // Never compare against a snapshot of the new implementation or use a V8 test facade.
 const dir=mkdtempSync(join(tmpdir(),'mythwrought-r2b-legacy-'));
 try{
   for(const [file,sha] of Object.entries(sourceBlobs)){
     const original=execFileSync('git',['show',`${legacyHead}:src/building-pool/roadmap-2/${file}`],
       {cwd:process.cwd(),encoding:'utf8',maxBuffer:8*1024*1024});
     const blob=execFileSync('git',['hash-object','--stdin'],
       {cwd:process.cwd(),encoding:'utf8',input:original}).trim();
     assert.equal(blob,sha,`source blob mismatch: ${file}`);
     writeFileSync(join(dir,file),original);
   }
   const original=await import(pathToFileURL(join(dir,'m1-representatives.mjs')).href);
   const oldTemples=original.M1_REPRESENTATIVES.filter(b=>b.category==='temple');
   assert.equal(oldTemples.length,15);
   for(const b of LEGACY_TEMPLES){
     const old=oldTemples.find(x=>x.id===b.id);
     assert(old,`legacy identity missing: ${b.id}`);
     // Byte-equivalent canonical JSON proves coordinates, materials, fixtures,
     // openings, rooms, rotation intentions and dependency declarations match.
     assert.equal(JSON.stringify(b),JSON.stringify(old),`source-exact migration altered ${b.id}`);
   }
 }finally{rmSync(dir,{recursive:true,force:true});}
});
