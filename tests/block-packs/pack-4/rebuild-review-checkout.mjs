// Pack 4 M5 opt-in source-exact review checkout builder.
// Builds a LOCAL, TEMPORARY union of a pinned integrated main and Pack 4 PR HEAD.
// It neither changes the repository nor merges/deploys/registers block IDs.
// Usage: node tests/block-packs/pack-4/rebuild-review-checkout.mjs \
//   --main <40hex> --pack <40hex> [--output <empty-dir>] [--run-node] [--run-gallery]
// Gallery needs Playwright/Chromium installed on the invoking machine; on Linux
// with software-only GL use xvfb-run + PACK4_CHROMIUM_HEADFUL=1.
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile,symlink,stat} from 'node:fs/promises';
import {mkdtempSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve,join,dirname} from 'node:path';
import {spawnSync} from 'node:child_process';

export const REQUIRED_MAIN=Object.freeze([
 'src/voxel-shape-interactions.mjs','src/voxel-shape-fit.mjs',
 'src/voxel-orientation-sidecar.mjs','src/shape-prototypes.mjs'
]);
export const TESTS=Object.freeze([
 'acceptance','current-main-loader','fixture','furnishings-fixture','furnishings',
 'hearth-civic-fixture','hearth-civic','integrated-main-contract',
 'integrated-main-surface','interaction-handoff','lighting','manifest',
 'mesh-budget','mesh-winding','preview-utils','windows'
].map(name=>`tests/block-packs/pack-4/${name}.test.mjs`));
const PREFIXES=['src/block-packs/pack-4/','tests/block-packs/pack-4/'];
const SHA=/^[0-9a-f]{40}$/;
const REPO='hdog960/Mythwrought';
const MAX_BYTES=500000;

export function gitBlobSha(buffer){
 const data=Buffer.isBuffer(buffer)?buffer:Buffer.from(buffer);
 return createHash('sha1').update(`blob ${data.length}\0`,'utf8').update(data).digest('hex');
}
export function selectPackFiles(tree){
 if(!tree||tree.truncated||!Array.isArray(tree.tree))
  throw Error('Incomplete Git tree: no trustworthy Pack 4 inventory');
 const files=tree.tree.filter(entry=>entry.type==='blob'&&
  PREFIXES.some(p=>entry.path.startsWith(p)));
 if(files.length<32||files.length>96)
  throw Error(`Unexpected Pack 4 owned file inventory: ${files.length}`);
 const map=new Map();
 for(const entry of files){
  if(!SHA.test(entry.sha)||!safePath(entry.path)||map.has(entry.path)||
     !(Number.isSafeInteger(entry.size)&&entry.size>=0&&entry.size<=MAX_BYTES))
   throw Error('Unsafe or invalid Pack 4 tree entry: '+entry.path);
  map.set(entry.path,entry);
 }
 for(const test of TESTS)if(!map.has(test))throw Error('Missing one of 16 native test suites: '+test);
 for(const path of ['tests/block-packs/pack-4/gallery.mjs',
  'tests/block-packs/pack-4/gallery.html','tests/block-packs/pack-4/gallery-browser.mjs',
  'tests/block-packs/pack-4/verify-final.mjs',
  'src/block-packs/pack-4/manifest.json',
  'src/block-packs/pack-4/windows.mjs','src/block-packs/pack-4/lighting.mjs',
  'src/block-packs/pack-4/furnishings.mjs','src/block-packs/pack-4/hearth-civic.mjs'])
  if(!map.has(path))throw Error('Missing required Pack 4 source: '+path);
 return map;
}
function safePath(p){
 return typeof p==='string'&&!p.startsWith('/')&&!p.includes('\\')&&
  p.split('/').every(x=>x&&x!=='.'&&x!=='..')&&!p.includes('\0');
}
function selectMainFiles(tree){
 if(!tree||tree.truncated||!Array.isArray(tree.tree))throw Error('Incomplete main Git tree');
 const map=new Map(tree.tree.filter(e=>REQUIRED_MAIN.includes(e.path)&&e.type==='blob').map(e=>[e.path,e]));
 for(const path of REQUIRED_MAIN){
  const e=map.get(path);
  if(!e||!SHA.test(e.sha)||!Number.isSafeInteger(e.size)||e.size>MAX_BYTES)
   throw Error('Missing or invalid main dependency: '+path);
 }
 return map;
}
async function httpGet(url,{fetcher=fetch,json=false}={}){
 let last;
 for(let attempt=0;attempt<3;attempt++){
  try{
   const r=await fetcher(url,{headers:{'accept':'application/vnd.github+json',
    'user-agent':'mythwrought-pack4-m5-source-checkout'},signal:AbortSignal.timeout(20000)});
   if(!r.ok)throw Error('HTTP '+r.status+' '+new URL(url).pathname);
   if(json)return await r.json();
   const buf=Buffer.from(await r.arrayBuffer());
   if(buf.length>MAX_BYTES)throw Error('Oversized response: '+url);
   return buf;
  }catch(e){last=e;if(attempt===2)break;}
 }
 throw last;
}
async function downloadTree(sha,apiBase,fetcher){
 return await httpGet(`${apiBase}/repos/${REPO}/git/trees/${sha}?recursive=1`,{fetcher,json:true});
}
export async function buildReviewCheckout({mainSha,packSha,output,fetcher=fetch,
 apiBase='https://api.github.com',rawBase='https://raw.githubusercontent.com',
 concurrency=5}={}){
 if(!SHA.test(mainSha)||!SHA.test(packSha))throw Error('Explicit exact 40-hex main and Pack 4 SHAs required');
 if(!Number.isSafeInteger(concurrency)||concurrency<1||concurrency>8)throw Error('Invalid download concurrency');
 const [main,pack]=await Promise.all([
  downloadTree(mainSha,apiBase,fetcher),downloadTree(packSha,apiBase,fetcher)]);
 const p=selectPackFiles(pack),m=selectMainFiles(main);
 const out=output?resolve(output):mkdtempSync(join(tmpdir(),'mythwrought-pack4-m5-'));
 if(output){
  if(existsSync(out)&& (await stat(out)).isDirectory()){
   const {readdir}=await import('node:fs/promises');
   if((await readdir(out)).length)throw Error('Refusing to overwrite nonempty output directory');
  }else await mkdir(out,{recursive:true});
 }
 const entries=[...m.values().map(e=>({entry:e,sha:mainSha})),
  ...p.values().map(e=>({entry:e,sha:packSha}))];
 let cursor=0,completed=0;
 async function worker(){
  while(cursor<entries.length){
   const {entry,sha}=entries[cursor++];
   if(!safePath(entry.path))throw Error('Unsafe path: '+entry.path);
   const url=`${rawBase}/${REPO}/${sha}/${entry.path}`;
   const bytes=await httpGet(url,{fetcher});
   if(bytes.length!==entry.size||gitBlobSha(bytes)!==entry.sha)
    throw Error('Git blob hash or byte length MISMATCH: '+entry.path);
   const target=resolve(out,entry.path);
   if(!target.startsWith(out+'/'))throw Error('Output path escaped checkout: '+entry.path);
   await mkdir(dirname(target),{recursive:true});
   await writeFile(target,bytes,{flag:'wx'});
   completed++;
  }
 }
 await Promise.all(Array.from({length:Math.min(concurrency,entries.length)},()=>worker()));
 const dependencies=resolve(process.cwd(),'node_modules');
 if(existsSync(dependencies)&&!existsSync(resolve(out,'node_modules')))
  await symlink(dependencies,resolve(out,'node_modules'),'dir');
 return {directory:out,mainSha,packSha,verifiedFiles:completed,
  packFiles:p.size,sharedFiles:m.size,suites:TESTS.length};
}
function options(argv){
 const o={};
 for(let i=0;i<argv.length;i++){
  const a=argv[i];
  if(['--main','--pack','--output'].includes(a)){
   if(!argv[i+1]||argv[i+1].startsWith('--'))throw Error('Missing value for '+a);
   o[a.slice(2)]=argv[++i];
  }else if(['--run-node','--run-gallery'].includes(a))o[a.slice(2)]=true;
  else throw Error('Unknown argument '+a);
 }
 return o;
}
function invoke(cmd,args,cwd){
 const r=spawnSync(cmd,args,{cwd,stdio:'inherit',timeout:240000,env:process.env});
 if(r.error||r.status!==0)throw Error('Review command failed: '+cmd+' '+args.join(' ')+' exit '+r.status);
}
if(process.argv[1]&&resolve(process.argv[1])===resolve(new URL(import.meta.url).pathname)){
 try{
  const o=options(process.argv.slice(2));
  const r=await buildReviewCheckout({mainSha:o.main,packSha:o.pack,output:o.output});
  console.log('PACK4_BLOB_CHECKOUT '+JSON.stringify(r));
  if(o['run-node'])invoke(process.execPath,
   ['tests/block-packs/pack-4/verify-final.mjs','--node-only'],r.directory);
  if(o['run-gallery'])invoke(process.execPath,
   ['tests/block-packs/pack-4/gallery-browser.mjs'],r.directory);
 }catch(e){console.error('PACK4_M5_SOURCE_ERROR',e?.stack||String(e));process.exitCode=1;}
}
