#!/usr/bin/env node
// SINGLE OPT-IN native original-M7 audit triplet at an exact, clean Git HEAD.
// No GitHub Actions dispatch, cave/biome writes, saves, GPU, PWA or merges.
// Run in a REAL fully checked-out original repository, not a source proxy:
// node scripts/underworld/audit-m7-exact-head-triplet.mjs <40-hex-HEAD>
// Output: ONE read-only JSON evidence bundle on stdout.
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
import {classifyExactHeadOriginalM7Triplet}
 from '../../src/living-underworld/m7-triplet-readonly-admission.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const expected=process.argv[2],SHA=/^[0-9a-f]{40}$/;
if(!SHA.test(expected??'')||process.argv.length!==3)
 throw Error('Usage: node scripts/underworld/audit-m7-exact-head-triplet.mjs <40-hex-SHA>');

function call(command,args,timeout){
 const r=spawnSync(command,args,{cwd:root,encoding:'utf8',timeout,
  maxBuffer:16*1024*1024,windowsHide:true});
 return {status:r.status,signal:r.signal??null,
  error:r.error?String(r.error):null,
  stdout:r.stdout??'',stderr:r.stderr??''};
}
function git(...args){
 const r=call('git',args,20000);
 if(r.status!==0)throw Error('Cannot verify exact native Git checkout: '+
  (r.stderr||r.error||'Unknown git failure'));
 return r.stdout.trim();
}
const actual=git('rev-parse','HEAD');
if(actual!==expected)
 throw Error('WRONG_NATIVE_M7_HEAD: expected '+expected+' got '+actual);
const dirty=git('status','--porcelain','--untracked-files=all');
if(dirty)throw Error('DIRTY_NATIVE_M7_CHECKOUT: refuse uncommitted source');
// This only verifies Git-visible tracked/untracked files; ignored world
// saves and device storage remain outside this source-only research gate.
const verifyAfter=()=>Object.freeze({
 headUnchanged:git('rev-parse','HEAD')===expected,
 gitVisibleFilesStillClean:
  git('status','--porcelain','--untracked-files=all')===''
});
const origin=git('rev-parse','--show-toplevel');
if(resolve(origin)!==root)
 throw Error('Native M7 project root does not match runner location');
const tests=Object.freeze([
 'tests/living-underworld-strict-source-role-booleans.test.mjs',
 'tests/living-underworld-gallery-full-veto-census.test.mjs',
 'tests/living-underworld-material-id-veto-census.test.mjs',
 'tests/living-underworld-gallery-reader-call-accounting.test.mjs',
 'tests/living-underworld-as-built-block-ids.test.mjs',
 'tests/living-underworld-source-chunk-core-halo.test.mjs',
 'tests/living-underworld-chunk-interior-nonoverlap.test.mjs',
 'tests/living-underworld-city-deep-selection-budgets.test.mjs',
 'tests/living-underworld-city-remaining-source-budget.test.mjs',
 'tests/living-underworld-city-floor-early-geometry-and-terrain-contract.test.mjs',
 'tests/living-underworld-city-floor-original-role-contract.test.mjs',
 'tests/living-underworld-city-gallery-easement-district.test.mjs',
 'tests/living-underworld-city-gallery-floor-cutset.test.mjs',
 'tests/living-underworld-city-grade-separated-underpass.test.mjs',
 'tests/living-underworld-underpass-pedestrian-footgraph.test.mjs',
 'tests/living-underworld-city-underpass-player-aabb-fixture.test.mjs',
 'tests/living-underworld-city-underpass-step-player-fixture.test.mjs',
 'tests/living-underworld-city-underpass-continuous-walk-fixture.test.mjs',
 'tests/living-underworld-source-role-coordinate-census.test.mjs',
 'tests/living-underworld-source-footprint-coordinate-witness.test.mjs',
 'tests/living-underworld-m7-triplet-readonly-admission.test.mjs'
]);
const nodeTests=call(process.execPath,['--test',...tests],180000);
const outcome={expectedHead:expected,actualHead:actual,
 nativeFullCheckoutExactAndClean:true,
 focusedNativeNodeTestsPassed:nodeTests.status===0,
 testSummaryStdoutTail:nodeTests.stdout.slice(-5500),
 testErrorTail:nodeTests.stderr.slice(-4000),
 trueOriginalM7ScriptsAttempted:0,
 originalM7ReadOnly:true,noGitHubActionsTriggered:true,
 noWorldChangesAuthorized:true,noReleaseApproval:true};
if(nodeTests.status!==0){
 const after=verifyAfter();
 console.log(JSON.stringify({...outcome,...after,
  trackedAndUntrackedGitStatusVerified:true,
  ignoredSavedWorldContentNotChecked:true,
  reason:'NATIVE_FOCUSED_TEST_FAILURE',
  sourceOrGameplayAcceptance:false}));
 process.exitCode=2;
}else{
 const entries=Object.freeze([
  ['gallery','scripts/underworld/audit-m7-five-biome-gallery-source.mjs'],
  ['city','scripts/underworld/audit-m7-original-city-terrace-source.mjs'],
  ['chunk','scripts/underworld/audit-m7-five-biome-hub-chunk-risk.mjs']
 ]);
 const reports={},executions={};
 for(const [kind,path] of entries){
  const started=performance.now();
  const r=call(process.execPath,[path],240000);
  let parsed=null,parseError=null;
  if(r.status===0){
   try{parsed=JSON.parse(r.stdout.trim().split(/\r?\n/).at(-1))}
   catch(e){parseError=String(e)}
  }
  executions[kind]={
   originalNativeNodeProcessExitedSuccessfully:r.status===0,
   exitStatus:r.status,signal:r.signal,error:r.error,
   wallMs:Math.round((performance.now()-started)*1000)/1000,
   parseError,
   stderrTail:r.stderr.slice(-4000),
   stdoutTail:parsed?null:r.stdout.slice(-4000)
  };
  if(parsed)reports[kind]=parsed;
 }
 let admission=null;
 try{
  admission=classifyExactHeadOriginalM7Triplet({
   expectedHead:expected,actualHead:actual,
   gallery:reports.gallery,city:reports.city,chunk:reports.chunk
  });
 }catch(e){executions.classificationError=String(e)}
 const allThreeExecutedSuccessfully=entries.every(([name])=>
  executions[name].originalNativeNodeProcessExitedSuccessfully&&
  reports[name]!=null);
 const after=verifyAfter();
 const exactSourceStayedUnmodified=after.headUnchanged&&
  after.gitVisibleFilesStillClean;
 const result={...outcome,...after,
  trackedAndUntrackedGitStatusVerified:true,
  ignoredSavedWorldContentNotChecked:true,
  trueOriginalM7ScriptsAttempted:entries.length,
  allThreeExecutedSuccessfully,executions,
  originalNativeM7Reports:reports,
  sourceOnlyCandidateAdmission:admission,
  thinUnderpassExactSourceAndFutureMovementGatePassed:
   admission?.cityThinUnderpassHypotheticalMovementSafe===true,
  historicalConstructorFaultsStillUnresolved:[8675309,13579],
  actualPlayerWalkingTested:false,actualIphoneGpuTested:false,
  installedPwaAcceptance:false,noReleaseApproval:true,
  reason:!exactSourceStayedUnmodified?
   'GIT_VISIBLE_NATIVE_CHECKOUT_CHANGED_DURING_AUDIT':
   !allThreeExecutedSuccessfully?
   'ORIGINAL_M7_SCRIPT_EXECUTION_OR_JSON_FAILURE':
   admission?.proposalEvidenceAllPassed&&
   admission?.cityThinUnderpassHypotheticalMovementSafe?
    'SOURCE_AND_FUTURE_PLAYER_RESEARCH_ONLY_NOT_RELEASE':
    'ORIGINAL_M7_SOURCE_OR_COVERAGE_GATES_HOLD'
 };
 console.log(JSON.stringify(result));
 if(!exactSourceStayedUnmodified||!allThreeExecutedSuccessfully||
  !admission?.proposalEvidenceAllPassed||
  !admission?.cityThinUnderpassHypotheticalMovementSafe)
  process.exitCode=2;
}
