import {createHash} from 'node:crypto';
const paths={'48':['src/nonblock-scene48/nonblock-object-v1.mjs'],'24':['src/nonblock-environments24/v1-bridge.mjs','src/nonblock-environments24/v1-admission-policy.mjs'],'36':['src/nonblock-fittings36/fittings-phase1.mjs','src/nonblock-fittings36/guarded-break-session.mjs']};
const sha=/^[0-9a-f]{40}$/;
export function verifySourceBoundHandoff(manifest,sources){
 const errors=[];
 if(!manifest||!sources||typeof manifest!=='object'||typeof sources!=='object')return {accepted:false,live:false,errors:['missing evidence']};
 if(manifest.contract!=='nonblock-object-v1')errors.push('wrong contract');
 for(const k of ['mainHead','coreHead'])if(!sha.test(manifest[k]??''))errors.push('missing '+k);
 if(manifest.productionEnabled!==false)errors.push('production not disabled');
 if(manifest.realRemovalEvidence!==true)errors.push('no real removal evidence');
 const seen=new Set();
 for(const lane of ['48','24','36']){
  const p=manifest.producers?.[lane];
  if(!sha.test(p?.head??'')){errors.push(lane+': missing HEAD');continue}
  if(!Array.isArray(p.files)){errors.push(lane+': missing files');continue}
  for(const required of paths[lane])if(!p.files.some(f=>f.path===required))errors.push('missing '+required);
  for(const f of p.files){
   if(typeof f?.path!=='string'||!f.path.startsWith(paths[lane][0].split('/').slice(0,2).join('/')+'/')||f.path.includes('..')){errors.push('ownership violation');continue}
   if(seen.has(f.path))errors.push('duplicate path');
   seen.add(f.path);
   if(typeof sources[f.path]!=='string'||!sha.test(f.blobSha??'')){errors.push('missing source/blob');continue}
   const bytes=Buffer.from(sources[f.path],'utf8');
   const actual=createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
   if(actual!==f.blobSha)errors.push('blob mismatch: '+f.path);
  }
 }
 return {accepted:errors.length===0,live:false,errors};
}
