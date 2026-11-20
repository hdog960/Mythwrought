// Additive Roadmap C 4B CI owner. Historical tests and existing workflow remain untouched.
// Fail closed on test-inventory drift, any skipped real Chromium, wrong source SHA, and test-count drift.
import {readdirSync,existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {resolve,join} from 'node:path';
const ROOT=resolve('.');
const DIR='tests/building-pool/roadmap-4b';
const BROWSER=[
  "m1-webgl2.test.mjs",
  "m2-distinctive-webgl2.test.mjs",
  "m2-variant02-completion-webgl2.test.mjs",
  "m2-variant02-expansion-webgl2.test.mjs",
  "m2-variant02-webgl2.test.mjs",
  "m2-variant03-final10-webgl2.test.mjs",
  "m2-variant03-first10-webgl2.test.mjs",
  "m2-variant03-second10-webgl2.test.mjs",
  "m2-variant04-final10-webgl2.test.mjs",
  "m2-variant04-first10-webgl2.test.mjs",
  "m2-variant04-second10-webgl2.test.mjs",
  "m2-variant05-final15-webgl2.test.mjs",
  "m2-webgl2.test.mjs",
  "m3-research-wave7-roadmap-c-webgl2.test.mjs",
  "m3-schoolhouses-first5-webgl2.test.mjs",
  "m3-schoolhouses-second5-webgl2.test.mjs",
  "m3-schoolhouses-wave3-roadmap-c-webgl2.test.mjs",
  "m3-schoolhouses-wave4-roadmap-c-webgl2.test.mjs",
  "m3-schoolhouses-wave5-roadmap-c-webgl2.test.mjs",
  "m3-schoolhouses-wave6-roadmap-c-webgl2.test.mjs"
];
const NATIVE=[
  "m1-exemplars.test.mjs",
  "m2-distinctive.test.mjs",
  "m2-healing-library.test.mjs",
  "m2-variant02-completion.test.mjs",
  "m2-variant02-expansion.test.mjs",
  "m2-variant02.test.mjs",
  "m2-variant03-final10.test.mjs",
  "m2-variant03-first10.test.mjs",
  "m2-variant03-second10.test.mjs",
  "m2-variant04-final10.test.mjs",
  "m2-variant04-first10.test.mjs",
  "m2-variant04-second10.test.mjs",
  "m2-variant05-final15.test.mjs",
  "m3-research-wave7-roadmap-c.test.mjs",
  "m3-schoolhouses-first5.test.mjs",
  "m3-schoolhouses-second5.test.mjs",
  "m3-schoolhouses-wave3-roadmap-c.test.mjs",
  "m3-schoolhouses-wave4-roadmap-c.test.mjs",
  "m3-schoolhouses-wave5-roadmap-c.test.mjs",
  "m3-schoolhouses-wave6-roadmap-c.test.mjs",
  "manifest.test.mjs",
  "schema.test.mjs"
];
const FULL=[
  "tests/browser-smoke.mjs",
  "tests/exploration-map-browser.mjs",
  "tests/touch-browser.mjs",
  "tests/layout-browser.mjs",
  "tests/seam-browser.mjs",
  "tests/movement-browser.mjs",
  "tests/blocks-browser.mjs",
  "tests/persistence-browser.mjs",
  "tests/preflight-browser.mjs",
  "tests/vault-browser.mjs",
  "tests/mirror-browser.mjs",
  "tests/foreground-browser.mjs",
  "tests/meadow-browser.mjs",
  "tests/grove-browser.mjs",
  "tests/canopy-browser.mjs",
  "tests/storybook-browser.mjs",
  "tests/grotto-browser.mjs",
  "tests/voxel-landmarks-browser.mjs",
  "tests/live-world-browser.mjs",
  "tests/context-restore-browser.mjs"
];
const mode=process.argv[2],index=process.argv[3]===undefined?null:Number(process.argv[3]);
function fail(message){throw Error('Roadmap C 4B fail-closed: '+message);}
const actual=readdirSync(DIR).filter(n=>n.endsWith('.test.mjs')).sort();
const expected=[...BROWSER,...NATIVE].sort();
if(JSON.stringify(actual)!==JSON.stringify(expected))fail('4B original file inventory changed: '+JSON.stringify({actual,expected}));
if(new Set(expected).size!==42||BROWSER.length!==20||NATIVE.length!==22)fail('expected 42 original 4B tests including 20 true Chromium files');
const sha=spawnSync('git',['rev-parse','HEAD'],{encoding:'utf8'});
if(sha.status!==0)fail('git HEAD unavailable');
const sourceHead=sha.stdout.trim();
if(!/^[0-9a-f]{40}$/.test(sourceHead)||sourceHead!==process.env.SOURCE_HEAD_SHA)fail('wrong exact source HEAD: '+sourceHead);
if(!process.env.GITHUB_RUN_ID||!process.env.GITHUB_RUN_ATTEMPT)fail('missing run provenance');
function invoke(command,args,label){
 const t=Date.now();
 const r=spawnSync(command,args,{cwd:ROOT,encoding:'utf8',maxBuffer:64*1024*1024,env:Object.fromEntries(Object.entries(process.env).filter(([k])=>k!=='NODE_TEST_CONTEXT'))});
 if(r.stdout)process.stdout.write(r.stdout);if(r.stderr)process.stderr.write(r.stderr);
 if(r.error||r.status!==0)fail(label+' exited '+r.status+' '+String(r.error||''));
 const lines=(r.stdout||'').split(/\r?\n/);
 const totals=lines.filter(s=>/^# tests \d+$/.test(s)).map(s=>Number(s.split(' ')[2]));
 const passes=lines.filter(s=>/^# pass \d+$/.test(s)).map(s=>Number(s.split(' ')[2]));
 const failures=lines.filter(s=>/^# fail \d+$/.test(s)).map(s=>Number(s.split(' ')[2]));
 const tests=totals.length?totals[totals.length-1]:null;
 const pass=passes.length?passes[passes.length-1]:null;
 const failCount=failures.length?failures[failures.length-1]:null;
 if(!['full-real-webgl2','syntax'].includes(label)&&(tests===null||pass!==tests||failCount!==0))fail('missing/partial TAP pass accounting '+label);
 return {label,tests,pass,fail:failCount,elapsedMs:Date.now()-t,command:[command,...args]};
}
const result=[];
if(mode==='roots'){
 for(const path of ['src/main.mjs','src/voxel.mjs','src/meadow.mjs','src/grove.mjs','src/canopy.mjs','src/storybook-materials.mjs','src/grotto.mjs','src/gpu-recovery.mjs','src/gpu-pipeline.mjs','src/cave-runes.mjs','src/sky.mjs'])invoke('node',['--check',path],'syntax');
 const contracts=readdirSync('tests/ci').filter(x=>x.endsWith('.test.mjs')).sort().map(x=>'tests/ci/'+x);
 result.push(invoke('node',['--test',...contracts],'12-contracts'));
 result.push(invoke('npm',['test'],'922-repository-root'));
 if(result[0].tests!==12||result[1].tests!==922)fail('exact accepted root counts changed');
}else if(mode==='native'){
 result.push(invoke('node',['--test','--test-concurrency=2',...NATIVE.map(x=>join(DIR,x))],'all-22-original-native-files'));
}else if(mode==='browser'){
 if(!Number.isInteger(index)||index<0||index>=BROWSER.length)fail('invalid browser shard');
 result.push(invoke('node',['--test','--test-concurrency=1',join(DIR,BROWSER[index])],'genuine-Chromium-'+index));
 const artifacts=join('artifacts','building-pool','roadmap-4b');
 if(!existsSync(artifacts))fail('no genuine Chromium 4B artifact directory');
 const dirs=readdirSync(artifacts,{withFileTypes:true}).filter(x=>x.isDirectory()&&existsSync(join(artifacts,x.name,'results.json'))).map(x=>x.name);
 if(dirs.length!==1)fail('browser shard did not yield exactly one complete source-specific manifest: '+JSON.stringify(dirs));
 result[0].manifest=dirs[0];result[0].file=BROWSER[index];result[0].index=index;
}else if(mode==='full'){
 if(FULL.length!==20||new Set(FULL).size!==20||FULL.some(f=>!existsSync(f)))fail('original full 20 WebGL2 scripts absent');
 for(const path of FULL){const row=invoke('node',[path],'full-real-webgl2');row.script=path;result.push(row);}
}else fail('unsupported verification mode');
const record={schema:'mythwrought.roadmap-c-4b-ci-attestation.v1',mode,index,sourceHead,runId:process.env.GITHUB_RUN_ID,runAttempt:process.env.GITHUB_RUN_ATTEMPT,sourceIsSameForAll:true,results:result,passed:true};
mkdirSync('artifacts/attestations',{recursive:true});
const name=mode+(index!==null?'-'+String(index).padStart(2,'0'):'');
writeFileSync('artifacts/attestations/'+name+'.json',JSON.stringify(record,null,2)+'\n');
console.log('RC4B_SOURCE_EXACT_PASS '+name+' '+sourceHead+' '+result.map(x=>x.tests??x.script).join(','));
