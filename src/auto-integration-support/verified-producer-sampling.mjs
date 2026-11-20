// Candidate-only orchestration. Matching files cannot authenticate injected JS functions.
import {verifyManifestCheckouts} from './manifest-checkout-bridge.mjs';
import {inspectProducerSamples} from './producer-sample-harness.mjs';
const rejected=(reason,detail)=>Object.freeze({ok:false,status:'NOT_VERIFIED',reason,detail,integrationVerified:false,browserVerified:false,saveVerified:false});
/** File verification does not attest that injected callbacks came from those files. */
export async function inspectVerifiedProducerSamples({manifest,checkouts,verify,sample}={}) {
 let provenance;
 try {provenance=await verifyManifestCheckouts({manifest,checkouts,...(verify?{verify}:{})});}
 catch(e){return rejected('source-verifier-exception',String(e?.message??e));}
 if(provenance.status!=='SOURCE_MATCH_ONLY'||provenance.results?.length!==3||provenance.results.some(r=>r.status!=='SOURCE_MATCH'))return rejected('source-verification-incomplete',provenance);
 if(!sample||typeof sample!=='object'||Array.isArray(sample))return rejected('missing-sample-plan');
 let result;
 try {result=inspectProducerSamples({...sample,sourceVerified:true});}
 catch(e){return rejected('sample-exception',String(e?.message??e));}
 if(!result.ok)return rejected('sample-contract-failed',result.reason);
 return Object.freeze({ok:true,status:'SOURCE_MATCH_SAMPLED_UNBOUND',sourceStatus:'SOURCE_MATCH_ONLY',sampleStatus:result.status,callbackProvenanceVerified:false,integrationVerified:false,browserVerified:false,saveVerified:false,samples:result.samples});
}
