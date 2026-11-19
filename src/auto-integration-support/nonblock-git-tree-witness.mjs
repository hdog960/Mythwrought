// :12 only. Offline source-to-Git-tree evidence gate; never production-registers objects.
import {createHash} from 'node:crypto';
export function gitBlobSha(content) {
 const bytes=Buffer.isBuffer(content)?content:Buffer.from(content);
 return createHash('sha1').update(Buffer.from('blob '+bytes.length+'\\0'.replace('\\0','\0'))).update(bytes).digest('hex');
}
const HEX=/^[a-f0-9]{40}$/;
export function verifyProducerTreeWitness({manifest, trees, sourceBytes, expectedHeads}) {
 const errors=[], witnessed=[];
 if(manifest?.version!==1||!Array.isArray(manifest.producers)||manifest.producers.length!==3) return {ok:false,errors:['invalid manifest'],witnessed};
 for(const p of manifest.producers){
  if(!['24','36','48'].includes(p.lane)||!HEX.test(p.head)||expectedHeads?.[p.lane]!==p.head){errors.push('head mismatch '+p.lane);continue;}
  const tree=trees?.[p.lane];
  if(tree?.sha!==p.head||tree.truncated===true||!Array.isArray(tree.tree)){errors.push('unverified tree '+p.lane);continue;}
  const prefix={'24':'src/nonblock-environments24/','36':'src/nonblock-fittings36/','48':'src/nonblock-scene48/'}[p.lane];
  for(const file of p.files){
   const member=tree.tree.find(e=>e.path===file.path&&e.type==='blob'&&e.mode==='100644');
   if(!file.path.startsWith(prefix)||!HEX.test(file.blob)||member?.sha!==file.blob){errors.push('tree membership '+file.path);continue;}
   const bytes=sourceBytes?.[file.path];
   if(!(typeof bytes==='string'||Buffer.isBuffer(bytes))){errors.push('missing bytes '+file.path);continue;}
   if(gitBlobSha(bytes)!==file.blob){errors.push('blob mismatch '+file.path);continue;}
   witnessed.push({lane:p.lane,path:file.path,blob:file.blob,head:p.head});
  }
 }
 if(new Set(manifest.producers.map(p=>p.lane)).size!==3)errors.push('duplicate lane');
 return {ok:errors.length===0&&witnessed.length===6,errors,witnessed,live:false,breakabilityReady:false};
}
