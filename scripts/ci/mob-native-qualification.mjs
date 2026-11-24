// Mob-only finite qualification. Run from a separately authorized checkout.
// No checkout, ref changes, network, CI, cache edits or deployment performed.
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve,relative,isAbsolute,sep} from 'node:path';
import {pathToFileURL} from 'node:url';

export const BASELINE='af3d483f64747227a7af69d328269580ef6bdec5';
const NODE_VERSION='v22.16.0';
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
export const PLAN=Object.freeze([
  {name:'actual-m7-births',files:[
    'tests/mob-ecosystem-original-m7-three-seed-real-births.test.mjs']},
  {name:'original-lifecycle-and-admission',files:[
    'tests/mob-ecosystem-original-away-ledger-contract.test.mjs',
    'tests/mob-ecosystem-original-engine-final-spawn-fence.test.mjs',
    'tests/mob-ecosystem-original-wake-recovery-fence.test.mjs',
    'tests/mob-ecosystem-original-spawn-final-source-fence.test.mjs',
    'tests/mob-ecosystem-original-live-source-revision-authority.test.mjs',
    'tests/mob-ecosystem-original-host-world-residency-after-callback.test.mjs',
    'tests/mob-ecosystem-original-live-biome-admission.test.mjs',
    'tests/mob-ecosystem-original-flat-habitat-matrix.test.mjs']},
  {name:'original-collision-combat-and-restore',files:[
    'tests/mob-ecosystem-original-m7-live-collision-optin.test.mjs',
    'tests/mob-ecosystem-original-m7-overlay-ray-preservation.test.mjs',
    'tests/mob-ecosystem-original-live-projectile-budget.test.mjs',
    'tests/mob-ecosystem-original-restored-projectile-budget.test.mjs',
    'tests/live-five-system-mobs.test.mjs',
    'tests/mobs/full-roster.test.mjs','tests/mobs/roster-persistence.test.mjs']}
].map(g=>Object.freeze({name:g.name,files:Object.freeze(g.files)})));

function git(root,...args){
  const r=spawnSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024});
  if(r.error||r.status!==0)throw Error('Git provenance check failed: '+(r.error?.message??r.stderr));
  return r.stdout.trim();
}
function outside(root,path){
  const rel=relative(root,path);
  return rel==='..'||rel.startsWith('..'+sep)||isAbsolute(rel);
}
function checkCheckout(root,expected){
  if(git(root,'rev-parse','--show-toplevel')!==root)throw Error('Expected repository root');
  if(git(root,'rev-parse','HEAD')!==expected)throw Error('Wrong checkout HEAD');
  if(git(root,'status','--porcelain','--untracked-files=all'))throw Error('Checkout is dirty');
  return git(root,'rev-parse','HEAD^{tree}');
}
export async function qualify({root,output,expected=BASELINE,plan=PLAN,timeoutMs=15*60*1000}){
  root=resolve(root);output=resolve(output);
  if(process.version!==NODE_VERSION)throw Error('Requires exact Node '+NODE_VERSION);
  if(!/^[a-f0-9]{40}$/.test(expected))throw Error('Expected full commit SHA');
  if(!outside(root,output))throw Error('Evidence directory must be outside checkout');
  if(!Number.isSafeInteger(timeoutMs)||timeoutMs<1)throw Error('Invalid test timeout');
  const tree=checkCheckout(root,expected),seen=new Set(),names=new Set(),files=[];
  if(!Array.isArray(plan)||!plan.length)throw Error('Empty qualification plan');
  for(const group of plan){
    if(!/^[a-z0-9-]+$/.test(group.name)||names.has(group.name)||!Array.isArray(group.files)||!group.files.length)
      throw Error('Invalid or duplicate qualification group');
    names.add(group.name);
    for(const path of group.files){
      if(!/^tests\/[\w/-]+\.test\.mjs$/.test(path)||seen.has(path))throw Error('Invalid or duplicate test: '+path);
      seen.add(path);
      const blob=git(root,'rev-parse','HEAD:'+path);
      const actual=git(root,'hash-object','--no-filters',path);
      if(actual!==blob)throw Error('Test bytes differ from HEAD: '+path);
      files.push({path,blob,sha256:digest(await readFile(resolve(root,path)))});
    }
  }
  // Exclusive directory creation prevents accidentally overwriting prior evidence.
  await mkdir(output);
  const report={head:expected,tree,node:process.version,files,groups:[],nativeReady:false,
    releaseReady:false,offline:'HOLD: separate owner cache acceptance',device:'UNVERIFIED'};
  const writeReport=()=>writeFile(resolve(output,'qualification.json'),JSON.stringify(report,null,2)+'\n');
  await writeReport();
  for(const group of plan){
    checkCheckout(root,expected);
    const start=Date.now();
    const args=['--test','--test-reporter=tap','--test-concurrency=1',...group.files];
    const env={...process.env,NODE_OPTIONS:''};
    delete env.NODE_TEST_CONTEXT;
    const r=spawnSync(process.execPath,args,{cwd:root,encoding:'buffer',timeout:timeoutMs,maxBuffer:64*1024*1024,
      env});
    const log=Buffer.concat([r.stdout??Buffer.alloc(0),r.stderr??Buffer.alloc(0)]);
    const file=group.name+'.tap';await writeFile(resolve(output,file),log,{flag:'wx'});
    const txt=log.toString('utf8');
    const count=Number(txt.match(/^# tests (\d+)\s*$/m)?.[1]??0);
    const pass=Number(txt.match(/^# pass (\d+)\s*$/m)?.[1]??0);
    const fail=Number(txt.match(/^# fail (\d+)\s*$/m)?.[1]??-1);
    const skipped=Number(txt.match(/^# skipped (\d+)\s*$/m)?.[1]??-1);
    const cancelled=Number(txt.match(/^# cancelled (\d+)\s*$/m)?.[1]??-1);
    const todo=Number(txt.match(/^# todo (\d+)\s*$/m)?.[1]??-1);
    const passed=r.status===0&&!r.error&&count>0&&pass===count&&fail===0&&skipped===0&&cancelled===0&&todo===0;
    report.groups.push({name:group.name,args,exit:r.status,signal:r.signal,error:r.error?.message??null,
      elapsedMs:Date.now()-start,tests:count,pass,fail,skipped,cancelled,todo,passed,log:file,sha256:digest(log)});
    await writeReport();
    checkCheckout(root,expected);
  }
  report.nativeReady=report.groups.length===plan.length&&report.groups.every(g=>g.passed);
  await writeReport();return report;
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url){
  try{
    if(process.argv.length!==4)throw Error('Usage: node mob-native-qualification.mjs CHECKOUT NEW_EVIDENCE_DIRECTORY');
    const result=await qualify({root:process.argv[2],output:process.argv[3]});
    console.log(JSON.stringify(result,null,2));
    if(!result.nativeReady)process.exitCode=1;
  }catch(error){console.error(error.message);process.exitCode=1;}
}
