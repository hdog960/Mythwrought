import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {summarizeSnowS4AuthenticatedReader} from '../src/manual-biomes/snowy-s4-authenticated-census.mjs';
const source=JSON.parse(readFileSync(new URL('./fixtures/snow-s4-authentic-two-seed-reader-census.json',import.meta.url)));

test('S4 genuine exact-protected-head source census separates solid snow/ice/rime and protected terrain',()=>{
  const s=summarizeSnowS4AuthenticatedReader(source);
  assert.equal(s.protectedHead,'59e449be7e73b25f259c4c72855cfb638a056517');
  assert.deepEqual(s.rows.map(r=>r.seed),[179,2026]);
  assert.deepEqual(s.totals,{
    interior:3362,authored:3149,unauthored:213,retainedGrass:97,
    ice:549,snow:2109,rime:491,
    protectedOriginalAir:156,protectedOriginalStone:30,
    protectedOriginalWood:23,protectedOriginalLeaves:4
  });
  assert.ok(Math.abs(s.proportions.authored-3149/3362)<1e-12);
  assert.ok(s.totals.retainedGrass<s.totals.unauthored);
  assert.equal(Object.isFrozen(s),true);
  assert.equal(Object.isFrozen(s.totals),true);
});

test('S4 read-only evidence fails closed on altered sources, unsupported cells and missing physical protection',()=>{
  const bad=fn=>{const d=structuredClone(source);fn(d);return d;};
  for(const corrupted of [
    bad(d=>d.source.artifactId=1),
    bad(d=>d.source.artifactSha256='f'.repeat(64)),
    bad(d=>d.source.readerMetricsSha256='a'.repeat(64)),
    bad(d=>d.seedResults[1].seed=179),
    bad(d=>d.seedResults[0].caps['276']++),
    bad(d=>d.seedResults[1].rejectionReasons['above-old-ground:3:original']++),
    bad(d=>d.seedResults[0].emptyColumns--),
    bad(d=>d.seedResults[0].rejectionReasons['unknown-source-class']=1),
    bad(d=>d.seedResults[1].uncoveredGrass=150),
    bad(d=>d.seedResults[0].otherProtected=4)
  ])assert.throws(()=>summarizeSnowS4AuthenticatedReader(corrupted),
    /original|S4|M7|authentic/i);
});
