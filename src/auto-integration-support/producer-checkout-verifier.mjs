// :12 opt-in checkout provenance: verify actual Git HEAD and source bytes.
// Never executes producer modules, mutates worktrees, or claims runtime integration.
import {createHash} from 'node:crypto';
import {readFile,realpath} from 'node:fs/promises';
import {relative,isAbsolute,resolve} from 'node:path';
import {execFile as execFileCallback} from 'node:child_process';
import {promisify} from 'node:util';
const execFile=promisify(execFileCallback);
const SHA=/^[0-9a-f]{40}$/;
const DIGEST=/^[0-9a-f]{64}$/;
const LANES=Object.freeze(['surface','caves','objects']);
const within=(root,path)=>{const r=relative(root,path);return r!==''&&!r.startsWith('..')&&!isAbsolute(r);};
export async function verifyCheckoutProducers({manifest,run=execFile,read=readFile,canonical=realpath}={}) {
 const results=[];
 for(const lane of LANES){
  const p=manifest?.[lane];
  if(!p||!SHA.test(p.commit??'')||!DIGEST.test(p.sha256??'')||
     typeof p.checkout!=='string'||!p.checkout||
     typeof p.path!=='string'||!p.path||p.path.includes('\\')||
     p.path.split('/').includes('..')||isAbsolute(p.path)){
   results.push({lane,status:'NOT_VERIFIED',reason:'invalid or absent producer declaration'});continue;
  }
  try{
   const root=await canonical(p.checkout);
   const target=await canonical(resolve(root,p.path));
   if(!within(root,target))throw Error('producer path escapes checkout');
   const headResult=await run('git',['-C',root,'rev-parse','--verify','HEAD'],{timeout:10000});
   const head=String(headResult.stdout).trim();
   if(head!==p.commit)throw Error('checkout HEAD mismatch');
   const dirtyResult=await run('git',['-C',root,'status','--porcelain','--',p.path],{timeout:10000});
   if(String(dirtyResult.stdout).trim())throw Error('producer source has uncommitted changes');
   const digest=createHash('sha256').update(await read(target)).digest('hex');
   if(digest!==p.sha256)throw Error('producer source digest mismatch');
   results.push({lane,status:'SOURCE_MATCH',commit:head,path:p.path,sha256:digest});
  }catch(e){results.push({lane,status:'NOT_VERIFIED',reason:e.message||'producer unavailable'});}
 }
 return {status:results.every(r=>r.status==='SOURCE_MATCH')?'SOURCE_MATCH_ONLY':'NOT_VERIFIED',
  results,integrationVerified:false,browserVerified:false};
}
