import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve,posix} from 'node:path';
import {buildStageCacheManifest} from '../../scripts/ci/build-stage-cache-manifest.mjs';
const production=resolve('prior-production'),history=resolve('prior-history'),root=process.cwd();
const read=(r,p)=>readFile(resolve(r,p),'utf8');
for(const [dir,sha] of [[production,'8400d13a6f5521901cbf0909a0c4f6e2e79c1629'],[history,'f8b0dc6dbbc68f375c24dc7be7af044da08da4ee']])
 assert.equal(execFileSync('git',['-C',dir,'rev-parse','HEAD'],{encoding:'utf8'}).trim(),sha);
const manifests=await Promise.all([production,history,root].map(async r=>{
 const m=JSON.parse(await read(r,'nonblock-stage-assets.json'));
 const builder=r===root?buildStageCacheManifest:(await import(resolve(r,'scripts/ci/build-stage-cache-manifest.mjs'))).buildStageCacheManifest;
 assert.deepEqual(m,await builder(r));return m;
}));
const [old,qualified,current]=manifests;
const union=new Set([...Object.keys(old.assets),...Object.keys(qualified.assets)]);
assert.equal(current.version,'20261128-v51');
assert.deepEqual(Object.keys(current.assets).sort(),[...union].sort());
assert.equal(current.assets['./'],current.assets['./index.html']);
for(const p of ['src/voxel.mjs','src/manual-biomes/m2-runtime-bridge.mjs','src/mining-trace.mjs'])
 assert.equal(await read(root,p),await read(production,p),'Released save dependency changed: '+p);
const [pm,cm,pp,cp]=await Promise.all([read(production,'src/main.mjs'),read(root,'src/main.mjs'),read(production,'src/manual-biomes/profile-world.mjs'),read(root,'src/manual-biomes/profile-world.mjs')]);
const region=(s,a,b)=>{const i=s.indexOf(a),j=s.indexOf(b,i);assert.ok(i>=0&&j>i,a);return s.slice(i,j)};
assert.equal(region(cm,'  function publishEditedChunkBatch(','  function refreshEditedMeshes('),region(pm,'  function publishEditedChunkBatch(','  function refreshEditedMeshes('),'Released atomic GPU publisher changed');
assert.equal(cp.slice(cp.indexOf('export function restoreFourRegionWorld(')),pp.slice(pp.indexOf('export function restoreFourRegionWorld(')),'Released restore validation changed');
assert.ok(cm.includes("traceMeasure('saveAndExistingReadback',saveOriginal)")&&cm.includes('saveM2World(localStorage,world)'));
// Verify the real live import/call chain, rather than expecting a transitive
// navigation constructor to be imported by main directly.
const [em,na]=await Promise.all([read(root,'src/exploration-map.mjs'),read(root,'src/navigation00/navigation-adapter.mjs')]);
assert.match(cm,/import\s*\{\s*replayCreativeVoxelBatch\s*\}\s*from\s*['"]\.\/creative-integration\/creative-voxel-batch\.mjs['"]/,'Creative replay import missing');
assert.match(cm,/return\s+replayCreativeVoxelBatch\s*\(/,'Creative replay call missing');
assert.match(cm,/import\s*\{\s*installExplorationMap\s*\}\s*from\s*['"]\.\/exploration-map\.mjs['"]/,'Live map import missing');
assert.match(cm,/const\s+exploration\s*=\s*installExplorationMap\s*\(/,'Live map installation missing');
assert.match(em,/import\s*\{\s*createNavigationAdapter\s*\}\s*from\s*['"]\.\/navigation00\/navigation-adapter\.mjs['"]/,'Map adapter import missing');
assert.match(em,/\bnav\s*=\s*createNavigationAdapter\s*\(/,'Map adapter initialization missing');
assert.match(na,/import\s*\{\s*createObservedNavigator\s*\}\s*from\s*['"]\.\/observed-navigation\.mjs['"]/,'Observed navigation import missing');
assert.match(na,/const\s+navigator\s*=\s*createObservedNavigator\s*\(/,'Observed navigator construction missing');
// Static linkage is not UI proof; the existing integrated browser gates still run.
assert.ok(!cm.includes('ready=stageEditedChunkBuffers'));
for(const p of Object.keys(current.assets).filter(p=>p.startsWith('./src/')&&p.endsWith('.mjs')&&(current.assets[p]!==qualified.assets[p]||current.assets[p]!==old.assets[p]))){
 const s=await read(root,p);
 for(const m of s.matchAll(/(?:from\s*|import\s*\(\s*|import\s*)(['"])(\.\.?\/[^'"]+)\1/g)){
  const dependency='./'+posix.normalize(posix.join(posix.dirname(p),m[2].split('?')[0]));
  assert.ok(union.has(dependency),'Missing imported source '+p+' -> '+dependency);
 }
}
console.log('UNIFIED_POST_SAVE_CLOSURE',JSON.stringify({stage:current.version,assets:union.size,prior:Object.keys(old.assets).length,history:Object.keys(qualified.assets).length,productionSaveBytesPreserved:true,productionGpuPublisherPreserved:true}));
