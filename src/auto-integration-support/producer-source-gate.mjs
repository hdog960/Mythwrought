// :12-only opt-in producer provenance gate. Never imports or modifies producer code.
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {resolve,relative,isAbsolute} from 'node:path';

export const REQUIRED_LANES=Object.freeze(['surface','caves','objects']);
const SHA=/^[0-9a-f]{40}$/;
const HEX=/^[0-9a-f]{64}$/;
function safePath(root,path) {
  if(typeof path!=='string'||!path||path.includes('\\')||path.split('/').includes('..')||isAbsolute(path)) throw Error('unsafe producer path');
  const full=resolve(root,path), rel=relative(resolve(root),full);
  if(!rel||rel.startsWith('..')||isAbsolute(rel)) throw Error('producer path escapes checkout');
  return full;
}
export async function verifyProducerSources({root,manifest,read=readFile}={}) {
  if(typeof root!=='string'||!root||!manifest||typeof manifest!=='object') throw Error('root and manifest required');
  const results=[];
  for(const lane of REQUIRED_LANES) {
    const item=manifest[lane];
    if(!item) {results.push({lane,status:'NOT_VERIFIED',reason:'producer absent from manifest'});continue;}
    if(!SHA.test(item.commit??'')||!HEX.test(item.sha256??'')) {results.push({lane,status:'NOT_VERIFIED',reason:'missing exact commit or content digest'});continue;}
    let full;
    try {full=safePath(root,item.path);} catch(e) {results.push({lane,status:'NOT_VERIFIED',reason:e.message});continue;}
    try {
      const bytes=await read(full);
      const digest=createHash('sha256').update(bytes).digest('hex');
      results.push(digest===item.sha256
        ? {lane,status:'SOURCE_MATCH',commit:item.commit,path:item.path,sha256:digest}
        : {lane,status:'NOT_VERIFIED',reason:'source digest mismatch'});
    } catch(e) {
      results.push({lane,status:'NOT_VERIFIED',reason:e.code==='ENOENT'?'producer file unavailable':'producer source unreadable'});
    }
  }
  return {status:results.every(r=>r.status==='SOURCE_MATCH')?'SOURCE_MATCH_ONLY':'NOT_VERIFIED',results,
    integrationVerified:false, browserVerified:false};
}
