// MYTHWROUGHT — Pack 1 M6 opt-in native acceptance orchestrator.
// Explicit manual command only; does not alter root CI, deployed game, or saves.
// Run in a complete GitHub checkout with free Node 22 + Playwright/Chromium:
//   PACK1_EXPECTED_HEAD=<40-hex-commit> node tests/block-packs/pack-1/run-acceptance.mjs
//
// A successful exit is possible ONLY after 12 nested native Node test modules
// and 15 real Chromium page views/30 authentic screenshots actually succeed.
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFile,mkdir,writeFile,rm} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {verifyScreenshotPng} from './png-proof.mjs';

const repo=resolve(process.cwd());
const own='tests/block-packs/pack-1/';
const groups=[
  'core-masonry.test.mjs',
  'stone-shapes.test.mjs',
  'garden-components.test.mjs',
  'physical-foliage.test.mjs',
  'floral-forms.test.mjs',
  'all-families.test.mjs',
  'raycast-regression.test.mjs',
  'gallery-count.test.mjs',
  'png-proof.test.mjs',
  'builder-handoff.test.mjs',
  'construction-stress.test.mjs',
  'structure-handoff.test.mjs'
];
const views=[
  'masonry','stone-shapes','garden','foliage','floral'
].flatMap(name=>[[667,375],[844,390],[932,430]].map(([w,h])=>name+'-'+w+'x'+h));
const reportDir=resolve(process.env.PACK1_ARTIFACT_DIR||'artifacts/pack-1');
const run=(executable,args,options={})=>{
  const p=spawnSync(executable,args,{
    cwd:repo,encoding:'utf8',stdio:'pipe',maxBuffer:16*1024*1024,...options
  });
  if(p.error)throw p.error;
  if(p.status!==0){
    process.stderr.write((p.stdout||'')+(p.stderr||''));
    throw new Error(executable+' '+args.join(' ')+' returned '+p.status);
  }
  return (p.stdout||'')+(p.stderr||'');
};
function git(...args){return run('git',args).trim();}
function verifyContext(){
  const root=resolve(git('rev-parse','--show-toplevel'));
  assert.equal(root,repo,'Run only from the repository root');
  const commit=git('rev-parse','HEAD');
  assert.match(commit,/^[a-f0-9]{40}$/,'Invalid Git commit identifier');
  const required=process.env.PACK1_EXPECTED_HEAD;
  assert.ok(required,'Set PACK1_EXPECTED_HEAD to the independently verified draft PR head');
  assert.equal(commit,required,'Checkout is NOT the verified PR head');
  const branch=git('rev-parse','--abbrev-ref','HEAD');
  assert.ok(branch==='manual-pack-1-stone-nature-core-masonry-20261114'||branch==='HEAD',
    'Wrong branch for Pack 1 acceptance');
  const dirty=git('status','--porcelain','--',
    'src/block-packs/pack-1','tests/block-packs/pack-1');
  assert.equal(dirty,'','Pack 1 source/test checkout is dirty; cannot certify exact committed source');
  return {commit,branch};
}
const checkImage=async(path,width,minHeight)=>{
  const data=await readFile(path);
  return verifyScreenshotPng(data,{width,minHeight});
};
async function main(){
  const {commit,branch}=verifyContext();
  // Delete stale PASS markers BEFORE either Node or Chromium tests begin.
  // An early Node failure may not leave a previous success report behind.
  await rm(join(reportDir,'native-acceptance-PASS.json'),{force:true});
  await rm(join(reportDir,'acceptance-report.json'),{force:true});
  process.stdout.write('Verified Pack 1 exact checkout '+commit+' ('+branch+')\n');
  const files=groups.map(x=>own+x);
  const nodeResult=run(process.execPath,['--test',...files]);
  // A zero exit alone can hide a suite that skipped everything. Require an
  // authentic Node TAP summary with at least 128 tests (93 established source/gallery + 11 builder-handoff + 13 stress/save + 11 structure ABI).
  const metric=(key)=>{
    const match=nodeResult.match(new RegExp('^# '+key+'\\s+(\\d+)\\s*$','m'));
    assert.ok(match,'Native Node TAP summary missing '+key);
    return Number(match[1]);
  };
  const tests=metric('tests'),passed=metric('pass'),failed=metric('fail');
  const skipped=metric('skipped'),todo=metric('todo');
  assert.ok(tests>=128,'Too few native Pack 1 tests executed: '+tests);
  assert.equal(passed,tests,'Native Pack 1 tests were not all passing');
  assert.equal(failed,0,'Native Pack 1 tests failed');
  assert.equal(skipped,0,'Native Pack 1 tests were skipped');
  assert.equal(todo,0,'Native Pack 1 tests remained TODO');
  process.stdout.write(nodeResult);
  const gallery=run(process.execPath,[own+'galleries-browser.mjs'],{
    env:{...process.env,PACK1_EXPECTED_HEAD:commit}
  });
  process.stdout.write(gallery);
  // The gallery runner writes this manifest ONLY after its own 15-view pass.
  const manifest=JSON.parse(await readFile(join(reportDir,'acceptance-report.json'),'utf8'));
  assert.equal(manifest.checkoutGitHead,commit,'Chromium report has wrong checkout commit');
  assert.equal(manifest.playwrightChromeRealRun,true);
  assert.equal(manifest.evidence.length,15,'Not all landscape gallery views ran');
  assert.equal(manifest.totals.viewports,15);
  assert.equal(manifest.totals.screenshots,30);
  // 15 place/save/clear cycles = 45, plus two true cross-section
  // selection/collision probes in each of the 9 partial-shape views = 18.
  assert.equal(manifest.totals.interactionChecks,63);
  for(const entry of manifest.evidence){
    const expected=['garden','foliage','floral'].includes(entry.gallery)?2:0;
    assert.equal(entry.cutawayProbeResults?.length,expected,
      'Missing actual cutaway probe evidence for '+entry.gallery);
  }
  assert.deepEqual(manifest.evidence.map(x=>
    x.gallery+'-'+x.viewport.width+'x'+x.viewport.height).sort(),views.slice().sort());
  const images=[];
  for(const v of views)for(const suffix of ['-candidate.png','-placed.png']){
    const filename=v+suffix;
    const dims=/-(\d+)x(\d+)$/.exec(v);
    assert.ok(dims,'Malformed screenshot viewport identifier '+v);
    images.push({file:filename,...await checkImage(join(reportDir,filename),
      Number(dims[1]),Number(dims[2]))});
  }
  assert.equal(images.length,30);
  const finished={
    status:'PASS',kind:'pack-1-standalone-final-candidate-acceptance',
    gitHead:commit,createdAt:new Date().toISOString(),
    nativeNode:{testFiles:files,executed:true,result:'PASS',tests,passed,failed,skipped,todo},
    chromium:{executed:true,views:15,screenshots:30,images},
    note:'Source candidate gallery acceptance only; NOT integrated WebGL2, offline PWA reload, or physical-iPhone review'
  };
  await mkdir(reportDir,{recursive:true});
  await writeFile(join(reportDir,'native-acceptance-PASS.json'),
    JSON.stringify(finished,null,2)+'\n');
  process.stdout.write('PACK1_NATIVE_ACCEPTANCE_PASS '+commit+' (9 Node suites, 15 Chromium views, 30 decoded PNGs)\n');
}
try{await main()}catch(error){
  // Do not fabricate a PASS file on any partial run. A pre-existing report
  // should be considered valid only when its gitHead equals the run's exact SHA.
  process.stderr.write('PACK1_NATIVE_ACCEPTANCE_BLOCKED: '+String(error)+'\n');
  process.exitCode=1;
}
