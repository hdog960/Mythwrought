// Source-exact M5 sampler provenance, run only against a verified isolated
// git archive of manual four-biome PR #265; never use stand-in coordinates.
import test from 'node:test';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {S6_ANCHORS,S6_BIOME_SOURCE_HEAD,S6_GENERATORS,
  resolveS6Biome,sampleS6BiomeSky} from '../../src/sky-biome-adapter.mjs';
import {sampleSkyAtmosphere} from '../../src/sky-atmosphere.mjs';
const dir=process.env.MYTHWROUGHT_M5_READONLY_DIR;
if(!dir)throw Error('Missing separately archived exact M5 source');
const file=p=>pathToFileURL(resolve(dir,p)).href;
const {surfaceBiomeAt}=await import(file('src/surface-regions/regions.mjs'));
const {FourRegionWorld,fourRegionProfile}=await import(file('src/manual-biomes/profile-world.mjs'));
const {Pack2LiveWorld}=await import(file('src/pack2-world.mjs'));
test('authoritative exact M5 biome source, actual FourRegionWorld and source positions',()=>{
  assert.equal(S6_BIOME_SOURCE_HEAD,
    process.env.MYTHWROUGHT_M5_EXPECTED_SHA);
  for(const generator of S6_GENERATORS){
    const w=new Pack2LiveWorld(new FourRegionWorld(179,fourRegionProfile(179,generator)));
    const before=JSON.stringify(w.save()),palettes=new Set();
    for(const anchor of S6_ANCHORS){
      const actual=surfaceBiomeAt(anchor.x,anchor.z,179);
      assert.equal(actual?.name,anchor.name);
      assert.deepEqual(actual?.center,[anchor.x,anchor.z]);
      assert.ok(actual.weight>.99);
      const b=resolveS6Biome(w,anchor.x,anchor.z,surfaceBiomeAt);
      assert.equal(b?.name,anchor.name);
      assert.equal(b?.generator,generator);
      const sky=sampleS6BiomeSky(sampleSkyAtmosphere(720000),b);
      palettes.add(JSON.stringify(sky.horizon));
    }
    assert.equal(palettes.size,4);
    assert.equal(JSON.stringify(w.save()),before,'Biomes and sky never wrote an edit');
  }
});
test('physical authentic M5 shoulder uses source weight and has a null outside',()=>{
  const w=new Pack2LiveWorld(new FourRegionWorld(179));
  const outside=resolveS6Biome(w,0,0,surfaceBiomeAt);
  assert.equal(outside,null,'legacy spawn does not pretend to be a biome');
  const interior=resolveS6Biome(w,512,0,surfaceBiomeAt);
  assert.equal(interior.name,'desert');
  assert.ok(interior.strength>.99);
  assert.equal(resolveS6Biome(w,512,0,null),null);
  const legacy=new Pack2LiveWorld(w.base);
  // A world with a REAL profile still must not be recognized if its sampler
  // is missing: no standalone S6 biome generation is attempted.
  assert.equal(resolveS6Biome(legacy,512,0,null),null);
});
