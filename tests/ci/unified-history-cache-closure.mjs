// Independent expected closure: verified frozen source shell plus new exact import.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,posix} from 'node:path';
import {execFileSync} from 'node:child_process';
import {buildStageCacheManifest} from '../../scripts/ci/build-stage-cache-manifest.mjs';
const baseline=resolve(process.env.UNIFIED_FROZEN_ROOT??'');
assert.equal(execFileSync('git',['-C',baseline,'rev-parse','HEAD'],{encoding:'utf8'}).trim(),'f48c42e85c979dd66d8b42db0e8b01dd531b0fe6');
const baselineManifest=JSON.parse(await readFile(resolve(baseline,'nonblock-stage-assets.json'),'utf8'));
assert.deepEqual(baselineManifest,await buildStageCacheManifest(baseline));
const expected=new Set(Object.keys(baselineManifest.assets));
const newImport='./src/creative-integration/creative-voxel-batch.mjs';
assert.ok(!expected.has(newImport));expected.add(newImport);
const actual=JSON.parse(await readFile('nonblock-stage-assets.json','utf8'));
assert.equal(actual.version,'20261126-v46');
assert.deepEqual(Object.keys(actual.assets).sort(),[...expected].sort());
assert.deepEqual(actual,await buildStageCacheManifest(process.cwd()));
assert.equal(actual.assets['./'],actual.assets['./index.html']);
const changed=['./src/main.mjs','./src/blocks.mjs','./src/manual-biomes/profile-world.mjs',newImport];
for(const file of changed){
 const code=await readFile(file,'utf8');
 for(const match of code.matchAll(/(?:from\s*|import\s*\(\s*|import\s*)(['"])(\.\.?\/[^'"]+)\1/g)){
  const dependency='./'+posix.normalize(posix.join(posix.dirname(file),match[2].split('?')[0]));
  assert.ok(expected.has(dependency),'Uncached relative import '+file+' -> '+dependency);
 }
}
const main=await readFile('src/main.mjs','utf8');
assert.match(main,/from '\.\/creative-integration\/creative-voxel-batch\.mjs'/);
for(const [p,hash] of Object.entries(actual.assets)){
 const bytes=await readFile(p==='./'?'index.html':p);
 assert.equal(createHash('sha256').update(bytes).digest('hex'),hash,p);
}
console.log('Verified exact source and staged cache closure',Object.keys(actual.assets).length);
