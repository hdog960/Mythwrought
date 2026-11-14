// Pack 4 M5 strict, opt-in *native* acceptance command.
// Must run from a temporary checkout with current main + Pack 4 sources/tests.
// This command never merges, edits main, creates block registrations or deploys.
// Usage: node tests/block-packs/pack-4/verify-final.mjs [--node-only]
import {spawnSync} from 'node:child_process';
import {readdirSync,accessSync,constants} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

const root=resolve(fileURLToPath(new URL('../../../',import.meta.url)));
const dir=resolve(root,'tests/block-packs/pack-4');
const args=process.argv.slice(2);
if(args.length>1||args.some(arg=>arg!=='--node-only')){
 console.error('Usage: node tests/block-packs/pack-4/verify-final.mjs [--node-only]');
 process.exitCode=2;
}else{
 const required=[
  'src/voxel-shape-interactions.mjs',
  'src/voxel-shape-fit.mjs',
  'src/voxel-orientation-sidecar.mjs',
  'src/shape-prototypes.mjs',
  'src/block-packs/pack-4/manifest.json',
  'tests/block-packs/pack-4/integrated-main-contract.test.mjs',
  'tests/block-packs/pack-4/integrated-main-surface.test.mjs'
 ];
 let absent=[];
 for(const p of required){
  try{accessSync(resolve(root,p),constants.R_OK)}
  catch{absent.push(p)}
 }
 if(absent.length){
  console.error('M5 FAIL: Combined current-main + Pack 4 checkout required; missing:\n'+absent.join('\n'));
  process.exitCode=1;
 }else{
  const tests=readdirSync(dir).filter(x=>x.endsWith('.test.mjs')).sort();
  const expectedNames=[
   'acceptance.test.mjs','current-main-loader.test.mjs','fixture.test.mjs',
   'furnishings-fixture.test.mjs','furnishings.test.mjs',
   'hearth-civic-fixture.test.mjs','hearth-civic.test.mjs',
   'integrated-main-contract.test.mjs','integrated-main-surface.test.mjs',
   'interaction-handoff.test.mjs','lighting.test.mjs',
   'manifest.test.mjs','mesh-budget.test.mjs','mesh-winding.test.mjs',
   'preview-utils.test.mjs','windows.test.mjs'
  ];
  const missing=expectedNames.filter(x=>!tests.includes(x));
  const unexpected=tests.filter(x=>!expectedNames.includes(x));
  if(missing.length||unexpected.length){
   console.error('M5 FAIL: Dedicated native suite inventory mismatch: missing='+
    missing.join(', ')+' unexpected='+unexpected.join(', '));
   process.exitCode=1;
  }else{
   const run=spawnSync(process.execPath,['--test','--test-reporter=tap',
     ...expectedNames.map(x=>resolve(dir,x))],{
    cwd:root,encoding:'utf8',timeout:120000,maxBuffer:20*1024*1024
   });
   process.stdout.write(run.stdout||'');
   process.stderr.write(run.stderr||'');
   const tap=run.stdout||'';
   const get=n=>{
    const m=[...tap.matchAll(new RegExp('^# '+n+' (\\d+)\\s*$','gm'))].at(-1);
    return m?Number(m[1]):null;
   };
   const result={
    suites:expectedNames.length,tests:get('tests'),passed:get('pass'),
    failed:get('fail'),skipped:get('skipped'),cancelled:get('cancelled'),
    nodeExit:run.status,signal:run.signal,
    currentMainModulesPresent:true
   };
   console.log('PACK4_NATIVE_ACCEPTANCE '+JSON.stringify(result));
   // An ordinary zero exit from node --test can include SKIPPED integrated
   // tests. M5 cannot accept that as complete evidence.
   if(run.error||run.status!==0||result.tests!==179||
      result.passed!==179||result.failed!==0||
      result.skipped!==0||result.cancelled!==0){
    console.error('M5 FAIL: Expected 179 genuine native Node cases and ZERO skips.');
    process.exitCode=1;
   }else if(args.includes('--node-only')){
    console.log('PACK4_ACCEPTANCE: native Node PASS; Chromium not executed (--node-only).');
   }else{
    const browser=spawnSync(process.execPath,
     [resolve(dir,'gallery-browser.mjs')],{
      cwd:root,encoding:'utf8',timeout:180000,maxBuffer:20*1024*1024
     });
    process.stdout.write(browser.stdout||'');
    process.stderr.write(browser.stderr||'');
    if(browser.error||browser.status!==0){
     console.error('M5 FAIL: Genuine Chromium/WebGL2 gallery has not passed.');
     process.exitCode=1;
    }else{
     console.log('PACK4_ACCEPTANCE: native Node and genuine 3-viewport Chromium gallery PASSED. Creator Gate A still requires physical-iPhone artwork/control approval.');
    }
   }
  }
 }
}
