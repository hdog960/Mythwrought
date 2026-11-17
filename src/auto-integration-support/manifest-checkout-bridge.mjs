// Read-only bridge from the multi-file dependency manifest to the single-file checkout verifier.
// A source match never certifies runtime, saves, mobile rendering, or integration.
import {validateProducerDependencyManifest} from './producer-dependency-manifest.mjs';
import {verifyCheckoutProducers} from './producer-checkout-verifier.mjs';

const LANES=Object.freeze(['surface','caves','objects']);
export async function verifyManifestCheckouts({manifest,checkouts,verify=verifyCheckoutProducers}={}) {
 const validation=validateProducerDependencyManifest(manifest);
 if(!validation.ok) return {status:'NOT_VERIFIED',errors:validation.errors,results:[],integrationVerified:false,browserVerified:false};
 const errors=[];
 const results=[];
 for(const lane of LANES) {
  const producer=manifest.producers[lane];
  const checkout=checkouts?.[lane];
  if(typeof checkout!=='string'||!checkout.trim()) {
   errors.push(lane+': missing checkout');
   results.push({lane,status:'NOT_VERIFIED',reason:'missing checkout'});
   continue;
  }
  const files=[];
  for(const file of producer.files) {
   try {
    const outcome=await verify({manifest:{[lane]:{commit:producer.head,sha256:file.sha256,checkout,path:file.path}}});
    const found=outcome?.results?.find(r=>r.lane===lane);
    if(!found||found.status!=='SOURCE_MATCH'||found.commit!==producer.head||found.path!==file.path||found.sha256!==file.sha256) {
     files.push({path:file.path,status:'NOT_VERIFIED',reason:found?.reason??'source identity not verified'});
    } else files.push({path:file.path,status:'SOURCE_MATCH'});
   }catch(e) {
    files.push({path:file.path,status:'NOT_VERIFIED',reason:e?.message??'verification error'});
   }
  }
  const ok=files.length===producer.files.length&&files.every(f=>f.status==='SOURCE_MATCH');
  if(!ok)errors.push(lane+': source verification incomplete');
  results.push({lane,pr:producer.pr,head:producer.head,status:ok?'SOURCE_MATCH':'NOT_VERIFIED',files});
 }
 return {status:errors.length?'NOT_VERIFIED':'SOURCE_MATCH_ONLY',errors,results,integrationVerified:false,browserVerified:false};
}
